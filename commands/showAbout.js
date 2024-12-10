const { EmbedBuilder } = require('discord.js');
const { logInteraction } = require('../tools/log');
const { botName, urlFooterIcon, embedColor } = require('../tools/settings');

/**
 * Displays informations about the bot, including its ping, uptime, and version.
 * @param {object} interaction - The interaction object from Discord.js, used to log the command.
 * @param {object} client - The Discord client object, used to get the bot's ping.
 * @returns {EmbedBuilder} The embed message to send.
 */
async function showABout(interaction, client) {
    logInteraction('About command', interaction, client, true);

    let ping = client.ws.ping;

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400).toString().padStart(2, '0');
    const hours = Math.floor((uptime % 86400) / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((uptime % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(uptime % 60).toString().padStart(2, '0');

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`About ${botName}`)
        .addFields(
            { 
                name: 'Ping', 
                value: `${ping} ms`,
                inline: true
            },
            { 
                name: 'Uptime', 
                value: `${days}d ${hours}h ${minutes}m ${seconds}s`, 
                inline: true 
            },
            { 
                name: 'Version', 
                value: `${process.env.BOT_VERSION}`, 
                inline: true 
            }
        )
        .setFooter({ 
            text: botName, 
            iconURL: urlFooterIcon
        })
        .setTimestamp();

    return embed;
}

module.exports = { showABout };
