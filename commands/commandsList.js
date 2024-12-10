const { EmbedBuilder } = require('discord.js');
const { logInteraction } = require('../tools/log');
const { botName, urlFooterIcon, embedColor } = require('../tools/settings');

/**
 * Displays a list of available commands in Discord as an embed message.
 * @param {object} interaction - The interaction object from Discord.js, used to reply or edit messages.
 * @param {object} client - The Discord client object.
 * @returns {EmbedBuilder} The embed message to send.
 */
async function commandsList(interaction, client) {
    logInteraction('Commands list command', interaction, client, true);

    const commands = await interaction.client.application.commands.fetch();
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Available commands')
      .setFooter({ 
        text: botName, 
        iconURL: urlFooterIcon 
      })
      .setTimestamp();

    commands.forEach(command => {
      embed.addFields({
        name: `</${command.name}:${command.id}>`,
        value: `${command.description}`,
      });
    });

    return embed;
}

module.exports = { commandsList };
