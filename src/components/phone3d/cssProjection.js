// CSS 3D projection: pins DOM elements onto 3D anchors so real HTML sits on the phone glass.
// Same matrix math as drei's <Html transform>, but the DOM stays in the main React tree
// (drei renders into a separate root, which React 19 StrictMode unmounts mid-render).
// Views: web only (inside PhoneScene).

const CAMERA_MULTIPLIERS = [1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1];

function toCssMatrix(elements, multipliers) {
  let css = "matrix3d(";
  for (let i = 0; i < 16; i += 1) {
    const value = multipliers[i] * elements[i];
    css += (Math.abs(value) < 1e-10 ? 0 : value) + (i === 15 ? ")" : ",");
  }
  return css;
}

const objectMultipliersCache = new Map();

function objectMultipliers(pxPerUnit) {
  let multipliers = objectMultipliersCache.get(pxPerUnit);
  if (!multipliers) {
    const s = 1 / pxPerUnit;
    multipliers = [s, s, s, 1, -s, -s, -s, -1, s, s, s, 1, 1, 1, 1, 1];
    objectMultipliersCache.set(pxPerUnit, multipliers);
  }
  return multipliers;
}

// view: perspective container; camera: preserve-3d stage inside it.
export function projectCamera(view, cameraEl, camera, size) {
  const focal = camera.projectionMatrix.elements[5] * (size.height / 2);
  view.style.width = `${size.width}px`;
  view.style.height = `${size.height}px`;
  view.style.perspective = `${focal}px`;
  cameraEl.style.width = `${size.width}px`;
  cameraEl.style.height = `${size.height}px`;
  cameraEl.style.transform = `translateZ(${focal}px)${toCssMatrix(
    camera.matrixWorldInverse.elements,
    CAMERA_MULTIPLIERS
  )}translate(${size.width / 2}px,${size.height / 2}px)`;
}

// pxPerUnit: how many CSS px of the element span one world unit on the anchor.
export function projectAnchor(element, anchor, pxPerUnit) {
  element.style.transform = `translate(-50%,-50%)${toCssMatrix(
    anchor.matrixWorld.elements,
    objectMultipliers(pxPerUnit)
  )}`;
}
