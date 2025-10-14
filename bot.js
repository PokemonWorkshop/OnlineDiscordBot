require('dotenv').config();

const {Client} = require('discord.js');

const {intents} = require('./tools/settings');
const {registerCommands} = require('./commands/register/commands');

const readyEvent = require('./events/ready');
const interactionCreateEvent = require('./events/interactionCreate');

const client = new Client({
    intents: intents
});

(async () => {
    await registerCommands(process.env.CLIENT_ID);
})();

client.once(readyEvent.name, () => readyEvent.execute(client));
client.on(interactionCreateEvent.name, (...args) => interactionCreateEvent.execute(...args, client));

client.login(process.env.TOKEN);
