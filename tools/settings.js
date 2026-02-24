const {GatewayIntentBits} = require('discord.js');
const stream = require("node:stream");

// Bot name
const botName = 'OnlineDiscordBot';
// URL of the online server API
const baseUrlOnlineServerAPI = 'http://onlineserver.srv953596.hstgr.cloud:8181/api';
// Url of the data API
const baseUrlDataApi = process.env.BASE_URL_DATA_API;
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

module.exports = {
    botName,
    baseUrlOnlineServerAPI,
    baseUrlDataApi,
    urlFooterIcon,
    embedColor,
    errorEmbedColor,
    logsChannelName,
    intents
};
