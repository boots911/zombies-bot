const WIN_ROUND = {
  deadend:       { normal: 30, hard: 30, rip: 30 },
  badblood:      { normal: 30, hard: 30, rip: 30 },
  alienarcadium: { normal: 30 },
  prison:        { normal: 30, hard: 30, rip: 30 },
};

function transformPlayer(player) {
  const arcade = player?.stats?.Arcade ?? {};

  return {
    uuid:     normalizeUuid(player.uuid),
    username: player.displayname,

    // Overall
    wins_total:        arcade.wins_zombies              ?? 0,
    kills_total:       arcade.zombie_kills_zombies      ?? 0,
    deaths_total:      arcade.deaths_zombies            ?? 0,
    rounds_total:      arcade.total_rounds_survived_zombies ?? 0,
    doors_total:       arcade.doors_opened_zombies      ?? 0,
    windows_total:     arcade.windows_repaired_zombies  ?? 0,
    knocks_total:      arcade.times_knocked_down_zombies ?? 0,
    revives_total:     arcade.players_revived_zombies   ?? 0,
    headshots_total:   arcade.headshots_zombies         ?? 0,
    bullets_hit_total: arcade.bullets_hit_zombies       ?? 0,
    bullets_shot_total:arcade.bullets_shot_zombies      ?? 0,

    // Per-map total wins
    wins_deadend:        arcade.wins_zombies_deadend        ?? 0,
    wins_badblood:       arcade.wins_zombies_badblood       ?? 0,
    wins_alienarcadium:  arcade.wins_zombies_alienarcadium  ?? 0,
    wins_prison:         arcade.wins_zombies_prison         ?? 0,

    // Dead End per difficulty
    wins_deadend_normal: arcade.wins_zombies_deadend_normal ?? 0,
    wins_deadend_hard:   arcade.wins_zombies_deadend_hard   ?? 0,
    wins_deadend_rip:    arcade.wins_zombies_deadend_rip    ?? 0,
    fastest_deadend_normal: winTime(arcade, 'deadend', 'normal'),
    fastest_deadend_hard:   winTime(arcade, 'deadend', 'hard'),
    fastest_deadend_rip:    winTime(arcade, 'deadend', 'rip'),
    r10_deadend_normal: arcade.fastest_time_10_zombies_deadend_normal ?? null,
    r20_deadend_normal: arcade.fastest_time_20_zombies_deadend_normal ?? null,
    r10_deadend_hard:   arcade.fastest_time_10_zombies_deadend_hard   ?? null,
    r20_deadend_hard:   arcade.fastest_time_20_zombies_deadend_hard   ?? null,
    r10_deadend_rip:    arcade.fastest_time_10_zombies_deadend_rip    ?? null,
    r20_deadend_rip:    arcade.fastest_time_20_zombies_deadend_rip    ?? null,

    // Dead End extended stats
    kills_deadend_total:   arcade.zombie_kills_zombies_deadend          ?? 0,
    kills_deadend_normal:  arcade.zombie_kills_zombies_deadend_normal   ?? 0,
    kills_deadend_hard:    arcade.zombie_kills_zombies_deadend_hard     ?? 0,
    kills_deadend_rip:     arcade.zombie_kills_zombies_deadend_rip      ?? 0,
    deaths_deadend_total:  arcade.deaths_zombies_deadend                ?? 0,
    deaths_deadend_normal: arcade.deaths_zombies_deadend_normal         ?? 0,
    deaths_deadend_hard:   arcade.deaths_zombies_deadend_hard           ?? 0,
    deaths_deadend_rip:    arcade.deaths_zombies_deadend_rip            ?? 0,
    rounds_deadend_total:  arcade.total_rounds_survived_zombies_deadend          ?? 0,
    rounds_deadend_normal: arcade.total_rounds_survived_zombies_deadend_normal   ?? 0,
    rounds_deadend_hard:   arcade.total_rounds_survived_zombies_deadend_hard     ?? 0,
    rounds_deadend_rip:    arcade.total_rounds_survived_zombies_deadend_rip      ?? 0,
    doors_deadend_total:   arcade.doors_opened_zombies_deadend          ?? 0,
    doors_deadend_normal:  arcade.doors_opened_zombies_deadend_normal   ?? 0,
    doors_deadend_hard:    arcade.doors_opened_zombies_deadend_hard     ?? 0,
    doors_deadend_rip:     arcade.doors_opened_zombies_deadend_rip      ?? 0,
    windows_deadend_total:   arcade.windows_repaired_zombies_deadend          ?? 0,
    windows_deadend_normal:  arcade.windows_repaired_zombies_deadend_normal   ?? 0,
    windows_deadend_hard:    arcade.windows_repaired_zombies_deadend_hard     ?? 0,
    windows_deadend_rip:     arcade.windows_repaired_zombies_deadend_rip      ?? 0,
    knocks_deadend_total:  arcade.times_knocked_down_zombies_deadend          ?? 0,
    knocks_deadend_normal: arcade.times_knocked_down_zombies_deadend_normal   ?? 0,
    knocks_deadend_hard:   arcade.times_knocked_down_zombies_deadend_hard     ?? 0,
    knocks_deadend_rip:    arcade.times_knocked_down_zombies_deadend_rip      ?? 0,
    revives_deadend_total:   arcade.players_revived_zombies_deadend          ?? 0,
    revives_deadend_normal:  arcade.players_revived_zombies_deadend_normal   ?? 0,
    revives_deadend_hard:    arcade.players_revived_zombies_deadend_hard     ?? 0,
    revives_deadend_rip:     arcade.players_revived_zombies_deadend_rip      ?? 0,

    // Bad Blood per difficulty
    wins_badblood_normal: arcade.wins_zombies_badblood_normal ?? 0,
    wins_badblood_hard:   arcade.wins_zombies_badblood_hard   ?? 0,
    wins_badblood_rip:    arcade.wins_zombies_badblood_rip    ?? 0,
    fastest_badblood_normal: winTime(arcade, 'badblood', 'normal'),
    fastest_badblood_hard:   winTime(arcade, 'badblood', 'hard'),
    fastest_badblood_rip:    winTime(arcade, 'badblood', 'rip'),
    r10_badblood_normal: arcade.fastest_time_10_zombies_badblood_normal ?? null,
    r20_badblood_normal: arcade.fastest_time_20_zombies_badblood_normal ?? null,
    r10_badblood_hard:   arcade.fastest_time_10_zombies_badblood_hard   ?? null,
    r20_badblood_hard:   arcade.fastest_time_20_zombies_badblood_hard   ?? null,
    r10_badblood_rip:    arcade.fastest_time_10_zombies_badblood_rip    ?? null,
    r20_badblood_rip:    arcade.fastest_time_20_zombies_badblood_rip    ?? null,

    // Bad Blood extended stats
    kills_badblood_total:   arcade.zombie_kills_zombies_badblood          ?? 0,
    kills_badblood_normal:  arcade.zombie_kills_zombies_badblood_normal   ?? 0,
    kills_badblood_hard:    arcade.zombie_kills_zombies_badblood_hard     ?? 0,
    kills_badblood_rip:     arcade.zombie_kills_zombies_badblood_rip      ?? 0,
    deaths_badblood_total:  arcade.deaths_zombies_badblood                ?? 0,
    deaths_badblood_normal: arcade.deaths_zombies_badblood_normal         ?? 0,
    deaths_badblood_hard:   arcade.deaths_zombies_badblood_hard           ?? 0,
    deaths_badblood_rip:    arcade.deaths_zombies_badblood_rip            ?? 0,
    rounds_badblood_total:  arcade.total_rounds_survived_zombies_badblood          ?? 0,
    rounds_badblood_normal: arcade.total_rounds_survived_zombies_badblood_normal   ?? 0,
    rounds_badblood_hard:   arcade.total_rounds_survived_zombies_badblood_hard     ?? 0,
    rounds_badblood_rip:    arcade.total_rounds_survived_zombies_badblood_rip      ?? 0,
    doors_badblood_total:   arcade.doors_opened_zombies_badblood          ?? 0,
    doors_badblood_normal:  arcade.doors_opened_zombies_badblood_normal   ?? 0,
    doors_badblood_hard:    arcade.doors_opened_zombies_badblood_hard     ?? 0,
    doors_badblood_rip:     arcade.doors_opened_zombies_badblood_rip      ?? 0,
    windows_badblood_total:   arcade.windows_repaired_zombies_badblood          ?? 0,
    windows_badblood_normal:  arcade.windows_repaired_zombies_badblood_normal   ?? 0,
    windows_badblood_hard:    arcade.windows_repaired_zombies_badblood_hard     ?? 0,
    windows_badblood_rip:     arcade.windows_repaired_zombies_badblood_rip      ?? 0,
    knocks_badblood_total:  arcade.times_knocked_down_zombies_badblood          ?? 0,
    knocks_badblood_normal: arcade.times_knocked_down_zombies_badblood_normal   ?? 0,
    knocks_badblood_hard:   arcade.times_knocked_down_zombies_badblood_hard     ?? 0,
    knocks_badblood_rip:    arcade.times_knocked_down_zombies_badblood_rip      ?? 0,
    revives_badblood_total:   arcade.players_revived_zombies_badblood          ?? 0,
    revives_badblood_normal:  arcade.players_revived_zombies_badblood_normal   ?? 0,
    revives_badblood_hard:    arcade.players_revived_zombies_badblood_hard     ?? 0,
    revives_badblood_rip:     arcade.players_revived_zombies_badblood_rip      ?? 0,

    // Alien Arcadium (no difficulties; fastest time uses _normal key in API)
    fastest_alienarcadium:      winTime(arcade, 'alienarcadium', 'normal'),
    r10_alienarcadium:          arcade.fastest_time_10_zombies_alienarcadium_normal ?? null,
    r20_alienarcadium:          arcade.fastest_time_20_zombies_alienarcadium_normal ?? null,
    total_rounds_alienarcadium: arcade.total_rounds_survived_zombies_alienarcadium  ?? 0,
    kills_alienarcadium:        arcade.zombie_kills_zombies_alienarcadium            ?? 0,
    deaths_alienarcadium:       arcade.deaths_zombies_alienarcadium                 ?? 0,
    doors_alienarcadium:        arcade.doors_opened_zombies_alienarcadium           ?? 0,
    windows_alienarcadium:      arcade.windows_repaired_zombies_alienarcadium       ?? 0,
    knocks_alienarcadium:       arcade.times_knocked_down_zombies_alienarcadium     ?? 0,
    revives_alienarcadium:      arcade.players_revived_zombies_alienarcadium        ?? 0,

    // Prison per difficulty
    wins_prison_normal: arcade.wins_zombies_prison_normal ?? 0,
    wins_prison_hard:   arcade.wins_zombies_prison_hard   ?? 0,
    wins_prison_rip:    arcade.wins_zombies_prison_rip    ?? 0,
    fastest_prison_normal: winTime(arcade, 'prison', 'normal'),
    fastest_prison_hard:   winTime(arcade, 'prison', 'hard'),
    fastest_prison_rip:    winTime(arcade, 'prison', 'rip'),
    r10_prison_normal: arcade.fastest_time_10_zombies_prison_normal ?? null,
    r20_prison_normal: arcade.fastest_time_20_zombies_prison_normal ?? null,
    r10_prison_hard:   arcade.fastest_time_10_zombies_prison_hard   ?? null,
    r20_prison_hard:   arcade.fastest_time_20_zombies_prison_hard   ?? null,
    r10_prison_rip:    arcade.fastest_time_10_zombies_prison_rip    ?? null,
    r20_prison_rip:    arcade.fastest_time_20_zombies_prison_rip    ?? null,

    // Prison extended stats
    kills_prison_total:   arcade.zombie_kills_zombies_prison          ?? 0,
    kills_prison_normal:  arcade.zombie_kills_zombies_prison_normal   ?? 0,
    kills_prison_hard:    arcade.zombie_kills_zombies_prison_hard     ?? 0,
    kills_prison_rip:     arcade.zombie_kills_zombies_prison_rip      ?? 0,
    deaths_prison_total:  arcade.deaths_zombies_prison                ?? 0,
    deaths_prison_normal: arcade.deaths_zombies_prison_normal         ?? 0,
    deaths_prison_hard:   arcade.deaths_zombies_prison_hard           ?? 0,
    deaths_prison_rip:    arcade.deaths_zombies_prison_rip            ?? 0,
    rounds_prison_total:  arcade.total_rounds_survived_zombies_prison          ?? 0,
    rounds_prison_normal: arcade.total_rounds_survived_zombies_prison_normal   ?? 0,
    rounds_prison_hard:   arcade.total_rounds_survived_zombies_prison_hard     ?? 0,
    rounds_prison_rip:    arcade.total_rounds_survived_zombies_prison_rip      ?? 0,
    doors_prison_total:   arcade.doors_opened_zombies_prison          ?? 0,
    doors_prison_normal:  arcade.doors_opened_zombies_prison_normal   ?? 0,
    doors_prison_hard:    arcade.doors_opened_zombies_prison_hard     ?? 0,
    doors_prison_rip:     arcade.doors_opened_zombies_prison_rip      ?? 0,
    windows_prison_total:   arcade.windows_repaired_zombies_prison          ?? 0,
    windows_prison_normal:  arcade.windows_repaired_zombies_prison_normal   ?? 0,
    windows_prison_hard:    arcade.windows_repaired_zombies_prison_hard     ?? 0,
    windows_prison_rip:     arcade.windows_repaired_zombies_prison_rip      ?? 0,
    knocks_prison_total:  arcade.times_knocked_down_zombies_prison          ?? 0,
    knocks_prison_normal: arcade.times_knocked_down_zombies_prison_normal   ?? 0,
    knocks_prison_hard:   arcade.times_knocked_down_zombies_prison_hard     ?? 0,
    knocks_prison_rip:    arcade.times_knocked_down_zombies_prison_rip      ?? 0,
    revives_prison_total:   arcade.players_revived_zombies_prison          ?? 0,
    revives_prison_normal:  arcade.players_revived_zombies_prison_normal   ?? 0,
    revives_prison_hard:    arcade.players_revived_zombies_prison_hard     ?? 0,
    revives_prison_rip:     arcade.players_revived_zombies_prison_rip      ?? 0,

    // Best round reached per map + difficulty
    best_round_total:           arcade.best_round_zombies                      ?? 0,
    best_round_deadend:         arcade.best_round_zombies_deadend              ?? 0,
    best_round_deadend_normal:  arcade.best_round_zombies_deadend_normal       ?? 0,
    best_round_deadend_hard:    arcade.best_round_zombies_deadend_hard         ?? 0,
    best_round_deadend_rip:     arcade.best_round_zombies_deadend_rip          ?? 0,
    best_round_badblood:        arcade.best_round_zombies_badblood             ?? 0,
    best_round_badblood_normal: arcade.best_round_zombies_badblood_normal      ?? 0,
    best_round_badblood_hard:   arcade.best_round_zombies_badblood_hard        ?? 0,
    best_round_badblood_rip:    arcade.best_round_zombies_badblood_rip         ?? 0,
    best_round_alienarcadium:   arcade.best_round_zombies_alienarcadium        ?? 0,
    best_round_prison:          arcade.best_round_zombies_prison               ?? 0,
    best_round_prison_normal:   arcade.best_round_zombies_prison_normal        ?? 0,
    best_round_prison_hard:     arcade.best_round_zombies_prison_hard          ?? 0,
    best_round_prison_rip:      arcade.best_round_zombies_prison_rip           ?? 0,

    raw_json:     JSON.stringify(arcade),
    last_updated: Date.now(),
  };
}

function winTime(arcade, mapKey, diffKey) {
  const round = WIN_ROUND[mapKey]?.[diffKey];
  if (!round) return null;
  return arcade[`fastest_time_${round}_zombies_${mapKey}_${diffKey}`] ?? null;
}

function normalizeUuid(raw) {
  if (!raw) return raw;
  if (raw.includes('-')) return raw;
  return `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`;
}

module.exports = { transformPlayer };
