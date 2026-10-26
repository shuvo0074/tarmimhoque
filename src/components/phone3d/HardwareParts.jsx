// HardwareParts: exploded phone internals that drift in Hero and assemble into the body on About.
// Each part lives in the phone's local space, so it lands in its real slot wherever the phone is.
// Views: web only (inside PhoneScene).
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, Color, MathUtils, MeshStandardMaterial, Object3D, SphereGeometry } from "three";
import { scrollProgress } from "../../utils/scrollProgress";
import { createRoundedSlab } from "./geometry";
import {
  createBatteryTexture,
  createChipTexture,
  createFlexTexture,
  createPcbTextures,
} from "./textures";

// from: exploded position (phone-local), to: assembled slot inside the body.
// scale: optional exploded-size boost for tiny parts (sensors) so they read at a glance.
const PARTS = [
  { id: "chipModule", from: [1.5, -1.5, -0.1], fromRot: [-0.4, 0.45, 0.25], to: [0.1, 0.9, -0.02] },
  { id: "faceSensor", from: [1.8, 0.9, 0.2], fromRot: [0.25, 0.55, -0.25], to: [0, 1.48, 0.0], scale: 1.6 },
  { id: "mic", from: [0.9, -2.05, 0.4], fromRot: [0.5, 0.5, -0.4], to: [0.5, -1.52, 0.0], scale: 2.2 },
  { id: "battery", from: [-1.3, -0.9, -1.6], fromRot: [-0.3, 0.6, -0.25], to: [0, -0.5, -0.01] },
  // Flipped in Hero so its BGA solder balls face the viewer, then turns over as it docks.
  { id: "processor", from: [-0.95, 1.9, 0.3], fromRot: [2.5, 0.5, 0.6], to: [0.18, 1.02, 0.01] },
  { id: "flex", from: [-1.15, 0.55, -0.9], fromRot: [0.3, 0.5, 1.1], to: [0.5, 0.2, -0.02] },
  { id: "taptic", from: [-0.85, -2.1, 0.2], fromRot: [0.6, 0.8, 0.2], to: [-0.3, -1.38, 0] },
  { id: "rfChip", from: [-0.1, 2.3, -0.4], fromRot: [0.6, 0.9, 0.4], to: [0.4, 1.22, 0] },
  { id: "portBoard", from: [0.85, 2.15, 0.2], fromRot: [0.7, -0.3, -0.4], to: [0, -1.5, -0.02] },
  { id: "lens", from: [-1.15, -1.75, -0.3], fromRot: [0.5, 1.1, 0.2], to: [-0.36, 1.14, -0.05] },
];

const STAGGER = 0.3;
const FLIGHT = 0.7;
// Parts read larger while exploded and shrink to true size as they dock.
const EXPLODED_SCALE = 1.35;
// How far a part swings behind the phone mid-flight, so it enters through the back
// instead of crossing in front of the screen.
const BACK_ARC = 1.4;

// BoxGeometry face order: +x, -x, +y, -y, +z, -z — texture only the top (+z) face.
function topFaced(top, side) {
  return [side, side, side, side, top, side];
}

function Instanced({ geometry, material, items }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(0, 0, item.rotationZ ?? 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);

  return <instancedMesh ref={ref} args={[geometry, material, items.length]} />;
}

function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createSmdLayout(count, seed, width, height, z) {
  const random = seeded(seed);
  return Array.from({ length: count }, () => ({
    position: [(random() - 0.5) * width, (random() - 0.5) * height, z],
    rotationZ: random() > 0.5 ? Math.PI / 2 : 0,
  }));
}

function createBgaLayout(grid, pitch, z) {
  const offset = ((grid - 1) * pitch) / 2;
  const items = [];
  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < grid; col += 1) {
      items.push({ position: [col * pitch - offset, row * pitch - offset, z] });
    }
  }
  return items;
}

function createPinRow(count, pitch, y, z) {
  const offset = ((count - 1) * pitch) / 2;
  return Array.from({ length: count }, (_, index) => ({
    position: [index * pitch - offset, y, z],
  }));
}

// A single memory chip on a small board fragment, with gold edge pads and passives.
function ChipModule({ kit }) {
  const { materials, geometries, layouts } = kit;
  return (
    <>
      <mesh material={topFaced(materials.pcb, materials.pcbEdge)}>
        <boxGeometry args={[0.54, 0.44, 0.024]} />
      </mesh>
      <mesh material={topFaced(materials.ram, materials.chipSide)} position={[0, 0.03, 0.024]}>
        <boxGeometry args={[0.3, 0.22, 0.024]} />
      </mesh>
      <Instanced geometry={geometries.pin} material={materials.gold} items={layouts.moduleEdgePads} />
      <Instanced geometry={geometries.smd} material={materials.ceramic} items={layouts.moduleCaps} />
      <Instanced geometry={geometries.smd} material={materials.resistor} items={layouts.moduleResistors} />
    </>
  );
}

// Face-unlock sensor bar: IR camera, flood illuminator, dot projector on one carrier.
function FaceSensor({ kit }) {
  const { materials, geometries } = kit;
  return (
    <>
      <mesh geometry={geometries.sensorBar} material={materials.chipSide} />
      {[
        [-0.2, 0.045, materials.lensGlass],
        [0.2, 0.04, materials.projectorGlass],
      ].map(([x, radius, material]) => (
        <group key={x} position={[x, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.silver}>
            <cylinderGeometry args={[radius * 1.35, radius * 1.35, 0.02, 32]} />
          </mesh>
          <mesh material={material} position={[0, 0.011, 0]}>
            <cylinderGeometry args={[radius, radius, 0.004, 32]} />
          </mesh>
        </group>
      ))}
      <mesh material={materials.infrared} position={[0, 0, 0.032]}>
        <boxGeometry args={[0.06, 0.05, 0.006]} />
      </mesh>
      <mesh material={topFaced(materials.flex, materials.copper)} position={[0, -0.16, -0.02]}>
        <boxGeometry args={[0.1, 0.22, 0.008]} />
      </mesh>
    </>
  );
}

// MEMS microphone: metal can with an acoustic port.
function Mic({ kit }) {
  const { materials, geometries } = kit;
  return (
    <>
      <mesh material={materials.substrate}>
        <boxGeometry args={[0.15, 0.11, 0.012]} />
      </mesh>
      <mesh geometry={geometries.micCan} material={materials.silver} position={[0, 0, 0.022]} />
      <mesh material={materials.chipSide} position={[0.03, 0.01, 0.043]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.004, 16]} />
      </mesh>
    </>
  );
}

function Processor({ kit }) {
  const { materials, geometries, layouts } = kit;
  return (
    <>
      <mesh material={materials.substrate}>
        <boxGeometry args={[0.46, 0.46, 0.02]} />
      </mesh>
      <mesh material={topFaced(materials.socLid, materials.silver)} position={[0, 0, 0.022]}>
        <boxGeometry args={[0.34, 0.34, 0.026]} />
      </mesh>
      <Instanced geometry={geometries.smd} material={materials.ceramic} items={layouts.processorCaps} />
      <Instanced geometry={geometries.ball} material={materials.solder} items={layouts.bga} />
    </>
  );
}

function Battery({ kit }) {
  const { materials } = kit;
  return (
    <>
      <mesh material={topFaced(materials.batteryLabel, materials.batteryFoil)}>
        <boxGeometry args={[1.22, 1.7, 0.07]} />
      </mesh>
      <mesh material={topFaced(materials.flex, materials.copper)} position={[0.3, 0.95, 0.02]}>
        <boxGeometry args={[0.14, 0.24, 0.008]} />
      </mesh>
      <mesh material={materials.chipSide} position={[0.3, 1.08, 0.025]}>
        <boxGeometry args={[0.2, 0.08, 0.025]} />
      </mesh>
    </>
  );
}

function FlexCable({ kit }) {
  const { materials } = kit;
  return (
    <>
      <mesh material={topFaced(materials.flex, materials.copper)}>
        <boxGeometry args={[0.13, 0.82, 0.008]} />
      </mesh>
      <mesh material={materials.chipSide} position={[0, 0.43, 0.01]}>
        <boxGeometry args={[0.19, 0.08, 0.024]} />
      </mesh>
      <mesh material={materials.gold} position={[0, -0.42, 0.006]}>
        <boxGeometry args={[0.15, 0.06, 0.006]} />
      </mesh>
    </>
  );
}

function Taptic({ kit }) {
  const { materials, geometries } = kit;
  return (
    <>
      <mesh geometry={geometries.taptic} material={materials.silver} />
      <mesh material={materials.sticker} position={[0, 0, 0.042]}>
        <boxGeometry args={[0.3, 0.12, 0.002]} />
      </mesh>
    </>
  );
}

function RfChip({ kit }) {
  const { materials, layouts, geometries } = kit;
  return (
    <>
      <mesh material={topFaced(materials.rf, materials.chipSide)}>
        <boxGeometry args={[0.2, 0.2, 0.03]} />
      </mesh>
      <Instanced geometry={geometries.pin} material={materials.gold} items={layouts.rfPins} />
    </>
  );
}

function PortBoard({ kit }) {
  const { materials, geometries, layouts } = kit;
  return (
    <>
      <mesh material={topFaced(materials.pcb, materials.pcbEdge)}>
        <boxGeometry args={[0.68, 0.24, 0.02]} />
      </mesh>
      <mesh geometry={geometries.usbShell} material={materials.silver} position={[0, -0.1, 0.03]} />
      <mesh material={materials.chipSide} position={[0, -0.1, 0.03]}>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
      </mesh>
      <Instanced geometry={geometries.smd} material={materials.ceramic} items={layouts.portCaps} />
    </>
  );
}

function LensElement({ kit }) {
  const { materials } = kit;
  return (
    <>
      <mesh material={materials.silver}>
        <torusGeometry args={[0.16, 0.035, 16, 48]} />
      </mesh>
      <mesh material={materials.lensGlass} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 32]} />
      </mesh>
    </>
  );
}

const PART_COMPONENTS = {
  chipModule: ChipModule,
  faceSensor: FaceSensor,
  mic: Mic,
  battery: Battery,
  processor: Processor,
  flex: FlexCable,
  taptic: Taptic,
  rfChip: RfChip,
  portBoard: PortBoard,
  lens: LensElement,
};

function createKit(materials) {
  const pcbTextures = createPcbTextures();
  const textures = {
    pcb: pcbTextures.map,
    pcbGlow: pcbTextures.emissiveMap,
    socLid: createChipTexture(["SoC X1", "3nm · 2431", "8-CORE"], { lid: true }),
    ram: createChipTexture(["LPDDR5X", "8GB 2430"], { pinOne: false }),
    rf: createChipTexture(["RF 5G", "NR-X70"]),
    battery: createBatteryTexture(),
    flex: createFlexTexture(),
  };

  const standard = (options) => new MeshStandardMaterial(options);
  const kitMaterials = {
    ...materials,
    pcb: standard({
      map: textures.pcb,
      emissiveMap: textures.pcbGlow,
      emissive: new Color("#5eead4"),
      emissiveIntensity: 0.6,
      roughness: 0.45,
      metalness: 0.25,
    }),
    pcbEdge: standard({ color: "#0c3a2a", roughness: 0.6, metalness: 0.1 }),
    socLid: standard({ map: textures.socLid, roughness: 0.35, metalness: 0.55 }),
    ram: standard({ map: textures.ram, roughness: 0.45, metalness: 0.2 }),
    rf: standard({ map: textures.rf, roughness: 0.45, metalness: 0.2 }),
    // Dot projector glass has a faint violet coating; IR emitters glow deep red.
    projectorGlass: standard({ color: "#2a1d4a", roughness: 0.05, metalness: 0.6 }),
    infrared: standard({
      color: "#3a0c14",
      emissive: new Color("#ff2d55"),
      emissiveIntensity: 0.5,
      roughness: 0.3,
    }),
    chipSide: standard({ color: "#15181e", roughness: 0.5, metalness: 0.3 }),
    substrate: standard({ color: "#1f4a3a", roughness: 0.5, metalness: 0.2 }),
    solder: standard({ color: "#d7dde4", roughness: 0.2, metalness: 1 }),
    batteryLabel: standard({ map: textures.battery, roughness: 0.55, metalness: 0.2 }),
    batteryFoil: standard({ color: "#9aa4b1", roughness: 0.3, metalness: 0.9 }),
    flex: standard({ map: textures.flex, roughness: 0.4, metalness: 0.35 }),
    resistor: standard({ color: "#121418", roughness: 0.4, metalness: 0.2 }),
    sticker: standard({ color: "#2b3a4c", roughness: 0.6, metalness: 0.1 }),
  };

  const geometries = {
    smd: new BoxGeometry(0.045, 0.022, 0.018),
    pin: new BoxGeometry(0.012, 0.03, 0.006),
    ball: new SphereGeometry(0.011, 8, 6),
    sensorBar: createRoundedSlab(0.62, 0.15, 0.05, 0.06, 0.01),
    micCan: createRoundedSlab(0.12, 0.085, 0.032, 0.02, 0.006),
    taptic: createRoundedSlab(0.56, 0.22, 0.08, 0.06, 0.012),
    usbShell: createRoundedSlab(0.2, 0.07, 0.06, 0.035, 0.008),
  };

  const layouts = {
    moduleEdgePads: createPinRow(14, 0.032, -0.19, 0.014),
    moduleCaps: [
      [-0.22, 0.16],
      [-0.22, 0.08],
      [-0.22, -0.0],
      [0.22, 0.16],
      [0.22, 0.08],
      [-0.08, -0.12],
      [0.08, -0.12],
    ].map(([x, y]) => ({ position: [x, y, 0.021] })),
    moduleResistors: [
      [0.22, -0.0],
      [-0.22, -0.08],
      [0.22, -0.08],
      [0, 0.19],
    ].map(([x, y]) => ({ position: [x, y, 0.021], rotationZ: Math.PI / 2 })),
    processorCaps: [
      [-0.2, 0.2],
      [0.2, 0.2],
      [-0.2, -0.2],
      [0.2, -0.2],
      [0, 0.205],
      [0, -0.205],
    ].map(([x, y]) => ({ position: [x, y, 0.016] })),
    bga: createBgaLayout(11, 0.036, -0.016),
    rfPins: createPinRow(6, 0.028, 0.105, 0)
      .concat(createPinRow(6, 0.028, -0.105, 0)),
    portCaps: createSmdLayout(10, 53, 0.6, 0.12, 0.016),
  };

  const dispose = () => {
    Object.values(textures).forEach((texture) => texture.dispose());
    Object.values(geometries).forEach((geometry) => geometry.dispose());
    Object.entries(kitMaterials).forEach(([key, material]) => {
      // Shared phone materials are disposed by PhoneRig.
      if (!(key in materials)) material.dispose();
    });
  };

  return { materials: kitMaterials, geometries, layouts, dispose };
}

function HardwarePartsComponent({ materials, reducedMotion }) {
  const groupRef = useRef(null);
  const partRefs = useRef([]);
  const kit = useMemo(() => createKit(materials), [materials]);

  useEffect(() => () => kit.dispose(), [kit]);

  useFrame((state) => {
    const heroAbout = scrollProgress.heroAbout;
    const group = groupRef.current;
    if (!group) return;

    // Once assembled everything sits inside the body; skip drawing it.
    group.visible = heroAbout < 0.999;
    if (!group.visible) return;

    const time = reducedMotion ? 0 : state.clock.elapsedTime;

    PARTS.forEach((part, index) => {
      const mesh = partRefs.current[index];
      if (!mesh) return;

      const delay = (index / PARTS.length) * STAGGER;
      const p = MathUtils.clamp((heroAbout - delay) / FLIGHT, 0, 1);
      const settle = 1 - p;
      // Gentle drift while exploded, fading out as the part docks.
      const drift = Math.sin(time * 0.6 + index * 1.7) * 0.12 * settle;

      mesh.position.set(
        MathUtils.lerp(part.from[0], part.to[0], p),
        MathUtils.lerp(part.from[1], part.to[1], p) + drift,
        MathUtils.lerp(part.from[2], part.to[2], p) - Math.sin(Math.PI * p) * BACK_ARC
      );
      mesh.rotation.set(
        part.fromRot[0] * settle + Math.sin(time * 0.4 + index) * 0.25 * settle,
        part.fromRot[1] * settle + Math.sin(time * 0.3 + index * 0.9) * 0.6 * settle,
        part.fromRot[2] * settle
      );
      mesh.scale.setScalar(1 + ((part.scale ?? EXPLODED_SCALE) - 1) * settle);
    });
  });

  return (
    <group ref={groupRef}>
      {PARTS.map((part, index) => {
        const Part = PART_COMPONENTS[part.id];
        return (
          <group
            key={part.id}
            ref={(node) => {
              partRefs.current[index] = node;
            }}
            position={part.from}
          >
            <Part kit={kit} />
          </group>
        );
      })}
    </group>
  );
}

export const HardwareParts = memo(HardwarePartsComponent);
