// src/components/TryOnModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Box3, Vector3 } from "three";

// Face tracking constants
const MIN_EYE_DIST = 0.06;
const MAX_EYE_DIST = 0.25;
const REF_EYE_DIST = 0.12;
const Y_OFFSET = 0.02;
const Z_POSITION = 0;

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
  });

  // Small / Medium / Large
  const [sizePreset, setSizePreset] = useState(1);
  const sizePresetRef = useRef(1);
  useEffect(() => {
    sizePresetRef.current = sizePreset;
  }, [sizePreset]);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);

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
      setDimensions({
        width: rect.width,
        height: rect.width * 0.75,
      });
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

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const onResults = (results) => {
        if (!running) return;
        if (!results.multiFaceLandmarks || !results.multiFaceLandmarks[0]) {
          return;
        }

        const landmarks = results.multiFaceLandmarks[0];

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const centerX = (leftEye.x + rightEye.x) / 2;
        const centerY = (leftEye.y + rightEye.y) / 2;

        const dx = rightEye.x - leftEye.x;
        const dy = rightEye.y - leftEye.y;

        const eyeDistRaw = Math.sqrt(dx * dx + dy * dy);
        const eyeDist = Math.min(
          MAX_EYE_DIST,
          Math.max(MIN_EYE_DIST, eyeDistRaw)
        );

        const angle = Math.atan2(dy, dx);

        const x = (centerX - 0.5) * 1.5;
        const y = -(centerY - 0.5) * 1.5 + Y_OFFSET;

        let baseScale = (eyeDist / REF_EYE_DIST) * 0.6 * (defaultScale || 1);

        const preset = sizePresetRef.current;
        let presetMul = 1;
        if (preset === 0) presetMul = 0.9; // Small
        else if (preset === 2) presetMul = 1.15; // Large
        else presetMul = 1.02; // Medium

        let dynamicScale = baseScale * presetMul;
        dynamicScale = Math.min(1.8, Math.max(0.4, dynamicScale));

        setGlassesTransform({
          position: [x, y, Z_POSITION],
          scale: dynamicScale,
          rotationZ: -angle,
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
            <span className="whitespace-nowrap">Frame size</span>

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
                      idx === sizePreset ? "text-white font-semibold" : "text-white/50"
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

function GlassesModel({ url, position, scale, rotationZ }) {
  const ext = (url || "").split(".").pop().toLowerCase();

  if (ext === "obj") {
    return (
      <OBJGlasses
        url={url}
        position={position}
        scale={scale}
        rotationZ={rotationZ}
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
    />
  );
}

function GLBGlasses({ url, position, scale, rotationZ }) {
  const gltf = useGLTF(url);
  const { scene } = gltf;

  const calibratedScene = useMemo(() => {
    const cloned = scene.clone(true);

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
  }, [scene]);

  const s = scale;
  const finalScale = [s, s, s];

  return (
    <group position={position} rotation={[0, 0, rotationZ]} scale={finalScale}>
      <primitive object={calibratedScene} />
    </group>
  );
}

function OBJGlasses({ url, position, scale, rotationZ }) {
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
    <group position={position} rotation={[0, 0, rotationZ]} scale={finalScale}>
      <primitive object={calibratedScene} />
    </group>
  );
}
