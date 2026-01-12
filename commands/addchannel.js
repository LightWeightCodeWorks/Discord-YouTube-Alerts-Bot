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

    // Get latest video
    const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${youtubeChannelId}&part=snippet,id&order=date&maxResults=1&type=video`;

    try {
      const res = await axios.get(url);
      const latestVideo = res.data.items[0];

      if (!latestVideo) {
        return interaction.reply({ content: 'Could not fetch latest video. Is the channel ID correct?', flags: MessageFlags.Ephemeral });
      }

      if (!trackedChannels[guildId]) {
        trackedChannels[guildId] = {
          discordChannelId: interaction.channel.id,
          youtubeChannels: {}
        };
      }

      trackedChannels[guildId].youtubeChannels[youtubeChannelId] = latestVideo.id.videoId;
      fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));

      await interaction.reply(`✅ Now tracking ${latestVideo.snippet.channelTitle}!`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Error fetching YouTube data. Is the channel ID correct?', flags: MessageFlags.Ephemeral });
    }
  }
};
