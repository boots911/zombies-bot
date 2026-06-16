require('dotenv').config();
const { REST, Routes } = require('discord.js');
const statsCommand         = require('./src/commands/stats');
const leaderboardCommand   = require('./src/commands/leaderboard');
const deadendCommand       = require('./src/commands/deadend');
const badbloodCommand      = require('./src/commands/badblood');
const alienarcadiumCommand = require('./src/commands/alienarcadium');
const prisonCommand        = require('./src/commands/prison');
const rankingsCommand      = require('./src/commands/rankings');
const killsCommand         = require('./src/commands/kills');
const bosskillsCommand     = require('./src/commands/bosskills');
const diceCommand          = require('./src/commands/dice');

const commands = [
  statsCommand.data.toJSON(),
  leaderboardCommand.data.toJSON(),
  deadendCommand.data.toJSON(),
  badbloodCommand.data.toJSON(),
  alienarcadiumCommand.data.toJSON(),
  prisonCommand.data.toJSON(),
  rankingsCommand.data.toJSON(),
  killsCommand.data.toJSON(),
  bosskillsCommand.data.toJSON(),
  diceCommand.data.toJSON(),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const global = process.argv.includes('--global');

(async () => {
  try {
    if (global) {
      console.log('Registering commands globally (takes up to 1 hour to propagate)...');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('Done. Commands will work everywhere once Discord propagates them.');
    } else {
      console.log('Registering commands to test guild (instant)...');
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('Done. Commands are live in your test server.');
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();
