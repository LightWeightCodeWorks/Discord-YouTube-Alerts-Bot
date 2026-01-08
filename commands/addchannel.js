const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addchannel')
    .setDescription('Start tracking a YouTube channel.')
    .addStringOption(opt =>
      opt.setName('channelid')
         .setDescription('The YouTube channel ID')
         .setRequired(true)
    ),
  async execute(interaction, trackedChannels) {
    if (!interaction.member.roles.cache.some(role => role.name === 'Admin')) {
      return interaction.reply({ content: 'You do not have Admin Level permissions to use this command.', flags: MessageFlags.Ephemeral });
        }

        // If the user is an admin, execute the command
        const guildId = interaction.guild.id;
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
      await interaction.reply({ content: 'Error fetching YouTube data.', flags: MessageFlags.Ephemeral });
    }
  }
};
