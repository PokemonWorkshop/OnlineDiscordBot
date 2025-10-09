const {
    MessageFlags, TextDisplayBuilder, ContainerBuilder, SectionBuilder,
    ThumbnailBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder
} = require('discord.js');
const axios = require('axios');
const { baseUrlDataApi } = require('../../tools/settings');

async function pokemonInfo(interaction) {
    const name = interaction.options.getString('name').toLowerCase();
    const lang = interaction.options.getString('lang') || 'en';

    try {
        const response = await axios.get(`${baseUrlDataApi}/pokemon/${name}`);

        const pokemonData = response.data;
        const mainForm = pokemonData.main_form;

        const container = new ContainerBuilder();

        // Section principale avec nom, numéro, image
        const section = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder({ content: `# ${pokemonData.symbol.charAt(0).toUpperCase() + pokemonData.symbol.slice(1)}` }),
                new TextDisplayBuilder({ content: `Numéro **${pokemonData.number}**` }),
                new TextDisplayBuilder({ content: `Taille: **${mainForm.height}m**, Poids: **${mainForm.weight}kg**` })
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder({ media: { url: `https://www.pokemonforeteternelle.com/wp-content/uploads/2020/04/725.png` } })
            );

        container.addSectionComponents(section);

        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `**Stats de base:**` }),
            new TextDisplayBuilder({ content: `HP: ${mainForm.baseHp}, ATK: ${mainForm.baseAtk}, DEF: ${mainForm.baseDfe}` }),
            new TextDisplayBuilder({ content: `SPD: ${mainForm.baseSpd}, ATS: ${mainForm.baseAts}, DFS: ${mainForm.baseDfs}` })
        );

        // Types en boutons
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(mainForm.type1.symbol.charAt(0).toUpperCase() + mainForm.type1.symbol.slice(1))
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`type_${mainForm.type1.symbol}`)
            );

        if (mainForm.type2) {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setLabel(mainForm.type2.symbol.charAt(0).toUpperCase() + mainForm.type2.symbol.slice(1))
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`type_${mainForm.type2.symbol}`)
            );
        }

        container.addActionRowComponents(actionRow);

        container.addSeparatorComponents(new SeparatorBuilder());

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
        });

    } catch (error) {
        console.error('Erreur récupération Pokémon:', error);
        await interaction.reply({ content: 'Impossible de récupérer les informations du Pokémon.', ephemeral: true });
    }
}

module.exports = { pokemonInfo };
