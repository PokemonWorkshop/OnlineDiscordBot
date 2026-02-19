const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    Colors
} = require('discord.js');
const fetch = require('node-fetch');
const {logInteraction} = require('../tools/log');
const {baseUrlDataApi} = require('../tools/settings');

async function handleTypeShow(interaction) {
    const typeSymbol = interaction.customId.replace('type_', '');
    const lang = interaction.locale || 'en';

    await interaction.deferReply({ flags: MessageFlags.ephemeral});
    try {
        const response = await fetch(`${baseUrlDataApi}/types/${typeSymbol}?lang=${encodeURIComponent(lang.toString())}`, {
            headers: {
                authorization: process.env.BEARER
            },
        });

        const type = await response.json();
        if (!type || !type.symbol)
            return interaction.editReply({ content: '⚠️ Impossible de récupérer ce type.' });

        const color = type.color ? parseInt(type.color.slice(1), 16) : Colors.Blurple;
        const container = new ContainerBuilder().setAccentColor(color);

        // Titre du type
        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `# **${type.name}**` })
        );

        container.addSeparatorComponents(new SeparatorBuilder());

        // Tableau des dégâts défensifs
        if (type.typeDamage && type.typeDamage.length > 0) {
            // Grouper par catégorie (faiblesse, résistance, neutre)
            const weaknesses = type.typeDamage.filter(td => td.factor > 1);
            const resistances = type.typeDamage.filter(td => td.factor < 1);

            // Afficher les faiblesses (prend plus de dégâts)
            if (weaknesses.length > 0) {
                const weaknessesText = weaknesses
                    .map(td => `- **${td.defensiveType}** ×${td.factor}`)
                    .join('\n');
                container.addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `**Faiblesses (prend plus de dégâts):**\n${weaknessesText}`
                    })
                );
            }

            container.addSeparatorComponents(new SeparatorBuilder());

            // Afficher les résistances (prend moins de dégâts)
            if (resistances.length > 0) {
                const resistancesText = resistances
                    .map(td => `- **${td.defensiveType}** ×${td.factor}`)
                    .join('\n');
                container.addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `**Résistances (prend moins de dégâts):**\n${resistancesText}`
                    })
                );
            }
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({ content: 'Aucune donnée de dégâts disponible.' })
            );
        }

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

    } catch (error) {
        console.error('Error while fetching type :', error);
        logInteraction('Error in handleTypeShow:', error);
        await interaction.editReply({ content: "⚠️ Une erreur s'est produite lors de la récupération de ce type." });
    }
}

module.exports = {handleTypeShow};

