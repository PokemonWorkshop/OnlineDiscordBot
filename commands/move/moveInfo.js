const fetch = require('node-fetch');
const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    Colors
} = require('discord.js');
const {baseUrlDataApi} = require("../../tools/settings");

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
            type: 'Type',
            category: 'Category',
            power: 'Power',
            accuracy: 'Accuracy',
            pp: 'PP',
            priority: 'Priority',
            criticalRate: 'Critical Rate',
            targeting: 'Targeting',
            aimedTarget: 'Target',
            contactType: 'Contact',
            execution: 'Execution',
            charge: 'Charge',
            recharge: 'Recharge',
            method: 'Method',
            interactionsLabel: 'Interactions',
            secondaryEffects: 'Secondary Effects',
            chance: 'Chance',
            statusEffects: 'Status Effects',
            mechanicalTagsLabel: 'Tags',
            yes: 'Yes',
            no: 'No',
            none: 'None',
            notFound: name => `⚠️ Move "${name}" not found.`,
            error: '❌ Unable to retrieve move information.',
            missingName: '⚠️ You must specify a move name.',
            categories: {
                physical: 'Physical',
                special: 'Special',
                status: 'Status'
            },
            targets: {
                adjacent_pokemon: 'Adjacent Pokémon',
                adjacent_foe: 'Adjacent Foe',
                adjacent_all_foe: 'All Adjacent Foes',
                all_foe: 'All Foes',
                adjacent_all_pokemon: 'All Adjacent Pokémon',
                all_pokemon: 'All Pokémon',
                user: 'User',
                user_or_adjacent_ally: 'User or Adjacent Ally',
                adjacent_ally: 'Adjacent Ally',
                all_ally: 'All Allies',
                all_ally_but_user: 'All Allies (except User)',
                any_other_pokemon: 'Any Other Pokémon',
                random_foe: 'Random Foe'
            },
            contacts: {
                NONE: 'None',
                DIRECT: 'Direct',
                DISTANT: 'Distant'
            },
            methods: {
                s_basic: 'Basic',
                s_stat: 'Stat Modifier',
                s_status: 'Status Infliction',
                s_multi_hit: 'Multi-Hit',
                s_2hits: 'Two Hits',
                s_ohko: 'One-Hit KO',
                s_2turns: 'Two Turns',
                s_self_stat: 'Self Stat Modifier',
                s_self_status: 'Self Status'
            },
            interactionNames: {
                BLOCABLE: 'Blockable',
                MIRROR_MOVE: 'Mirror Move',
                SNATCHABLE: 'Snatchable',
                MAGIC_COAT_AFFECTED: 'Magic Coat',
                KING_ROCK_UTILITY: "King's Rock",
                AFFECTED_BY_GRAVITY: 'Affected by Gravity',
                NON_SKY_BATTLE: 'Not usable in Sky Battle'
            },
            mechanicalTagNames: {
                AUTHENTIC: 'Authentic',
                BALLISTIC: 'Ballistic',
                BITE: 'Bite',
                DANCE: 'Dance',
                PUNCH: 'Punch',
                SLICE: 'Slice',
                SOUND: 'Sound',
                WIND: 'Wind',
                PULSE: 'Pulse',
                POWDER: 'Powder',
                MENTAL: 'Mental'
            },
            statuses: {
                BURN: 'Burn',
                FREEZE: 'Freeze',
                PARALYSIS: 'Paralysis',
                POISON: 'Poison',
                TOXIC: 'Badly Poisoned',
                SLEEP: 'Sleep',
                CONFUSION: 'Confusion',
                FLINCH: 'Flinch'
            }
        },
        fr: {
            type: 'Type',
            category: 'Catégorie',
            power: 'Puissance',
            accuracy: 'Précision',
            pp: 'PP',
            priority: 'Priorité',
            criticalRate: 'Taux critique',
            targeting: 'Ciblage',
            aimedTarget: 'Cible',
            contactType: 'Contact',
            execution: 'Exécution',
            charge: 'Charge',
            recharge: 'Recharge',
            method: 'Méthode',
            interactionsLabel: 'Interactions',
            secondaryEffects: 'Effets secondaires',
            chance: 'Chance',
            statusEffects: 'Effets de statut',
            mechanicalTagsLabel: 'Tags',
            yes: 'Oui',
            no: 'Non',
            none: 'Aucun',
            notFound: name => `⚠️ L'attaque "${name}" est introuvable.`,
            error: '❌ Impossible de récupérer les informations de l\'attaque.',
            missingName: '⚠️ Vous devez spécifier un nom d\'attaque.',
            categories: {
                physical: 'Physique',
                special: 'Spéciale',
                status: 'Statut'
            },
            targets: {
                adjacent_pokemon: 'Pokémon adjacent',
                adjacent_foe: 'Ennemi adjacent',
                adjacent_all_foe: 'Tous les ennemis adjacents',
                all_foe: 'Tous les ennemis',
                adjacent_all_pokemon: 'Tous les Pokémon adjacents',
                all_pokemon: 'Tous les Pokémon',
                user: 'Utilisateur',
                user_or_adjacent_ally: 'Utilisateur ou allié adjacent',
                adjacent_ally: 'Allié adjacent',
                all_ally: 'Tous les alliés',
                all_ally_but_user: 'Tous les alliés (sauf utilisateur)',
                any_other_pokemon: 'N\'importe quel autre Pokémon',
                random_foe: 'Ennemi aléatoire'
            },
            contacts: {
                NONE: 'Aucun',
                DIRECT: 'Direct',
                DISTANT: 'Distant'
            },
            methods: {
                s_basic: 'Basique',
                s_stat: 'Modification de stat',
                s_status: 'Infliction de statut',
                s_multi_hit: 'Multi-coups',
                s_2hits: 'Deux coups',
                s_ohko: 'K.O. en un coup',
                s_2turns: 'Deux tours',
                s_self_stat: 'Auto-modification de stat',
                s_self_status: 'Auto-statut'
            },
            interactionNames: {
                BLOCABLE: 'Blocable',
                MIRROR_MOVE: 'Mimique',
                SNATCHABLE: 'Larcin',
                MAGIC_COAT_AFFECTED: 'Reflet Magik',
                KING_ROCK_UTILITY: 'Roche Royale',
                AFFECTED_BY_GRAVITY: 'Affecté par Gravité',
                NON_SKY_BATTLE: 'Non utilisable en Combat Ciel'
            },
            mechanicalTagNames: {
                AUTHENTIC: 'Authentique',
                BALLISTIC: 'Balistique',
                BITE: 'Morsure',
                DANCE: 'Danse',
                PUNCH: 'Poing',
                SLICE: 'Tranchant',
                SOUND: 'Son',
                WIND: 'Vent',
                PULSE: 'Aura',
                POWDER: 'Poudre',
                MENTAL: 'Mental'
            },
            statuses: {
                BURN: 'Brûlure',
                FREEZE: 'Gel',
                PARALYSIS: 'Paralysie',
                POISON: 'Poison',
                TOXIC: 'Empoisonnement grave',
                SLEEP: 'Sommeil',
                CONFUSION: 'Confusion',
                FLINCH: 'Tressaillement'
            }
        },
        es: {
            type: 'Tipo',
            category: 'Categoría',
            power: 'Potencia',
            accuracy: 'Precisión',
            pp: 'PP',
            priority: 'Prioridad',
            criticalRate: 'Tasa crítica',
            targeting: 'Objetivo',
            aimedTarget: 'Objetivo',
            contactType: 'Contacto',
            execution: 'Ejecución',
            charge: 'Carga',
            recharge: 'Recarga',
            method: 'Método',
            interactionsLabel: 'Interacciones',
            secondaryEffects: 'Efectos secundarios',
            chance: 'Probabilidad',
            statusEffects: 'Efectos de estado',
            mechanicalTagsLabel: 'Etiquetas',
            yes: 'Sí',
            no: 'No',
            none: 'Ninguno',
            notFound: name => `⚠️ El movimiento "${name}" no se ha encontrado.`,
            error: '❌ No se pudieron obtener los datos del movimiento.',
            missingName: '⚠️ Debes especificar un nombre de movimiento.',
            categories: {
                physical: 'Físico',
                special: 'Especial',
                status: 'Estado'
            },
            targets: {
                adjacent_pokemon: 'Pokémon adyacente',
                adjacent_foe: 'Enemigo adyacente',
                adjacent_all_foe: 'Todos los enemigos adyacentes',
                all_foe: 'Todos los enemigos',
                adjacent_all_pokemon: 'Todos los Pokémon adyacentes',
                all_pokemon: 'Todos los Pokémon',
                user: 'Usuario',
                user_or_adjacent_ally: 'Usuario o aliado adyacente',
                adjacent_ally: 'Aliado adyacente',
                all_ally: 'Todos los aliados',
                all_ally_but_user: 'Todos los aliados (excepto usuario)',
                any_other_pokemon: 'Cualquier otro Pokémon',
                random_foe: 'Enemigo aleatorio'
            },
            contacts: {
                NONE: 'Ninguno',
                DIRECT: 'Directo',
                DISTANT: 'Distante'
            },
            methods: {
                s_basic: 'Básico',
                s_stat: 'Modificador de stat',
                s_status: 'Inflicción de estado',
                s_multi_hit: 'Multi-golpe',
                s_2hits: 'Dos golpes',
                s_ohko: 'K.O. de un golpe',
                s_2turns: 'Dos turnos',
                s_self_stat: 'Auto-modificador de stat',
                s_self_status: 'Auto-estado'
            },
            interactionNames: {
                BLOCABLE: 'Bloqueable',
                MIRROR_MOVE: 'Espejo',
                SNATCHABLE: 'Robo',
                MAGIC_COAT_AFFECTED: 'Capa Mágica',
                KING_ROCK_UTILITY: 'Roca del Rey',
                AFFECTED_BY_GRAVITY: 'Afectado por Gravedad',
                NON_SKY_BATTLE: 'No usable en Combate Cielo'
            },
            mechanicalTagNames: {
                AUTHENTIC: 'Auténtico',
                BALLISTIC: 'Balístico',
                BITE: 'Mordisco',
                DANCE: 'Danza',
                PUNCH: 'Puño',
                SLICE: 'Cortante',
                SOUND: 'Sonido',
                WIND: 'Viento',
                PULSE: 'Pulso',
                POWDER: 'Polvo',
                MENTAL: 'Mental'
            },
            statuses: {
                BURN: 'Quemadura',
                FREEZE: 'Congelación',
                PARALYSIS: 'Parálisis',
                POISON: 'Veneno',
                TOXIC: 'Envenenamiento grave',
                SLEEP: 'Sueño',
                CONFUSION: 'Confusión',
                FLINCH: 'Retroceso'
            }
        }
    };
    return locales[lang] || locales.en;
}

/**
 * Fetches and displays move information.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function moveInfo(interaction) {
    const moveName = interaction.options.getString('name');
    const lang = interaction.options.getString('lang') || interaction.locale;
    const t = getLocale(lang);

    if (!moveName) {
        return interaction.reply({content: t.missingName, ephemeral: true});
    }

    await interaction.deferReply();

    try {
        const response = await fetch(`${baseUrlDataApi}/moves/detail/${moveName}`, {
            headers: {'Accept-Language': lang},
        });

        if (!response.ok) {
            if (response.status === 404) {
                return interaction.editReply({content: t.notFound(moveName)});
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const moveData = await response.json();

        const color = hexToDecimalColor(moveData.type?.color);
        const container = new ContainerBuilder().setAccentColor(color);

        // Header Section
        const categoryText = t.categories[moveData.category] || moveData.category || '?';

        container.addTextDisplayComponents(
            new TextDisplayBuilder({content: `# **${moveData.name}**`}),
            new TextDisplayBuilder({content: `${moveData.description}`})
        );
        container.addSeparatorComponents(new SeparatorBuilder());

        // Main Stats Section
        const powerText = moveData.power > 0 ? `**${moveData.power}**` : '-';
        const accuracyText = moveData.accuracy > 0 ? `**${moveData.accuracy}%**` : '-';
        const priorityText = moveData.priority && moveData.priority !== 0 ? ` | ${t.priority}: **${moveData.priority > 0 ? '+' : ''}${moveData.priority}**` : '';

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `**${t.type}:** ${moveData.type?.name || '?'}\n` +
                    `**${t.category}:** ${categoryText}\n` +
                    `**${t.power}:** ${powerText} | **${t.accuracy}:** ${accuracyText} | **${t.pp}:** **${moveData.pp ?? '?'}**${priorityText}`
            })
        );

        // Critical Rate (if not 1)
        if (moveData.criticalRate && moveData.criticalRate !== 1) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.criticalRate}:** +${moveData.criticalRate}`
                })
            );
        }

        // Targeting Section
        if (moveData.targeting) {
            container.addSeparatorComponents(new SeparatorBuilder());
            const targetText = t.targets[moveData.targeting.aimedTarget] || moveData.targeting.aimedTarget || '?';
            const contactText = t.contacts[moveData.targeting.contactType] || moveData.targeting.contactType || '?';

            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.targeting}:**\n` +
                        `${t.aimedTarget}: **${targetText}**\n` +
                        `${t.contactType}: **${contactText}**`
                })
            );
        }

        // Execution Section (if method exists, or charge/recharge is true)
        if (moveData.execution && (moveData.execution.method || moveData.execution.charge || moveData.execution.recharge)) {
            container.addSeparatorComponents(new SeparatorBuilder());
            let executionContent = `**${t.execution}:**\n`;

            if (moveData.execution.method) {
                const methodText = t.methods[moveData.execution.method] || moveData.execution.method;
                executionContent += `${t.method}: **${methodText}**\n`;
            }
            if (moveData.execution.charge) {
                executionContent += `${t.charge}: **${t.yes}**\n`;
            }
            if (moveData.execution.recharge) {
                executionContent += `${t.recharge}: **${t.yes}**\n`;
            }

            container.addTextDisplayComponents(
                new TextDisplayBuilder({content: executionContent.trim()})
            );
        }

        // Mechanical Tags Section
        if (moveData.mechanicalTags && moveData.mechanicalTags.length > 0) {
            container.addSeparatorComponents(new SeparatorBuilder());
            const tagsText = moveData.mechanicalTags
                .map(tag => t.mechanicalTagNames[tag] || tag)
                .join(', ');
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.mechanicalTagsLabel}:** ${tagsText}`
                })
            );
        }

        // Secondary Effects Section
        if (moveData.secondaryEffects && moveData.secondaryEffects.chance > 0) {
            container.addSeparatorComponents(new SeparatorBuilder());

            let effectsContent = `**${t.secondaryEffects}:**\n` +
                `${t.chance}: **${moveData.secondaryEffects.chance}%**`;

            if (moveData.secondaryEffects.statusEffects && moveData.secondaryEffects.statusEffects.length > 0) {
                const statusList = moveData.secondaryEffects.statusEffects
                    .map(effect => {
                        const statusName = t.statuses[effect.status] || effect.status;
                        return `${statusName} (${effect.luckRate}%)`;
                    })
                    .join(', ');

                effectsContent += `\n${t.statusEffects}: **${statusList}**`;
            }

            container.addTextDisplayComponents(
                new TextDisplayBuilder({content: effectsContent})
            );
        }

        // Interactions Section
        if (moveData.interactions && moveData.interactions.list && moveData.interactions.list.length > 0) {
            container.addSeparatorComponents(new SeparatorBuilder());
            const interactionsText = moveData.interactions.list
                .map(interaction => t.interactionNames[interaction] || interaction)
                .join(', ');
            container.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `**${t.interactionsLabel}:** ${interactionsText}`
                })
            );
        }

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

    } catch (error) {
        console.error('Error while fetching move:', error);
        const t = getLocale(lang);
        await interaction.editReply({content: t.error});
    }
}

module.exports = {moveInfo};