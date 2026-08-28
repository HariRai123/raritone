import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  useGLTF,
} from "@react-three/drei";
import {
  Expand,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
} from "lucide-react";

function Model({ url }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} scale={1} />;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
        <p className="text-sm font-medium text-neutral-700">
          Loading 3D model...
        </p>
      </div>
    </Html>
  );
}

function ViewerContent({ url, controlsRef }) {
  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <directionalLight
        position={[-5, 3, -5]}
        intensity={1}
      />

      <Suspense fallback={<Loader />}>
        <Model url={url} />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableRotate
        enableZoom
        enablePan
        minDistance={1}
        maxDistance={10}
      />
    </>
  );
}

function ThreeDViewer({ url, className = "" }) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);

  const resetView = () => {
    if (!controlsRef.current) {
      return;
    }

    controlsRef.current.reset();
  };

  const zoomIn = () => {
    if (!controlsRef.current) {
      return;
    }

    const controls = controlsRef.current;

    if (controls.dollyIn) {
      controls.dollyIn(1.2);
      controls.update();
    }
  };

  const zoomOut = () => {
    if (!controlsRef.current) {
      return;
    }

    const controls = controlsRef.current;

    if (controls.dollyOut) {
      controls.dollyOut(1.2);
      controls.update();
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  if (!url) {
    return (
      <div
        className={`flex min-h-[500px] items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50 ${className}`}
      >
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-neutral-300" />

          <p className="mt-3 text-sm font-medium text-neutral-700">
            3D preview coming soon
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            This product does not have an approved 3D model.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[500px] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 ${className}`}
    >
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 45,
        }}
      >
        <ViewerContent
          url={url}
          controlsRef={controlsRef}
        />
      </Canvas>

      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-sm backdrop-blur">
        3D Preview
      </div>

      <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-[10px] text-white backdrop-blur">
        Drag to rotate · Scroll to zoom
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-neutral-200 bg-white/95 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={resetView}
          title="Reset view"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={zoomIn}
          title="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={zoomOut}
          title="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title={
            fullscreen
              ? "Exit fullscreen"
              : "Fullscreen"
          }
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ThreeDViewer;