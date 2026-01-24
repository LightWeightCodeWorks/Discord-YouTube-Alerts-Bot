const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addchannel')
    .setDescription('Start tracking a YouTube channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('channelid')
         .setDescription('The YouTube channel ID')
         .setRequired(true)
    ),
  async execute(interaction, trackedChannels) {
    const guildId = interaction.guild.id;

    if (!trackedChannels[guildId] || !trackedChannels[guildId].discordChannelId) {
      return interaction.reply({ 
        content: '❌ No alert channel has been set for this server. Please use `/setalertchannel` first to choose where notifications should be sent.', 
        flags: MessageFlags.Ephemeral 
      });
    }

    const youtubeChannelId = interaction.options.getString('channelid');

    // Get latest video activity
    const url = `https://www.googleapis.com/youtube/v3/activities?key=${process.env.YOUTUBE_API_KEY}&channelId=${youtubeChannelId}&part=snippet,contentDetails&maxResults=1&type=upload`;

    try {
      const res = await axios.get(url);
      const latestActivity = res.data.items[0];

      if (!latestActivity || !latestActivity.contentDetails.upload) {
        return interaction.reply({ content: 'Could not fetch latest video. Is the channel ID correct?', flags: MessageFlags.Ephemeral });
      }

      trackedChannels[guildId].youtubeChannels[youtubeChannelId] = latestActivity.contentDetails.upload.videoId;
      fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));

      await interaction.reply(`✅ Now tracking ${latestActivity.snippet.channelTitle}!`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Error fetching YouTube data. Is the channel ID correct?', flags: MessageFlags.Ephemeral });
    }
  }
};
