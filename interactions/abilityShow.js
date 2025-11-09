const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    Colors
} = require('discord.js');
const fetch = require('node-fetch');
const {logInteraction} = require('../tools/log');
const {baseUrlDataApi} = require('../tools/settings');

async function handleAbilityShow(interaction) {
    const abilityId = interaction.customId.replace('ability_', '');

    await interaction.deferReply({ flags: MessageFlags.ephemeral});
    try {
        const response = await fetch(`${baseUrlDataApi}/abilities/${abilityId}`, {
            headers: { authorization: process.env.BEARER,
                'Accept-Language': 'fr'
            },
        });
        const ability = await response.json();
        if (!ability || !ability.symbol)
            return interaction.editReply({ content: '⚠️ Impossible de récupérer cette capacité.' });

        const container = new ContainerBuilder().setAccentColor(Colors.Blue);

        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `# **${ability.name}**` }),
            new TextDisplayBuilder({ content: `${ability.description}` }),
        );

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

    } catch (error) {
        console.error('Error while fetching ability :', error);
        logInteraction('Error in handleAbilityShow:', error);
        await interaction.editReply({ content: "⚠️ Une erreur s'est produite lors de la récupération de cette capacité." });
    }
}

module.exports = {handleAbilityShow};