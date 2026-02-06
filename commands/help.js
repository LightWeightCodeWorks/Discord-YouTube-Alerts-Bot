const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get guidance on how to set up YouTube Alerts.'),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Setting Up YouTube Alerts')
      .setDescription('Follow these steps to set up YouTube notifications in your server:')
      .addFields(
        { name: 'Step 1: Set Alert Channel', value: 'Use `/setalertchannel` to choose which Discord channel will receive the notifications.' },
        { name: 'Step 2: Add YouTube Channel', value: 'Use `/addchannel` with the YouTube Channel ID to start tracking. (Example: `UC_x5XG1OV2P6uYZ5ujfW30A`)' },
        { name: 'Optional Step: Choose role to ping yor users', value: 'Use `/setpingrole` with the Discord Server role you like to use for alerts. (Default role is @everyone)' },
        { name: 'Manage Tracking', value: '• `/listchannels`: See all YouTube channels currently being tracked.\n• `/removechannel`: Stop tracking a specific YouTube channel.' },
        { name: 'Permissions', value: 'Only users with **Administrator or Manage Server** permissions and server owners can use these commands.' }
      )
      .setFooter({ text: 'YouTube Alerts Bot' });

    await interaction.reply({ embeds: [helpEmbed] });
  }
};
