const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { formatDate } = require('../tools/date');
const { logInteraction } = require('../tools/log');
const { botName, urlFooterIcon, embedColor, errorEmbedColor, baseUrlOnlineServerAPI } = require('../tools/settings');

/**
 * Fetches and displays a list of players in Discord as an embed message.
 * @param {object} interaction - The interaction object from Discord.js, used to reply or edit messages.
 * @param {object} client - The Discord client object.
 */
async function playersList(interaction, client) {
    logInteraction('Players list command', interaction, client, true);

    try {
        const response = await axios.get(`${baseUrlOnlineServerAPI}/player/all`, {
            headers: {
                'Authorization': `Bearer ${process.env.BEARER}`
            }
        });

        if (response.data.success) {
            const players = response.data.data;

            const playerList = players.map((player) => {
                const status = player.isOnline ? '🟢 Online' : '🔴 Offline';
                const friendCode = player.friendCode || 'N/A';

                return `**${player.playerName}**\n` +
                       `${status}\n`+
                       `📋 **Friend code** : ${friendCode}\n` +
                       `📅 **Last seen** : ${formatDate(player.lastConnection)}`;
            }).join('\n\n');

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('List of players')
                .setDescription(playerList || 'No players found.')
                .setFooter({ 
                    text: botName, 
                    iconURL: urlFooterIcon
                })
                .setTimestamp();

            return embed;
        } else {
            throw new Error('API response indicates failure');
        }
    } catch (error) {
        console.error('Error while fetching players :', error);

        const errorEmbed = new EmbedBuilder()
            .setColor(errorEmbedColor)
            .setTitle('Error')
            .setDescription('Unable to retrieve the list of players. Please try again later.');

        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = { playersList };
