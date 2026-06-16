// Per-map render configs, shared by the slash commands (deadend.js etc.) and
// the card view dispatcher (views.js) that powers the nav buttons.
//
//   name        — display name
//   color       — accent color
//   hasDiffs    — true = Normal/Hard/RIP columns, false = single panel (AA)
//   bg          — background image basename (assets/bg/<bg>.png)
//   rankedStats — { statProperty: leaderboardValue } for top-10 rank lookup
//   k           — { rendererKey: statProperty } the renderer reads

const deadend = {
  name: 'Dead End', color: '#532173', hasDiffs: true, bg: 'deadend',
  rankedStats: {
    wins_deadend: 'wins_de', kills_deadend_total: 'kills_de', deaths_deadend_total: 'deaths_de', rounds_deadend_total: 'rounds_de',
    r10_deadend_normal: 'r10_de_normal', r20_deadend_normal: 'r20_de_normal', fastest_deadend_normal: 'r30_de_normal',
    r10_deadend_hard: 'r10_de_hard', r20_deadend_hard: 'r20_de_hard', fastest_deadend_hard: 'r30_de_hard',
    r10_deadend_rip: 'r10_de_rip', r20_deadend_rip: 'r20_de_rip', fastest_deadend_rip: 'r30_de_rip',
    kills_deadend_normal: 'kills_de_normal', kills_deadend_hard: 'kills_de_hard', kills_deadend_rip: 'kills_de_rip',
    deaths_deadend_normal: 'deaths_de_normal', deaths_deadend_hard: 'deaths_de_hard', deaths_deadend_rip: 'deaths_de_rip',
    doors_deadend_normal: 'doors_de_normal', windows_deadend_normal: 'windows_de_normal', knocks_deadend_normal: 'knocks_de_normal', revives_deadend_normal: 'revives_de_normal',
    doors_deadend_hard: 'doors_de_hard', windows_deadend_hard: 'windows_de_hard', knocks_deadend_hard: 'knocks_de_hard', revives_deadend_hard: 'revives_de_hard',
    doors_deadend_rip: 'doors_de_rip', windows_deadend_rip: 'windows_de_rip', knocks_deadend_rip: 'knocks_de_rip', revives_deadend_rip: 'revives_de_rip',
  },
  k: {
    wins: 'wins_deadend', kills: 'kills_deadend_total', deaths: 'deaths_deadend_total', rounds: 'rounds_deadend_total',
    r10_normal: 'r10_deadend_normal', r20_normal: 'r20_deadend_normal', r30_normal: 'fastest_deadend_normal',
    r10_hard: 'r10_deadend_hard', r20_hard: 'r20_deadend_hard', r30_hard: 'fastest_deadend_hard',
    r10_rip: 'r10_deadend_rip', r20_rip: 'r20_deadend_rip', r30_rip: 'fastest_deadend_rip',
    kills_normal: 'kills_deadend_normal', kills_hard: 'kills_deadend_hard', kills_rip: 'kills_deadend_rip',
    deaths_normal: 'deaths_deadend_normal', deaths_hard: 'deaths_deadend_hard', deaths_rip: 'deaths_deadend_rip',
    doors_normal: 'doors_deadend_normal', windows_normal: 'windows_deadend_normal', knocks_normal: 'knocks_deadend_normal', revives_normal: 'revives_deadend_normal',
    doors_hard: 'doors_deadend_hard', windows_hard: 'windows_deadend_hard', knocks_hard: 'knocks_deadend_hard', revives_hard: 'revives_deadend_hard',
    doors_rip: 'doors_deadend_rip', windows_rip: 'windows_deadend_rip', knocks_rip: 'knocks_deadend_rip', revives_rip: 'revives_deadend_rip',
  },
};

const badblood = {
  name: 'Bad Blood', color: '#9C1324', hasDiffs: true, bg: 'badblood',
  rankedStats: {
    wins_badblood: 'wins_bb', kills_badblood_total: 'kills_bb', deaths_badblood_total: 'deaths_bb', rounds_badblood_total: 'rounds_bb',
    r10_badblood_normal: 'r10_bb_normal', r20_badblood_normal: 'r20_bb_normal', fastest_badblood_normal: 'r30_bb_normal',
    r10_badblood_hard: 'r10_bb_hard', r20_badblood_hard: 'r20_bb_hard', fastest_badblood_hard: 'r30_bb_hard',
    r10_badblood_rip: 'r10_bb_rip', r20_badblood_rip: 'r20_bb_rip', fastest_badblood_rip: 'r30_bb_rip',
    kills_badblood_normal: 'kills_bb_normal', kills_badblood_hard: 'kills_bb_hard', kills_badblood_rip: 'kills_bb_rip',
    deaths_badblood_normal: 'deaths_bb_normal', deaths_badblood_hard: 'deaths_bb_hard', deaths_badblood_rip: 'deaths_bb_rip',
    doors_badblood_normal: 'doors_bb_normal', windows_badblood_normal: 'windows_bb_normal', knocks_badblood_normal: 'knocks_bb_normal', revives_badblood_normal: 'revives_bb_normal',
    doors_badblood_hard: 'doors_bb_hard', windows_badblood_hard: 'windows_bb_hard', knocks_badblood_hard: 'knocks_bb_hard', revives_badblood_hard: 'revives_bb_hard',
    doors_badblood_rip: 'doors_bb_rip', windows_badblood_rip: 'windows_bb_rip', knocks_badblood_rip: 'knocks_bb_rip', revives_badblood_rip: 'revives_bb_rip',
  },
  k: {
    wins: 'wins_badblood', kills: 'kills_badblood_total', deaths: 'deaths_badblood_total', rounds: 'rounds_badblood_total',
    r10_normal: 'r10_badblood_normal', r20_normal: 'r20_badblood_normal', r30_normal: 'fastest_badblood_normal',
    r10_hard: 'r10_badblood_hard', r20_hard: 'r20_badblood_hard', r30_hard: 'fastest_badblood_hard',
    r10_rip: 'r10_badblood_rip', r20_rip: 'r20_badblood_rip', r30_rip: 'fastest_badblood_rip',
    kills_normal: 'kills_badblood_normal', kills_hard: 'kills_badblood_hard', kills_rip: 'kills_badblood_rip',
    deaths_normal: 'deaths_badblood_normal', deaths_hard: 'deaths_badblood_hard', deaths_rip: 'deaths_badblood_rip',
    doors_normal: 'doors_badblood_normal', windows_normal: 'windows_badblood_normal', knocks_normal: 'knocks_badblood_normal', revives_normal: 'revives_badblood_normal',
    doors_hard: 'doors_badblood_hard', windows_hard: 'windows_badblood_hard', knocks_hard: 'knocks_badblood_hard', revives_hard: 'revives_badblood_hard',
    doors_rip: 'doors_badblood_rip', windows_rip: 'windows_badblood_rip', knocks_rip: 'knocks_badblood_rip', revives_rip: 'revives_badblood_rip',
  },
};

const alienarcadium = {
  name: 'Alien Arcadium', color: '#4E9432', hasDiffs: false, bg: 'alienarcadium',
  rankedStats: {
    wins_alienarcadium: 'wins_aa', kills_alienarcadium: 'kills_aa', deaths_alienarcadium: 'deaths_aa', total_rounds_alienarcadium: 'rounds_aa_total',
    r10_alienarcadium: 'r10_aa', r20_alienarcadium: 'r20_aa', fastest_alienarcadium: 'r30_aa',
    doors_alienarcadium: 'doors_aa', windows_alienarcadium: 'windows_aa', knocks_alienarcadium: 'knocks_aa', revives_alienarcadium: 'revives_aa',
  },
  k: {
    wins: 'wins_alienarcadium', kills: 'kills_alienarcadium', deaths: 'deaths_alienarcadium', rounds: 'total_rounds_alienarcadium',
    r10: 'r10_alienarcadium', r20: 'r20_alienarcadium', r30: 'fastest_alienarcadium',
    doors: 'doors_alienarcadium', windows: 'windows_alienarcadium', knocks: 'knocks_alienarcadium', revives: 'revives_alienarcadium',
  },
};

const prison = {
  name: 'Prison', color: '#5A6159', hasDiffs: true, bg: 'prison',
  rankedStats: {
    wins_prison: 'wins_pr', kills_prison_total: 'kills_pr', deaths_prison_total: 'deaths_pr', rounds_prison_total: 'rounds_pr',
    r10_prison_normal: 'r10_pr_normal', r20_prison_normal: 'r20_pr_normal', fastest_prison_normal: 'r30_pr_normal',
    r10_prison_hard: 'r10_pr_hard', r20_prison_hard: 'r20_pr_hard', fastest_prison_hard: 'r30_pr_hard',
    r10_prison_rip: 'r10_pr_rip', r20_prison_rip: 'r20_pr_rip', fastest_prison_rip: 'r30_pr_rip',
    kills_prison_normal: 'kills_pr_normal', kills_prison_hard: 'kills_pr_hard', kills_prison_rip: 'kills_pr_rip',
    deaths_prison_normal: 'deaths_pr_normal', deaths_prison_hard: 'deaths_pr_hard', deaths_prison_rip: 'deaths_pr_rip',
    doors_prison_normal: 'doors_pr_normal', windows_prison_normal: 'windows_pr_normal', knocks_prison_normal: 'knocks_pr_normal', revives_prison_normal: 'revives_pr_normal',
    doors_prison_hard: 'doors_pr_hard', windows_prison_hard: 'windows_pr_hard', knocks_prison_hard: 'knocks_pr_hard', revives_prison_hard: 'revives_pr_hard',
    doors_prison_rip: 'doors_pr_rip', windows_prison_rip: 'windows_pr_rip', knocks_prison_rip: 'knocks_pr_rip', revives_prison_rip: 'revives_pr_rip',
  },
  k: {
    wins: 'wins_prison', kills: 'kills_prison_total', deaths: 'deaths_prison_total', rounds: 'rounds_prison_total',
    r10_normal: 'r10_prison_normal', r20_normal: 'r20_prison_normal', r30_normal: 'fastest_prison_normal',
    r10_hard: 'r10_prison_hard', r20_hard: 'r20_prison_hard', r30_hard: 'fastest_prison_hard',
    r10_rip: 'r10_prison_rip', r20_rip: 'r20_prison_rip', r30_rip: 'fastest_prison_rip',
    kills_normal: 'kills_prison_normal', kills_hard: 'kills_prison_hard', kills_rip: 'kills_prison_rip',
    deaths_normal: 'deaths_prison_normal', deaths_hard: 'deaths_prison_hard', deaths_rip: 'deaths_prison_rip',
    doors_normal: 'doors_prison_normal', windows_normal: 'windows_prison_normal', knocks_normal: 'knocks_prison_normal', revives_normal: 'revives_prison_normal',
    doors_hard: 'doors_prison_hard', windows_hard: 'windows_prison_hard', knocks_hard: 'knocks_prison_hard', revives_hard: 'revives_prison_hard',
    doors_rip: 'doors_prison_rip', windows_rip: 'windows_prison_rip', knocks_rip: 'knocks_prison_rip', revives_rip: 'revives_prison_rip',
  },
};

module.exports = { deadend, badblood, alienarcadium, prison };
