// src/components/TryOnModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, useGLTF } from "@react-three/drei";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";

// ===== إعدادات عامة للترانسفورم =====
const BASE_SCALE_MULTIPLIER = 800; // لو صغير جداً زوّد الرقم ده
const MIN_EYE_DIST = 0.06;
const MAX_EYE_DIST = 0.25;
const Y_OFFSET = 0.02; // تحريك النضارة لفوق/تحت بسيط
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

  // tracking state
  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, Z_POSITION],
    scale: defaultScale,
    rotationZ: 0,
  });

  // slider للتحكم في الحجم
  const [userScale, setUserScale] = useState(1); // من 0.5 لـ 2 مثلاً
  const userScaleRef = useRef(1);
  useEffect(() => {
    userScaleRef.current = userScale;
  }, [userScale]);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);

  // نخلي آخر dimensions في ref عشان الـ effect بتاع FaceMesh
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  // اعتبر الموديل جاهز طول ما في URL
  useEffect(() => {
    if (!modelUrl) {
      setModelError("No 3D model URL provided.");
      setModelReady(false);
    } else {
      setModelError(null);
      setModelReady(true);
    }
  }, [modelUrl]);

  // resize للكونتينر
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

  // ===== FaceMesh + camera – tracking حقيقي لملامح الوش =====
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

        // نقاط العينين (دي نقاط ثابته من Mediapipe)
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

        // زاوية ميلان الرأس حوالين محور Z
        const angle = Math.atan2(dy, dx);

        // من [0,1] إلى [-1,1] + تعويض بسيط في الـ Y
        const x = (centerX - 0.5) * 2;
        const y = -(centerY - 0.5) * 2 + Y_OFFSET;

        // scale ديناميكي حسب المسافة بين العينين + الـ slider بتاعك
        const dynamicScale =
          eyeDist *
          BASE_SCALE_MULTIPLIER *
          (defaultScale || 1) *
          userScaleRef.current;

        setGlassesTransform({
          position: [x, y, Z_POSITION],
          scale: dynamicScale,
          rotationZ: -angle, // نعكسها عشان الكاميرا
        });
      };

      faceMesh.onResults(onResults);

      const { width, height } = dimensionsRef.current;

      mpCamera = new MP_Camera(videoRef.current, {
        onFrame: async () => {
          if (!running) return;
          try {
            await faceMesh.send({ image: videoRef.current });
          } catch (err) {
            // errors داخلية من wasm – مفيش مشكلة لو حصلت أحياناً
          }
        },
        width,
        height,
      });

      mpCamera.start();
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
  }, [defaultScale]); // مش بنحط userScale هنا عشان ما نعملش init كل مره

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
          {/* الكاميرا – mirrored بس في الـ CSS، ال data اللي رايحة للـ faceMesh مش بتتقلب */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* 3D overlay – بنقلبه برضه عشان يبقى نفس اتجاه وشّك */}
          {modelReady && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            >
              <Canvas
                orthographic
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: "high-performance",
                }}
                camera={{ position: [0, 0, 5], zoom: 320 }}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  pointerEvents: "none",
                }}
              >
                <OrthographicCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.9} />
                <directionalLight position={[0, 5, 5]} intensity={0.7} />

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

        {/* Slider للتحكم في حجم الموديل */}
        <div className="px-4 pt-2 pb-1 bg-black border-t border-white/20 text-[11px] text-white/80">
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap">Frame size</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={userScale}
              onChange={(e) => setUserScale(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
            <span className="w-10 text-right">
              {Math.round(userScale * 100)}%
            </span>
          </div>
        </div>

        <div className="px-4 py-2 bg-black text-[11px] text-white/70 flex justify-between items-center">
          <span>Tip: move your head slowly left and right.</span>
          <span className="hidden md:inline">
            Your camera stays in your browser only.
          </span>
        </div>
      </div>
    </div>
  );
}

// 👓 3D Glasses component
function GlassesModel({ url, position, scale, rotationZ }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const finalScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <group position={position} rotation={[0, 0, rotationZ]}>
      <primitive object={clonedScene} scale={finalScale} />
    </group>
  );
}
