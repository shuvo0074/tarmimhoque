// PhoneModel: 3D phone body plus the anchors its HTML screens are projected onto.
// The landscape anchor is pre-rotated so Experience reads upright once the phone turns sideways.
// Views: web only (inside PhoneScene).
import { memo, useEffect, useMemo } from "react";
import { PHONE, SCREEN, createRoundedPlane, createRoundedSlab } from "./geometry";

const FRONT_Z = PHONE.depth / 2;
const BACK_Z = -PHONE.depth / 2;

function PhoneModelComponent({ materials, portraitAnchorRef, landscapeAnchorRef }) {
  const geometries = useMemo(
    () => ({
      body: createRoundedSlab(
        PHONE.width,
        PHONE.height,
        PHONE.depth,
        PHONE.cornerRadius,
        PHONE.bevel
      ),
      glass: createRoundedPlane(SCREEN.width + 0.04, SCREEN.height + 0.04, SCREEN.cornerRadius),
      island: createRoundedSlab(0.44, 0.12, 0.01, 0.06, 0.004),
      cameraBump: createRoundedSlab(0.7, 0.7, 0.06, 0.18, 0.02),
      button: createRoundedSlab(0.03, 0.3, 0.07, 0.015, 0.008),
    }),
    []
  );

  useEffect(
    () => () => Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries]
  );

  return (
    <group>
      {/* Extrude groups: 0 = front/back caps, 1 = sides — sides get the polished frame. */}
      <mesh geometry={geometries.body} material={[materials.back, materials.frame]} />

      <mesh geometry={geometries.glass} material={materials.glass} position={[0, 0, FRONT_Z + 0.001]} />
      <mesh
        geometry={geometries.island}
        material={materials.chip}
        position={[0, SCREEN.height / 2 - 0.13, FRONT_Z + 0.006]}
      />

      <group position={[-0.36, 1.14, BACK_Z - 0.03]}>
        <mesh geometry={geometries.cameraBump} material={materials.back} />
        {[
          [-0.14, 0.14],
          [0.14, -0.14],
          [-0.14, -0.14],
        ].map(([x, y]) => (
          <group key={`${x}${y}`} position={[x, y, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={materials.silver}>
              <cylinderGeometry args={[0.105, 0.105, 0.03, 32]} />
            </mesh>
            <mesh material={materials.lensGlass} position={[0, -0.016, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.004, 32]} />
            </mesh>
          </group>
        ))}
        <mesh material={materials.flash} position={[0.15, 0.15, -0.032]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.008, 20]} />
        </mesh>
      </group>

      <mesh geometry={geometries.button} material={materials.frame} position={[PHONE.width / 2 + 0.006, 0.62, 0]} />
      <mesh geometry={geometries.button} material={materials.frame} position={[-PHONE.width / 2 - 0.006, 0.84, 0]} />
      <mesh geometry={geometries.button} material={materials.frame} position={[-PHONE.width / 2 - 0.006, 0.42, 0]} />

      <group ref={portraitAnchorRef} position={[0, 0, FRONT_Z + 0.004]} />
      <group
        ref={landscapeAnchorRef}
        position={[0, 0, FRONT_Z + 0.004]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </group>
  );
}

export const PhoneModel = memo(PhoneModelComponent);
