const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { formatDate } = require('../tools/date');
const { logInteraction } = require('../tools/log');
const { botName, urlFooterIcon, embedColor, errorEmbedColor, baseUrlOnlineServerAPI } = require('../tools/settings');

/**
 * Fetches and displays a list of mystery gifts in Discord as an embed message.
 * @param {object} interaction - The interaction object from Discord.js, used to reply or edit messages.
 * @param {object} client - The Discord client object.
 */
async function mysteryGiftsList(interaction, client) {
    logInteraction('Mystery gifts command', interaction, client, true);

    try {
        const response = await axios.get(`${baseUrlOnlineServerAPI}/gift/all`, {
            headers: {
                'Authorization': `Bearer ${process.env.BEARER}`
            }
        });
        if (response.data.success) {
            const gifts = response.data.data;

            const giftList = gifts.map((gift) => {
                const isActive = new Date() >= new Date(gift.availability.startDate) && new Date() <= new Date(gift.availability.endDate);
            
                const startDate = formatDate(gift.availability.startDate);
                const endDate = formatDate(gift.availability.endDate);
                const code = gift.redeemCode || '*retrievable in game*';
            
                return `**${gift.title}** \n` + 
                       `${isActive ? '🟢 Available' : '🔴 Not available'}\n` +
                       `➡️ **Code** : ${code}\n` +
                       `📅 **From** : ${startDate} to ${endDate}`;

            }).join('\n\n');

            return new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('List of mystery gifts')
                .setDescription(giftList || 'No mystery gift available for now.')
                .setFooter({
                    text: botName,
                    iconURL: urlFooterIcon
                })
                .setTimestamp();
        } else {
            throw new Error('API response indicates failure');
        }
    } catch (error) {
        console.error('Error while fetching gifts :', error);

        return new EmbedBuilder()
            .setColor(errorEmbedColor)
            .setTitle('Error')
            .setDescription('Unable to retrieve the list of mystery gifts. Please try again later.');
    }
}  

module.exports = { mysteryGiftsList };
