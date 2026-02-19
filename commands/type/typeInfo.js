const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    Colors
} = require('discord.js');
const fetch = require('node-fetch');
const {logInteraction} = require('../../tools/log');
const {baseUrlDataApi} = require('../../tools/settings');

/**
 * Simple localization system for text labels.
 * @param {'en' | 'fr' | 'es'} lang
 * @returns {Record<string, string>}
 */
function getLocale(lang) {
    const locales = {
        en: {
            notFound: name => `⚠️ Type "${name}" not found.`,
            error: '❌ Unable to retrieve type information.',
            missingName: '⚠️ You must specify a type name.',
            weaknesses: 'Weaknesses (takes more damage)',
            resistances: 'Resistances (takes less damage)',
            noData: 'No damage data available.',
        },
        fr: {
            notFound: name => `⚠️ Le type "${name}" est introuvable.`,
            error: '❌ Impossible de récupérer les informations du type.',
            missingName: '⚠️ Vous devez spécifier un nom de type.',
            weaknesses: 'Faiblesses (prend plus de dégâts)',
            resistances: 'Résistances (prend moins de dégâts)',
            noData: 'Aucune donnée de dégâts disponible.',
        },
        es: {
            notFound: name => `⚠️ El tipo "${name}" no se ha encontrado.`,
            error: '❌ No se pudieron obtener los datos del tipo.',
            missingName: '⚠️ Debes especificar un nombre de tipo.',
            weaknesses: 'Debilidades (recibe más daño)',
            resistances: 'Resistencias (recibe menos daño)',
            noData: 'No hay datos de daño disponibles.',
        },
    };
    return locales[lang] || locales['en'];
}

/**
 * Convert hex color to Discord decimal color safely.
 * @param {string} hex
 * @returns {number}
 */
function hexToDecimalColor(hex) {
    if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return Colors.Blurple;
    return parseInt(hex.slice(1), 16);
}

async function typeInfo(interaction) {
    const typeName = interaction.options.getString('name');
    const lang = interaction.options.getString('lang') || interaction.locale || 'en';
    const t = getLocale(lang);

    if (!typeName) {
        return interaction.reply({content: t.missingName, flags: MessageFlags.ephemeral});
    }

    await interaction.deferReply();

    try {
        const response = await fetch(`${baseUrlDataApi}/types/${typeName.toLowerCase()}`, {
            headers: {
                authorization: process.env.BEARER,
                'Accept-Language': lang
            },
        });

        const type = await response.json();

        if (!type || !type.symbol) {
            return interaction.editReply({content: t.notFound(typeName)});
        }

        const color = hexToDecimalColor(type.color);
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
                        content: `**${t.weaknesses}:**\n${weaknessesText}`
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
                        content: `**${t.resistances}:**\n${resistancesText}`
                    })
                );
            }
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({ content: t.noData })
            );
        }

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
        });

    } catch (error) {
        console.error('❌ Error fetching type data:', error.message);
        logInteraction('Error in typeInfo:', error);
        await interaction.editReply({content: t.error});
    }
}

module.exports = {typeInfo};


