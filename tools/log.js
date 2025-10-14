const {EmbedBuilder} = require('discord.js');
const {embedColor, logsChannelName, botName, urlFooterIcon} = require('../tools/settings');

/**
 * Logs an interaction with the bot in the console and in a channel of the bot named "📰-logs" (set in the settings file).
 * @param {string} message - The message to log.
 * @param {object} [interaction=null] - The interaction object from Discord.js, used to log user information.
 * @param {object} [client=null] - The Discord client object, used to send the log message in a channel.
 * @param {boolean} [warn=false] - Indicates if this log is a warning.
 */
async function logInteraction(message, interaction = null, client = null, warn = false) {
    // 1. Prepare time string
    const now = new Date();
    // Use toLocaleTimeString for a more standard format, but keep original logic for consistency
    const timeString = now.toTimeString().split(' ')[0];

    // 2. Extract and format user/interaction information
    let userInfoMessage = 'N/A';
    let userInfoConsole = '';

    const user = interaction?.user;
    const guildName = interaction?.guild?.name || 'DM';

    if (user) {
        const userName = user.username;
        const userId = user.id;
        // Use optional chaining and nullish coalescing for safe access
        const commandName = interaction.commandName ?? interaction.customId ?? 'N/A';

        userInfoMessage = `**Utilisateur** : ${userName} (${userId})\n**Commande/ID** : ${commandName}\n**Serveur** : ${guildName}`;
        userInfoConsole = ` | User: ${userName} (${userId}) | Command: ${commandName} | Guild: ${guildName}`;
    } else if (interaction?.customId) {
        // Handle interactions without a direct .user (e.g., some modals or buttons before deferring)
        userInfoMessage = `**Interaction ID** : ${interaction.customId}\n**Serveur** : ${guildName}`;
        userInfoConsole = ` | Interaction ID: ${interaction.customId} | Guild: ${guildName}`;
    }

    // 3. Log to console
    const logMessage = `[${timeString}] ${message}${userInfoConsole}`;
    // Use ternary operator for concise console logging
    warn ? console.warn(logMessage) : console.log(logMessage);

    // 4. Log to Discord channel if client is provided
    if (client) {
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(`📜 ${botName} Log`) // Added an emoji for visibility
            .addFields(
                {name: '📄 Message', value: message, inline: false},
                {name: '🔍 Détails', value: userInfoMessage, inline: false}
            )
            .setFooter({
                text: `${botName} Logs`,
                iconURL: urlFooterIcon
            })
            .setTimestamp();

        // Prefer .get(id) for faster access if possible, but .find(name) is needed here.
        // Also, cache might not be fully populated. A safer way is to fetch, but .find is fine for a logs channel.
        const logChannel = client.channels.cache.find(ch => ch.name === logsChannelName);

        if (logChannel) {
            try {
                await logChannel.send({embeds: [embed]});
            } catch (error) {
                console.error(`Failed to send log message to channel '${logsChannelName}'. Error:`, error);
            }
        } else {
            console.error(`Channel '${logsChannelName}' not found to send the log message.`);
        }
    }
}

module.exports = {logInteraction};