// src/pages/TryAr.jsx
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Sparkles, ScanFace } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";
import { Box3, Vector3 } from "three";
import { toast } from "sonner";

import { getProductsAr } from "../api/productsApi";

// Face tracking constants
const MIN_EYE_DIST = 0.06;
const MAX_EYE_DIST = 0.25;
const Y_OFFSET = 0.02;
const REF_EYE_DIST = 0.12; // reference eye distance for scaling

export default function TryAr() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
  const dimensionsRef = useRef(dimensions);

  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, 0],
    scale: 1,
    rotationZ: 0,
  });

  // 0 = Small, 1 = Medium, 2 = Large
  const [sizePreset, setSizePreset] = useState(1);
  const sizePresetRef = useRef(1);

  const [modelFailed, setModelFailed] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  useEffect(() => {
    sizePresetRef.current = sizePreset;
  }, [sizePreset]);

  // ---------- Load first AR product ----------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductsAr();
        if (Array.isArray(data) && data.length > 0) {
          setSelectedProduct(data[0]);
        } else {
          toast.error("No AR products found.");
        }
      } catch (err) {
        console.error("Failed to load AR products:", err);
        toast.error("Failed to load AR products.");
      } finally {
        setLoadingProduct(false);
      }
    };
    load();
  }, []);

  // ---------- Resize container ----------
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.width * 0.75, // 4:3
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // ---------- FaceMesh tracking ----------
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

        // Eye landmarks (Mediapipe indices)
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

        // Map from [0,1] to a smaller range around center
        const x = (centerX - 0.5) * 1.5;
        const y = -(centerY - 0.5) * 1.5 + Y_OFFSET;

        // Base scale from face size
        let baseScale = (eyeDist / REF_EYE_DIST) * 0.6;

        // Small / Medium / Large preset multiplier
        const preset = sizePresetRef.current;
        let presetMul = 1;
        if (preset === 0) presetMul = 0.9; // Small
        else if (preset === 2) presetMul = 1.15; // Large
        else presetMul = 1.02; // Medium

        let dynamicScale = baseScale * presetMul;

        // Clamp
        dynamicScale = Math.min(1.6, Math.max(0.4, dynamicScale));

        // Direct mapping (no smoothing)
        setGlassesTransform({
          position: [x, y, 0],
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
        console.error("Failed to start Mediapipe Camera:", err);
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-black text-white px-4 sm:px-6 lg:px-50 py-8 sm:py-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/15 text-[11px] uppercase tracking-[0.15em]">
            <ScanFace className="w-3 h-3" />
            <span>Live AR Try-On</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span>AR Try-On — First AR Frame</span>
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed text-white/80">
            Turn on your camera and see your first AR-enabled frame in real-time.
            Move your head slowly and pick the size that fits you best.
          </p>
        </div>
      </header>

      {/* Layout */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-start">
        {/* AR Section */}
        <section
          ref={containerRef}
          className="relative w-full rounded-2xl border border-white/15 bg-black/80 overflow-hidden shadow-2xl"
        >
          <div
            className="relative flex items-center justify-center bg-black"
            style={{ aspectRatio: "4 / 3" }}
          >
            {/* VIDEO */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* 3D OVERLAY */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
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

                {!modelFailed && (
                  <Suspense fallback={null}>
                    <GlassesGLB
                      url="/3d.glb"
                      position={glassesTransform.position}
                      scale={glassesTransform.scale}
                      rotationZ={glassesTransform.rotationZ}
                      onError={() => setModelFailed(true)}
                    />
                  </Suspense>
                )}
              </Canvas>
            </div>
          </div>

          {/* Size presets */}
          <div className="px-4 pt-2 pb-1 bg-black/95 border-t border-white/15 text-[11px] text-white/80">
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

          <div className="px-4 py-2 bg-black/95 text-[11px] text-white/70 flex justify-between items-center">
            <span>Tip: Move your head slowly left and right for better tracking.</span>
            <span className="hidden md:inline">
              Your camera runs locally in your browser only.
            </span>
          </div>
        </section>

        {/* Product info */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-4 sm:p-5 flex flex-col h-full">
            {loadingProduct && (
              <div className="animate-pulse space-y-3">
                <div className="h-5 w-1/2 bg-white/10 rounded" />
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-24 w-full bg-white/5 rounded-xl" />
              </div>
            )}

            {!loadingProduct && !selectedProduct && (
              <p className="text-sm text-white/75">
                No AR-enabled product is available right now.
              </p>
            )}

            {!loadingProduct && selectedProduct && (
              <>
                <div className="w-full mb-4">
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-70" />
                    <img
                      src={selectedProduct.images?.[0]?.url}
                      alt={selectedProduct.name}
                      className="relative w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-semibold mb-1">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mb-3">
                  {selectedProduct.description ||
                    "Premium AR-ready eyewear, designed to look great both on-screen and in real life."}
                </p>

                <div className="flex items-center gap-2 text-sm mb-3">
                  {selectedProduct.oldPrice &&
                    Number(selectedProduct.oldPrice) >
                      Number(selectedProduct.price) && (
                      <span className="line-through text-white/60">
                        EGP {Number(selectedProduct.oldPrice).toLocaleString()}
                      </span>
                    )}
                  <span className="font-bold">
                    EGP {Number(selectedProduct.price).toLocaleString()}
                  </span>

                  {selectedProduct.oldPrice &&
                    Number(selectedProduct.oldPrice) >
                      Number(selectedProduct.price) && (
                      <span className="text-red-400 text-[11px] font-semibold">
                        -
                        {Math.round(
                          ((Number(selectedProduct.oldPrice) -
                            Number(selectedProduct.price)) /
                            Number(selectedProduct.oldPrice)) *
                            100
                        )}
                        %
                      </span>
                    )}
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from(
                    new Set(
                      (selectedProduct.images || [])
                        .map((img) => img.color)
                        .filter(Boolean)
                    )
                  )
                    .slice(0, 4)
                    .map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/60"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                </div>

                <div className="mt-auto text-[11px] text-white/70">
                  This frame is automatically loaded into the AR view on the
                  left. Choose Small, Medium, or Large and look straight at
                  the camera for the best fit.
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ========== GLB model (aligned to face) ========== */
function GlassesGLB({ url, position, scale, rotationZ, onError }) {
  let gltf;
  try {
    gltf = useGLTF(url);
  } catch (e) {
    console.error("GLTF load error:", e);
    if (onError) onError();
    return null;
  }

  const { scene } = gltf;

  const calibratedScene = useMemo(() => {
    const cloned = scene.clone(true);

    // Compute bounding box
    const box = new Box3().setFromObject(cloned);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Center model at (0,0,0)
    cloned.position.sub(center);

    // Lift slightly so lenses sit around origin
    cloned.position.y += size.y * 0.44;

    // Normalize width (~0.85 units)
    const width = size.x || 1;
    const targetWidth = 0.80;
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

useGLTF.preload("/3d.glb");
