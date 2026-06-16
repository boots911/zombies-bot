const db = require('./schema');

const upsertStmt = db.prepare(`
  INSERT INTO players (
    uuid, username,
    wins_total, kills_total, deaths_total,
    rounds_total, doors_total, windows_total, knocks_total, revives_total,
    headshots_total, bullets_hit_total, bullets_shot_total,
    wins_deadend, wins_badblood, wins_alienarcadium, wins_prison,
    wins_deadend_normal, wins_deadend_hard, wins_deadend_rip,
    fastest_deadend_normal, fastest_deadend_hard, fastest_deadend_rip,
    r10_deadend_normal, r20_deadend_normal,
    r10_deadend_hard,   r20_deadend_hard,
    r10_deadend_rip,    r20_deadend_rip,
    kills_deadend_total, kills_deadend_normal, kills_deadend_hard, kills_deadend_rip,
    deaths_deadend_total, deaths_deadend_normal, deaths_deadend_hard, deaths_deadend_rip,
    rounds_deadend_total, rounds_deadend_normal, rounds_deadend_hard, rounds_deadend_rip,
    doors_deadend_total, doors_deadend_normal, doors_deadend_hard, doors_deadend_rip,
    windows_deadend_total, windows_deadend_normal, windows_deadend_hard, windows_deadend_rip,
    knocks_deadend_total, knocks_deadend_normal, knocks_deadend_hard, knocks_deadend_rip,
    revives_deadend_total, revives_deadend_normal, revives_deadend_hard, revives_deadend_rip,
    wins_badblood_normal, wins_badblood_hard, wins_badblood_rip,
    fastest_badblood_normal, fastest_badblood_hard, fastest_badblood_rip,
    r10_badblood_normal, r20_badblood_normal,
    r10_badblood_hard,   r20_badblood_hard,
    r10_badblood_rip,    r20_badblood_rip,
    kills_badblood_total, kills_badblood_normal, kills_badblood_hard, kills_badblood_rip,
    deaths_badblood_total, deaths_badblood_normal, deaths_badblood_hard, deaths_badblood_rip,
    rounds_badblood_total, rounds_badblood_normal, rounds_badblood_hard, rounds_badblood_rip,
    doors_badblood_total, doors_badblood_normal, doors_badblood_hard, doors_badblood_rip,
    windows_badblood_total, windows_badblood_normal, windows_badblood_hard, windows_badblood_rip,
    knocks_badblood_total, knocks_badblood_normal, knocks_badblood_hard, knocks_badblood_rip,
    revives_badblood_total, revives_badblood_normal, revives_badblood_hard, revives_badblood_rip,
    fastest_alienarcadium, r10_alienarcadium, r20_alienarcadium,
    total_rounds_alienarcadium, kills_alienarcadium,
    deaths_alienarcadium, doors_alienarcadium, windows_alienarcadium,
    knocks_alienarcadium, revives_alienarcadium,
    wins_prison_normal, wins_prison_hard, wins_prison_rip,
    fastest_prison_normal, fastest_prison_hard, fastest_prison_rip,
    r10_prison_normal, r20_prison_normal,
    r10_prison_hard,   r20_prison_hard,
    r10_prison_rip,    r20_prison_rip,
    kills_prison_total, kills_prison_normal, kills_prison_hard, kills_prison_rip,
    deaths_prison_total, deaths_prison_normal, deaths_prison_hard, deaths_prison_rip,
    rounds_prison_total, rounds_prison_normal, rounds_prison_hard, rounds_prison_rip,
    doors_prison_total, doors_prison_normal, doors_prison_hard, doors_prison_rip,
    windows_prison_total, windows_prison_normal, windows_prison_hard, windows_prison_rip,
    knocks_prison_total, knocks_prison_normal, knocks_prison_hard, knocks_prison_rip,
    revives_prison_total, revives_prison_normal, revives_prison_hard, revives_prison_rip,
    best_round_total,
    best_round_deadend, best_round_deadend_normal, best_round_deadend_hard, best_round_deadend_rip,
    best_round_badblood, best_round_badblood_normal, best_round_badblood_hard, best_round_badblood_rip,
    best_round_alienarcadium,
    best_round_prison, best_round_prison_normal, best_round_prison_hard, best_round_prison_rip,
    raw_json, last_updated
  ) VALUES (
    @uuid, @username,
    @wins_total, @kills_total, @deaths_total,
    @rounds_total, @doors_total, @windows_total, @knocks_total, @revives_total,
    @headshots_total, @bullets_hit_total, @bullets_shot_total,
    @wins_deadend, @wins_badblood, @wins_alienarcadium, @wins_prison,
    @wins_deadend_normal, @wins_deadend_hard, @wins_deadend_rip,
    @fastest_deadend_normal, @fastest_deadend_hard, @fastest_deadend_rip,
    @r10_deadend_normal, @r20_deadend_normal,
    @r10_deadend_hard,   @r20_deadend_hard,
    @r10_deadend_rip,    @r20_deadend_rip,
    @kills_deadend_total, @kills_deadend_normal, @kills_deadend_hard, @kills_deadend_rip,
    @deaths_deadend_total, @deaths_deadend_normal, @deaths_deadend_hard, @deaths_deadend_rip,
    @rounds_deadend_total, @rounds_deadend_normal, @rounds_deadend_hard, @rounds_deadend_rip,
    @doors_deadend_total, @doors_deadend_normal, @doors_deadend_hard, @doors_deadend_rip,
    @windows_deadend_total, @windows_deadend_normal, @windows_deadend_hard, @windows_deadend_rip,
    @knocks_deadend_total, @knocks_deadend_normal, @knocks_deadend_hard, @knocks_deadend_rip,
    @revives_deadend_total, @revives_deadend_normal, @revives_deadend_hard, @revives_deadend_rip,
    @wins_badblood_normal, @wins_badblood_hard, @wins_badblood_rip,
    @fastest_badblood_normal, @fastest_badblood_hard, @fastest_badblood_rip,
    @r10_badblood_normal, @r20_badblood_normal,
    @r10_badblood_hard,   @r20_badblood_hard,
    @r10_badblood_rip,    @r20_badblood_rip,
    @kills_badblood_total, @kills_badblood_normal, @kills_badblood_hard, @kills_badblood_rip,
    @deaths_badblood_total, @deaths_badblood_normal, @deaths_badblood_hard, @deaths_badblood_rip,
    @rounds_badblood_total, @rounds_badblood_normal, @rounds_badblood_hard, @rounds_badblood_rip,
    @doors_badblood_total, @doors_badblood_normal, @doors_badblood_hard, @doors_badblood_rip,
    @windows_badblood_total, @windows_badblood_normal, @windows_badblood_hard, @windows_badblood_rip,
    @knocks_badblood_total, @knocks_badblood_normal, @knocks_badblood_hard, @knocks_badblood_rip,
    @revives_badblood_total, @revives_badblood_normal, @revives_badblood_hard, @revives_badblood_rip,
    @fastest_alienarcadium, @r10_alienarcadium, @r20_alienarcadium,
    @total_rounds_alienarcadium, @kills_alienarcadium,
    @deaths_alienarcadium, @doors_alienarcadium, @windows_alienarcadium,
    @knocks_alienarcadium, @revives_alienarcadium,
    @wins_prison_normal, @wins_prison_hard, @wins_prison_rip,
    @fastest_prison_normal, @fastest_prison_hard, @fastest_prison_rip,
    @r10_prison_normal, @r20_prison_normal,
    @r10_prison_hard,   @r20_prison_hard,
    @r10_prison_rip,    @r20_prison_rip,
    @kills_prison_total, @kills_prison_normal, @kills_prison_hard, @kills_prison_rip,
    @deaths_prison_total, @deaths_prison_normal, @deaths_prison_hard, @deaths_prison_rip,
    @rounds_prison_total, @rounds_prison_normal, @rounds_prison_hard, @rounds_prison_rip,
    @doors_prison_total, @doors_prison_normal, @doors_prison_hard, @doors_prison_rip,
    @windows_prison_total, @windows_prison_normal, @windows_prison_hard, @windows_prison_rip,
    @knocks_prison_total, @knocks_prison_normal, @knocks_prison_hard, @knocks_prison_rip,
    @revives_prison_total, @revives_prison_normal, @revives_prison_hard, @revives_prison_rip,
    @best_round_total,
    @best_round_deadend, @best_round_deadend_normal, @best_round_deadend_hard, @best_round_deadend_rip,
    @best_round_badblood, @best_round_badblood_normal, @best_round_badblood_hard, @best_round_badblood_rip,
    @best_round_alienarcadium,
    @best_round_prison, @best_round_prison_normal, @best_round_prison_hard, @best_round_prison_rip,
    @raw_json, @last_updated
  )
  ON CONFLICT(uuid) DO UPDATE SET
    username                = excluded.username,
    wins_total              = excluded.wins_total,
    kills_total             = excluded.kills_total,
    deaths_total            = excluded.deaths_total,
    rounds_total            = excluded.rounds_total,
    doors_total             = excluded.doors_total,
    windows_total           = excluded.windows_total,
    knocks_total            = excluded.knocks_total,
    revives_total           = excluded.revives_total,
    headshots_total         = excluded.headshots_total,
    bullets_hit_total       = excluded.bullets_hit_total,
    bullets_shot_total      = excluded.bullets_shot_total,
    wins_deadend            = excluded.wins_deadend,
    wins_badblood           = excluded.wins_badblood,
    wins_alienarcadium      = excluded.wins_alienarcadium,
    wins_prison             = excluded.wins_prison,
    wins_deadend_normal     = excluded.wins_deadend_normal,
    wins_deadend_hard       = excluded.wins_deadend_hard,
    wins_deadend_rip        = excluded.wins_deadend_rip,
    fastest_deadend_normal  = excluded.fastest_deadend_normal,
    fastest_deadend_hard    = excluded.fastest_deadend_hard,
    fastest_deadend_rip     = excluded.fastest_deadend_rip,
    r10_deadend_normal      = excluded.r10_deadend_normal,
    r20_deadend_normal      = excluded.r20_deadend_normal,
    r10_deadend_hard        = excluded.r10_deadend_hard,
    r20_deadend_hard        = excluded.r20_deadend_hard,
    r10_deadend_rip         = excluded.r10_deadend_rip,
    r20_deadend_rip         = excluded.r20_deadend_rip,
    kills_deadend_total     = excluded.kills_deadend_total,
    kills_deadend_normal    = excluded.kills_deadend_normal,
    kills_deadend_hard      = excluded.kills_deadend_hard,
    kills_deadend_rip       = excluded.kills_deadend_rip,
    deaths_deadend_total    = excluded.deaths_deadend_total,
    deaths_deadend_normal   = excluded.deaths_deadend_normal,
    deaths_deadend_hard     = excluded.deaths_deadend_hard,
    deaths_deadend_rip      = excluded.deaths_deadend_rip,
    rounds_deadend_total    = excluded.rounds_deadend_total,
    rounds_deadend_normal   = excluded.rounds_deadend_normal,
    rounds_deadend_hard     = excluded.rounds_deadend_hard,
    rounds_deadend_rip      = excluded.rounds_deadend_rip,
    doors_deadend_total     = excluded.doors_deadend_total,
    doors_deadend_normal    = excluded.doors_deadend_normal,
    doors_deadend_hard      = excluded.doors_deadend_hard,
    doors_deadend_rip       = excluded.doors_deadend_rip,
    windows_deadend_total   = excluded.windows_deadend_total,
    windows_deadend_normal  = excluded.windows_deadend_normal,
    windows_deadend_hard    = excluded.windows_deadend_hard,
    windows_deadend_rip     = excluded.windows_deadend_rip,
    knocks_deadend_total    = excluded.knocks_deadend_total,
    knocks_deadend_normal   = excluded.knocks_deadend_normal,
    knocks_deadend_hard     = excluded.knocks_deadend_hard,
    knocks_deadend_rip      = excluded.knocks_deadend_rip,
    revives_deadend_total   = excluded.revives_deadend_total,
    revives_deadend_normal  = excluded.revives_deadend_normal,
    revives_deadend_hard    = excluded.revives_deadend_hard,
    revives_deadend_rip     = excluded.revives_deadend_rip,
    wins_badblood_normal    = excluded.wins_badblood_normal,
    wins_badblood_hard      = excluded.wins_badblood_hard,
    wins_badblood_rip       = excluded.wins_badblood_rip,
    fastest_badblood_normal = excluded.fastest_badblood_normal,
    fastest_badblood_hard   = excluded.fastest_badblood_hard,
    fastest_badblood_rip    = excluded.fastest_badblood_rip,
    r10_badblood_normal     = excluded.r10_badblood_normal,
    r20_badblood_normal     = excluded.r20_badblood_normal,
    r10_badblood_hard       = excluded.r10_badblood_hard,
    r20_badblood_hard       = excluded.r20_badblood_hard,
    r10_badblood_rip        = excluded.r10_badblood_rip,
    r20_badblood_rip        = excluded.r20_badblood_rip,
    kills_badblood_total    = excluded.kills_badblood_total,
    kills_badblood_normal   = excluded.kills_badblood_normal,
    kills_badblood_hard     = excluded.kills_badblood_hard,
    kills_badblood_rip      = excluded.kills_badblood_rip,
    deaths_badblood_total   = excluded.deaths_badblood_total,
    deaths_badblood_normal  = excluded.deaths_badblood_normal,
    deaths_badblood_hard    = excluded.deaths_badblood_hard,
    deaths_badblood_rip     = excluded.deaths_badblood_rip,
    rounds_badblood_total   = excluded.rounds_badblood_total,
    rounds_badblood_normal  = excluded.rounds_badblood_normal,
    rounds_badblood_hard    = excluded.rounds_badblood_hard,
    rounds_badblood_rip     = excluded.rounds_badblood_rip,
    doors_badblood_total    = excluded.doors_badblood_total,
    doors_badblood_normal   = excluded.doors_badblood_normal,
    doors_badblood_hard     = excluded.doors_badblood_hard,
    doors_badblood_rip      = excluded.doors_badblood_rip,
    windows_badblood_total  = excluded.windows_badblood_total,
    windows_badblood_normal = excluded.windows_badblood_normal,
    windows_badblood_hard   = excluded.windows_badblood_hard,
    windows_badblood_rip    = excluded.windows_badblood_rip,
    knocks_badblood_total   = excluded.knocks_badblood_total,
    knocks_badblood_normal  = excluded.knocks_badblood_normal,
    knocks_badblood_hard    = excluded.knocks_badblood_hard,
    knocks_badblood_rip     = excluded.knocks_badblood_rip,
    revives_badblood_total  = excluded.revives_badblood_total,
    revives_badblood_normal = excluded.revives_badblood_normal,
    revives_badblood_hard   = excluded.revives_badblood_hard,
    revives_badblood_rip    = excluded.revives_badblood_rip,
    fastest_alienarcadium      = excluded.fastest_alienarcadium,
    r10_alienarcadium          = excluded.r10_alienarcadium,
    r20_alienarcadium          = excluded.r20_alienarcadium,
    total_rounds_alienarcadium = excluded.total_rounds_alienarcadium,
    kills_alienarcadium        = excluded.kills_alienarcadium,
    deaths_alienarcadium       = excluded.deaths_alienarcadium,
    doors_alienarcadium        = excluded.doors_alienarcadium,
    windows_alienarcadium      = excluded.windows_alienarcadium,
    knocks_alienarcadium       = excluded.knocks_alienarcadium,
    revives_alienarcadium      = excluded.revives_alienarcadium,
    wins_prison_normal      = excluded.wins_prison_normal,
    wins_prison_hard        = excluded.wins_prison_hard,
    wins_prison_rip         = excluded.wins_prison_rip,
    fastest_prison_normal   = excluded.fastest_prison_normal,
    fastest_prison_hard     = excluded.fastest_prison_hard,
    fastest_prison_rip      = excluded.fastest_prison_rip,
    r10_prison_normal       = excluded.r10_prison_normal,
    r20_prison_normal       = excluded.r20_prison_normal,
    r10_prison_hard         = excluded.r10_prison_hard,
    r20_prison_hard         = excluded.r20_prison_hard,
    r10_prison_rip          = excluded.r10_prison_rip,
    r20_prison_rip          = excluded.r20_prison_rip,
    kills_prison_total      = excluded.kills_prison_total,
    kills_prison_normal     = excluded.kills_prison_normal,
    kills_prison_hard       = excluded.kills_prison_hard,
    kills_prison_rip        = excluded.kills_prison_rip,
    deaths_prison_total     = excluded.deaths_prison_total,
    deaths_prison_normal    = excluded.deaths_prison_normal,
    deaths_prison_hard      = excluded.deaths_prison_hard,
    deaths_prison_rip       = excluded.deaths_prison_rip,
    rounds_prison_total     = excluded.rounds_prison_total,
    rounds_prison_normal    = excluded.rounds_prison_normal,
    rounds_prison_hard      = excluded.rounds_prison_hard,
    rounds_prison_rip       = excluded.rounds_prison_rip,
    doors_prison_total      = excluded.doors_prison_total,
    doors_prison_normal     = excluded.doors_prison_normal,
    doors_prison_hard       = excluded.doors_prison_hard,
    doors_prison_rip        = excluded.doors_prison_rip,
    windows_prison_total    = excluded.windows_prison_total,
    windows_prison_normal   = excluded.windows_prison_normal,
    windows_prison_hard     = excluded.windows_prison_hard,
    windows_prison_rip      = excluded.windows_prison_rip,
    knocks_prison_total     = excluded.knocks_prison_total,
    knocks_prison_normal    = excluded.knocks_prison_normal,
    knocks_prison_hard      = excluded.knocks_prison_hard,
    knocks_prison_rip       = excluded.knocks_prison_rip,
    revives_prison_total    = excluded.revives_prison_total,
    revives_prison_normal   = excluded.revives_prison_normal,
    revives_prison_hard     = excluded.revives_prison_hard,
    revives_prison_rip          = excluded.revives_prison_rip,
    best_round_total            = excluded.best_round_total,
    best_round_deadend          = excluded.best_round_deadend,
    best_round_deadend_normal   = excluded.best_round_deadend_normal,
    best_round_deadend_hard     = excluded.best_round_deadend_hard,
    best_round_deadend_rip      = excluded.best_round_deadend_rip,
    best_round_badblood         = excluded.best_round_badblood,
    best_round_badblood_normal  = excluded.best_round_badblood_normal,
    best_round_badblood_hard    = excluded.best_round_badblood_hard,
    best_round_badblood_rip     = excluded.best_round_badblood_rip,
    best_round_alienarcadium    = excluded.best_round_alienarcadium,
    best_round_prison           = excluded.best_round_prison,
    best_round_prison_normal    = excluded.best_round_prison_normal,
    best_round_prison_hard      = excluded.best_round_prison_hard,
    best_round_prison_rip       = excluded.best_round_prison_rip,
    raw_json                    = excluded.raw_json,
    last_updated                = excluded.last_updated
`);

function upsertPlayer(data) {
  upsertStmt.run(data);
}

function getByUuid(uuid) {
  return db.prepare('SELECT * FROM players WHERE uuid = ?').get(uuid);
}

// SQL expression for a mob-kill leaderboard: a single json_extract, or the sum
// of several COALESCE(json_extract,...) when the config uses `jsonKeys`.
// Keys come from trusted config (never raw user input), so interpolation is safe.
function killsExpr(lb) {
  const keys = lb.jsonKeys ?? [lb.jsonKey];
  if (keys.length === 1) return `json_extract(raw_json, '$.${keys[0]}')`;
  return '(' + keys.map(k => `COALESCE(json_extract(raw_json, '$.${k}'), 0)`).join(' + ') + ')';
}

function isKillsLb(lb) {
  return !!(lb.jsonKey || lb.jsonKeys);
}

// col/jsonKey come from trusted config (never raw user input), so interpolation is safe.
function getLeaderboardPage(lb, offset, limit) {
  const dir = lb.asc ? 'ASC' : 'DESC';
  if (isKillsLb(lb)) {
    const expr  = killsExpr(lb);
    const where = `${expr} > 0`;
    return db.prepare(`
      SELECT username, CAST(${expr} AS INTEGER) AS value,
             DENSE_RANK() OVER (ORDER BY ${expr} ${dir}) AS rank
      FROM players
      WHERE ${where}
      ORDER BY ${expr} ${dir}
      LIMIT ? OFFSET ?
    `).all(limit, offset);
  }
  const where = lb.fmt === 'time' ? `${lb.col} IS NOT NULL` : `${lb.col} > 0`;
  return db.prepare(`
    SELECT username, ${lb.col} AS value,
           DENSE_RANK() OVER (ORDER BY ${lb.col} ${dir}) AS rank
    FROM players
    WHERE ${where}
    ORDER BY ${lb.col} ${dir}
    LIMIT ? OFFSET ?
  `).all(limit, offset);
}

function getLeaderboardCount(lb) {
  if (isKillsLb(lb)) {
    const expr = killsExpr(lb);
    return db.prepare(`SELECT COUNT(*) AS n FROM players WHERE ${expr} > 0`).get().n;
  }
  const where = lb.fmt === 'time' ? `${lb.col} IS NOT NULL` : `${lb.col} > 0`;
  return db.prepare(`SELECT COUNT(*) AS n FROM players WHERE ${where}`).get().n;
}

function getPlayerRank(lb, value) {
  if (value == null) return null;
  if (isKillsLb(lb)) {
    const expr       = killsExpr(lb);
    const betterCond = lb.asc ? `${expr} < ?` : `${expr} > ?`;
    const row = db.prepare(
      `SELECT COUNT(DISTINCT ${expr}) + 1 AS rank FROM players WHERE ${betterCond}`
    ).get(value);
    return row.rank;
  }
  const betterCond = lb.asc
    ? `${lb.col} < ? AND ${lb.col} IS NOT NULL`
    : `${lb.col} > ?`;
  const row = db.prepare(
    `SELECT COUNT(DISTINCT ${lb.col}) + 1 AS rank FROM players WHERE ${betterCond}`
  ).get(value);
  return row.rank;
}

module.exports = { upsertPlayer, getByUuid, getLeaderboardPage, getLeaderboardCount, getPlayerRank };
