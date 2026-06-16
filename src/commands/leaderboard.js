const {
  SlashCommandBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
} = require('discord.js');
const { getLeaderboardPage, getLeaderboardCount } = require('../db/players');
const { LEADERBOARDS, getLb } = require('../leaderboards/config');
const { renderListCard } = require('../image/listCard');
const { sendInteractive, accessDenied } = require('../cards/views');

const PAGE_SIZE = 15;
const CAP       = 500;   // only show the top 500 of any leaderboard

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtSecs(s) {
  if (s >= 3600) {
    const h  = Math.floor(s / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }
  const m  = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function fmtValue(value, fmt) {
  return fmt === 'time' ? fmtSecs(value) : value.toLocaleString('en-US');
}

async function buildPage(lb, statValue, page, invokerId) {
  const realTotal  = getLeaderboardCount(lb);
  const total      = Math.min(realTotal, CAP);            // capped at top 500
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  page = Math.min(Math.max(page, 0), totalPages - 1);     // clamp stray pages

  const offset = page * PAGE_SIZE;
  const limit  = Math.min(PAGE_SIZE, CAP - offset);       // never fetch past 500
  const dbRows = limit > 0 ? getLeaderboardPage(lb, offset, limit) : [];

  const rows = dbRows.map(r => ({
    rank:  r.rank,
    name:  r.username,
    value: fmtValue(r.value, lb.fmt),
  }));

  const footer = realTotal > CAP
    ? `Page ${page + 1}/${totalPages} • Top ${CAP} of ${realTotal.toLocaleString('en-US')}`
    : `Page ${page + 1}/${totalPages} • ${total} entries`;

  const buffer = await renderListCard({
    title:    lb.name,
    subtitle: 'Leaderboard',
    rows,
    footer,
    accent:   '#4ade80',
    bgName:   'leaderboard',
    emptyText: 'No data yet — players appear after their first /stats lookup.',
  });

  const attachment = new AttachmentBuilder(buffer, { name: 'leaderboard.png' });

  // customId: "lb:<statValue>:<page>:<invokerId>:<ts>"  (statValue has no colons)
  const lock = `${invokerId}:${Date.now().toString(36)}`;
  const prev = new ButtonBuilder()
    .setCustomId(`lb:${statValue}:${page - 1}:${lock}`)
    .setLabel('◀')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page <= 0);

  const next = new ButtonBuilder()
    .setCustomId(`lb:${statValue}:${page + 1}:${lock}`)
    .setLabel('▶')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page >= totalPages - 1);

  const row = new ActionRowBuilder().addComponents(prev, next);

  return { files: [attachment], components: [row] };
}

// ── Command ───────────────────────────────────────────────────────────────────

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View a Hypixel Zombies leaderboard')
    .addStringOption(opt =>
      opt
        .setName('stat')
        .setDescription('Which stat to rank — type to search (e.g. "dead end r30")')
        .setRequired(true)
        .setAutocomplete(true)
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

  async autocomplete(interaction) {
    const focused  = interaction.options.getFocused().toLowerCase();
    const filtered = LEADERBOARDS
      .filter(lb => lb.name.toLowerCase().includes(focused))
      .slice(0, 25)
      .map(lb => ({ name: lb.name, value: lb.value }));
    await interaction.respond(filtered);
  },

  async execute(interaction) {
    const statValue = interaction.options.getString('stat');
    const lb = getLb(statValue);

    if (!lb) {
      return interaction.reply({
        content: 'Unknown stat. Please choose from the autocomplete suggestions.',
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply();
    await sendInteractive(interaction, await buildPage(lb, statValue, 0, interaction.user.id));
  },

  async handleButton(interaction) {
    // customId format: "lb:<statValue>:<page>:<invokerId>:<ts>"
    const parts     = interaction.customId.split(':');
    const statValue = parts[1];
    const page      = parseInt(parts[2], 10);
    const invokerId = parts[3];
    const tsRaw     = parts[4];
    const lb        = getLb(statValue);

    if (!lb || isNaN(page) || page < 0) {
      return interaction.reply({ content: 'Something went wrong.', flags: MessageFlags.Ephemeral });
    }

    const denied = accessDenied(interaction, invokerId, tsRaw);
    if (denied) return interaction.reply({ content: denied, flags: MessageFlags.Ephemeral });

    await interaction.deferUpdate();
    await sendInteractive(interaction, await buildPage(lb, statValue, page, invokerId));
  },
};
