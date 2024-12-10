const { GatewayIntentBits } = require('discord.js');

// Bot name
const botName = 'OnlineDiscordBot';
// URL of the online server API
const baseUrlApi = 'https://online-address/api';
// URL of the icon to display in the footer of the messages
const urlFooterIcon = 'https://pokemonworkshop.com/media/assets/assets/2915011424-1665083029/logo-50x50.webp';

// Color of the messages
const embedColor = 0x345C6D;
// Color of the error messages
const errorEmbedColor = 0xFF0000;
// Name of the logs channel
const logsChannelName = '📰-logs';

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
];

module.exports = { botName, baseUrlApi, urlFooterIcon, embedColor, errorEmbedColor, logsChannelName, intents };
