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
const {baseUrlDataApi} = require('../../tools/settings');

/**
 * Format a Pokémon name (capitalize first letter).
 * @param {string} str
 * @returns {string}
 */
function formatName(str) {
    if (!str) return 'Unknown';
    return str;
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
            abilities: 'Abilities',
            experience: 'Experience',
            encounter: 'Encounter',
            breeding: 'Breeding',
            evGiven: 'EV Given',
            expCurve: 'Experience Curve',
            baseExp: 'Base Experience',
            baseLoyalty: 'Base Loyalty',
            catchRate: 'Catch Rate',
            genderRatio: 'Gender Ratio',
            itemHeld: 'Item Held',
            breedingGroups: 'Breeding Groups',
            eggSteps: 'Egg Steps',
            baby: 'Baby',
            male: 'Male',
            female: 'Female',
            genderless: 'Genderless',
            notFound: name => `⚠️ Pokémon "${name}" not found.`,
            error: '❌ Unable to retrieve Pokémon information.',
            missingName: '⚠️ You must specify a Pokémon name.',
            stats: {
                hp: 'HP',
                atk: 'ATK',
                def: 'DEF',
                ats: 'ATS',
                dfs: 'DFS',
                spd: 'SPD'
            },
            experience_curve: {
                fast: 'Fast',
                medium_fast: 'Medium Fast',
                medium_slow: 'Medium Slow',
                slow: 'Slow',
                fluctuating: 'Fluctuating',
                erratic: 'Erratic'
            }
        },
        fr: {
            height: 'Taille',
            weight: 'Poids',
            baseStats: 'Statistiques de base',
            types: 'Type',
            abilities: 'Talents',
            experience: 'Expérience',
            encounter: 'Rencontre',
            breeding: 'Reproduction',
            evGiven: 'EV donnés',
            expCurve: 'Courbe d\'expérience',
            baseExp: 'Expérience de base',
            baseLoyalty: 'Bonheur de base',
            catchRate: 'Taux de capture',
            genderRatio: 'Ratio de genre',
            itemHeld: 'Objet tenu',
            breedingGroups: 'Groupes d\'œufs',
            eggSteps: 'Pas pour éclosion',
            baby: 'Bébé',
            male: 'Mâle',
            female: 'Femelle',
            genderless: 'Asexué',
            notFound: name => `⚠️ Le Pokémon "${name}" est introuvable.`,
            error: '❌ Impossible de récupérer les informations du Pokémon.',
            missingName: '⚠️ Vous devez spécifier un nom de Pokémon.',
            stats: {
                hp: 'PV',
                atk: 'ATQ',
                def: 'DEF',
                ats: 'ATS',
                dfs: 'DFS',
                spd: 'VIT'
            },
            experience_curve: {
                fast: 'Rapide',
                medium_fast: 'Moyenne-Rapide',
                medium_slow: 'Moyenne-Lente',
                slow: 'Lente',
                fluctuating: 'Fluctuante',
                erratic: 'Erratique'
            }
        },
        es: {
            height: 'Altura',
            weight: 'Peso',
            baseStats: 'Estadísticas base',
            types: 'Tipo',
            abilities: 'Habilidades',
            experience: 'Experiencia',
            encounter: 'Encuentro',
            breeding: 'Cría',
            evGiven: 'EV otorgados',
            expCurve: 'Curva de experiencia',
            baseExp: 'Experiencia base',
            baseLoyalty: 'Felicidad base',
            catchRate: 'Tasa de captura',
            genderRatio: 'Proporción de género',
            itemHeld: 'Objeto equipado',
            breedingGroups: 'Grupos de huevo',
            eggSteps: 'Pasos para eclosión',
            baby: 'Bebé',
            male: 'Macho',
            female: 'Hembra',
            genderless: 'Sin género',
            notFound: name => `⚠️ El Pokémon "${name}" no se ha encontrado.`,
            error: '❌ No se pudieron obtener los datos del Pokémon.',
            missingName: '⚠️ Debes especificar un nombre de Pokémon.',
            stats: {
                hp: 'PS',
                atk: 'ATA',
                def: 'DEF',
                ats: 'ATAE',
                dfs: 'DEFE',
                spd: 'VEL'
            },
            experience_curve: {
                fast: 'Rápida',
                medium_fast: 'Media-Rápida',
                medium_slow: 'Media-Lenta',
                slow: 'Lenta',
                fluctuating: 'Fluctuante',
                erratic: 'Errática'
            }
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
    const lang = interaction.options.getString('lang') || interaction.locale;
    const t = getLocale(lang);

    if (!name) {
        return interaction.reply({content: t.missingName, ephemeral: true});
    }

    await interaction.deferReply();

    try {
        const response = await fetch(`${baseUrlDataApi}/pokemon/${name}`, {
            headers: {
                'Accept-Language': lang,
            },
        });
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
        const number = pokemonData.number || '???';
        const thumbnailUrl =
            mainForm.sprite ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.number}.png`;

        const container = new ContainerBuilder().setAccentColor(color);

        const headerSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder({content: `# **${formatName(pokemonData.name)} - ${number}**`}),
                new TextDisplayBuilder({content: `${pokemonData.description}`}),
                new TextDisplayBuilder({
                    content: `${t.height}: **${mainForm.height ?? '?'} m** | ${t.weight}: **${mainForm.weight ?? '?'} kg**`
                })
            )
            .setThumbnailAccessory(new ThumbnailBuilder({media: {url: thumbnailUrl}}));

        container.addSectionComponents(headerSection);
        container.addSeparatorComponents(new SeparatorBuilder());

        const statsLines = [
            `${t.stats.hp}: **${mainForm.baseHp ?? '?'}**`,
            `${t.stats.atk}: **${mainForm.baseAtk ?? '?'}**`,
            `${t.stats.def}: **${mainForm.baseDfe ?? '?'}**`,
            `${t.stats.ats}: **${mainForm.baseAts ?? '?'}**`,
            `${t.stats.dfs}: **${mainForm.baseDfs ?? '?'}**`,
            `${t.stats.spd}: **${mainForm.baseSpd ?? '?'}**`
        ];

        container.addTextDisplayComponents(
            new TextDisplayBuilder({content: `**${t.baseStats}:**\n${statsLines.join(' | ')}`})
        );

        const typeRow = new ActionRowBuilder();

        if (mainForm.type1) {
            typeRow.addComponents(
                new ButtonBuilder()
                    .setLabel(formatName(mainForm.type1.name))
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`type_${mainForm.type1.symbol}`)
            );
        }

        if (mainForm.type2?.symbol) {
            typeRow.addComponents(
                new ButtonBuilder()
                    .setLabel(formatName(mainForm.type2.name))
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

        if (mainForm.abilities && mainForm.abilities.length > 0) {
            container.addSeparatorComponents(new SeparatorBuilder());
            const abilitiesRows = new ActionRowBuilder();
            mainForm.abilities.forEach((ability, index) => {
                abilitiesRows.addComponents(
                    new ButtonBuilder()
                        .setLabel(formatName(ability.name))
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`ability_${ability.symbol}&index=${index}`)
                );
            });
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.abilities}:**`
                })
            );
            container.addActionRowComponents(abilitiesRows);
        }

        // Experience Section
        container.addSeparatorComponents(new SeparatorBuilder());
        const evGivenParts = [];
        if (mainForm.evHp > 0) evGivenParts.push(`${t.stats.hp}: ${mainForm.evHp}`);
        if (mainForm.evAtk > 0) evGivenParts.push(`${t.stats.atk}: ${mainForm.evAtk}`);
        if (mainForm.evDfe > 0) evGivenParts.push(`${t.stats.def}: ${mainForm.evDfe}`);
        if (mainForm.evAts > 0) evGivenParts.push(`${t.stats.ats}: ${mainForm.evAts}`);
        if (mainForm.evDfs > 0) evGivenParts.push(`${t.stats.dfs}: ${mainForm.evDfs}`);
        if (mainForm.evSpd > 0) evGivenParts.push(`${t.stats.spd}: ${mainForm.evSpd}`);

        const evGivenText = evGivenParts.length > 0 ? evGivenParts.join(', ') : '-';

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${t.experience}:**\n` +
                    `${t.evGiven}: **${evGivenText}**\n` +
                    `${t.expCurve}: **${t.experience_curve[mainForm.experienceType] || '?'}**\n` +
                    `${t.baseExp}: **${mainForm.baseExperience ?? '?'}** | ${t.baseLoyalty}: **${mainForm.baseLoyalty ?? '?'}**`
            })
        );

        // Encounter Section
        container.addSeparatorComponents(new SeparatorBuilder());
        let genderRatioText = '';
        if (mainForm.femaleRate === -1) {
            genderRatioText = t.genderless;
        } else {
            const femalePercent = mainForm.femaleRate;
            const malePercent = 100 - femalePercent;
            genderRatioText = `♂ ${malePercent}% / ♀ ${femalePercent}%`;
        }

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${t.encounter}:**\n` +
                    `${t.catchRate}: **${mainForm.catchRate ?? '?'}**\n` +
                    `${t.genderRatio}: **${genderRatioText}**\n` +
                    `${t.itemHeld}: **-**`
            })
        );

        // Breeding Section
        if (mainForm.babyDbSymbol !== '__undef__') {
            container.addSeparatorComponents(new SeparatorBuilder());
            const breedingGroupsText = mainForm.breedGroups && mainForm.breedGroups.length > 0
                ? mainForm.breedGroups.filter((v, i, a) => a.indexOf(v) === i).join(', ')
                : '-';
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.breeding}:**\n` +
                        `${t.baby}: **${mainForm.babyDbSymbol ?? '-'}**\n` +
                        `${t.breedingGroups}: **${breedingGroupsText}**\n` +
                        `${t.eggSteps}: **${mainForm.hatchSteps ?? '?'}**`
                })
            );
        }

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
