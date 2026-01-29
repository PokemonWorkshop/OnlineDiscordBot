const {logInteraction} = require('../tools/log');
const {showABout} = require('../commands/showAbout');
const {commandsList} = require('../commands/commandsList');
const {mysteryGiftsList} = require('../commands/mysteryGiftsList');
const {playersList} = require('../commands/playersList');
const {pokemonInfo} = require("../commands/pokemon/pokemonInfo");
const {moveInfo} = require("../commands/move/moveInfo");
const {handleGiftShow} = require("../interactions/giftShow");
const {handleAbilityShow} = require("../interactions/abilityShow");
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * Handles the 'interactionCreate' event for executing commands.
     * Responds to various slash commands by sending appropriate embed messages.
     * @param {object} interaction - The interaction object from Discord.js, used to determine the command and respond.
     * @param {object} client - The Discord client object.
     */
    async execute(interaction, client) {
        try {
            if (interaction.isCommand()) {
                let embed = null;
                if (interaction.commandName === 'about') {
                    embed = await showABout(interaction, client);
                } else if (interaction.commandName === 'commands') {
                    embed = await commandsList(interaction, client);
                } else if (interaction.commandName === 'gifts') {
                    await mysteryGiftsList(interaction, client); // déjà gère la liste
                } else if (interaction.commandName === 'players') {
                    embed = await playersList(interaction, client);
                } else if (interaction.commandName === 'pokemon') {
                    await pokemonInfo(interaction, client);
                } else if (interaction.commandName === 'move') {
                    await moveInfo(interaction, client);
                }
                if (embed) await interaction.reply({ embeds: [embed] });
            }

            else if (interaction.isButton()) {
                if (interaction.customId.startsWith('gift_show_')) {
                    await handleGiftShow(interaction);
                } else if (interaction.customId.startsWith('ability&')) {
                    await handleAbilityShow(interaction);
                }
            }

        } catch (error) {
            console.error('Error while handling interaction:', error);
            logInteraction('Error in interactionCreate:', error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: "Désolé, une erreur s'est produite lors de l'exécution de l'interaction.",
                    flags: MessageFlags.ephemeral,
                });
            }
        }
    }

};
