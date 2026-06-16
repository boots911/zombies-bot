// Interactive player profile: the overall /stats card, the four map cards, and
// the Rankings / Mob Kills / Boss Kills list cards — all reachable from one row
// of nav buttons. Buttons are "pv:<view>:<page>:<uuid>" so they're stateless
// (survive restarts) and re-render from the cached DB row (no API call).

const {
  AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags,
} = require('discord.js');
const { getLb, LEADERBOARDS, lbJsonKeys, readKills } = require('../leaderboards/config');
const { getByUuid, getPlayerRank } = require('../db/players');
const { renderStatsCard } = require('../image/statsCard');
const { renderMapCard } = require('../image/mapCard');
const { renderListCard } = require('../image/listCard');
const { BOSSES } = require('../kills/bosses');
const MAP_CONFIGS = require('./mapConfigs');

const PAGE_SIZE     = 15;
const RANK_MAX      = 100;   // rankings: only stats ranked #1–100
const RANK_RESULTS  = 45;    // rankings: cap shown
const EXPIRE_MS     = 5 * 60 * 1000;   // buttons stop working ~5 min after last use
const disableTimers = new Map();       // messageId -> setTimeout (in-memory, cosmetic)

// Buttons, laid out in rows of up to 5.
const NAV_ROWS = [
  ['overall', 'deadend', 'badblood', 'alienarcadium', 'prison'],
  ['rankings', 'kills', 'bosskills'],
];
const VIEW_LABELS = {
  overall:       'Overall',
  deadend:       'Dead End',
  badblood:      'Bad Blood',
  alienarcadium: 'Alien Arcadium',
  prison:        'Prison',
  rankings:      'Rankings',
  kills:         'Mob Kills',
  bosskills:     'Boss Kills',
};
const ALL_VIEWS = NAV_ROWS.flat();

// ── Formatting ────────────────────────────────────────────────────────────────

function fmtSecs(s) {
  if (s >= 3600) {
    const h  = Math.floor(s / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }
  const m  = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2,'0')}`;
}
const fmtValue = (v, fmt) => (fmt === 'time' ? fmtSecs(v) : v.toLocaleString('en-US'));

// ── Rankings shown on the stats/map cards (top-10 #rank badges) ───────────────

const OVERALL_RANKED = {
  wins_total:              'wins_total',
  wins_deadend:            'wins_de',
  fastest_deadend_normal:  'r30_de_normal',
  fastest_deadend_hard:    'r30_de_hard',
  fastest_deadend_rip:     'r30_de_rip',
  wins_badblood:           'wins_bb',
  fastest_badblood_normal: 'r30_bb_normal',
  fastest_badblood_hard:   'r30_bb_hard',
  fastest_badblood_rip:    'r30_bb_rip',
  wins_alienarcadium:      'wins_aa',
  fastest_alienarcadium:   'r30_aa',
  wins_prison:             'wins_pr',
  fastest_prison_normal:   'r30_pr_normal',
  fastest_prison_hard:     'r30_pr_hard',
  fastest_prison_rip:      'r30_pr_rip',
};

function computeRankings(stats, rankedStats) {
  const rankings = {};
  for (const [statKey, lbValue] of Object.entries(rankedStats)) {
    const lb  = getLb(lbValue);
    const val = stats[statKey];
    if (!lb || val == null || val === 0) continue;
    const rank = getPlayerRank(lb, val);
    if (rank <= 10) rankings[statKey] = rank;
  }
  return rankings;
}

// ── List-view data ────────────────────────────────────────────────────────────

const MOBS = LEADERBOARDS.filter(lb => lbJsonKeys(lb).length > 0).map(lb => ({
  name: lb.name.replace(/ Kills$/, ''),
  lb,
}));

function computeAllRankings(stats) {
  const rawJson = JSON.parse(stats.raw_json);
  const results = [];
  for (const lb of LEADERBOARDS) {
    let value;
    if (lbJsonKeys(lb).length > 0) {
      const v = readKills(lb, rawJson);
      value = v !== 0 ? v : null;
    } else {
      value = stats[lb.col];
    }
    if (value == null || value === 0) continue;
    const rank = getPlayerRank(lb, value);
    if (rank <= RANK_MAX) results.push({ lb, rank, value });
  }
  return results
    .sort((a, b) => a.rank - b.rank || a.lb.name.localeCompare(b.lb.name))
    .slice(0, RANK_RESULTS);
}

function computeKills(stats) {
  const rawJson = JSON.parse(stats.raw_json);
  const rows = [];
  for (const mob of MOBS) {
    const v = readKills(mob.lb, rawJson);
    if (v > 0) rows.push({ name: mob.name, count: v });
  }
  return rows.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function computeBossKills(stats) {
  const rawJson = JSON.parse(stats.raw_json);
  return BOSSES
    .map(b => ({ name: b.name, count: rawJson[b.jsonKey] ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// ── Render a view → { buffer, totalPages } ────────────────────────────────────

async function renderView(view, stats, page = 0) {
  if (view === 'overall') {
    return { buffer: await renderStatsCard(stats, computeRankings(stats, OVERALL_RANKED)), totalPages: 1 };
  }
  if (MAP_CONFIGS[view]) {
    const cfg = MAP_CONFIGS[view];
    return { buffer: await renderMapCard(stats, computeRankings(stats, cfg.rankedStats), cfg), totalPages: 1 };
  }
  if (view === 'rankings') {
    const all        = computeAllRankings(stats);
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    const rows = all.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
      .map(({ lb, rank, value }) => ({ rank, name: lb.name, value: fmtValue(value, lb.fmt) }));
    const buffer = await renderListCard({
      title: `${stats.username} — Rankings`,
      subtitle: `Top stats ranked #1–${RANK_MAX} across all leaderboards`,
      uuid: stats.uuid, rows,
      footer: `Page ${page + 1}/${totalPages} • ${all.length} ranked stats`,
      accent: '#a855f7', bgName: 'rankings',
      emptyText: `${stats.username} has no stats ranked in the top ${RANK_MAX}.`,
    });
    return { buffer, totalPages };
  }
  if (view === 'kills') {
    const all        = computeKills(stats);
    const total      = all.reduce((s, r) => s + r.count, 0);
    const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    const rows = all.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
      .map((r, i) => ({ rank: page * PAGE_SIZE + i + 1, name: r.name, value: r.count.toLocaleString('en-US') }));
    const buffer = await renderListCard({
      title: `${stats.username} — Mob Kills`, subtitle: 'Ranked highest to lowest',
      uuid: stats.uuid, rows,
      footer: `Page ${page + 1}/${totalPages} • ${total.toLocaleString('en-US')} total kills`,
      accent: '#22c55e', bgName: 'kills',
      emptyText: `${stats.username} has no recorded mob kills.`,
    });
    return { buffer, totalPages };
  }
  if (view === 'bosskills') {
    const sorted = computeBossKills(stats);
    const total  = sorted.reduce((s, r) => s + r.count, 0);
    const rows = sorted.map((r, i) => ({ rank: i + 1, name: r.name, value: r.count.toLocaleString('en-US') }));
    const buffer = await renderListCard({
      title: `${stats.username} — Boss Kills`, subtitle: 'Ranked highest to lowest',
      uuid: stats.uuid, rows,
      footer: `${total.toLocaleString('en-US')} total boss kills`,
      accent: '#ef4444', bgName: 'bosskills',
    });
    return { buffer, totalPages: 1 };
  }
  throw new Error(`Unknown view: ${view}`);
}

// ── Buttons ───────────────────────────────────────────────────────────────────

// customIds embed the runner's id + a base36 timestamp (the "lock"), and put
// the variable-length uuid last. Two namespaces so a page arrow can never
// duplicate a nav button (Discord rejects duplicate custom_ids):
//   nav  button → "pv:<view>:<invokerId>:<ts>:<uuid>"
//   page arrow  → "pp:<view>:<page>:<invokerId>:<ts>:<uuid>"
function buildComponents(view, page, totalPages, uuid, invokerId, ts) {
  const lock = `${invokerId}:${ts}`;
  const rows = NAV_ROWS.map(group => {
    const row = new ActionRowBuilder();
    for (const v of group) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`pv:${v}:${lock}:${uuid}`)
          .setLabel(VIEW_LABELS[v])
          .setStyle(v === view ? ButtonStyle.Primary : ButtonStyle.Secondary)
          .setDisabled(v === view)
      );
    }
    return row;
  });

  if (totalPages > 1) {
    rows.push(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`pp:${view}:${page - 1}:${lock}:${uuid}`).setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(page <= 0),
      new ButtonBuilder().setCustomId(`pp:${view}:${page + 1}:${lock}:${uuid}`).setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1),
    ));
  }
  return rows;
}

async function buildReply(view, stats, page = 0, invokerId) {
  const { buffer, totalPages } = await renderView(view, stats, page);
  const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });
  const ts = Date.now().toString(36);
  return { files: [attachment], components: buildComponents(view, page, totalPages, stats.uuid, invokerId, ts) };
}

// ── Interaction lock / expiry (shared with leaderboard) ───────────────────────

// Returns an ephemeral denial message, or null if the click is allowed.
function accessDenied(interaction, invokerId, tsRaw) {
  if (interaction.user.id !== invokerId) {
    return 'Only the person who ran this command can use these buttons — run it yourself to browse.';
  }
  const ts = parseInt(tsRaw, 36);
  if (!Number.isFinite(ts) || Date.now() - ts > EXPIRE_MS) {
    return 'This menu has expired — run the command again.';
  }
  return null;
}

// Edit the reply, then (re)schedule removal of the buttons after EXPIRE_MS so
// old messages become a static image. Timer resets on each navigation.
async function sendInteractive(interaction, payload) {
  const msg = await interaction.editReply(payload);
  const id  = msg.id;
  const prev = disableTimers.get(id);
  if (prev) clearTimeout(prev);
  const t = setTimeout(() => {
    disableTimers.delete(id);
    interaction.editReply({ components: [] }).catch(() => {});
  }, EXPIRE_MS);
  if (t.unref) t.unref();
  disableTimers.set(id, t);
}

// Used by the slash commands (runner = the person invoking).
async function sendProfile(interaction, view, stats) {
  await sendInteractive(interaction, await buildReply(view, stats, 0, interaction.user.id));
}

// Handle a nav ("pv:…") or page ("pp:…") button click.
async function handleProfile(interaction) {
  const parts = interaction.customId.split(':');
  const kind  = parts[0];                    // 'pv' (nav) | 'pp' (page)
  const view  = parts[1];
  let page, invokerId, tsRaw, uuid;
  if (kind === 'pp') {
    page = parseInt(parts[2], 10);
    invokerId = parts[3];
    tsRaw = parts[4];
    uuid = parts.slice(5).join(':');         // uuid has hyphens, no colons
  } else {
    page = 0;
    invokerId = parts[2];
    tsRaw = parts[3];
    uuid = parts.slice(4).join(':');
  }

  if (!ALL_VIEWS.includes(view) || isNaN(page) || page < 0 || !uuid) {
    return interaction.reply({ content: 'Something went wrong.', flags: MessageFlags.Ephemeral });
  }

  const denied = accessDenied(interaction, invokerId, tsRaw);
  if (denied) return interaction.reply({ content: denied, flags: MessageFlags.Ephemeral });

  const stats = getByUuid(uuid);
  if (!stats) {
    return interaction.reply({
      content: 'That player is no longer cached — run `/stats` for them again.',
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferUpdate();
  await sendInteractive(interaction, await buildReply(view, stats, page, invokerId));
}

module.exports = { sendProfile, handleProfile, sendInteractive, accessDenied, ALL_VIEWS };
