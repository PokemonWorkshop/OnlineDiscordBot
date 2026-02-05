const {REST, Routes, SlashCommandBuilder} = require('discord.js');
const {logInteraction} = require('../../tools/log');
const {baseUrlOnlineServerAPI, baseUrlDataApi} = require('../../tools/settings');

const token = process.env.TOKEN;
const rest = new REST({version: '10'}).setToken(token);

const commands = [
    new SlashCommandBuilder().setName('commands')
        .setNameLocalizations({
            French: 'commandes',
            SpanishES: 'comandos',
        })
        .setDescription('Displays the list of the application commands.')
        .setDescriptionLocalizations({
            French: 'Affiche la liste des commandes de l\'application.',
            SpanishES: 'Muestra la lista de comandos de la aplicación.'
        }),

    new SlashCommandBuilder()
        .setName('about')
        .setNameLocalizations({
            French: 'info',
            SpanishES: 'info',
        })
        .setDescription('Displays information about the bot.')
        .setDescriptionLocalizations({
            French: 'Affiche des informations sur le bot.',
            SpanishES: 'Muestra información sobre el bot.',
        }),
];

const onlineServerApiCommands = [
    new SlashCommandBuilder()
        .setName('players')
        .setNameLocalizations({
            French: 'joueurs',
            SpanishES: 'jugadores',
        })
        .setDescription('Displays the list of players.')
        .setDescriptionLocalizations({
            French: 'Affiche la liste des joueurs.',
            SpanishES: 'Muestra la lista de jugadores.',
        }),

    new SlashCommandBuilder()
        .setName('gifts')
        .setNameLocalizations({
            French: 'cadeaux',
            SpanishES: 'regalos',
        })
        .setDescription('Displays the list of mystery gifts.')
        .setDescriptionLocalizations({
            French: 'Affiche la liste des cadeaux mystères.',
            SpanishES: 'Muestra la lista de regalos misteriosos.',
        })
        .addStringOption(option =>
            option
                .setName('type')
                .setNameLocalizations({
                    French: 'type',
                    SpanishES: 'tipo',
                })
                .setDescription('Type of gifts to display')
                .setDescriptionLocalizations({
                    French: 'Type de cadeaux à afficher',
                    SpanishES: 'Tipo de regalos a mostrar',
                })
                .addChoices(
                    {
                        name: 'All',
                        nameLocalizations: {French: 'Tous', SpanishES: 'Todos'},
                        value: 'all',
                    },
                    {
                        name: 'Code',
                        nameLocalizations: {French: 'Code', SpanishES: 'Código'},
                        value: 'code',
                    },
                    {
                        name: 'Internet',
                        nameLocalizations: {French: 'Internet', SpanishES: 'Internet'},
                        value: 'internet',
                    }
                )
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('show_all')
                .setNameLocalizations({
                    French: 'expiré',
                    SpanishES: 'todo',
                })
                .setDescription('Display all gifts, including expired ones')
                .setDescriptionLocalizations({
                    French: 'Afficher tous les cadeaux, même les périmés',
                    SpanishES: 'Mostrar todos los regalos, incluso los caducados',
                })
                .addChoices(
                    {
                        name: 'Yes',
                        nameLocalizations: {French: 'Oui', SpanishES: 'Sí'},
                        value: 'yes',
                    },
                    {
                        name: 'No',
                        nameLocalizations: {French: 'Non', SpanishES: 'No'},
                        value: 'no',
                    }
                )
                .setRequired(false)
        ),

]

const dataApiCommands = [
    new SlashCommandBuilder()
        .setName('pokemon')
        .setNameLocalizations({
            French: 'pokemon',
            SpanishES: 'pokemon',
        })
        .setDescription('Display Pokémon information.')
        .setDescriptionLocalizations({
            French: 'Affiche les informations sur un Pokémon.',
            SpanishES: 'Muestra la información de un Pokémon.',
        })
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Pokémon name')
                .setDescriptionLocalizations({
                    French: 'Nom du Pokémon',
                    SpanishES: 'Nombre del Pokémon',
                })
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('lang')
                .setDescription('Language of the information')
                .setDescriptionLocalizations({
                    French: 'Langue des informations',
                    SpanishES: 'Idioma de la información',
                })
                .setRequired(false)
                .addChoices(
                    {name: 'Français', value: 'fr'},
                    {name: 'Anglais', value: 'en'},
                    {name: 'Español', value: 'es'},
                )
        ),

    new SlashCommandBuilder()
        .setName("move")
        .setNameLocalizations({
            French: 'capacité',
            SpanishES: 'movimiento',
        })
        .setDescription("Display Move information.")
        .setDescriptionLocalizations({
            French: 'Affiche les informations sur une capacité.',
            SpanishES: 'Muestra la información de un movimiento.',
        })
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Move name')
                .setDescriptionLocalizations({
                    French: 'Nom de la capacité',
                    SpanishES: 'Nombre del movimiento',
                })
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('lang')
                .setDescription('Language of the information')
                .setDescriptionLocalizations({
                    French: 'Langue des informations',
                    SpanishES: 'Idioma de la información',
                })
                .setRequired(false)
                .addChoices(
                    {name: 'Français', value: 'fr'},
                    {name: 'Anglais', value: 'en'},
                    {name: 'Español', value: 'es'},
                )
        ),
];

if (baseUrlOnlineServerAPI) {
    for (const command of onlineServerApiCommands) {
        commands.push(command)
    }
}
if (baseUrlDataApi) {
    for (const command of dataApiCommands) {
        commands.push(command)
    }
}

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
            {body: commands}
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

module.exports = {commands, registerCommands, getCommandIdByName, deleteCommands};
