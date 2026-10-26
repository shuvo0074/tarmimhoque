// PhoneScene: full-viewport WebGL stage for the 3D phone (Hero → About → Experience → Projects).
// Scroll progress comes from the shared store; pointer adds a light parallax tilt.
// Views: web only (lazy-loaded; mobile and no-WebGL browsers keep the CSS phone).
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MathUtils } from "three";
import { scrollProgress, subscribeSceneHidden } from "../../utils/scrollProgress";
import { projectAnchor, projectCamera } from "./cssProjection";
import { HardwareParts } from "./HardwareParts";
import { PhoneModel } from "./PhoneModel";
import { LANDSCAPE_PX_PER_UNIT, PORTRAIT_PX_PER_UNIT, PhoneScreens } from "./PhoneScreens";
import { PHONE, createMaterials } from "./geometry";

const { lerp, damp } = MathUtils;
const FOLLOW = 9;
const PARALLAX_FOLLOW = 3.5;

function usePointer(enabled) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  return pointer;
}

function PhoneRig({ reducedMotion, screenRefs }) {
  const rigRef = useRef(null);
  const portraitAnchorRef = useRef(null);
  const landscapeAnchorRef = useRef(null);
  const pointer = usePointer(!reducedMotion);
  const parallax = useRef({ x: 0, y: 0 });
  const materials = useMemo(createMaterials, []);

  useEffect(
    () => () => Object.values(materials).forEach((material) => material.dispose()),
    [materials]
  );

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const { heroAbout: h, aboutExperience: ae, experienceProjects: ep } = scrollProgress;
    const { width: vw, height: vh } = state.viewport;
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    parallax.current.x = damp(parallax.current.x, pointer.current.x, PARALLAX_FOLLOW, dt);
    parallax.current.y = damp(parallax.current.y, pointer.current.y, PARALLAX_FOLLOW, dt);
    const tiltWeight = 1 - ep;

    // Portrait fills ~2/3 of the viewport height; landscape fills the Experience panel.
    const portraitScale = (0.66 * vh) / PHONE.height;
    const landscapeScale = Math.min((0.8 * vw) / PHONE.height, (0.78 * vh) / PHONE.width);
    // Dip mid-turn so the phone's diagonal never overflows the viewport while rotating.
    const turnDip = 1 - 0.3 * Math.sin(Math.PI * ae);
    const scale =
      lerp(lerp(portraitScale * 0.94, portraitScale, h), landscapeScale, ae) *
      turnDip *
      (1 - 0.6 * ep);

    const x = lerp(0.19 * vw, 0, ae);
    const y = Math.sin(time * 0.9) * 0.05 * (1 - ae * 0.7);
    // Projects: recede into the distance while the canvas fades (see .phone-scene canvas).
    const z = -ep * 4;

    // Hero: angled to show the frame; About: nearly face-on; Experience: turned to landscape.
    const rotX = lerp(lerp(0.3, 0.06, h), 0, ae) + ep * 0.5 - parallax.current.y * 0.08 * tiltWeight;
    const rotY = lerp(lerp(-0.62, -0.2, h), 0, ae) - ep * 0.8 + parallax.current.x * 0.14 * tiltWeight;
    const rotZ =
      lerp(-0.16, 0, h) * (1 - ae) - (Math.PI / 2) * ae + Math.sin(time * 0.5) * 0.02 * (1 - ae);

    rig.position.x = damp(rig.position.x, x, FOLLOW, dt);
    rig.position.y = damp(rig.position.y, y, FOLLOW, dt);
    rig.position.z = damp(rig.position.z, z, FOLLOW, dt);
    rig.rotation.x = damp(rig.rotation.x, rotX, FOLLOW, dt);
    rig.rotation.y = damp(rig.rotation.y, rotY, FOLLOW, dt);
    rig.rotation.z = damp(rig.rotation.z, rotZ, FOLLOW, dt);
    rig.scale.setScalar(damp(rig.scale.x, scale, FOLLOW, dt));

    // Pin the HTML screens to the glass using this frame's matrices.
    rig.updateMatrixWorld(true);
    state.camera.updateMatrixWorld();
    const { viewRef, cameraRef, portraitRef, landscapeRef } = screenRefs;
    if (viewRef.current && cameraRef.current) {
      projectCamera(viewRef.current, cameraRef.current, state.camera, state.size);
    }
    if (portraitRef.current && portraitAnchorRef.current) {
      projectAnchor(portraitRef.current, portraitAnchorRef.current, PORTRAIT_PX_PER_UNIT);
    }
    if (landscapeRef.current && landscapeAnchorRef.current) {
      projectAnchor(landscapeRef.current, landscapeAnchorRef.current, LANDSCAPE_PX_PER_UNIT);
    }
  });

  return (
    <group ref={rigRef}>
      <PhoneModel
        materials={materials}
        portraitAnchorRef={portraitAnchorRef}
        landscapeAnchorRef={landscapeAnchorRef}
      />
      <HardwareParts materials={materials} reducedMotion={reducedMotion} />
    </group>
  );
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={2.6} />
      <directionalLight position={[-6, 1, 4]} intensity={1.1} color="#bfe9ff" />
      <pointLight position={[-5, -2, 3]} color="#5eead4" intensity={45} />
      <pointLight position={[5, 3, -2]} color="#dd66ff" intensity={30} />
      {/* Procedural studio reflections — no HDR download needed. */}
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 2]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#7be8ff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 8, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#dd66ff" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[3, 7, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#5eead4" position={[0, -5, 2]} scale={[10, 1, 1]} />
      </Environment>
    </>
  );
}

function PhoneSceneComponent() {
  const [hidden, setHidden] = useState(scrollProgress.sceneHidden);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const viewRef = useRef(null);
  const cameraRef = useRef(null);
  const portraitRef = useRef(null);
  const landscapeRef = useRef(null);
  const screenRefs = useMemo(
    () => ({ viewRef, cameraRef, portraitRef, landscapeRef }),
    []
  );

  useEffect(() => subscribeSceneHidden(setHidden), []);

  return (
    <div className={`phone-scene${hidden ? " is-hidden" : ""}`} aria-hidden="true">
      <Canvas
        frameloop={hidden ? "never" : "always"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 32, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <StudioLights />
        <PhoneRig reducedMotion={reducedMotion} screenRefs={screenRefs} />
      </Canvas>
      <PhoneScreens screenRefs={screenRefs} />
    </div>
  );
}

export default memo(PhoneSceneComponent);
