const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removechannel')
    .setDescription('Stop tracking a YouTube channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('channelid')
         .setDescription('The YouTube channel ID')
         .setRequired(true)
    ),
  async execute(interaction, trackedChannels) {
    const guildId = interaction.guild.id;
    const youtubeChannelId = interaction.options.getString('channelid');
    

    if (trackedChannels[guildId]?.youtubeChannels?.[youtubeChannelId]) {
      delete trackedChannels[guildId].youtubeChannels[youtubeChannelId];
      fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));
      return interaction.reply('✅ Channel removed from tracking.');
    }

    return interaction.reply({ content: '❌ Channel was not being tracked.', flags: MessageFlags.Ephemeral});
  }
};
