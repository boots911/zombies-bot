// Shared rendering kit for stat cards (statsCard, mapCard).
//
// Design model for the "screenshot background" look:
//   1. background image (cover-fit) — atmosphere
//   2. dark scrim gradient on top    — guarantees text legibility
//   3. frosted-glass panels          — calm surface the numbers sit on
//   4. shadowed text                 — readable over anything
//
// Backgrounds live in assets/bg/<name>.png and fonts in assets/fonts/.
// All of it degrades gracefully: missing image -> tinted gradient,
// missing font -> system sans-serif. So this renders fine before any
// real assets are added.

const path = require('path');
const fs   = require('fs');
const { loadImage, GlobalFonts } = require('@napi-rs/canvas');

const ASSETS_DIR = path.join(__dirname, '../../assets');
const BG_DIR     = path.join(ASSETS_DIR, 'bg');
const FONTS_DIR  = path.join(ASSETS_DIR, 'fonts');

// ── Colors ──────────────────────────────────────────────────────────────────

const C = {
  bg:    '#0d1117',
  text:  '#f0f6fc',
  muted: '#aab2c0',                 // a touch brighter than before for photo bg
  green: '#4ade80',
  gold:  '#fbbf24',
  sep:   'rgba(255,255,255,0.10)',
  glass: 'rgba(12,16,22,0.62)',
  glassBorder: 'rgba(255,255,255,0.09)',
};

// ── Fonts (optional; fall back to sans-serif) ─────────────────────────────────
// Drop a heading font at assets/fonts/heading.ttf and/or a body font at
// assets/fonts/body.ttf to use them. Either may be omitted.

let HEAD_FAMILY = 'sans-serif';
let BODY_FAMILY = 'sans-serif';

(function registerFonts() {
  const tryReg = (file, family) => {
    const p = path.join(FONTS_DIR, file);
    if (fs.existsSync(p)) {
      try { GlobalFonts.registerFromPath(p, family); return family; } catch (_) {}
    }
    return null;
  };
  HEAD_FAMILY = tryReg('heading.ttf', 'CardHeading') || tryReg('heading.otf', 'CardHeading') || 'sans-serif';
  BODY_FAMILY = tryReg('body.ttf',    'CardBody')    || tryReg('body.otf',    'CardBody')    || 'sans-serif';
})();

function fontStr(size, weight, kind) {
  const fam = kind === 'head' ? HEAD_FAMILY : BODY_FAMILY;
  return `${weight || 'normal'} ${size}px '${fam}', sans-serif`;
}

// ── Image cache (heads + backgrounds) ─────────────────────────────────────────

const _imgCache = new Map();
function loadCached(src) {
  if (!_imgCache.has(src)) {
    _imgCache.set(src, loadImage(src).catch(err => { _imgCache.delete(src); throw err; }));
  }
  return _imgCache.get(src);
}

// ── Text with drop shadow ─────────────────────────────────────────────────────

function text(ctx, str, x, y, opts = {}) {
  const {
    size = 13, weight = 'normal', kind = 'body',
    color = C.text, align = 'left', shadow = true, alpha = 1,
  } = opts;

  ctx.textAlign  = align;
  ctx.font       = fontStr(size, weight, kind);
  ctx.globalAlpha = alpha;

  if (shadow) {
    ctx.shadowColor   = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur    = 4;
    ctx.shadowOffsetY = 1;
  }
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);

  ctx.shadowColor   = 'transparent';
  ctx.shadowBlur    = 0;
  ctx.shadowOffsetY = 0;
  ctx.globalAlpha   = 1;
}

// Measure a string at a given font (matches what text() will draw).
function measure(ctx, str, opts = {}) {
  const { size = 13, weight = 'normal', kind = 'body' } = opts;
  ctx.font = fontStr(size, weight, kind);
  return ctx.measureText(str).width;
}

// Truncate a string with an ellipsis so it fits within maxW at the given font.
function ellipsize(ctx, str, maxW, opts = {}) {
  if (measure(ctx, str, opts) <= maxW) return str;
  let s = str;
  while (s.length > 1 && measure(ctx, s + '…', opts) > maxW) s = s.slice(0, -1);
  return s + '…';
}

// Medal-style rank color: gold #1, silver #2, bronze #3, grey for the rest.
const RANK_COLORS = { 1: '#fbbf24', 2: '#cbd5e1', 3: '#cd7f32' };
function rankColor(rank) {
  return RANK_COLORS[rank] || C.muted;
}

// Draw a value plus an optional " (#rank)" badge, where only the badge is
// colored (by rank) and the value keeps its own color. Honors alignment.
function statValue(ctx, x, y, valueText, rank, opts = {}) {
  const { size = 13, weight = 'bold', kind = 'body', color = C.text, align = 'left' } = opts;

  if (rank == null) {
    text(ctx, valueText, x, y, { size, weight, kind, color, align });
    return;
  }

  const rankText = ` (#${rank})`;
  ctx.font = fontStr(size, weight, kind);          // set font so measurements match
  const vW = ctx.measureText(valueText).width;
  const rW = ctx.measureText(rankText).width;

  let vx;
  if (align === 'right')       vx = x - vW - rW;
  else if (align === 'center') vx = x - (vW + rW) / 2;
  else                         vx = x;

  text(ctx, valueText, vx, y,       { size, weight, kind, color, align: 'left' });
  text(ctx, rankText,  vx + vW, y,  { size, weight, kind, color: rankColor(rank), align: 'left' });
}

// ── Background: image (cover-fit) + scrim, or tinted gradient fallback ─────────

// Resolve a background image path: prefer the requested one, then stats.png as
// a shared default, then any PNG present. Returns null if none exist (→ gradient).
function pickBgPath(bgName) {
  const prefer = [];
  if (bgName) prefer.push(`${bgName}.png`);
  prefer.push('stats.png');

  for (const f of prefer) {
    const p = path.join(BG_DIR, f);
    if (fs.existsSync(p)) return p;
  }
  try {
    const any = fs.readdirSync(BG_DIR).find(f => f.toLowerCase().endsWith('.png'));
    if (any) return path.join(BG_DIR, any);
  } catch (_) {}
  return null;
}

async function drawBackground(ctx, W, H, bgName, accent) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  let img = null;
  const bgPath = pickBgPath(bgName);
  if (bgPath) {
    try { img = await loadCached(bgPath); } catch (_) {}
  }

  if (img) {
    const scale = Math.max(W / img.width, H / img.height); // cover
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    // Placeholder: subtle vertical gradient tinted toward the accent.
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix(C.bg, accent || C.green, 0.14));
    g.addColorStop(1, C.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Scrim — darker toward the bottom so footer/labels stay readable.
  const s = ctx.createLinearGradient(0, 0, 0, H);
  s.addColorStop(0.0, 'rgba(7,9,13,0.50)');
  s.addColorStop(0.5, 'rgba(7,9,13,0.62)');
  s.addColorStop(1.0, 'rgba(7,9,13,0.86)');
  ctx.fillStyle = s;
  ctx.fillRect(0, 0, W, H);
}

// ── Frosted-glass panel ───────────────────────────────────────────────────────

function glassPanel(ctx, x, y, w, h, r = 10, accent = null) {
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = C.glass;
  ctx.fill();

  if (accent) {
    ctx.save();
    roundRect(ctx, x, y, w, h, r);
    ctx.clip();
    ctx.fillStyle   = accent;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(x, y, w, 3);           // accent strip along the panel top
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = C.glassBorder;
  ctx.lineWidth   = 1;
  ctx.stroke();
}

// ── Player head: square, no border ────────────────────────────────────────────

async function drawHead(ctx, uuid, x, y, size, ring) {
  try {
    const img = await loadCached(`https://mc-heads.net/avatar/${uuid}/${size}`);
    ctx.drawImage(img, x, y, size, size);
  } catch (_) {
    ctx.fillStyle = ring || C.green;
    ctx.fillRect(x, y, size, size);
  }
}

// ── Separators ────────────────────────────────────────────────────────────────

function hline(ctx, x1, x2, y) {
  ctx.strokeStyle = C.sep;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

// ── Shapes ────────────────────────────────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Formatting ────────────────────────────────────────────────────────────────

function fmtSecs(s) {
  if (s >= 3600) {
    const h  = Math.floor(s / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }
  const m  = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function fmtAge(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

// ── Color helpers ─────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function hexA(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function mix(hexA_, hexB, t) {
  const a = hexToRgb(hexA_), b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}

module.exports = {
  C,
  text,
  measure,
  ellipsize,
  statValue,
  rankColor,
  drawBackground,
  glassPanel,
  drawHead,
  hline,
  roundRect,
  fmtSecs,
  fmtAge,
  hexA,
};
