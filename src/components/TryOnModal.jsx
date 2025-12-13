// src/components/TryOnModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Box3, Vector3 } from "three";

/**
 * ✅ Improvements added:
 * 1) Stronger tracking settings (higher confidences)
 * 2) Better anchors: nose bridge (168) for Y + eye center for X
 * 3) Scale based on face width (cheeks 234/454) + clamp
 * 4) Smoothing (low-pass filter) for position/scale/rotation
 * 5) Extra pose feel: slight Yaw/Pitch from landmark Z/Y relations (optional but helps)
 */

// Tracking constants
const MIN_FACE_W = 0.16;
const MAX_FACE_W = 0.42;
const REF_FACE_W = 0.28;

const Y_OFFSET = 0.02;
const Z_POSITION = 0;

// Smoothing
const SMOOTH = 0.18; // 0.12 ~ 0.25 (higher = more responsive, lower = more stable)

// Helpers
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const lerpAngle = (a, b, t) => {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + d * t;
};

export default function TryOnModal({
  modelUrl,
  defaultScale = 1,
  productName,
  onClose,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
  const dimensionsRef = useRef(dimensions);

  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, Z_POSITION],
    scale: 1,
    rotationZ: 0,
    rotationY: 0,
    rotationX: 0,
  });

  // Small / Medium / Large
  const [sizePreset, setSizePreset] = useState(1);
  const sizePresetRef = useRef(1);
  useEffect(() => {
    sizePresetRef.current = sizePreset;
  }, [sizePreset]);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);

  // smoothing memory
  const prevRef = useRef({
    x: 0,
    y: 0,
    z: Z_POSITION,
    s: 1,
    rz: 0,
    ry: 0,
    rx: 0,
  });

  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  useEffect(() => {
    if (!modelUrl) {
      setModelError("No 3D model URL provided.");
      setModelReady(false);
    } else {
      setModelError(null);
      setModelReady(true);
    }
  }, [modelUrl]);

  // Resize container
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = w * 0.75;
      setDimensions({ width: w, height: h });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // FaceMesh tracking
  useEffect(() => {
    let mpCamera;
    let faceMesh;
    let running = true;

    const setupFaceMesh = async () => {
      if (!videoRef.current) return;

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      // ✅ Stronger, more stable
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      const onResults = (results) => {
        if (!running) return;
        const lm = results.multiFaceLandmarks?.[0];
        if (!lm) return;

        /**
         * Landmarks used:
         * - Eyes outer corners: 33 (L), 263 (R)
         * - Nose bridge / between eyes: 168
         * - Nose tip: 1
         * - Cheeks: 234 (L), 454 (R) => better face width scaling
         */
        const leftEye = lm[33];
        const rightEye = lm[263];
        const bridge = lm[168];
        const noseTip = lm[1];
        const lCheek = lm[234];
        const rCheek = lm[454];

        // Center X from eyes
        const centerX = (leftEye.x + rightEye.x) / 2;

        // Center Y from bridge (more stable than eyes)
        const centerY = bridge?.y ?? (leftEye.y + rightEye.y) / 2;

        // Roll from eye line
        const dx = rightEye.x - leftEye.x;
        const dy = rightEye.y - leftEye.y;
        const roll = Math.atan2(dy, dx);

        // Face width from cheeks (more accurate scale)
        const fdx = rCheek.x - lCheek.x;
        const fdy = rCheek.y - lCheek.y;
        const faceWRaw = Math.sqrt(fdx * fdx + fdy * fdy);
        const faceW = clamp(faceWRaw, MIN_FACE_W, MAX_FACE_W);

        // Map screen coords into your R3F plane coords
        const x = (centerX - 0.5) * 1.5;
        const y = -(centerY - 0.5) * 1.5 + Y_OFFSET;

        // ✅ Scale based on face width
        // (tweak 0.6 and REF_FACE_W if you want tighter/looser)
        let baseScale = (faceW / REF_FACE_W) * 0.6 * (defaultScale || 1);

        // Presets
        const preset = sizePresetRef.current;
        let presetMul = 1;
        if (preset === 0) presetMul = 0.9; // Small
        else if (preset === 2) presetMul = 1.15; // Large
        else presetMul = 1.02; // Medium

        let dynamicScale = baseScale * presetMul;
        dynamicScale = clamp(dynamicScale, 0.45, 1.85);

        // ✅ Optional: give a bit of yaw/pitch based on Z/Y relations
        // Yaw: difference in z between eyes (when head turns, one eye appears closer)
        const yaw = clamp((rightEye.z - leftEye.z) * 2.2, -0.45, 0.45);

        // Pitch: nose tip relation to bridge (when head up/down changes)
        const pitch = clamp(((noseTip?.y ?? 0) - (bridge?.y ?? 0)) * 2.0, -0.35, 0.35);

        // ✅ Smoothing
        const p = prevRef.current;

        const nx = lerp(p.x, x, SMOOTH);
        const ny = lerp(p.y, y, SMOOTH);
        const ns = lerp(p.s, dynamicScale, SMOOTH);

        const nrz = lerpAngle(p.rz, -roll, SMOOTH);
        const nry = lerpAngle(p.ry, yaw, SMOOTH);
        const nrx = lerpAngle(p.rx, -pitch, SMOOTH);

        prevRef.current = {
          x: nx,
          y: ny,
          z: Z_POSITION,
          s: ns,
          rz: nrz,
          ry: nry,
          rx: nrx,
        };

        setGlassesTransform({
          position: [nx, ny, Z_POSITION],
          scale: ns,
          rotationZ: nrz,
          rotationY: nry,
          rotationX: nrx,
        });
      };

      faceMesh.onResults(onResults);

      const { width, height } = dimensionsRef.current;

      try {
        mpCamera = new MP_Camera(videoRef.current, {
          onFrame: async () => {
            if (!running) return;
            try {
              await faceMesh.send({ image: videoRef.current });
            } catch (_) {}
          },
          width,
          height,
        });

        mpCamera.start();
      } catch (err) {
        console.error("Failed to start Mediapipe camera:", err);
      }
    };

    setupFaceMesh();

    return () => {
      running = false;
      if (mpCamera) {
        try {
          mpCamera.stop();
        } catch (_) {}
      }
      if (faceMesh && faceMesh.close) {
        try {
          faceMesh.close();
        } catch (_) {}
      }
    };
  }, [defaultScale]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
      <div className="relative bg-black rounded-2xl overflow-hidden w-[95vw] max-w-2xl shadow-2xl border border-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/40 bg-black">
          <div>
            <p className="text-[11px] text-white/70">Virtual Try-On</p>
            <h2 className="text-sm md:text-base font-semibold text-white">
              {productName || "Try On Glasses"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video + 3D overlay */}
        <div
          ref={containerRef}
          className="relative bg-black flex items-center justify-center"
          style={{ aspectRatio: "4 / 3" }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {modelReady && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            >
              <Canvas
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: "high-performance",
                }}
                camera={{ position: [0, 0, 2.5], fov: 35 }}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  pointerEvents: "none",
                }}
              >
                <ambientLight intensity={1.1} />
                <directionalLight position={[2, 2, 3]} intensity={0.8} />

                <GlassesModel
                  url={modelUrl}
                  position={glassesTransform.position}
                  scale={glassesTransform.scale}
                  rotationZ={glassesTransform.rotationZ}
                  rotationY={glassesTransform.rotationY}
                  rotationX={glassesTransform.rotationX}
                />
              </Canvas>
            </div>
          )}

          {modelError && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-4 py-2 rounded-full">
              {modelError}
            </div>
          )}
        </div>

        {/* Small / Medium / Large */}
        <div className="px-4 pt-2 pb-1 bg-black border-t border-white/20 text-[11px] text-white/80">
          <div className="flex items-center justify-between gap-4">
            <span className="whitespace-nowrap">Frame sizeثث</span>

            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={sizePreset}
                onChange={(e) => setSizePreset(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-[0.15em]">
                {["Small", "Medium", "Large"].map((label, idx) => (
                  <span
                    key={label}
                    className={
                      idx === sizePreset
                        ? "text-white font-semibold"
                        : "text-white/50"
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-black text-[11px] text-white/70 flex justify-between items-center">
          <span>Tip: Look straight at the camera and move your head slowly.</span>
          <span className="hidden md:inline">
            Your camera stays in your browser only.
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- 3D models (GLB / OBJ) ----------

function GlassesModel({ url, position, scale, rotationZ, rotationY, rotationX }) {
  const ext = (url || "").split(".").pop().toLowerCase();

  if (ext === "obj") {
    return (
      <OBJGlasses
        url={url}
        position={position}
        scale={scale}
        rotationZ={rotationZ}
        rotationY={rotationY}
        rotationX={rotationX}
      />
    );
  }

  // default: glb / gltf
  return (
    <GLBGlasses
      url={url}
      position={position}
      scale={scale}
      rotationZ={rotationZ}
      rotationY={rotationY}
      rotationX={rotationX}
    />
  );
}

function GLBGlasses({ url, position, scale, rotationZ, rotationY, rotationX }) {
  const gltf = useGLTF(url);
  const { scene } = gltf;

  const calibratedScene = useMemo(() => {
    const cloned = scene.clone(true);

    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // center object
    cloned.position.sub(center);

    // lift a bit (helps sit on nose)
    cloned.position.y += size.y * 0.38;

    // normalize model width
    const width = size.x || 1;
    const targetWidth = 0.8; // tweak if needed
    const normScale = targetWidth / width;
    cloned.scale.setScalar(normScale);

    return cloned;
  }, [scene]);

  const s = scale;
  const finalScale = [s, s, s];

  return (
    <group
      position={position}
      rotation={[rotationX || 0, rotationY || 0, rotationZ || 0]}
      scale={finalScale}
    >
      <primitive object={calibratedScene} />
    </group>
  );
}

function OBJGlasses({ url, position, scale, rotationZ, rotationY, rotationX }) {
  const obj = useLoader(OBJLoader, url);

  const calibratedScene = useMemo(() => {
    const cloned = obj.clone(true);

    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    cloned.position.sub(center);
    cloned.position.y += size.y * 0.38;

    const width = size.x || 1;
    const targetWidth = 0.8;
    const normScale = targetWidth / width;
    cloned.scale.setScalar(normScale);

    return cloned;
  }, [obj]);

  const s = scale;
  const finalScale = [s, s, s];

  return (
    <group
      position={position}
      rotation={[rotationX || 0, rotationY || 0, rotationZ || 0]}
      scale={finalScale}
    >
      <primitive object={calibratedScene} />
    </group>
  );
}
