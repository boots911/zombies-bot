const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
} = require('discord.js');
const { usernameToUuid }  = require('../util/mojang');
const { fetchPlayer }     = require('../hypixel/client');
const { transformPlayer } = require('../hypixel/transform');
const { upsertPlayer, getByUuid } = require('../db/players');
const { sendProfile }     = require('../cards/views');

const CACHE_TTL = 5 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kills')
    .setDescription('Show a player\'s mob kills, ranked highest to lowest')
    .addStringOption(opt =>
      opt
        .setName('username')
        .setDescription('Minecraft username')
        .setRequired(true)
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),

  async execute(interaction) {
    await interaction.deferReply();

    const username = interaction.options.getString('username').trim();

    let resolved;
    try {
      resolved = await usernameToUuid(username);
    } catch (err) {
      console.error('Mojang API error:', err);
      return interaction.editReply('Could not reach Mojang API. Try again in a moment.');
    }

    if (!resolved) {
      return interaction.editReply(`Player **${username}** doesn't exist.`);
    }

    const { uuid, username: canonicalName } = resolved;
    const cached = getByUuid(uuid);
    const now    = Date.now();
    let stats;

    if (cached && now - cached.last_updated < CACHE_TTL) {
      stats = cached;
    } else {
      try {
        const player = await fetchPlayer(uuid);
        if (!player) {
          return interaction.editReply(`**${canonicalName}** has no Hypixel profile.`);
        }
        stats = transformPlayer(player);
        upsertPlayer(stats);
      } catch (err) {
        console.error('Hypixel API error:', err.message);
        if (cached) {
          stats = cached;
        } else {
          return interaction.editReply(
            `Could not fetch stats for **${canonicalName}** — Hypixel API is unavailable and there's no cached data. Try again later.`
          );
        }
      }
    }

    await sendProfile(interaction, 'kills', stats);
  },
};
