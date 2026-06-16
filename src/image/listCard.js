const { createCanvas } = require('@napi-rs/canvas');
const {
  C, text, ellipsize, rankColor, drawBackground, glassPanel, drawHead, hline,
} = require('./cardKit');

// A generic ranked-list card (leaderboards, rankings, kills, boss kills).
//
// opts:
//   title        — header title
//   subtitle     — small grey line under the title (optional)
//   uuid         — if set, draws the player's head in the header (optional)
//   rows         — [{ rank, name, value }]  (rank: number|null, value: string)
//   footer       — small grey footer line
//   accent       — accent color (gradient-placeholder tint / head fallback)
//   bgName       — assets/bg/<bgName>.png (optional; falls back to gradient)
//   emptyText    — shown when rows is empty

const W           = 620;
const PAD         = 20;
const ROW_H       = 30;
const HEADER_H    = 74;
const FOOTER_H    = 30;
const VALUE_RSVD  = 130;   // px reserved on the right for the value column

async function renderListCard(opts) {
  const {
    title, subtitle = null, uuid = null, rows = [],
    footer = '', accent = C.green, bgName = null, emptyText = 'No data yet.',
  } = opts;

  const n      = rows.length;
  const panelH = (n > 0 ? n * ROW_H : ROW_H) + 16;
  const panelY = HEADER_H;
  const H      = HEADER_H + panelH + FOOTER_H;

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');

  await drawBackground(ctx, W, H, bgName, accent);

  // ── Header ──
  let titleX = PAD;
  if (uuid) {
    await drawHead(ctx, uuid, PAD, 15, 44, accent);
    titleX = PAD + 56;
  }
  text(ctx, title, titleX, subtitle ? 38 : 46, { size: 22, weight: 'bold', kind: 'head' });
  if (subtitle) text(ctx, subtitle, titleX, 58, { size: 12, color: C.muted });

  // ── List panel ──
  glassPanel(ctx, PAD, panelY, W - 2 * PAD, panelH, 8, accent);

  if (n === 0) {
    text(ctx, emptyText, W / 2, panelY + panelH / 2 + 4, { size: 14, color: C.muted, align: 'center' });
  } else {
    const rankX    = PAD + 16;
    const nameX    = PAD + 64;
    const valueX   = W - PAD - 16;
    const nameMaxW = (W - PAD - VALUE_RSVD) - nameX;

    rows.forEach((r, i) => {
      const top      = panelY + 8 + i * ROW_H;
      const baseline = top + 20;

      if (i > 0) hline(ctx, PAD + 12, W - PAD - 12, top);   // faint row separator

      if (r.rank != null) {
        text(ctx, `#${r.rank}`, rankX, baseline,
          { size: 14, weight: 'bold', color: rankColor(r.rank) });
      }

      const name = ellipsize(ctx, String(r.name), nameMaxW, { size: 14, weight: 'bold' });
      text(ctx, name, nameX, baseline, { size: 14, weight: 'bold', color: C.text });

      text(ctx, r.value, valueX, baseline, { size: 14, weight: 'bold', color: C.text, align: 'right' });
    });
  }

  // ── Footer ──
  text(ctx, footer, PAD, H - 11, { size: 12, color: C.muted });

  return canvas.toBuffer('image/png');
}

module.exports = { renderListCard, ROW_H };
