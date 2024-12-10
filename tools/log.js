const { EmbedBuilder } = require('discord.js');
const { embedColor, logsChannelName, botName, urlFooterIcon } = require('../tools/settings');

/**
 * Logs an interaction with the bot in the console and in a channel of the bot named "📰-logs" (set in the settings file).
 * @param {string} message - The message to log.
 * @param {object} interaction - The interaction object from Discord.js, used to log the user informations.
 * @param {object} client - The Discord client object, used to send the log message in a channel.
 * @param {boolean} warn - Indicates if this log is a warning.
 */
async function logInteraction(message, interaction = null, client = null, warn = false) {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];

    let userInfoMessage = '';
    let userInfoConsole = '';
    if (interaction) {
        const userName = interaction.user.username;
        const userId = interaction.user.id;
        const commandName = interaction.commandName;
        const guildName = interaction.guild ? interaction.guild.name : 'DM';
        userInfoMessage = `User : ${userName} (${userId})\nCommand : ${commandName}\nGuild : ${guildName}`;
        userInfoConsole = ` | User : ${userName} (${userId}) | Command : ${commandName} | Guild : ${guildName}`;
    }
    const logMessage = `[${timeString}] ${message}${userInfoConsole}`;
    warn ? console.warn(logMessage) : console.log(logMessage);
    if (client) {
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`${botName} Log`)
            .addFields(
                { name: '📄 Message', value: message, inline: false },
                { name: '🔍 Details', value: userInfoMessage || 'N/A', inline: false }
            )
            .setFooter({ 
                text: `${botName} Logs`, 
                iconURL: urlFooterIcon
            })
            .setTimestamp();

        const logChannel = client.channels.cache.find(ch => ch.name === logsChannelName);

        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
        } else {
            console.error(`Channel '${logsChannelName}' not found to send the log message.`);
        }
    }
}

module.exports = { logInteraction };
