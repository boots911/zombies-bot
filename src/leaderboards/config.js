// value    — unique key used in button custom_ids (keep short, no colons)
// name     — shown in autocomplete and embed titles
// col      — DB column to ORDER BY (omit if jsonKey/jsonKeys is set)
// jsonKey  — single key inside raw_json for mob-type kills (omit if col is set)
// jsonKeys — array of raw_json keys summed together (use instead of jsonKey to
//            merge several in-game mob variants into one stat)
// asc      — true = lower is better (times), false = higher is better
// fmt      — 'wins' | 'time'

const LEADERBOARDS = [
  // ── Overall ───────────────────────────────────────────────────────────────
  { value: 'wins_total',       name: 'Overall Wins',              col: 'wins_total',          asc: false, fmt: 'wins' },
  { value: 'kills_total',      name: 'Overall Kills',             col: 'kills_total',         asc: false, fmt: 'wins' },
  { value: 'deaths_total',     name: 'Overall Deaths',            col: 'deaths_total',        asc: false, fmt: 'wins' },
  { value: 'rounds_total',     name: 'Overall Rounds',            col: 'rounds_total',        asc: false, fmt: 'wins' },
  { value: 'doors_total',      name: 'Overall Doors Opened',      col: 'doors_total',         asc: false, fmt: 'wins' },
  { value: 'windows_total',    name: 'Overall Windows Repaired',  col: 'windows_total',       asc: false, fmt: 'wins' },
  { value: 'knocks_total',     name: 'Overall Times Knocked Down',col: 'knocks_total',        asc: false, fmt: 'wins' },
  { value: 'revives_total',    name: 'Overall Players Revived',   col: 'revives_total',       asc: false, fmt: 'wins' },
  { value: 'headshots_total',  name: 'Overall Headshots',         col: 'headshots_total',     asc: false, fmt: 'wins' },
  { value: 'bullets_hit',      name: 'Overall Bullets Hit',       col: 'bullets_hit_total',   asc: false, fmt: 'wins' },
  { value: 'bullets_shot',     name: 'Overall Bullets Shot',      col: 'bullets_shot_total',  asc: false, fmt: 'wins' },

  // ── Dead End wins ─────────────────────────────────────────────────────────
  { value: 'wins_de',          name: 'Dead End Wins',             col: 'wins_deadend',            asc: false, fmt: 'wins' },
  { value: 'wins_de_normal',   name: 'Dead End Normal Wins',      col: 'wins_deadend_normal',     asc: false, fmt: 'wins' },
  { value: 'wins_de_hard',     name: 'Dead End Hard Wins',        col: 'wins_deadend_hard',       asc: false, fmt: 'wins' },
  { value: 'wins_de_rip',      name: 'Dead End RIP Wins',         col: 'wins_deadend_rip',        asc: false, fmt: 'wins' },

  // ── Dead End extended ─────────────────────────────────────────────────────
  { value: 'kills_de',         name: 'Dead End Kills',            col: 'kills_deadend_total',     asc: false, fmt: 'wins' },
  { value: 'kills_de_normal',  name: 'Dead End Normal Kills',     col: 'kills_deadend_normal',    asc: false, fmt: 'wins' },
  { value: 'kills_de_hard',    name: 'Dead End Hard Kills',       col: 'kills_deadend_hard',      asc: false, fmt: 'wins' },
  { value: 'kills_de_rip',     name: 'Dead End RIP Kills',        col: 'kills_deadend_rip',       asc: false, fmt: 'wins' },
  { value: 'deaths_de',        name: 'Dead End Deaths',           col: 'deaths_deadend_total',    asc: false, fmt: 'wins' },
  { value: 'deaths_de_normal', name: 'Dead End Normal Deaths',    col: 'deaths_deadend_normal',   asc: false, fmt: 'wins' },
  { value: 'deaths_de_hard',   name: 'Dead End Hard Deaths',      col: 'deaths_deadend_hard',     asc: false, fmt: 'wins' },
  { value: 'deaths_de_rip',    name: 'Dead End RIP Deaths',       col: 'deaths_deadend_rip',      asc: false, fmt: 'wins' },
  { value: 'rounds_de',        name: 'Dead End Rounds',           col: 'rounds_deadend_total',    asc: false, fmt: 'wins' },
  { value: 'rounds_de_normal', name: 'Dead End Normal Rounds',    col: 'rounds_deadend_normal',   asc: false, fmt: 'wins' },
  { value: 'rounds_de_hard',   name: 'Dead End Hard Rounds',      col: 'rounds_deadend_hard',     asc: false, fmt: 'wins' },
  { value: 'rounds_de_rip',    name: 'Dead End RIP Rounds',       col: 'rounds_deadend_rip',      asc: false, fmt: 'wins' },
  { value: 'doors_de',         name: 'Dead End Doors Opened',     col: 'doors_deadend_total',     asc: false, fmt: 'wins' },
  { value: 'doors_de_normal',  name: 'Dead End Normal Doors',     col: 'doors_deadend_normal',    asc: false, fmt: 'wins' },
  { value: 'doors_de_hard',    name: 'Dead End Hard Doors',       col: 'doors_deadend_hard',      asc: false, fmt: 'wins' },
  { value: 'doors_de_rip',     name: 'Dead End RIP Doors',        col: 'doors_deadend_rip',       asc: false, fmt: 'wins' },
  { value: 'windows_de',       name: 'Dead End Windows Repaired', col: 'windows_deadend_total',   asc: false, fmt: 'wins' },
  { value: 'windows_de_normal',name: 'Dead End Normal Windows',   col: 'windows_deadend_normal',  asc: false, fmt: 'wins' },
  { value: 'windows_de_hard',  name: 'Dead End Hard Windows',     col: 'windows_deadend_hard',    asc: false, fmt: 'wins' },
  { value: 'windows_de_rip',   name: 'Dead End RIP Windows',      col: 'windows_deadend_rip',     asc: false, fmt: 'wins' },
  { value: 'knocks_de',        name: 'Dead End Times Knocked Down',col:'knocks_deadend_total',    asc: false, fmt: 'wins' },
  { value: 'knocks_de_normal', name: 'Dead End Normal Knocks',    col: 'knocks_deadend_normal',   asc: false, fmt: 'wins' },
  { value: 'knocks_de_hard',   name: 'Dead End Hard Knocks',      col: 'knocks_deadend_hard',     asc: false, fmt: 'wins' },
  { value: 'knocks_de_rip',    name: 'Dead End RIP Knocks',       col: 'knocks_deadend_rip',      asc: false, fmt: 'wins' },
  { value: 'revives_de',       name: 'Dead End Players Revived',  col: 'revives_deadend_total',   asc: false, fmt: 'wins' },
  { value: 'revives_de_normal',name: 'Dead End Normal Revives',   col: 'revives_deadend_normal',  asc: false, fmt: 'wins' },
  { value: 'revives_de_hard',  name: 'Dead End Hard Revives',     col: 'revives_deadend_hard',    asc: false, fmt: 'wins' },
  { value: 'revives_de_rip',   name: 'Dead End RIP Revives',      col: 'revives_deadend_rip',     asc: false, fmt: 'wins' },

  // ── Dead End times ────────────────────────────────────────────────────────
  { value: 'r10_de_normal',    name: 'Dead End Normal R10',                 col: 'r10_deadend_normal',      asc: true,  fmt: 'time' },
  { value: 'r20_de_normal',    name: 'Dead End Normal R20',                 col: 'r20_deadend_normal',      asc: true,  fmt: 'time' },
  { value: 'r30_de_normal',    name: 'Dead End Normal R30 Fastest Win',     col: 'fastest_deadend_normal',  asc: true,  fmt: 'time' },
  { value: 'r10_de_hard',      name: 'Dead End Hard R10',                   col: 'r10_deadend_hard',        asc: true,  fmt: 'time' },
  { value: 'r20_de_hard',      name: 'Dead End Hard R20',                   col: 'r20_deadend_hard',        asc: true,  fmt: 'time' },
  { value: 'r30_de_hard',      name: 'Dead End Hard R30 Fastest Win',       col: 'fastest_deadend_hard',    asc: true,  fmt: 'time' },
  { value: 'r10_de_rip',       name: 'Dead End RIP R10',                    col: 'r10_deadend_rip',         asc: true,  fmt: 'time' },
  { value: 'r20_de_rip',       name: 'Dead End RIP R20',                    col: 'r20_deadend_rip',         asc: true,  fmt: 'time' },
  { value: 'r30_de_rip',       name: 'Dead End RIP R30 Fastest Win',        col: 'fastest_deadend_rip',     asc: true,  fmt: 'time' },

  // ── Bad Blood wins ────────────────────────────────────────────────────────
  { value: 'wins_bb',          name: 'Bad Blood Wins',            col: 'wins_badblood',           asc: false, fmt: 'wins' },
  { value: 'wins_bb_normal',   name: 'Bad Blood Normal Wins',     col: 'wins_badblood_normal',    asc: false, fmt: 'wins' },
  { value: 'wins_bb_hard',     name: 'Bad Blood Hard Wins',       col: 'wins_badblood_hard',      asc: false, fmt: 'wins' },
  { value: 'wins_bb_rip',      name: 'Bad Blood RIP Wins',        col: 'wins_badblood_rip',       asc: false, fmt: 'wins' },

  // ── Bad Blood extended ────────────────────────────────────────────────────
  { value: 'kills_bb',         name: 'Bad Blood Kills',           col: 'kills_badblood_total',    asc: false, fmt: 'wins' },
  { value: 'kills_bb_normal',  name: 'Bad Blood Normal Kills',    col: 'kills_badblood_normal',   asc: false, fmt: 'wins' },
  { value: 'kills_bb_hard',    name: 'Bad Blood Hard Kills',      col: 'kills_badblood_hard',     asc: false, fmt: 'wins' },
  { value: 'kills_bb_rip',     name: 'Bad Blood RIP Kills',       col: 'kills_badblood_rip',      asc: false, fmt: 'wins' },
  { value: 'deaths_bb',        name: 'Bad Blood Deaths',          col: 'deaths_badblood_total',   asc: false, fmt: 'wins' },
  { value: 'deaths_bb_normal', name: 'Bad Blood Normal Deaths',   col: 'deaths_badblood_normal',  asc: false, fmt: 'wins' },
  { value: 'deaths_bb_hard',   name: 'Bad Blood Hard Deaths',     col: 'deaths_badblood_hard',    asc: false, fmt: 'wins' },
  { value: 'deaths_bb_rip',    name: 'Bad Blood RIP Deaths',      col: 'deaths_badblood_rip',     asc: false, fmt: 'wins' },
  { value: 'rounds_bb',        name: 'Bad Blood Rounds',          col: 'rounds_badblood_total',   asc: false, fmt: 'wins' },
  { value: 'rounds_bb_normal', name: 'Bad Blood Normal Rounds',   col: 'rounds_badblood_normal',  asc: false, fmt: 'wins' },
  { value: 'rounds_bb_hard',   name: 'Bad Blood Hard Rounds',     col: 'rounds_badblood_hard',    asc: false, fmt: 'wins' },
  { value: 'rounds_bb_rip',    name: 'Bad Blood RIP Rounds',      col: 'rounds_badblood_rip',     asc: false, fmt: 'wins' },
  { value: 'doors_bb',         name: 'Bad Blood Doors Opened',    col: 'doors_badblood_total',    asc: false, fmt: 'wins' },
  { value: 'doors_bb_normal',  name: 'Bad Blood Normal Doors',    col: 'doors_badblood_normal',   asc: false, fmt: 'wins' },
  { value: 'doors_bb_hard',    name: 'Bad Blood Hard Doors',      col: 'doors_badblood_hard',     asc: false, fmt: 'wins' },
  { value: 'doors_bb_rip',     name: 'Bad Blood RIP Doors',       col: 'doors_badblood_rip',      asc: false, fmt: 'wins' },
  { value: 'windows_bb',       name: 'Bad Blood Windows Repaired',col: 'windows_badblood_total',  asc: false, fmt: 'wins' },
  { value: 'windows_bb_normal',name: 'Bad Blood Normal Windows',  col: 'windows_badblood_normal', asc: false, fmt: 'wins' },
  { value: 'windows_bb_hard',  name: 'Bad Blood Hard Windows',    col: 'windows_badblood_hard',   asc: false, fmt: 'wins' },
  { value: 'windows_bb_rip',   name: 'Bad Blood RIP Windows',     col: 'windows_badblood_rip',    asc: false, fmt: 'wins' },
  { value: 'knocks_bb',        name: 'Bad Blood Times Knocked Down',col:'knocks_badblood_total',  asc: false, fmt: 'wins' },
  { value: 'knocks_bb_normal', name: 'Bad Blood Normal Knocks',   col: 'knocks_badblood_normal',  asc: false, fmt: 'wins' },
  { value: 'knocks_bb_hard',   name: 'Bad Blood Hard Knocks',     col: 'knocks_badblood_hard',    asc: false, fmt: 'wins' },
  { value: 'knocks_bb_rip',    name: 'Bad Blood RIP Knocks',      col: 'knocks_badblood_rip',     asc: false, fmt: 'wins' },
  { value: 'revives_bb',       name: 'Bad Blood Players Revived', col: 'revives_badblood_total',  asc: false, fmt: 'wins' },
  { value: 'revives_bb_normal',name: 'Bad Blood Normal Revives',  col: 'revives_badblood_normal', asc: false, fmt: 'wins' },
  { value: 'revives_bb_hard',  name: 'Bad Blood Hard Revives',    col: 'revives_badblood_hard',   asc: false, fmt: 'wins' },
  { value: 'revives_bb_rip',   name: 'Bad Blood RIP Revives',     col: 'revives_badblood_rip',    asc: false, fmt: 'wins' },

  // ── Bad Blood times ───────────────────────────────────────────────────────
  { value: 'r10_bb_normal',    name: 'Bad Blood Normal R10',                col: 'r10_badblood_normal',     asc: true,  fmt: 'time' },
  { value: 'r20_bb_normal',    name: 'Bad Blood Normal R20',                col: 'r20_badblood_normal',     asc: true,  fmt: 'time' },
  { value: 'r30_bb_normal',    name: 'Bad Blood Normal R30 Fastest Win',    col: 'fastest_badblood_normal', asc: true,  fmt: 'time' },
  { value: 'r10_bb_hard',      name: 'Bad Blood Hard R10',                  col: 'r10_badblood_hard',       asc: true,  fmt: 'time' },
  { value: 'r20_bb_hard',      name: 'Bad Blood Hard R20',                  col: 'r20_badblood_hard',       asc: true,  fmt: 'time' },
  { value: 'r30_bb_hard',      name: 'Bad Blood Hard R30 Fastest Win',      col: 'fastest_badblood_hard',   asc: true,  fmt: 'time' },
  { value: 'r10_bb_rip',       name: 'Bad Blood RIP R10',                   col: 'r10_badblood_rip',        asc: true,  fmt: 'time' },
  { value: 'r20_bb_rip',       name: 'Bad Blood RIP R20',                   col: 'r20_badblood_rip',        asc: true,  fmt: 'time' },
  { value: 'r30_bb_rip',       name: 'Bad Blood RIP R30 Fastest Win',       col: 'fastest_badblood_rip',    asc: true,  fmt: 'time' },

  // ── Alien Arcadium wins + extended ────────────────────────────────────────
  { value: 'wins_aa',          name: 'Alien Arcadium Wins',               col: 'wins_alienarcadium',         asc: false, fmt: 'wins' },
  { value: 'kills_aa',         name: 'Alien Arcadium Kills',              col: 'kills_alienarcadium',        asc: false, fmt: 'wins' },
  { value: 'deaths_aa',        name: 'Alien Arcadium Deaths',             col: 'deaths_alienarcadium',       asc: false, fmt: 'wins' },
  { value: 'rounds_aa_total',  name: 'Alien Arcadium Rounds',             col: 'total_rounds_alienarcadium', asc: false, fmt: 'wins' },
  { value: 'doors_aa',         name: 'Alien Arcadium Doors Opened',       col: 'doors_alienarcadium',        asc: false, fmt: 'wins' },
  { value: 'windows_aa',       name: 'Alien Arcadium Windows Repaired',   col: 'windows_alienarcadium',      asc: false, fmt: 'wins' },
  { value: 'knocks_aa',        name: 'Alien Arcadium Times Knocked Down', col: 'knocks_alienarcadium',       asc: false, fmt: 'wins' },
  { value: 'revives_aa',       name: 'Alien Arcadium Players Revived',    col: 'revives_alienarcadium',      asc: false, fmt: 'wins' },

  // ── Alien Arcadium times ──────────────────────────────────────────────────
  { value: 'r10_aa',           name: 'Alien Arcadium R10',                col: 'r10_alienarcadium',          asc: true,  fmt: 'time' },
  { value: 'r20_aa',           name: 'Alien Arcadium R20',                col: 'r20_alienarcadium',          asc: true,  fmt: 'time' },
  { value: 'r30_aa',           name: 'Alien Arcadium R105 Fastest Win',   col: 'fastest_alienarcadium',      asc: true,  fmt: 'time' },

  // ── Prison wins ───────────────────────────────────────────────────────────
  { value: 'wins_pr',          name: 'Prison Wins',               col: 'wins_prison',             asc: false, fmt: 'wins' },
  { value: 'wins_pr_normal',   name: 'Prison Normal Wins',        col: 'wins_prison_normal',      asc: false, fmt: 'wins' },
  { value: 'wins_pr_hard',     name: 'Prison Hard Wins',          col: 'wins_prison_hard',        asc: false, fmt: 'wins' },
  { value: 'wins_pr_rip',      name: 'Prison RIP Wins',           col: 'wins_prison_rip',         asc: false, fmt: 'wins' },

  // ── Prison extended ───────────────────────────────────────────────────────
  { value: 'kills_pr',         name: 'Prison Kills',              col: 'kills_prison_total',      asc: false, fmt: 'wins' },
  { value: 'kills_pr_normal',  name: 'Prison Normal Kills',       col: 'kills_prison_normal',     asc: false, fmt: 'wins' },
  { value: 'kills_pr_hard',    name: 'Prison Hard Kills',         col: 'kills_prison_hard',       asc: false, fmt: 'wins' },
  { value: 'kills_pr_rip',     name: 'Prison RIP Kills',          col: 'kills_prison_rip',        asc: false, fmt: 'wins' },
  { value: 'deaths_pr',        name: 'Prison Deaths',             col: 'deaths_prison_total',     asc: false, fmt: 'wins' },
  { value: 'deaths_pr_normal', name: 'Prison Normal Deaths',      col: 'deaths_prison_normal',    asc: false, fmt: 'wins' },
  { value: 'deaths_pr_hard',   name: 'Prison Hard Deaths',        col: 'deaths_prison_hard',      asc: false, fmt: 'wins' },
  { value: 'deaths_pr_rip',    name: 'Prison RIP Deaths',         col: 'deaths_prison_rip',       asc: false, fmt: 'wins' },
  { value: 'rounds_pr',        name: 'Prison Rounds',             col: 'rounds_prison_total',     asc: false, fmt: 'wins' },
  { value: 'rounds_pr_normal', name: 'Prison Normal Rounds',      col: 'rounds_prison_normal',    asc: false, fmt: 'wins' },
  { value: 'rounds_pr_hard',   name: 'Prison Hard Rounds',        col: 'rounds_prison_hard',      asc: false, fmt: 'wins' },
  { value: 'rounds_pr_rip',    name: 'Prison RIP Rounds',         col: 'rounds_prison_rip',       asc: false, fmt: 'wins' },
  { value: 'doors_pr',         name: 'Prison Doors Opened',       col: 'doors_prison_total',      asc: false, fmt: 'wins' },
  { value: 'doors_pr_normal',  name: 'Prison Normal Doors',       col: 'doors_prison_normal',     asc: false, fmt: 'wins' },
  { value: 'doors_pr_hard',    name: 'Prison Hard Doors',         col: 'doors_prison_hard',       asc: false, fmt: 'wins' },
  { value: 'doors_pr_rip',     name: 'Prison RIP Doors',          col: 'doors_prison_rip',        asc: false, fmt: 'wins' },
  { value: 'windows_pr',       name: 'Prison Windows Repaired',   col: 'windows_prison_total',    asc: false, fmt: 'wins' },
  { value: 'windows_pr_normal',name: 'Prison Normal Windows',     col: 'windows_prison_normal',   asc: false, fmt: 'wins' },
  { value: 'windows_pr_hard',  name: 'Prison Hard Windows',       col: 'windows_prison_hard',     asc: false, fmt: 'wins' },
  { value: 'windows_pr_rip',   name: 'Prison RIP Windows',        col: 'windows_prison_rip',      asc: false, fmt: 'wins' },
  { value: 'knocks_pr',        name: 'Prison Times Knocked Down', col: 'knocks_prison_total',     asc: false, fmt: 'wins' },
  { value: 'knocks_pr_normal', name: 'Prison Normal Knocks',      col: 'knocks_prison_normal',    asc: false, fmt: 'wins' },
  { value: 'knocks_pr_hard',   name: 'Prison Hard Knocks',        col: 'knocks_prison_hard',      asc: false, fmt: 'wins' },
  { value: 'knocks_pr_rip',    name: 'Prison RIP Knocks',         col: 'knocks_prison_rip',       asc: false, fmt: 'wins' },
  { value: 'revives_pr',       name: 'Prison Players Revived',    col: 'revives_prison_total',    asc: false, fmt: 'wins' },
  { value: 'revives_pr_normal',name: 'Prison Normal Revives',     col: 'revives_prison_normal',   asc: false, fmt: 'wins' },
  { value: 'revives_pr_hard',  name: 'Prison Hard Revives',       col: 'revives_prison_hard',     asc: false, fmt: 'wins' },
  { value: 'revives_pr_rip',   name: 'Prison RIP Revives',        col: 'revives_prison_rip',      asc: false, fmt: 'wins' },

  // ── Prison times ──────────────────────────────────────────────────────────
  { value: 'r10_pr_normal',    name: 'Prison Normal R10',                   col: 'r10_prison_normal',       asc: true,  fmt: 'time' },
  { value: 'r20_pr_normal',    name: 'Prison Normal R20',                   col: 'r20_prison_normal',       asc: true,  fmt: 'time' },
  { value: 'r30_pr_normal',    name: 'Prison Normal R30 Fastest Win',       col: 'fastest_prison_normal',   asc: true,  fmt: 'time' },
  { value: 'r10_pr_hard',      name: 'Prison Hard R10',                     col: 'r10_prison_hard',         asc: true,  fmt: 'time' },
  { value: 'r20_pr_hard',      name: 'Prison Hard R20',                     col: 'r20_prison_hard',         asc: true,  fmt: 'time' },
  { value: 'r30_pr_hard',      name: 'Prison Hard R30 Fastest Win',         col: 'fastest_prison_hard',     asc: true,  fmt: 'time' },
  { value: 'r10_pr_rip',       name: 'Prison RIP R10',                      col: 'r10_prison_rip',          asc: true,  fmt: 'time' },
  { value: 'r20_pr_rip',       name: 'Prison RIP R20',                      col: 'r20_prison_rip',          asc: true,  fmt: 'time' },
  { value: 'r30_pr_rip',       name: 'Prison RIP R30 Fastest Win',          col: 'fastest_prison_rip',      asc: true,  fmt: 'time' },

  // ── Mob kill leaderboards ─────────────────────────────────────────────────
  // API key format inside raw_json: [mobname]_zombie_kills_zombies
  { value: 'mob_basic',            name: 'Basic Zombie Kills',           jsonKey: 'basic_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_blaze',            name: 'Blaze Zombie Kills',           jsonKey: 'blaze_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_blob',             name: 'Slime Kills',                  jsonKey: 'blob_zombie_kills_zombies',                asc: false, fmt: 'wins' },
  { value: 'mob_bomb',             name: 'Bomb Zombie Kills',            jsonKey: 'bomb_zombie_kills_zombies',                asc: false, fmt: 'wins' },
  { value: 'mob_broodmother',      name: 'Broodmother Kills',            jsonKey: 'broodmother_zombie_kills_zombies',         asc: false, fmt: 'wins' },
  { value: 'mob_basketball',       name: 'Basketball Zombie Kills',      jsonKey: 'basketball_zombie_zombie_kills_zombies',   asc: false, fmt: 'wins' },
  { value: 'mob_cave_spider',      name: 'Cave Spider Zombie Kills',     jsonKey: 'cave_spider_zombie_kills_zombies',         asc: false, fmt: 'wins' },
  { value: 'mob_charged_creeper',  name: 'Charged Creeper Kills',        jsonKey: 'charged_creeper_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_chgluglu',         name: 'Chgluglu Kills',               jsonKey: 'chgluglu_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_clown',            name: 'Clown Kills',                  jsonKey: 'clown_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_creeper',          name: 'Creeper Kills',                jsonKey: 'creeper_zombie_kills_zombies',             asc: false, fmt: 'wins' },
  { value: 'mob_drowned',          name: 'Drowned Kills',                jsonKey: 'drowned_zombie_kills_zombies',             asc: false, fmt: 'wins' },
  { value: 'mob_empowered',        name: 'Empowered Zombie Kills',       jsonKey: 'empowered_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_ender',            name: 'Ender Zombie Kills',           jsonKey: 'ender_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_endermite',        name: 'Endermite Kills',              jsonKey: 'endermite_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_family_father',    name: 'Father Zombie Kills',          jsonKey: 'family_father_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_family_twin_blue', name: 'Blue Twin Zombie Kills',       jsonKey: 'family_twin_blue_zombie_kills_zombies',    asc: false, fmt: 'wins' },
  { value: 'mob_family_twin_red',  name: 'Red Twin Zombie Kills',        jsonKey: 'family_twin_red_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_fire',             name: 'Fire Zombie Kills',            jsonKey: 'fire_zombie_kills_zombies',                asc: false, fmt: 'wins' },
  { value: 'mob_frost',            name: 'Frost Zombie Kills',           jsonKey: 'frost_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_ghast',            name: 'Ghast Kills',                  jsonKey: 'ghast_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_giant',            name: 'Giant Zombie Kills',           jsonKey: 'giant_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_guard',            name: 'Guard Zombie Kills',           jsonKey: 'guard_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_guardian',         name: 'Guardian Kills',               jsonKey: 'guardian_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_headless_pigman',  name: 'Headless Pigman Kills',        jsonKey: 'headless_pigman_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_herobrine_minion', name: 'Herobrine Minion Kills',       jsonKey: 'herobrine_minion_zombie_kills_zombies',    asc: false, fmt: 'wins' },
  { value: 'mob_human',            name: 'Human Zombie Kills',           jsonKey: 'human_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_inferno_pigman',   name: 'Inferno Pigman Kills',         jsonKey: 'inferno_pigman_zombie_kills_zombies',      asc: false, fmt: 'wins' },
  { value: 'mob_inferno',          name: 'Inferno Zombie Kills',         jsonKey: 'inferno_zombie_kills_zombies',             asc: false, fmt: 'wins' },
  { value: 'mob_invisible',        name: 'Invisible Zombie Kills',       jsonKey: 'invisible_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_iron_golem',       name: 'Iron Golem Kills',             jsonKey: 'iron_golem_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_king_drowned',     name: 'King Drowned Kills',           jsonKey: 'king_drowned_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_knight_drowned',   name: 'Knight Drowned Kills',         jsonKey: 'knight_drowned_zombie_kills_zombies',      asc: false, fmt: 'wins' },
  { value: 'mob_magma_cube',       name: 'Magma Cube Kills',             jsonKey: 'magma_cube_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_magma',            name: 'Magma Zombie Kills',           jsonKey: 'magma_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_mcdonalds_pigman', name: "McDonald's Pigman Kills",      jsonKey: 'mcdonalds_pigman_zombie_kills_zombies',    asc: false, fmt: 'wins' },
  { value: 'mob_mcdonalds_zombie', name: "McDonald's Zombie Kills",      jsonKey: 'mcdonalds_zombie_zombie_kills_zombies',    asc: false, fmt: 'wins' },
  { value: 'mob_murder_pigman',    name: 'Murder Pigman Kills',          jsonKey: 'murder_pigman_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_murder_zombie',    name: 'Murder Zombie Kills',          jsonKey: 'murder_zombie_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_nurse',            name: 'Nurse Zombie Kills',           jsonKey: 'nurse_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_pig_zombie',       name: 'Pigman Kills',                 jsonKey: 'pig_zombie_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_prisoner_pigman',  name: 'Prisoner Pigman Kills',        jsonKeys: ['prisoner_pigman_zombie_kills_zombies', 'prisoner_pigman_2_zombie_kills_zombies'],           asc: false, fmt: 'wins' },
  { value: 'mob_prisoner_pg_cell', name: 'Prisoner Pigman Cell Kills',   jsonKeys: ['prisoner_pigman_cell_zombie_kills_zombies', 'prisoner_pigman_2_cell_zombie_kills_zombies'], asc: false, fmt: 'wins' },
  { value: 'mob_prisoner_skel',    name: 'Prisoner Skeleton Kills',      jsonKey: 'prisoner_skeleton_zombie_kills_zombies',   asc: false, fmt: 'wins' },
  { value: 'mob_prisoner_angry',   name: 'Angry Prisoner Kills',         jsonKey: 'prisoner_zombie_angry_zombie_kills_zombies',asc:false, fmt: 'wins' },
  { value: 'mob_prisoner_angry2',  name: 'Angry Prisoner 2 Kills',       jsonKey: 'prisoner_zombie_angry_2_zombie_kills_zombies',asc:false,fmt: 'wins' },
  { value: 'mob_prisoner_angry3',  name: 'Angry Prisoner 3 Kills',       jsonKey: 'prisoner_zombie_angry_3_zombie_kills_zombies',asc:false,fmt: 'wins' },
  { value: 'mob_prisoner_cell',    name: 'Prisoner Cell Zombie Kills',   jsonKey: 'prisoner_zombie_cell_zombie_kills_zombies', asc: false, fmt: 'wins' },
  { value: 'mob_prisoner_zombie',  name: 'Prisoner Zombie Kills',        jsonKey: 'prisoner_zombie_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_rainbow',          name: 'Rainbow Zombie Kills',         jsonKey: 'rainbow_zombie_kills_zombies',             asc: false, fmt: 'wins' },
  { value: 'mob_scuba',            name: 'Scuba Zombie Kills',           jsonKey: 'scuba_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_sentinel',         name: 'Sentinel Kills',               jsonKey: 'sentinel_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_shady_skeleton',   name: 'Shady Skeleton Kills',         jsonKey: 'shady_skeleton_zombie_kills_zombies',      asc: false, fmt: 'wins' },
  { value: 'mob_silverfish',       name: 'Silverfish Kills',             jsonKey: 'silverfish_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_skelefish',        name: 'Skelefish Kills',              jsonKey: 'skelefish_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_skeleton',         name: 'Skeleton Kills',               jsonKey: 'skeleton_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_slime',            name: 'Slime Kills',                  jsonKey: 'slime_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_slime_zombie',     name: 'Slime Zombie Kills',           jsonKey: 'slime_zombie_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_space_blaster',    name: 'Space Blaster Kills',          jsonKey: 'space_blaster_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_space_grunt',      name: 'Space Grunt Kills',            jsonKey: 'space_grunt_zombie_kills_zombies',         asc: false, fmt: 'wins' },
  { value: 'mob_tank_drowned',     name: 'Tank Drowned Kills',           jsonKey: 'tank_drowned_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_tank',             name: 'Tank Zombie Kills',            jsonKey: 'tank_zombie_zombie_kills_zombies',         asc: false, fmt: 'wins' },
  { value: 'mob_tnt_baby',         name: 'Baby Bombie Kills',            jsonKey: 'tnt_baby_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_tnt',              name: 'Bombie Boss Kills',            jsonKey: 'tnt_zombie_kills_zombies',                 asc: false, fmt: 'wins' },
  { value: 'mob_werewolf',         name: 'Werewolf Kills',               jsonKey: 'werewolf_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_witch',            name: 'Witch Kills',                  jsonKey: 'witch_zombie_kills_zombies',               asc: false, fmt: 'wins' },
  { value: 'mob_wither_skeleton',  name: 'Wither Skeleton Kills',        jsonKey: 'wither_skeleton_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_wither_zombie',    name: 'Wither Zombie Kills',          jsonKey: 'wither_zombie_kills_zombies',              asc: false, fmt: 'wins' },
  { value: 'mob_wither_zombie2',   name: 'Wither Zombie Variant Kills',  jsonKey: 'wither_zombie_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_wolf_drowned',     name: 'Wolf Drowned Kills',           jsonKey: 'wolf_drowned_zombie_kills_zombies',        asc: false, fmt: 'wins' },
  { value: 'mob_wolf_pet',         name: 'Pet Wolf Kills',               jsonKey: 'wolf_pet_zombie_kills_zombies',            asc: false, fmt: 'wins' },
  { value: 'mob_wolf',             name: 'Wolf Kills',                   jsonKey: 'wolf_zombie_kills_zombies',                asc: false, fmt: 'wins' },
  { value: 'mob_worm_small',       name: 'Small Worm Kills',             jsonKey: 'worm_small_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_worm',             name: 'Worm Kills',                   jsonKey: 'worm_zombie_kills_zombies',                asc: false, fmt: 'wins' },
  { value: 'mob_family_daughter',  name: 'Daughter Zombie Kills',        jsonKey: 'family_daughter_zombie_kills_zombies',     asc: false, fmt: 'wins' },
  { value: 'mob_family_mother',    name: 'Mother Zombie Kills',          jsonKey: 'family_mother_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_da_bomb',          name: 'Da Bomb Kills',                jsonKey: 'da_bomb_zombie_kills_zombies',             asc: false, fmt: 'wins' },
  { value: 'mob_fire_lord',        name: 'Fire Lord Kills',              jsonKey: 'fire_lord_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_giant_rainbow',    name: 'Giant Rainbow Zombie Kills',   jsonKey: 'giant_rainbow_zombie_kills_zombies',       asc: false, fmt: 'wins' },
  { value: 'mob_mega_blob',        name: 'Mega Blob Kills',              jsonKey: 'mega_blob_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_mega_magma',       name: 'Mega Magma Kills',             jsonKey: 'mega_magma_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_molten',           name: 'Molten Zombie Kills',          jsonKey: 'molten_zombie_kills_zombies',              asc: false, fmt: 'wins' },
  { value: 'mob_the_old_one',      name: 'The Old One Kills',            jsonKey: 'the_old_one_zombie_kills_zombies',         asc: false, fmt: 'wins' },

  // ── Boss kills (distinct from same-named minions above) ───────────────────
  { value: 'mob_herobrine',        name: 'Herobrine Boss Kills',         jsonKey: 'herobrine_zombie_kills_zombies',           asc: false, fmt: 'wins' },
  { value: 'mob_king_slime',       name: 'Slime King Boss Kills',        jsonKey: 'king_slime_zombie_kills_zombies',          asc: false, fmt: 'wins' },
  { value: 'mob_corrupted_pigman', name: 'Corrupted Pigman Boss Kills',  jsonKey: 'corrupted_pigman_zombie_kills_zombies',    asc: false, fmt: 'wins' },
  { value: 'mob_world_ender',      name: 'World Ender Boss Kills',       jsonKey: 'world_ender_zombie_kills_zombies',         asc: false, fmt: 'wins' },
  { value: 'mob_the_warden',       name: 'The Warden Boss Kills',        jsonKey: 'the_warden_zombie_kills_zombies',          asc: false, fmt: 'wins' },
];

const INDEX = new Map(LEADERBOARDS.map(lb => [lb.value, lb]));

function getLb(value) {
  return INDEX.get(value) ?? null;
}

// jsonKey / jsonKeys → flat list of raw_json keys for this leaderboard.
function lbJsonKeys(lb) {
  if (lb.jsonKeys) return lb.jsonKeys;
  if (lb.jsonKey)  return [lb.jsonKey];
  return [];
}

// Sum a leaderboard's raw_json keys for one player. Returns 0 if none present.
function readKills(lb, rawJson) {
  let sum = 0;
  for (const k of lbJsonKeys(lb)) sum += rawJson[k] ?? 0;
  return sum;
}

module.exports = { LEADERBOARDS, getLb, lbJsonKeys, readKills };
