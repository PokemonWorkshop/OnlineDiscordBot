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
    const parts = interaction.customId.split('&');
    const abilityId = parts[1];
    const lang = parts[2] || interaction.locale || 'en';

    await interaction.deferReply({ flags: MessageFlags.ephemeral});
    try {
        const response = await fetch(`${baseUrlDataApi}/abilities/${abilityId}`, {
            headers: { authorization: process.env.BEARER,
                'Accept-Language': lang
            },
        });
        console.log('Fetching ability from:', `${baseUrlDataApi}/abilities/${abilityId}`);

        if (!response.ok) {
            console.error('Failed to fetch ability, status:', response.status);
            return interaction.editReply({ content: '⚠️ Impossible de récupérer cette capacité.' });
        }
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