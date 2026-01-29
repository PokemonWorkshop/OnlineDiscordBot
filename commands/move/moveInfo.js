const fetch = require('node-fetch');
const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    Colors
} = require('discord.js');


async function moveInfo(interaction) {
    await interaction.deferReply({ flags: MessageFlags.ephemeral });

    const moveName = interaction.options.getString('name');
    const lang = interaction.locale || 'en';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`, {
            headers: { 'Accept-Language': lang },
        });

        if (!response.ok) {
            return interaction.editReply({ content: '⚠️ Impossible de récupérer cette attaque.' });
        }

        const move = await response.json();

        const container = new ContainerBuilder().setAccentColor(Colors.Orange);

        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `# **${move.name}**` }),
            new TextDisplayBuilder({ content: `**Type :** ${move.type.name}` }),
            new TextDisplayBuilder({ content: `**Puissance :** ${move.power || '—'}` }),
            new TextDisplayBuilder({ content: `**Précision :** ${move.accuracy || '—'}` }),
            new TextDisplayBuilder({ content: `**PP :** ${move.pp}` }),
            new TextDisplayBuilder({ content: `**Description :** ${move.effect_entries.find(entry => entry.language.name === lang)?.short_effect || 'Aucune description disponible.'}` }),
        );

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

    } catch (error) {
        console.error('Error while fetching move :', error);
        await interaction.editReply({ content: "⚠️ Une erreur s'est produite lors de la récupération de cette attaque." });
    }
}

module.exports = { moveInfo };