const { createCanvas } = require('@napi-rs/canvas');
const {
  C, text, statValue, drawBackground, glassPanel, drawHead, hline, fmtSecs, fmtAge,
} = require('./cardKit');

const W   = 820;
const PAD = 20;

// ── Public API ────────────────────────────────────────────────────────────────

async function renderMapCard(stats, rankings, mapCfg) {
  const hasDiffs = mapCfg.hasDiffs;
  const H = hasDiffs ? 470 : 420;

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');

  await drawBackground(ctx, W, H, mapCfg.bg, mapCfg.color);
  await drawHeader(ctx, stats, mapCfg);
  drawOverview(ctx, stats, rankings, mapCfg);

  if (hasDiffs) {
    drawDiffColumns(ctx, stats, rankings, mapCfg);
  } else {
    drawAAStats(ctx, stats, rankings, mapCfg);
  }

  drawFooter(ctx, stats, H);

  return canvas.toBuffer('image/png');
}

// ── Header ────────────────────────────────────────────────────────────────────

async function drawHeader(ctx, stats, mapCfg) {
  await drawHead(ctx, stats.uuid, PAD, 14, 64, mapCfg.color);

  text(ctx, stats.username, PAD + 80, 44, { size: 26, weight: 'bold', kind: 'head' });
  text(ctx, mapCfg.name, PAD + 80, 70, { size: 21, weight: 'bold', kind: 'head', color: mapCfg.color });

  hline(ctx, PAD, W - PAD, 90);
}

// ── Overview (4 per-map totals) ───────────────────────────────────────────────

function drawOverview(ctx, stats, rankings, mapCfg) {
  const { k } = mapCfg;
  const cells = [
    { label: 'WINS',   value: stats[k.wins]   ?? 0, rankKey: k.wins   },
    { label: 'KILLS',  value: stats[k.kills]  ?? 0, rankKey: k.kills  },
    { label: 'DEATHS', value: stats[k.deaths] ?? 0, rankKey: k.deaths },
    { label: 'ROUNDS', value: stats[k.rounds] ?? 0, rankKey: k.rounds },
  ];

  const cellW = (W - 2 * PAD) / cells.length;

  cells.forEach(({ label, value, rankKey }, i) => {
    const cx   = PAD + i * cellW + cellW / 2;
    const rank = rankKey ? rankings[rankKey] : null;

    statValue(ctx, cx, 122, (value ?? 0).toLocaleString('en-US'), rank,
      { size: 24, weight: 'bold', color: C.text, align: 'center' });
    text(ctx, label, cx, 140, { size: 12, color: C.muted, align: 'center' });
  });

  hline(ctx, PAD, W - PAD, 155);
}

// ── Three difficulty columns (DE / BB / Prison) ───────────────────────────────

const DIFF_LABELS = ['Normal', 'Hard', 'RIP'];
const DIFF_KEYS   = ['normal', 'hard', 'rip'];
const DIFF_COLORS = { normal: '#4ade80', hard: '#f97316', rip: '#ef4444' };

const COL_COUNT_3 = 3;
const COL_GAP_3   = 10;
const COL_W_3     = Math.floor((W - 2 * PAD - (COL_COUNT_3 - 1) * COL_GAP_3) / COL_COUNT_3);
const COL_Y_START = 163;

function drawDiffColumns(ctx, stats, rankings, mapCfg) {
  DIFF_KEYS.forEach((diff, i) => {
    const x = PAD + i * (COL_W_3 + COL_GAP_3);
    drawDiffCol(ctx, x, COL_Y_START, diff, DIFF_LABELS[i], stats, rankings, mapCfg);
  });
}

function drawDiffCol(ctx, x, y, diff, diffLabel, stats, rankings, mapCfg) {
  const { k } = mapCfg;

  glassPanel(ctx, x, y, COL_W_3, 280, 8, DIFF_COLORS[diff]);

  text(ctx, diffLabel, x + COL_W_3 / 2, y + 22,
    { size: 14, weight: 'bold', kind: 'head', color: DIFF_COLORS[diff], align: 'center' });
  hline(ctx, x + 12, x + COL_W_3 - 12, y + 31);

  // Times: R10, R20, fastest Win (R30)
  const times = [
    { label: 'R10', val: stats[k[`r10_${diff}`]], rk: rankings[k[`r10_${diff}`]] ?? null },
    { label: 'R20', val: stats[k[`r20_${diff}`]], rk: rankings[k[`r20_${diff}`]] ?? null },
    { label: 'Win', val: stats[k[`r30_${diff}`]], rk: rankings[k[`r30_${diff}`]] ?? null },
  ];

  times.forEach(({ label, val, rk }, ti) => {
    const ry = y + 54 + ti * 26;
    text(ctx, label, x + 12, ry, { size: 13, color: C.muted });

    const timeStr = val != null ? fmtSecs(val) : '—';
    statValue(ctx, x + COL_W_3 - 12, ry, timeStr, val != null ? rk : null,
      { size: 16, weight: 'bold', color: val != null ? C.text : C.muted, align: 'right' });
  });

  hline(ctx, x + 12, x + COL_W_3 - 12, y + 122);

  // Secondary stats: kills/deaths first (if tracked per difficulty), then the rest
  const secondaryStats = [
    { label: 'Kills',   key: `kills_${diff}`   },
    { label: 'Deaths',  key: `deaths_${diff}`  },
    { label: 'Doors',   key: `doors_${diff}`   },
    { label: 'Windows', key: `windows_${diff}` },
    { label: 'Knocks',  key: `knocks_${diff}`  },
    { label: 'Revives', key: `revives_${diff}` },
  ];

  secondaryStats.forEach(({ label, key }, si) => {
    const statKey = k[key];
    const val     = stats[statKey];
    const rk      = rankings[statKey] ?? null;
    const ry = y + 144 + si * 22;
    text(ctx, label, x + 12, ry, { size: 12, color: C.muted });
    statValue(ctx, x + COL_W_3 - 12, ry, (val ?? 0).toLocaleString('en-US'), rk,
      { size: 12, weight: 'bold', color: C.text, align: 'right' });
  });
}

// ── Alien Arcadium single panel ───────────────────────────────────────────────

function drawAAStats(ctx, stats, rankings, mapCfg) {
  const { k } = mapCfg;
  const panelW = W - 2 * PAD;

  glassPanel(ctx, PAD, COL_Y_START, panelW, 220, 8, mapCfg.color);

  const half = panelW / 2;

  // World Ender (AA boss) kills live in the raw stats blob, not a DB column.
  const rawJson = stats.raw_json ? JSON.parse(stats.raw_json) : {};

  const times = [
    { label: 'R10', val: stats[k.r10], rk: rankings[k.r10] ?? null },
    { label: 'R20', val: stats[k.r20], rk: rankings[k.r20] ?? null },
    { label: 'Win', val: stats[k.r30], rk: rankings[k.r30] ?? null },
  ];

  const secondary = [
    { label: 'Doors',       val: stats[k.doors],   rk: rankings[k.doors]   ?? null },
    { label: 'Windows',     val: stats[k.windows], rk: rankings[k.windows] ?? null },
    { label: 'Knocks',      val: stats[k.knocks],  rk: rankings[k.knocks]  ?? null },
    { label: 'Revives',     val: stats[k.revives], rk: rankings[k.revives] ?? null },
    { label: 'World Ender', val: rawJson.world_ender_zombie_kills_zombies ?? 0, rk: null },
  ];

  text(ctx, 'Speed Records', PAD + half / 2, COL_Y_START + 22,
    { size: 13, weight: 'bold', kind: 'head', color: mapCfg.color, align: 'center' });
  hline(ctx, PAD + 12, PAD + half - 12, COL_Y_START + 30);

  times.forEach(({ label, val, rk }, i) => {
    const ry = COL_Y_START + 55 + i * 45;
    text(ctx, label, PAD + half / 2, ry, { size: 12, color: C.muted, align: 'center' });

    const timeStr = val != null ? fmtSecs(val) : '—';
    statValue(ctx, PAD + half / 2, ry + 18, timeStr, val != null ? rk : null,
      { size: 16, weight: 'bold', color: val != null ? C.text : C.muted, align: 'center' });
  });

  // Vertical divider
  ctx.strokeStyle = C.sep;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + half, COL_Y_START + 10);
  ctx.lineTo(PAD + half, COL_Y_START + 210);
  ctx.stroke();

  text(ctx, 'Stats', PAD + half + half / 2, COL_Y_START + 22,
    { size: 13, weight: 'bold', kind: 'head', color: mapCfg.color, align: 'center' });
  hline(ctx, PAD + half + 12, PAD + panelW - 12, COL_Y_START + 30);

  secondary.forEach(({ label, val, rk }, i) => {
    const ry = COL_Y_START + 60 + i * 36;
    text(ctx, label, PAD + half + 20, ry, { size: 13, color: C.muted });
    statValue(ctx, W - PAD - 20, ry, (val ?? 0).toLocaleString('en-US'), rk,
      { size: 13, weight: 'bold', color: C.text, align: 'right' });
  });
}

// ── Footer ────────────────────────────────────────────────────────────────────

function drawFooter(ctx, stats, H) {
  text(ctx, `Last updated: ${fmtAge(Date.now() - stats.last_updated)}`, PAD, H - 8,
    { size: 12, color: C.muted });
}

module.exports = { renderMapCard };
