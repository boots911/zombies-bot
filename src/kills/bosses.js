// Zombies bosses, in canonical display order.
// jsonKey — key inside raw_json (the stored arcade stats blob).
// Confirmed against player data: "Bombie" is the tnt_zombie key, and the
// "Angry Prisoner" boss is the base prisoner_zombie_angry key.

const BOSSES = [
  { name: 'Bombie',           jsonKey: 'tnt_zombie_kills_zombies' },
  { name: 'Inferno',          jsonKey: 'inferno_zombie_kills_zombies' },
  { name: 'Broodmother',      jsonKey: 'broodmother_zombie_kills_zombies' },
  { name: 'Slime King',       jsonKey: 'king_slime_zombie_kills_zombies' },
  { name: 'Wither',           jsonKey: 'wither_zombie_kills_zombies' },
  { name: 'Herobrine',        jsonKey: 'herobrine_zombie_kills_zombies' },
  { name: 'World Ender',      jsonKey: 'world_ender_zombie_kills_zombies' },
  { name: 'Angry Prisoner',   jsonKey: 'prisoner_zombie_angry_zombie_kills_zombies' },
  { name: 'Corrupted Pigman', jsonKey: 'corrupted_pigman_zombie_kills_zombies' },
  { name: 'The Warden',       jsonKey: 'the_warden_zombie_kills_zombies' },

  // Bad Blood "family" mini-bosses + pet (API names don't match in-game names).
  { name: 'Clarence',         jsonKey: 'family_father_zombie_kills_zombies' },     // father
  { name: 'Gertrude',         jsonKey: 'family_mother_zombie_kills_zombies' },     // mother
  { name: 'Ellie',            jsonKey: 'wolf_pet_zombie_kills_zombies' },          // pet dog
  { name: 'Lily',             jsonKey: 'family_daughter_zombie_kills_zombies' },   // daughter
  { name: 'Adam',             jsonKey: 'family_twin_blue_zombie_kills_zombies' },  // blue twin
  { name: 'Steve',            jsonKey: 'family_twin_red_zombie_kills_zombies' },   // red twin
];

module.exports = { BOSSES };
