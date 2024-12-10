const { logInteraction } = require('../tools/log');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * Logs a message when the bot is ready, indicating the name of the bot.
     * @param {object} client - The Discord client object.
     */
    async execute(client) {
        logInteraction(`Ready ! Logged as ${client.user.tag}.`);
    }
};
