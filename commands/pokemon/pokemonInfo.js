const axios = require('axios');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const { logInteraction } = require('../../tools/log');
const {
    botName,
    urlFooterIcon,
    embedColor,
    errorEmbedColor,
    baseUrlDataApi
} = require('../../tools/settings');

/**
 * /pokemon [name] [lang]
 * Displays a full Pokédex-style embed with buttons for extra info
 */
async function pokemonInfo(interaction, client) {
    logInteraction('Pokemon info command', interaction, client, true);

    const pokemonName = interaction.options.getString('name');
    const lang = interaction.options.getString('lang') || 'en';

    try {
        const response = await axios.get(`${baseUrlDataApi}/pokemon/${pokemonName.toLowerCase()}`, {
            headers: { Authorization: `Bearer ${process.env.BEARER}` },
        });

        if (!response.data || response.status !== 200) throw new Error('Invalid API response');

        const pkmn = response.data;
        const form = pkmn.main_form;

        // --- LANGUAGE STRINGS ---
        const text = {
            en: {
                title: `#${pkmn.number} — ${pkmn.symbol.toUpperCase()}`,
                description: `${pkmn.symbol.toUpperCase()} is a ${form.type2 ? `${form.type1.symbol}/${form.type2.symbol}` : form.type1.symbol}-type Pokémon known for its unique abilities and battle potential.`,
                fields: {
                    data: '📋 Data',
                    stats: '📊 Statistics',
                    experience: '🎓 Experience',
                    encounter: '🎯 Encounter',
                    breeding: '🥚 Breeding',
                    evolution: '🌱 Evolution',
                },
                labels: {
                    height: 'Height',
                    weight: 'Weight',
                    type: 'Type',
                    abilities: 'Abilities',
                    baseExp: 'Base Exp.',
                    loyalty: 'Base Loyalty',
                    expCurve: 'Experience Curve',
                    evGiven: 'EV Given',
                    catchRate: 'Catch Rate',
                    gender: 'Gender Ratio',
                    items: 'Held Items',
                    baby: 'Baby Pokémon',
                    groups: 'Egg Groups',
                    steps: 'Egg Steps',
                },
                buttons: {
                    movesLvl: 'Moves (Level Up)',
                    movesTm: 'Moves (TM/HM)',
                    movesBreed: 'Moves (Breeding)',
                    evolution: 'Evolutions',
                },
            },
            fr: {
                title: `#${pkmn.number} — ${pkmn.symbol.toUpperCase()}`,
                description: `${pkmn.symbol.toUpperCase()} est un Pokémon de type ${form.type2 ? `${form.type1.symbol}/${form.type2.symbol}` : form.type1.symbol}, connu pour ses capacités uniques et son potentiel au combat.`,
                fields: {
                    data: '📋 Informations',
                    stats: '📊 Statistiques',
                    experience: '🎓 Expérience',
                    encounter: '🎯 Rencontre',
                    breeding: '🥚 Reproduction',
                    evolution: '🌱 Évolution',
                },
                labels: {
                    height: 'Taille',
                    weight: 'Poids',
                    type: 'Type',
                    abilities: 'Talents',
                    baseExp: "Exp. de base",
                    loyalty: 'Loyauté de base',
                    expCurve: "Courbe d'expérience",
                    evGiven: 'EV donnés',
                    catchRate: 'Taux de capture',
                    gender: 'Taux femelle',
                    items: 'Objets tenus',
                    baby: 'Bébé Pokémon',
                    groups: "Groupes d'œufs",
                    steps: "Pas d'éclosion",
                },
                buttons: {
                    movesLvl: 'Attaques (Niveau)',
                    movesTm: 'Attaques (CT/CS)',
                    movesBreed: 'Attaques (Reproduction)',
                    evolution: 'Évolutions',
                },
            },
        }[lang];

        const color = form.type1?.color ?? embedColor;
        const type1 = form.type1?.symbol ?? 'unknown';
        const type2 = form.type2?.symbol ?? null;

        // --- MOCK abilities (replace with API data when ready) ---
        const abilities = ['Static', 'Lightning Rod'];

        // --- COMPUTE base stat total ---
        const totalStats =
            form.baseHp +
            form.baseAtk +
            form.baseDfe +
            form.baseSpd +
            form.baseAts +
            form.baseDfs;

        // --- EMBED CONSTRUCTION ---
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(text.title)
            .setThumbnail(`${baseUrlDataApi}/images/pokemon/${pkmn.symbol}.png`)
            .setDescription(text.description)
            .addFields(
                {
                    name: text.fields.data,
                    value:
                        `**${text.labels.height}**: ${form.height} m\n` +
                        `**${text.labels.weight}**: ${form.weight} kg\n` +
                        `**${text.labels.type}**: ${type2 ? `${type1}/${type2}` : type1}\n` +
                        `**${text.labels.abilities}**: ${abilities.join(', ')}`,
                    inline: false,
                },
                {
                    name: text.fields.stats,
                    value:
                        `❤️ **HP:** ${form.baseHp}\n` +
                        `⚔️ **ATK:** ${form.baseAtk}\n` +
                        `🛡️ **DEF:** ${form.baseDfe}\n` +
                        `💨 **SPD:** ${form.baseSpd}\n` +
                        `🔮 **Sp.Atk:** ${form.baseAts}\n` +
                        `🧱 **Sp.Def:** ${form.baseDfs}\n` +
                        `✨ **Total:** ${totalStats}`,
                    inline: true,
                },
                {
                    name: text.fields.experience,
                    value:
                        `**${text.labels.evGiven}**: ${form.evSpd} SPD EV\n` +
                        `**${text.labels.expCurve}**: ${form.experienceType}\n` +
                        `**${text.labels.baseExp}**: ${form.baseExperience}\n` +
                        `**${text.labels.loyalty}**: ${form.baseLoyalty}`,
                    inline: true,
                },
                {
                    name: text.fields.encounter,
                    value:
                        `**${text.labels.catchRate}**: ${form.catchRate}\n` +
                        `**${text.labels.gender}**: ${form.femaleRate}% female\n` +
                        `**${text.labels.items}**: None`,
                    inline: true,
                },
                {
                    name: text.fields.breeding,
                    value:
                        `**${text.labels.baby}**: ${form.babyDbSymbol ?? 'None'}\n` +
                        `**${text.labels.groups}**: ${form.breedGroups.join(', ')}\n` +
                        `**${text.labels.steps}**: ${form.hatchSteps}`,
                    inline: true,
                }
            )
            .setFooter({ text: botName, iconURL: urlFooterIcon })
            .setTimestamp();

        // --- BUTTONS ---
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`moves-level-${pkmn.symbol}`)
                .setLabel(text.buttons.movesLvl)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`moves-tm-${pkmn.symbol}`)
                .setLabel(text.buttons.movesTm)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`moves-breeding-${pkmn.symbol}`)
                .setLabel(text.buttons.movesBreed)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`evolution-${pkmn.symbol}`)
                .setLabel(text.buttons.evolution)
                .setStyle(ButtonStyle.Success)
        );

        await interaction.reply({
            embeds: [embed],
            components: [buttons],
        });
    } catch (error) {
        console.error('Error while fetching Pokémon info:', error);

        const errorEmbed = new EmbedBuilder()
            .setColor(errorEmbedColor)
            .setTitle('❌ Error')
            .setDescription(`Unable to retrieve information for **${pokemonName}**.`);

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}

module.exports = { pokemonInfo };
