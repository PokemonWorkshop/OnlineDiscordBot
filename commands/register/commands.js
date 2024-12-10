const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { logInteraction } = require('../../tools/log');

const token = process.env.TOKEN;
const rest = new REST({ version: '10' }).setToken(token);

const commands = [
    new SlashCommandBuilder().setName('commands').setDescription('Displays the list of the bot commands.'),
    new SlashCommandBuilder().setName('players').setDescription('Displays the list of players.'),
    new SlashCommandBuilder().setName('gifts').setDescription('Displays the list of mystery gifts.'),
    new SlashCommandBuilder().setName('about').setDescription('Displays informations about the bot.')
]
commands.map(command => command.toJSON());

/**
 * Registers slash commands for the bot.
 * @param {string} clientId - The client ID of the bot.
 */
async function registerCommands(clientId) {
    try {
        logInteraction('Registering Slash commands...');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        logInteraction('Slash commands done.');
    } catch (error) {
        console.log('Error while registering Slash commands :', error);
    }
}

/**
 * UNUSED - Deletes Slash commands for the bot.
 * @param {string[]} commandNames - List of Slash command names to delete.
 */
async function deleteCommands(commandNames) {
    try {
        for (const commandName of commandNames) {
            const commandId = getCommandIdByName(commandName);
            if (commandId) {
                await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, commandId));
                logInteraction(`Deleted command : ${commandName}`);
            } else {
                logInteraction(`Command not found : ${commandName}`);
            }
        }
    } catch (error) {
        console.log('Error while deleting commands :', error);
    }
}

/**
 * UNUSED - Returns the ID of the registered command with the given name.
 * @param {string} commandName - The name of the command.
 * @returns {string} The ID of the command or null if not found.
 */
async function getCommandIdByName(commandName) {
    try {
        const registeredCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );
        const command = registeredCommands.find(c => c.name === commandName);
        if (command) {
            return command.id;
        } else {
            throw new Error(`Command '${commandName}' not found.`);
        }
    } catch (error) {
        console.error('Error fetching command :', error);
        throw error;
    }
}

module.exports = { commands, registerCommands, getCommandIdByName, deleteCommands };
