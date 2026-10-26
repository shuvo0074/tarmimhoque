// Shared 3D geometry + materials for the phone scene.
// Views: web only (inside PhoneScene).
import {
  Color,
  ExtrudeGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
} from "three";

// World-unit size of the phone body; screen content is laid out against these.
export const PHONE = {
  width: 1.62,
  height: 3.3,
  depth: 0.17,
  cornerRadius: 0.26,
  bevel: 0.045,
};

export const SCREEN = {
  width: 1.5,
  height: 3.18,
  cornerRadius: 0.2,
};

function roundedRectShape(width, height, radius) {
  const shape = new Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// Rounded slab with independent corner radius and edge bevel — drei's RoundedBox ties the
// two together, which caps phone-like corners at half the (thin) depth.
export function createRoundedSlab(width, height, depth, cornerRadius, bevel) {
  const b = Math.min(bevel, depth / 2 - 0.001);
  const shape = roundedRectShape(width - 2 * b, height - 2 * b, Math.max(cornerRadius - b, 0.001));
  const geometry = new ExtrudeGeometry(shape, {
    depth: depth - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 5,
    curveSegments: 24,
  });
  geometry.center();
  return geometry;
}

export function createRoundedPlane(width, height, radius) {
  return new ShapeGeometry(roundedRectShape(width, height, radius), 24);
}

export function createMaterials() {
  return {
    frame: new MeshPhysicalMaterial({
      color: new Color("#2a3d52"),
      metalness: 1,
      roughness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
    }),
    back: new MeshPhysicalMaterial({
      color: new Color("#1c2738"),
      metalness: 0.55,
      roughness: 0.42,
      clearcoat: 0.8,
      clearcoatRoughness: 0.3,
    }),
    glass: new MeshPhysicalMaterial({
      color: new Color("#02050b"),
      metalness: 0.1,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
    lensGlass: new MeshPhysicalMaterial({
      color: new Color("#0a1d3a"),
      metalness: 0.4,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    }),
    silver: new MeshStandardMaterial({ color: "#c7d1de", metalness: 1, roughness: 0.22 }),
    gold: new MeshStandardMaterial({ color: "#d9aa4e", metalness: 1, roughness: 0.3 }),
    copper: new MeshStandardMaterial({ color: "#b8621b", metalness: 0.5, roughness: 0.42 }),
    chip: new MeshStandardMaterial({ color: "#1b2029", metalness: 0.4, roughness: 0.35 }),
    ceramic: new MeshStandardMaterial({ color: "#b8946a", metalness: 0.1, roughness: 0.55 }),
    flash: new MeshStandardMaterial({
      color: "#fff3c4",
      emissive: new Color("#ffe9a3"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    }),
  };
}
