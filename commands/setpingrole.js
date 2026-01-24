const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setpingrole')
    .setDescription('Set the role to ping for YouTube alerts.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addRoleOption(opt =>
      opt.setName('role')
         .setDescription('The role to ping (leave empty for @everyone)')
         .setRequired(false)
    ),
  async execute(interaction, trackedChannels) {
    const guildId = interaction.guild.id;
    const role = interaction.options.getRole('role');

    if (!trackedChannels[guildId]) {
      trackedChannels[guildId] = {
        discordChannelId: null,
        youtubeChannels: {}
      };
    }

    if (role) {
      trackedChannels[guildId].pingRoleId = role.id;
      await interaction.reply(`✅ YouTube alerts will now ping ${role}.`);
    } else {
      delete trackedChannels[guildId].pingRoleId;
      await interaction.reply('✅ YouTube alerts will now ping `@everyone`.');
    }

    fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));
  }
};
