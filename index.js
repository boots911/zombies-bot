require('dotenv').config();
const { Client, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
const statsCommand          = require('./src/commands/stats');
const leaderboardCommand    = require('./src/commands/leaderboard');
const deadendCommand        = require('./src/commands/deadend');
const badbloodCommand       = require('./src/commands/badblood');
const alienarcadiumCommand  = require('./src/commands/alienarcadium');
const prisonCommand         = require('./src/commands/prison');
const rankingsCommand       = require('./src/commands/rankings');
const killsCommand          = require('./src/commands/kills');
const bosskillsCommand      = require('./src/commands/bosskills');
const diceCommand           = require('./src/commands/dice');
const cardViews             = require('./src/cards/views');

// allowedMentions parse:[] => the bot never pings anyone, even if a username
// like "@everyone" gets echoed back in an error message.
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: [] },
});

// Keep the process alive if something throws outside a handler.
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));
process.on('uncaughtException',  err => console.error('Uncaught exception:', err));

// Light per-user cooldown on slash commands (they hit Mojang/Hypixel + render
// an image). Button clicks are exempt — they re-render from the DB cache.
const COOLDOWN_MS = 2500;
const lastUsed = new Map();

client.commands = new Collection();
client.commands.set(statsCommand.data.name,          statsCommand);
client.commands.set(leaderboardCommand.data.name,    leaderboardCommand);
client.commands.set(deadendCommand.data.name,        deadendCommand);
client.commands.set(badbloodCommand.data.name,       badbloodCommand);
client.commands.set(alienarcadiumCommand.data.name,  alienarcadiumCommand);
client.commands.set(prisonCommand.data.name,         prisonCommand);
client.commands.set(rankingsCommand.data.name,       rankingsCommand);
client.commands.set(killsCommand.data.name,          killsCommand);
client.commands.set(bosskillsCommand.data.name,      bosskillsCommand);
client.commands.set(diceCommand.data.name,           diceCommand);

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) await command.autocomplete(interaction);
      return;
    }

    if (interaction.isButton() && interaction.customId.startsWith('lb:')) {
      await leaderboardCommand.handleButton(interaction);
      return;
    }

    if (interaction.isButton() && (interaction.customId.startsWith('pv:') || interaction.customId.startsWith('pp:'))) {
      await cardViews.handleProfile(interaction);
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const now  = Date.now();
    const last = lastUsed.get(interaction.user.id) ?? 0;
    if (now - last < COOLDOWN_MS) {
      return interaction.reply({ content: 'Slow down a moment, then try again.', flags: MessageFlags.Ephemeral });
    }
    lastUsed.set(interaction.user.id, now);

    await command.execute(interaction);

  } catch (err) {
    console.error(`Error handling interaction:`, err);
    const msg = { content: 'Something went wrong. Try again later.', flags: MessageFlags.Ephemeral };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(msg).catch(() => {});
    } else if (!interaction.isAutocomplete()) {
      await interaction.reply(msg).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
