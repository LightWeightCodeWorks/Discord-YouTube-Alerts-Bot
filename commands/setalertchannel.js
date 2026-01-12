const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setalertchannel')
    .setDescription('Set the Discord channel where YouTube alerts will be sent.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(opt =>
      opt.setName('channel')
         .setDescription('The Discord channel for alerts')
         .addChannelTypes(ChannelType.GuildText)
         .setRequired(true)
    ),
  async execute(interaction, trackedChannels) {
    const guildId = interaction.guild.id;
    const channel = interaction.options.getChannel('channel');

    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({ 
        content: '❌ Invalid channel selected. Please select a valid text channel in this server.', 
        flags: MessageFlags.Ephemeral 
      });
    }

    if (!trackedChannels[guildId]) {
      trackedChannels[guildId] = {
        discordChannelId: channel.id,
        youtubeChannels: {}
      };
    } else {
      trackedChannels[guildId].discordChannelId = channel.id;
    }

    fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));

    await interaction.reply(`✅ YouTube alerts will now be sent to ${channel}.`);
  }
};
