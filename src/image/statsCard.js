const { createCanvas } = require('@napi-rs/canvas');
const {
  C, text, statValue, rankColor, drawBackground, glassPanel, drawHead, hline, fmtSecs, fmtAge,
} = require('./cardKit');

const W         = 820;
const H         = 340;
const PAD       = 20;
const COL_GAP   = 10;
const COL_COUNT = 4;
const COL_W     = Math.floor((W - 2 * PAD - (COL_COUNT - 1) * COL_GAP) / COL_COUNT); // 187
const COL_H     = 150;

const ACCENT = C.green;          // overall card accent
const BG_NAME = 'stats';         // assets/bg/stats.png

// ── Public API ────────────────────────────────────────────────────────────────

async function renderStatsCard(stats, rankings = {}) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');

  await drawBackground(ctx, W, H, BG_NAME, ACCENT);
  await drawHeader(ctx, stats);
  drawOverview(ctx, stats, rankings);
  drawMaps(ctx, stats, rankings);
  drawFooter(ctx, stats);

  return canvas.toBuffer('image/png');
}

// ── Header ────────────────────────────────────────────────────────────────────

async function drawHeader(ctx, stats) {
  await drawHead(ctx, stats.uuid, PAD, 14, 64, ACCENT);

  text(ctx, stats.username, PAD + 80, 46, { size: 28, weight: 'bold', kind: 'head' });
  text(ctx, 'HYPIXEL ZOMBIES', PAD + 80, 66, { size: 12, color: C.muted });

  hline(ctx, PAD, W - PAD, 90);
}

// ── Overview (overall totals) ─────────────────────────────────────────────────

function drawOverview(ctx, stats, rankings) {
  // Best round only matters before a player's first win (winners tie at the
  // final round), so it stands in for the win count when wins == 0.
  const winsCell = (stats.wins_total ?? 0) === 0 && (stats.best_round_total ?? 0) > 0
    ? { label: 'BEST ROUND', value: stats.best_round_total, rankKey: null }
    : { label: 'WINS', value: stats.wins_total, rankKey: 'wins_total' };

  const cells = [
    winsCell,
    { label: 'KILLS',   value: stats.kills_total,   rankKey: null },
    { label: 'DEATHS',  value: stats.deaths_total,  rankKey: null },
    { label: 'ROUNDS',  value: stats.rounds_total,  rankKey: null },
    { label: 'KNOCKS',  value: stats.knocks_total,  rankKey: null },
    { label: 'WINDOWS', value: stats.windows_total, rankKey: null },
  ];

  const cellW = (W - 2 * PAD) / cells.length;

  cells.forEach(({ label, value, rankKey }, i) => {
    const cx   = PAD + i * cellW + cellW / 2;
    const rank = rankKey ? rankings[rankKey] : null;

    statValue(ctx, cx, 122, (value ?? 0).toLocaleString('en-US'), rank,
      { size: 20, weight: 'bold', color: C.text, align: 'center' });
    text(ctx, label, cx, 140, { size: 11, color: C.muted, align: 'center' });
  });

  hline(ctx, PAD, W - PAD, 152);
}

// ── Map columns ───────────────────────────────────────────────────────────────

function drawMaps(ctx, stats, rankings) {
  buildMapData(stats, rankings).forEach((map, i) => {
    const x = PAD + i * (COL_W + COL_GAP);
    drawMapCol(ctx, x, 160, map);
  });
}

function buildMapData(stats, rankings) {
  const deMin = minFastestWithKey(stats, 'deadend');
  const bbMin = minFastestWithKey(stats, 'badblood');
  const prMin = minFastestWithKey(stats, 'prison');

  return [
    {
      name:        'Dead End',
      color:       '#a855f7',
      wins:        stats.wins_deadend ?? 0,
      winsRank:    rankings.wins_deadend ?? null,
      bestRound:   stats.best_round_deadend ?? 0,
      fastest:     deMin.time,
      fastestRank: deMin.key ? (rankings[deMin.key] ?? null) : null,
    },
    {
      name:        'Bad Blood',
      color:       '#ef4444',
      wins:        stats.wins_badblood ?? 0,
      winsRank:    rankings.wins_badblood ?? null,
      bestRound:   stats.best_round_badblood ?? 0,
      fastest:     bbMin.time,
      fastestRank: bbMin.key ? (rankings[bbMin.key] ?? null) : null,
    },
    {
      name:        'Alien Arcadium',
      color:       '#22c55e',
      wins:        stats.wins_alienarcadium ?? 0,
      winsRank:    rankings.wins_alienarcadium ?? null,
      bestRound:   stats.best_round_alienarcadium ?? 0,
      fastest:     stats.fastest_alienarcadium ?? null,
      fastestRank: rankings.fastest_alienarcadium ?? null,
    },
    {
      name:        'Prison',
      color:       '#94a3b8',
      wins:        stats.wins_prison ?? 0,
      winsRank:    rankings.wins_prison ?? null,
      bestRound:   stats.best_round_prison ?? 0,
      fastest:     prMin.time,
      fastestRank: prMin.key ? (rankings[prMin.key] ?? null) : null,
    },
  ];
}

function drawMapCol(ctx, x, y, map) {
  glassPanel(ctx, x, y, COL_W, COL_H, 8, map.color);

  const cx = x + COL_W / 2;

  text(ctx, map.name, cx, y + 21, { size: 13, weight: 'bold', kind: 'head', color: map.color, align: 'center' });

  // Big number: total wins, or best round reached if the player has no wins yet.
  const showBestRound = map.wins === 0 && (map.bestRound ?? 0) > 0;

  text(ctx, String(showBestRound ? map.bestRound : map.wins), cx, y + 70,
    { size: 36, weight: 'bold', kind: 'head', align: 'center' });
  text(ctx, showBestRound ? 'BEST ROUND' : 'TOTAL WINS', cx, y + 86,
    { size: 11, color: C.muted, align: 'center' });

  if (!showBestRound && map.winsRank != null) {
    text(ctx, `#${map.winsRank}`, cx, y + 99, { size: 11, weight: 'bold', color: rankColor(map.winsRank), align: 'center' });
  }

  text(ctx, 'FASTEST WIN', cx, y + 118, { size: 11, color: C.muted, align: 'center' });
  const timeStr = map.fastest != null ? fmtSecs(map.fastest) : '—';
  statValue(ctx, cx, y + 134, timeStr, map.fastest != null ? map.fastestRank : null,
    { size: 15, weight: 'bold', color: map.fastest != null ? C.text : C.muted, align: 'center' });
}

// ── Footer ────────────────────────────────────────────────────────────────────

function drawFooter(ctx, stats) {
  text(ctx, `Last updated: ${fmtAge(Date.now() - stats.last_updated)}`, PAD, H - 10,
    { size: 12, color: C.muted });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function minFastestWithKey(stats, mapKey) {
  const keys = [
    `fastest_${mapKey}_normal`,
    `fastest_${mapKey}_hard`,
    `fastest_${mapKey}_rip`,
  ];
  let best = null;
  for (const key of keys) {
    const val = stats[key];
    if (val != null && (best === null || val < best.time)) {
      best = { time: val, key };
    }
  }
  return best ?? { time: null, key: null };
}

module.exports = { renderStatsCard };
