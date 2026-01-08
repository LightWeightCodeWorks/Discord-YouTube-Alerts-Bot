const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listchannels')
    .setDescription('List all currently tracked YouTube channels for this server.'),

  async execute(interaction, trackedChannels) {
    if (!interaction.member.roles.cache.some(role => role.name === 'Admin')) {
      return interaction.reply({ content: 'You do not have Admin Level permissions to use this command.', flags: MessageFlags.Ephemeral });
        }

        // If the user is an admin, execute the command
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

