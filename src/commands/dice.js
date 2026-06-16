const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a number between 1 and 100')
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
    const roll = Math.floor(Math.random() * 100) + 1;
    await interaction.reply(`${interaction.user} rolled a **${roll}**! 🎲`);
  },
};
