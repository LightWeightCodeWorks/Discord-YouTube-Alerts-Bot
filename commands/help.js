const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get guidance on how to use the YouTube Alerts Bot.'),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('YouTube Alerts Bot Help')
      .setDescription('Follow these steps to set up YouTube notifications in your server:')
      .addFields(
        { name: 'Step 1: Set Alert Channel', value: 'Use `/setalertchannel` to choose which Discord channel will receive the notifications.' },
        { name: 'Step 2: Add YouTube Channel', value: 'Use `/addchannel` with the YouTube Channel ID to start tracking. (Example: `UC_x5XG1OV2P6uYZ5ujfW30A`)' },
        { name: 'Manage Tracking', value: '• `/listchannels`: See all YouTube channels currently being tracked.\n• `/removechannel`: Stop tracking a specific YouTube channel.' },
        { name: 'Permissions', value: 'Only users with **Administrator or Manage Server** permissions can use these commands.' }
      )
      .setFooter({ text: 'YouTube Alerts Bot' });

    await interaction.reply({ embeds: [helpEmbed] });
  }
};
