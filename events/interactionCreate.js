const { logInteraction } = require('../tools/log');
const { showABout } = require('../commands/showAbout');
const { commandsList } = require('../commands/commandsList');
const { mysteryGiftsList } = require('../commands/mysteryGiftsList');
const { playersList } = require('../commands/playersList');
const {pokemonInfo} = require("../commands/pokemon/pokemonInfo");

module.exports = {
    name: 'interactionCreate',
/**
 * Handles the 'interactionCreate' event for executing commands.
 * Responds to various slash commands by sending appropriate embed messages.
 * @param {object} interaction - The interaction object from Discord.js, used to determine the command and respond.
 * @param {object} client - The Discord client object.
 */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            let embed = null;
            try {
                if (interaction.commandName === 'about') {
                    embed = await showABout(interaction, client);
                } else if (interaction.commandName === 'commands') {
                    embed = await commandsList(interaction, client);
                } else if (interaction.commandName === 'gifts') {
                    embed = await mysteryGiftsList(interaction, client);
                } else if (interaction.commandName === 'players') {
                    embed = await playersList(interaction, client);
                } else if (interaction.commandName === 'pokemon') {
                    embed = await pokemonInfo(interaction, client);
                }
                if (embed){
                    await interaction.reply({ embeds: [embed] });
                }
            } catch (error) {
                logInteraction(`Error while running ${interaction.commandName} : `, error);
                await interaction.reply("Désolé, une erreur s'est produite lors de l'exécution de la commande.");
            }
        } 
    }
};
