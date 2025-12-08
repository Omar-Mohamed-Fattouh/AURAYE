import { useEffect, useState } from "react";
import "aframe";
import "mind-ar/dist/mindar-face.prod.js";
import "mind-ar/dist/mindar-face-aframe.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function GlassesTryOn({ modelUrl }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!modelUrl) return;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const glasses = gltf.scene;
        const root = document.getElementById("glasses");
        if (root && root.object3D) {
          // Clear previous model if exists
          while (root.object3D.children.length > 0) {
            root.object3D.remove(root.object3D.children[0]);
          }
          root.object3D.add(glasses);
          setLoaded(true);
        }
      },
      undefined,
      (error) => {
        console.error("Failed to load 3D model:", error);
      }
    );
  }, [modelUrl]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <a-scene
        mindar-face
        embedded
        color-space="sRGB"
        vr-mode-ui="enabled: false"
        renderer="colorManagement: true, physicallyCorrectLights"
      >
        <a-camera active="false" position="0 0 0"></a-camera>

        {/* face anchor */}
        <a-entity mindar-face-target="anchorIndex: 168">
          <a-entity
            id="glasses"
            position="0 0.05 0"
            scale="0.08 0.08 0.08"
            rotation="0 0 0"
          ></a-entity>
        </a-entity>
      </a-scene>

      {!loaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontWeight: "bold",
            background: "rgba(0,0,0,0.6)",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Loading AR Glasses...
        </div>
      )}
    </div>
  );
}
