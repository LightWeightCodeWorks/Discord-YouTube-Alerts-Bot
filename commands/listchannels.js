const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listchannels')
    .setDescription('List all currently tracked YouTube channels for this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, trackedChannels) {
    const guildId = interaction.guild.id;

    if (!trackedChannels[guildId] || Object.keys(trackedChannels[guildId].youtubeChannels).length === 0) {
      return interaction.reply('📭 No YouTube channels are currently being tracked in this server.');
    }

    const youtubeChannelIds = Object.keys(trackedChannels[guildId].youtubeChannels);

    let response = `📋 **Tracked YouTube Channels:**\n`;
    response += youtubeChannelIds.map((id, idx) => `**${idx + 1}.** \`${id}\``).join('\n');

    await interaction.reply(response);
      },
    };

