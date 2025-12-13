// src/pages/Ar.jsx
import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Sparkles, ScanFace, X } from "lucide-react";
import { toast } from "sonner";

import { Canvas } from "@react-three/fiber";
import {
  Box3,
  Vector3,
  Group,
  MeshStandardMaterial,
  DoubleSide,
  Color,
} from "three";

import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { getProductsAr } from "../api/productsApi";

/* ===================== PAGE: AR PRODUCTS GRID ===================== */

export default function Ar() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // { url, defaultScale, productName }
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductsAr();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load AR products:", err);
        toast.error("Failed to load AR products.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleOpenTryOn = (product) => {
    if (!product.models || product.models.length === 0) {
      toast.error("3D model is not available for this product yet.");
      return;
    }

    const mainModel = product.models[0];
    const rawUrl = mainModel.url || "";
    const cleanedUrl = rawUrl.split("?")[0].trim();

    setSelectedModel({
      url: cleanedUrl,
      defaultScale: mainModel.defaultScale || 1,
      productName: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-black px-4 sm:px-6 lg:px-12 py-8 sm:py-10 text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/15 text-[11px] uppercase tracking-[0.15em]">
            <ScanFace className="w-3 h-3" />
            <span>Live AR Try-On</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span>Virtual Try-On Collection</span>
          </h1>

          <p className="text-xs sm:text-sm leading-relaxed text-white/80">
            Browse our AR-enabled eyewear collection and instantly try frames on
            your face using your camera and real-time 3D models.
          </p>
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && (
        <>
          {products.length === 0 ? (
            <p className="text-center text-white/80 mt-12 text-sm">
              No AR products available at the moment.
            </p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product) => {
                const hasDiscount =
                  product.oldPrice &&
                  Number(product.oldPrice) > Number(product.price);

                const discountPercent = hasDiscount
                  ? Math.round(
                      ((Number(product.oldPrice) - Number(product.price)) /
                        Number(product.oldPrice)) *
                        100
                    )
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl border border-white/12 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-transform transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="w-full px-3 pt-5">
                      <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 opacity-70 group-hover:opacity-100 transition" />
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="relative w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 pt-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-[13px] sm:text-sm uppercase tracking-wide text-white h-[36px] overflow-hidden">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-white/80 h-[34px] overflow-hidden mt-1">
                        {product.description ||
                          "High-quality eyewear designed for everyday comfort and style."}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2 text-[12px] sm:text-[13px]">
                        {hasDiscount && (
                          <span className="line-through text-white/60">
                            EGP {Number(product.oldPrice).toLocaleString()}
                          </span>
                        )}

                        <span className="text-white font-bold">
                          EGP {Number(product.price).toLocaleString()}
                        </span>

                        {hasDiscount && (
                          <span className="text-red-400 text-[11px] font-semibold">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Try-On button */}
                      <div className="mt-auto pt-3">
                        <button
                          onClick={() => handleOpenTryOn(product)}
                          className="w-full inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium rounded-xl py-2.5 px-3 bg-white text-black hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition"
                        >
                          <ScanFace size={16} />
                          <span>Try On in AR</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </>
      )}

      {/* AR Try-On Popup */}
      {selectedModel && (
        <TryOnModal
          modelUrl={selectedModel.url}
          defaultScale={selectedModel.defaultScale}
          productName={selectedModel.productName}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}

/* ===================== MODAL + AR TRY-ON (FIXED BEHAVIOR) ===================== */
/**
 * ✅ Fixes:
 * 1) NO double mirroring: ONLY video is mirrored; debug + 3D overlay are NOT mirrored.
 * 2) selfieMode: true
 * 3) Use iris landmarks 468/473 (more stable)
 * 4) Move glasses UP: wy - 0.18
 * 5) Strong smoothing (steady) + safe angle lerp
 * 6) High-res getUserMedia stream + clean stop tracks
 */

const LM_LEFT_EYE_OUTER = 33;
const LM_RIGHT_EYE_OUTER = 263;
const LM_NOSE_BRIDGE = 168;
const LM_NOSE_TIP = 1;
const LM_LEFT_CHEEK = 234;
const LM_RIGHT_CHEEK = 454;

// iris centers (require refineLandmarks: true)
const LM_LEFT_IRIS = 468;
const LM_RIGHT_IRIS = 473;

// scale from face width (cheek-to-cheek)
const MIN_FACE_W = 0.16;
const MAX_FACE_W = 0.42;
const REF_FACE_W = 0.28;

// smoothing (lower = steadier)
const POS_SMOOTH = 0.14;
const ROT_SMOOTH = 0.14;
const SCALE_SMOOTH = 0.14;

const MIN_S = 0.16;
const MAX_S = 1.25;

const CAMERA_Z = 2.7;
const CAMERA_FOV = 35;

function TryOnModal({ modelUrl, defaultScale = 1, productName, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const debugCanvasRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
  const dimensionsRef = useRef(dimensions);

  // 0 small, 1 medium, 2 large
  const [sizePreset, setSizePreset] = useState(1);
  const sizePresetRef = useRef(1);
  useEffect(() => {
    sizePresetRef.current = sizePreset;
  }, [sizePreset]);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);

  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, 0],
    scale: 0.45,
    rotationZ: 0,
    rotationY: 0,
    rotationX: 0,
  });

  const transformRef = useRef(glassesTransform);
  const scanRef = useRef({ t: 0 });
  const streamRef = useRef(null);

  const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAngle = (a, b, t) => {
    const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
    return a + d * t;
  };

  const resolvedModel = useMemo(() => {
    const clean = (modelUrl || "").split("?")[0].trim();
    if (!clean) return { kind: "none" };

    const lower = clean.toLowerCase();
    if (lower.endsWith(".mtl")) {
      return { kind: "obj", objUrl: clean.replace(/\.mtl$/i, ".obj"), mtlUrl: clean };
    }
    if (lower.endsWith(".obj")) {
      return { kind: "obj", objUrl: clean, mtlUrl: clean.replace(/\.obj$/i, ".mtl") };
    }
    if (lower.endsWith(".glb") || lower.endsWith(".gltf")) {
      return { kind: "gltf", url: clean };
    }
    return { kind: "unsupported" };
  }, [modelUrl]);

  useEffect(() => {
    if (!modelUrl) {
      setModelError("No 3D model URL provided.");
      setModelReady(false);
      return;
    }
    if (resolvedModel.kind === "unsupported") {
      setModelError("Unsupported 3D model format (use .glb / .gltf / .obj).");
      setModelReady(false);
      return;
    }
    setModelError(null);
    setModelReady(true);
  }, [modelUrl, resolvedModel.kind]);

  // Resize container + debug canvas
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = w * 0.75;

      setDimensions({ width: w, height: h });
      dimensionsRef.current = { width: w, height: h };

      const c = debugCanvasRef.current;
      if (c) {
        c.width = Math.floor(w);
        c.height = Math.floor(h);
      }
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
    let lostFrames = 0;

    const getWorldRanges = () => {
      const { width, height } = dimensionsRef.current;
      const aspect = (width || 1) / (height || 1);
      const fovRad = (CAMERA_FOV * Math.PI) / 180;
      const visibleH = 2 * CAMERA_Z * Math.tan(fovRad / 2);
      const visibleW = visibleH * aspect;
      return { xHalf: visibleW / 2, yHalf: visibleH / 2 };
    };

    const mapToWorld = (nx, ny) => {
      const { xHalf, yHalf } = getWorldRanges();
      const x = (nx - 0.5) * (xHalf * 2);
      const y = -(ny - 0.5) * (yHalf * 2);
      return [x, y];
    };

    const drawDebug = (lm) => {
      const c = debugCanvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const w = c.width || 1;
      const h = c.height || 1;

      ctx.clearRect(0, 0, w, h);

      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      if (!lm) {
        scanRef.current.t += 1;
        const t = scanRef.current.t;
        const y = (Math.sin(t * 0.08) * 0.5 + 0.5) * h;

        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.15, y);
        ctx.lineTo(w * 0.85, y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
        ctx.fillText("Searching for face…", 12, 20);
        return;
      }

      const LI = lm[LM_LEFT_IRIS] || lm[LM_LEFT_EYE_OUTER];
      const RI = lm[LM_RIGHT_IRIS] || lm[LM_RIGHT_EYE_OUTER];
      const nose = lm[LM_NOSE_BRIDGE];
      const leftCheek = lm[LM_LEFT_CHEEK];
      const rightCheek = lm[LM_RIGHT_CHEEK];

      const px = (p) => [p.x * w, p.y * h];

      const [lix, liy] = px(LI);
      const [rix, riy] = px(RI);
      const [nx, ny] = px(nose);
      const [lcx, lcy] = px(leftCheek);
      const [rcx, rcy] = px(rightCheek);

      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lix, liy);
      ctx.lineTo(rix, riy);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lcx, lcy);
      ctx.lineTo(rcx, rcy);
      ctx.stroke();

      const dot = (x, y, r, a) => {
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      dot(lix, liy, 5, 0.95);
      dot(rix, riy, 5, 0.95);
      dot(nx, ny, 4, 0.75);
      dot(lcx, lcy, 4, 0.6);
      dot(rcx, rcy, 4, 0.6);

      const irisCenterX = (lix + rix) / 2;
      const irisCenterY = (liy + riy) / 2;
      const cx = lerp(irisCenterX, nx, 0.10);
      const cy = lerp(irisCenterY, ny, 0.18);

      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();
    };

    const applySmooth = (target) => {
      const prev = transformRef.current;

      const nextPos = [
        lerp(prev.position[0], target.position[0], POS_SMOOTH),
        lerp(prev.position[1], target.position[1], POS_SMOOTH),
        0,
      ];
      const nextScale = lerp(prev.scale, target.scale, SCALE_SMOOTH);
      const nextRz = lerpAngle(prev.rotationZ, target.rotationZ, ROT_SMOOTH);
      const nextRy = lerpAngle(prev.rotationY, target.rotationY, ROT_SMOOTH);
      const nextRx = lerpAngle(prev.rotationX, target.rotationX, ROT_SMOOTH);

      const next = {
        position: nextPos,
        scale: nextScale,
        rotationZ: nextRz,
        rotationY: nextRy,
        rotationX: nextRx,
      };

      transformRef.current = next;
      setGlassesTransform(next);
    };

    const startHighResCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    };

    const setup = async () => {
      if (!videoRef.current) return;

      try {
        await startHighResCamera();
      } catch (e) {
        console.error("getUserMedia failed:", e);
        setModelError("Camera permission denied or not available.");
        return;
      }

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        selfieMode: true, // ✅ مهم جدًا
        minDetectionConfidence: 0.75,
        minTrackingConfidence: 0.75,
      });

      faceMesh.onResults((results) => {
        if (!running) return;

        const lm = results.multiFaceLandmarks?.[0];

        if (!lm) {
          lostFrames += 1;
          drawDebug(null);

          const prev = transformRef.current;
          const relax = Math.min(0.03 + lostFrames * 0.002, 0.08);

          const next = {
            position: [
              lerp(prev.position[0], 0, relax),
              lerp(prev.position[1], 0, relax),
              0,
            ],
            scale: lerp(prev.scale, prev.scale * 0.99, relax),
            rotationZ: lerp(prev.rotationZ, 0, relax),
            rotationY: lerp(prev.rotationY, 0, relax),
            rotationX: lerp(prev.rotationX, 0, relax),
          };

          transformRef.current = next;
          setGlassesTransform(next);
          return;
        }

        lostFrames = 0;
        drawDebug(lm);

        // iris landmarks (most stable)
        const LI = lm[LM_LEFT_IRIS] || lm[LM_LEFT_EYE_OUTER];
        const RI = lm[LM_RIGHT_IRIS] || lm[LM_RIGHT_EYE_OUTER];

        const nose = lm[LM_NOSE_BRIDGE];
        const noseTip = lm[LM_NOSE_TIP];
        const leftCheek = lm[LM_LEFT_CHEEK];
        const rightCheek = lm[LM_RIGHT_CHEEK];

        // Center: X from iris center, Y blended with bridge (steadier)
        const irisCenterX = (LI.x + RI.x) / 2;
        const irisCenterY = (LI.y + RI.y) / 2;

        const centerX = lerp(irisCenterX, nose.x, 0.10);
        const centerY = lerp(irisCenterY, nose.y, 0.18);

        // roll from iris line
        const dx = RI.x - LI.x;
        const dy = RI.y - LI.y;
        const roll = Math.atan2(dy, dx);

        // face width scale from cheeks
        const fdx = rightCheek.x - leftCheek.x;
        const fdy = rightCheek.y - leftCheek.y;
        const faceWRaw = Math.sqrt(fdx * fdx + fdy * fdy);
        const faceW = clamp(faceWRaw, MIN_FACE_W, MAX_FACE_W);

        // presets
        const preset = sizePresetRef.current;
        const presetMul = preset === 0 ? 0.92 : preset === 2 ? 1.12 : 1.0;

        const dScale = clamp(defaultScale || 1, 0.5, 1.6);

        // scale
        let s = (faceW / REF_FACE_W) * 0.6 * dScale * presetMul;
        if (resolvedModel.kind === "obj") s *= 1.12;
        s = clamp(s, MIN_S, MAX_S);

        // yaw / pitch (subtle)
        const yaw = clamp((RI.z - LI.z) * 2.2, -0.45, 0.45);
        const pitch = clamp(((noseTip?.y ?? 0) - (nose?.y ?? 0)) * 2.0, -0.35, 0.35);

        // map to world and move UP to sit on eyes
        const [wx, wy0] = mapToWorld(centerX, centerY);

        let wy = wy0 - 0.18; // ✅ فوق العين
        if (resolvedModel.kind === "obj") wy += 0.03;

        applySmooth({
          position: [wx, wy, 0],
          scale: s,
          rotationZ: -roll,
          rotationY: yaw,
          rotationX: -pitch,
        });
      });

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
        setModelError("Camera failed to start. Check permissions.");
      }
    };

    setup();

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

      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch (_) {}
        streamRef.current = null;
      }
    };
  }, [defaultScale, resolvedModel.kind]);

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

        {/* Video + overlays */}
        <div
          ref={containerRef}
          className="relative bg-black flex items-center justify-center"
          style={{ aspectRatio: "4 / 3" }}
        >
          {/* ✅ ONLY VIDEO mirrored */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* ✅ Debug NOT mirrored */}
          <canvas
            ref={debugCanvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* ✅ 3D overlay NOT mirrored (fixes “moves opposite”) */}
          {modelReady && !modelError && (
            <div className="absolute inset-0 pointer-events-none">
              <Canvas
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: "high-performance",
                  preserveDrawingBuffer: false,
                }}
                camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  pointerEvents: "none",
                }}
                onCreated={({ gl }) => {
                  gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                }}
              >
                <ambientLight intensity={1.05} />
                <directionalLight position={[2, 2, 3]} intensity={0.85} />

                <Suspense fallback={null}>
                  <SafeGlassesModel
                    resolved={resolvedModel}
                    position={glassesTransform.position}
                    scale={glassesTransform.scale}
                    rotationZ={glassesTransform.rotationZ}
                    rotationY={glassesTransform.rotationY}
                    rotationX={glassesTransform.rotationX}
                    onModelError={(msg) => setModelError(msg)}
                  />
                </Suspense>
              </Canvas>
            </div>
          )}

          {/* Error message */}
          {modelError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/80 text-white text-[12px] px-4 py-2 rounded-full border border-white/15">
                {modelError}
              </div>
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
          <span className="hidden md:inline">Your camera stays in your browser only.</span>
        </div>
      </div>
    </div>
  );
}

/* ===================== 3D MODELS (SAFE LOADING) ===================== */

function SafeGlassesModel({
  resolved,
  position,
  scale,
  rotationZ,
  rotationY,
  rotationX,
  onModelError,
}) {
  if (!resolved || resolved.kind === "none") return null;
  if (resolved.kind === "unsupported") return null;

  if (resolved.kind === "gltf") {
    return (
      <LoadedGLTF
        url={resolved.url}
        position={position}
        scale={scale}
        rotationZ={rotationZ}
        rotationY={rotationY}
        rotationX={rotationX}
        onModelError={onModelError}
      />
    );
  }

  return (
    <LoadedOBJ
      objUrl={resolved.objUrl}
      mtlUrl={resolved.mtlUrl}
      position={position}
      scale={scale}
      rotationZ={rotationZ}
      rotationY={rotationY}
      rotationX={rotationX}
      onModelError={onModelError}
    />
  );
}

function LoadedGLTF({
  url,
  position,
  scale,
  rotationZ,
  rotationY,
  rotationX,
  onModelError,
}) {
  const [scene, setScene] = useState(null);
  const [loadedErr, setLoadedErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setScene(null);
    setLoadedErr(null);

    const loader = new GLTFLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      url,
      (gltf) => {
        if (!alive) return;
        const s = gltf?.scene ? gltf.scene.clone(true) : null;
        if (!s) {
          setLoadedErr("GLB/GLTF loaded but scene is empty.");
          return;
        }
        setScene(calibrateObject(s, 1.0, 0.38));
      },
      undefined,
      (err) => {
        if (!alive) return;
        console.error("GLTF load error:", err);
        setLoadedErr("Failed to load GLB/GLTF model (check URL/CORS).");
      }
    );

    return () => {
      alive = false;
    };
  }, [url]);

  useEffect(() => {
    if (loadedErr) onModelError?.(loadedErr);
  }, [loadedErr, onModelError]);

  if (!scene) return null;

  return (
    <group
      position={position}
      rotation={[rotationX || 0, rotationY || 0, rotationZ || 0]}
      scale={[scale, scale, scale]}
    >
      <primitive object={scene} />
    </group>
  );
}

function LoadedOBJ({
  objUrl,
  mtlUrl,
  position,
  scale,
  rotationZ,
  rotationY,
  rotationX,
  onModelError,
}) {
  const [obj, setObj] = useState(null);
  const [loadedErr, setLoadedErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setObj(null);
    setLoadedErr(null);

    const manager = undefined;

    const tryLoadMTL = () =>
      new Promise((resolve) => {
        const mtlLoader = new MTLLoader(manager);
        mtlLoader.setCrossOrigin("anonymous");
        mtlLoader.load(
          mtlUrl,
          (materials) => {
            try {
              materials.preload();
            } catch (_) {}
            resolve(materials);
          },
          undefined,
          () => resolve(null)
        );
      });

    const loadObjWith = (materials) =>
      new Promise((resolve, reject) => {
        const objLoader = new OBJLoader(manager);
        objLoader.setCrossOrigin("anonymous");
        if (materials) objLoader.setMaterials(materials);

        objLoader.load(
          objUrl,
          (loaded) => resolve(loaded),
          undefined,
          (err) => reject(err)
        );
      });

    (async () => {
      try {
        const materials = await tryLoadMTL(); // may be null
        const loaded = await loadObjWith(materials);

        if (!alive) return;

        const cloned = loaded.clone(true);

        // fallback material if no MTL
        if (!materials) {
          cloned.traverse((child) => {
            if (child && child.isMesh) {
              child.material = new MeshStandardMaterial({
                color: new Color("#f5f5f5"),
                roughness: 0.6,
                metalness: 0.1,
                side: DoubleSide,
              });
            }
          });
        }

        setObj(calibrateObject(cloned, 1.0, 0.45));
      } catch (err) {
        console.error("OBJ load error:", err);
        if (!alive) return;
        setLoadedErr("Failed to load OBJ model (check URL / CORS).");
      }
    })();

    return () => {
      alive = false;
    };
  }, [objUrl, mtlUrl]);

  useEffect(() => {
    if (loadedErr) onModelError?.(loadedErr);
  }, [loadedErr, onModelError]);

  if (!obj) return null;

  return (
    <group
      position={position}
      rotation={[rotationX || 0, rotationY || 0, rotationZ || 0]}
      scale={[scale, scale, scale]}
    >
      <primitive object={obj} />
    </group>
  );
}

/**
 * calibrateObject:
 * - center to origin
 * - lift so frame sits around eye level
 * - normalize width
 */
function calibrateObject(object3d, targetWidth = 1.0, liftRatio = 0.4) {
  const root = new Group();
  root.add(object3d);

  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  // center
  root.position.sub(center);

  // lift
  root.position.y += (size.y || 1) * liftRatio;

  // normalize width
  const width = size.x || 1;
  const norm = targetWidth / width;
  root.scale.setScalar(norm);

  return root;
}
