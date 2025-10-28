const {
    MessageFlags,
    TextDisplayBuilder,
    ContainerBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SeparatorBuilder,
    Colors
} = require('discord.js');
const fetch = require('node-fetch');
const {baseUrlDataApi} = require('../../tools/settings');

/**
 * Format a Pokémon name (capitalize first letter).
 * @param {string} str
 * @returns {string}
 */
function formatName(str) {
    if (!str) return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

/**
 * Simple localization system for text labels.
 * @param {'en' | 'fr' | 'es'} lang
 * @returns {Record<string, string>}
 */
function getLocale(lang) {
    const locales = {
        en: {
            height: 'Height',
            weight: 'Weight',
            baseStats: 'Base Stats',
            types: 'Type',
            notFound: name => `⚠️ Pokémon "${name}" not found.`,
            error: '❌ Unable to retrieve Pokémon information.',
            missingName: '⚠️ You must specify a Pokémon name.'
        },
        fr: {
            height: 'Taille',
            weight: 'Poids',
            baseStats: 'Statistiques de base',
            types: 'Type',
            notFound: name => `⚠️ Le Pokémon "${name}" est introuvable.`,
            error: '❌ Impossible de récupérer les informations du Pokémon.',
            missingName: '⚠️ Vous devez spécifier un nom de Pokémon.'
        },
        es: {
            height: 'Altura',
            weight: 'Peso',
            baseStats: 'Estadísticas base',
            types: 'Tipo',
            notFound: name => `⚠️ El Pokémon "${name}" no se ha encontrado.`,
            error: '❌ No se pudieron obtener los datos del Pokémon.',
            missingName: '⚠️ Debes especificar un nombre de Pokémon.'
        }
    };
    return locales[lang] || locales.en;
}

/**
 * Fetches and displays Pokémon information.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function pokemonInfo(interaction) {
    const name = interaction.options.getString('name')?.toLowerCase();
    const lang = interaction.options.getString('lang') || 'en';
    const t = getLocale(lang);

    if (!name) {
        return interaction.reply({content: t.missingName, ephemeral: true});
    }

    await interaction.deferReply();

    try {
        const response = await fetch(`${baseUrlDataApi}/pokemon/${name}`);
        if (!response.ok) {
            if (response.status === 404) {
                return interaction.editReply({content: t.notFound(name)});
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pokemonData = await response.json();
        const mainForm = pokemonData.main_form;

        if (!mainForm) {
            return interaction.editReply({content: t.notFound(name)});
        }

        const color = hexToDecimalColor(mainForm.type1?.color);
        const displayName = formatName(pokemonData.symbol);
        const number = pokemonData.number || '???';
        const thumbnailUrl =
            mainForm.sprite ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.number}.png`;

        const container = new ContainerBuilder().setAccentColor(color);

        const headerSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder({content: `# **${displayName}**`}),
                new TextDisplayBuilder({content: `No. **${number}**`}),
                new TextDisplayBuilder({
                    content: `${t.height}: **${mainForm.height ?? '?'} m** | ${t.weight}: **${mainForm.weight ?? '?'} kg**`
                })
            )
            .setThumbnailAccessory(new ThumbnailBuilder({media: {url: thumbnailUrl}}));

        container.addSectionComponents(headerSection);
        container.addSeparatorComponents(new SeparatorBuilder());

        const statsLines = [
            `HP: **${mainForm.baseHp ?? '?'}**`,
            `ATK: **${mainForm.baseAtk ?? '?'}**`,
            `DEF: **${mainForm.baseDfe ?? '?'}**`,
            `ATS: **${mainForm.baseAts ?? '?'}**`,
            `DFS: **${mainForm.baseDfs ?? '?'}**`,
            `SPD: **${mainForm.baseSpd ?? '?'}**`
        ];

        container.addTextDisplayComponents(
            new TextDisplayBuilder({content: `**${t.baseStats}:**\n${statsLines.join(' | ')}`})
        );

        const typeRow = new ActionRowBuilder();

        if (mainForm.type1) {
            typeRow.addComponents(
                new ButtonBuilder()
                    .setLabel(formatName(mainForm.type1.symbol))
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`type_${mainForm.type1.symbol}`)
            );
        }

        if (mainForm.type2) {
            typeRow.addComponents(
                new ButtonBuilder()
                    .setLabel(formatName(mainForm.type2.symbol))
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`type_${mainForm.type2.symbol}`)
            );
        }

        container.addSeparatorComponents(new SeparatorBuilder());
        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${t.types}${mainForm.type2 ? 's' : ''}:**`
            })
        );
        container.addActionRowComponents(typeRow);

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
        });

    } catch (error) {
        console.error('❌ Error fetching Pokémon data:', error.message);

        const message = t.error;
        await interaction.editReply({content: message});
    }
}

module.exports = {pokemonInfo};
