// Procedural canvas textures for the phone internals (PCB, chip markings, battery label, flex).
// Drawn once at startup, so no image assets are downloaded.
// Views: web only (inside PhoneScene).
import { CanvasTexture, SRGBColorSpace } from "three";

// Deterministic PRNG so the board layout is identical on every load.
function createRandom(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext("2d")];
}

function toTexture(canvas, isColor = true) {
  const texture = new CanvasTexture(canvas);
  if (isColor) texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Manhattan-routed trace: a few straight runs with 45° jogs, like real PCB routing.
function drawTrace(ctx, random, width, height) {
  let x = random() * width;
  let y = random() * height;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const segments = 2 + Math.floor(random() * 4);
  for (let i = 0; i < segments; i += 1) {
    const length = 40 + random() * 220;
    const direction = Math.floor(random() * 4);
    const jog = 10 + random() * 30;
    if (direction === 0) x += length;
    if (direction === 1) x -= length;
    if (direction === 2) y += length;
    if (direction === 3) y -= length;
    ctx.lineTo(x, y);
    x += random() > 0.5 ? jog : -jog;
    y += random() > 0.5 ? jog : -jog;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  return [x, y];
}

function drawVia(ctx, x, y, radius) {
  ctx.fillStyle = "#c9a24a";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0a1f17";
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

// Main logic board: solder mask, gold traces + vias, pads, silkscreen designators.
// Returns a color map and a matching emissive map so the traces glow faintly.
export function createPcbTextures(seed = 7) {
  const width = 1024;
  const height = 832;
  const random = createRandom(seed);
  const [canvas, ctx] = createCanvas(width, height);
  const [glowCanvas, glow] = createCanvas(width, height);

  const mask = ctx.createLinearGradient(0, 0, width, height);
  mask.addColorStop(0, "#0f4a35");
  mask.addColorStop(1, "#0a3426");
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, width, height);
  glow.fillStyle = "#000";
  glow.fillRect(0, 0, width, height);

  // Copper pour texture under the mask.
  for (let i = 0; i < 2600; i += 1) {
    ctx.fillStyle = `rgba(20, 90, 60, ${random() * 0.25})`;
    ctx.fillRect(random() * width, random() * height, 2, 2);
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  glow.lineCap = "round";
  glow.lineJoin = "round";
  for (let i = 0; i < 90; i += 1) {
    const traceWidth = random() > 0.85 ? 6 : 2 + random() * 2;
    ctx.strokeStyle = `rgba(201, 162, 74, ${0.55 + random() * 0.35})`;
    ctx.lineWidth = traceWidth;
    const viaRadius = 5 + random() * 3;
    const [endX, endY] = drawTrace(ctx, random, width, height);
    drawVia(ctx, endX, endY, viaRadius);

    if (i % 3 === 0) {
      glow.strokeStyle = "rgba(94, 234, 212, 0.9)";
      glow.lineWidth = traceWidth;
      drawTrace(glow, createRandom(seed + i), width, height);
    }
  }

  for (let i = 0; i < 160; i += 1) {
    drawVia(ctx, random() * width, random() * height, 3 + random() * 3);
  }

  // Component footprints with silkscreen outlines and designators.
  ctx.font = "bold 18px monospace";
  const prefixes = ["C", "R", "U", "L", "J", "Q", "FB", "TP"];
  for (let i = 0; i < 46; i += 1) {
    const x = 30 + random() * (width - 120);
    const y = 30 + random() * (height - 80);
    const w = 16 + random() * 46;
    const h = 10 + random() * 26;
    ctx.fillStyle = "#d8b25a";
    ctx.fillRect(x, y, w * 0.28, h);
    ctx.fillRect(x + w * 0.72, y, w * 0.28, h);
    ctx.strokeStyle = "rgba(235, 240, 230, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
    ctx.fillStyle = "rgba(235, 240, 230, 0.75)";
    const prefix = prefixes[Math.floor(random() * prefixes.length)];
    ctx.fillText(`${prefix}${Math.floor(random() * 900) + 100}`, x, y - 8);
  }

  // Gold edge fingers and mounting holes.
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = "#d9aa4e";
    ctx.fillRect(width - 30, 220 + i * 22, 22, 12);
  }
  [
    [40, 40],
    [width - 40, 40],
    [40, height - 40],
    [width - 40, height - 40],
  ].forEach(([x, y]) => {
    ctx.fillStyle = "#d9aa4e";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#05080f";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = "bold 26px monospace";
  ctx.fillStyle = "rgba(235, 240, 230, 0.8)";
  ctx.fillText("LOGIC BOARD  REV 3.1", 70, height - 30);

  return { map: toTexture(canvas), emissiveMap: toTexture(glowCanvas) };
}

// Laser-etched top marking for a chip package.
export function createChipTexture(lines, { size = 256, pinOne = true, lid = false } = {}) {
  const [canvas, ctx] = createCanvas(size, size);
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  if (lid) {
    gradient.addColorStop(0, "#d6dde6");
    gradient.addColorStop(0.5, "#aab4c1");
    gradient.addColorStop(1, "#c9d1db");
  } else {
    gradient.addColorStop(0, "#22262e");
    gradient.addColorStop(1, "#14171d");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = lid ? "rgba(40, 48, 60, 0.85)" : "rgba(190, 200, 215, 0.75)";
  ctx.textAlign = "center";
  lines.forEach((line, index) => {
    ctx.font = `${index === 0 ? "bold " : ""}${Math.round(size * (index === 0 ? 0.13 : 0.085))}px monospace`;
    ctx.fillText(line, size / 2, size * (0.42 + index * 0.15));
  });

  if (pinOne) {
    ctx.beginPath();
    ctx.arc(size * 0.14, size * 0.14, size * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = lid ? "rgba(40, 48, 60, 0.6)" : "rgba(190, 200, 215, 0.5)";
    ctx.fill();
  }
  return toTexture(canvas);
}

// Battery pouch label: specs, warnings, barcode.
export function createBatteryTexture() {
  const width = 512;
  const height = 712;
  const random = createRandom(21);
  const [canvas, ctx] = createCanvas(width, height);

  ctx.fillStyle = "#15181d";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(94, 234, 212, 0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = "#e9eef5";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("Li-ion Polymer", 52, 110);
  ctx.font = "26px sans-serif";
  ctx.fillStyle = "#b9c4d2";
  ["3.87V ⎓ 4,422 mAh", "17.11 Wh", "Rechargeable Battery", "Made for mobile"].forEach(
    (line, index) => ctx.fillText(line, 52, 170 + index * 42)
  );

  // Warning icons.
  for (let i = 0; i < 4; i += 1) {
    const x = 52 + i * 104;
    ctx.strokeStyle = "#e9eef5";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 380, 80, 80);
    ctx.beginPath();
    ctx.moveTo(x + 15, x % 2 ? 445 : 395);
    ctx.lineTo(x + 65, x % 2 ? 395 : 445);
    ctx.stroke();
  }

  // Barcode.
  let x = 52;
  while (x < width - 60) {
    const barWidth = 2 + Math.floor(random() * 5);
    ctx.fillStyle = "#e9eef5";
    ctx.fillRect(x, 520, barWidth, 90);
    x += barWidth + 2 + Math.floor(random() * 4);
  }
  ctx.font = "20px monospace";
  ctx.fillStyle = "#b9c4d2";
  ctx.fillText("SN 4F2K 9QX7 31B0", 52, 650);

  return toTexture(canvas);
}

// Polyimide ribbon with parallel copper conductors.
export function createFlexTexture() {
  const [canvas, ctx] = createCanvas(64, 512);
  ctx.fillStyle = "#b8621b";
  ctx.fillRect(0, 0, 64, 512);
  for (let i = 0; i < 7; i += 1) {
    ctx.fillStyle = "rgba(240, 190, 90, 0.85)";
    ctx.fillRect(8 + i * 7.5, 0, 3, 512);
  }
  ctx.fillStyle = "rgba(60, 25, 5, 0.35)";
  ctx.fillRect(0, 0, 5, 512);
  ctx.fillRect(59, 0, 5, 512);
  return toTexture(canvas);
}
