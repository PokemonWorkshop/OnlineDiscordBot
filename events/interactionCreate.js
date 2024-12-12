const { EmbedBuilder } = require('discord.js');
const { logInteraction } = require('../tools/log');
const { showABout } = require('../commands/showAbout');
const { commandsList } = require('../commands/commandsList');
const { mysteryGiftsList } = require('../commands/mysteryGiftsList');
const { playersList } = require('../commands/playersList');

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
            try {
                if (interaction.commandName === 'about') {
                    const embed = await showABout(interaction, client);
                    await interaction.reply({ embeds: [embed] });
                } else if (interaction.commandName === 'commands') {
                    const embed = await commandsList(interaction, client);
                    await interaction.reply({ embeds: [embed] });
                } else if (interaction.commandName === 'gifts') {
                    const embed = await mysteryGiftsList(interaction, client);
                    await interaction.reply({ embeds: [embed] });
                } else if (interaction.commandName === 'players') {
                    const embed = await playersList(interaction, client);
                    await interaction.reply({ embeds: [embed] });
                }
            } catch (error) {
                logInteraction(`Error while running ${interaction.commandName} : `, error);
                await interaction.reply("Désolé, une erreur s'est produite lors de l'exécution de la commande.");
            }
        } 
    }
};
