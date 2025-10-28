const axios = require('axios');
const {
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    Colors
} = require('discord.js');
const { formatDate } = require('../tools/date');
const { baseUrlOnlineServerAPI } = require('../tools/settings');

async function handleGiftShow(interaction) {
    const giftId = interaction.customId.replace('gift_show_', '');

    await interaction.deferReply({ flags: MessageFlags.ephemeral});

    try {
        const response = await axios.get(`${baseUrlOnlineServerAPI}/gift/${giftId}`, {
            headers: { authorization: process.env.BEARER }
        });

        if (!response.data.success || !response.data.gift)
            return interaction.editReply({ content: '⚠️ Impossible de récupérer ce cadeau.' });

        const gift = response.data.gift;

        const now = new Date();
        const hasDates = gift.validFrom && gift.validTo;
        const isActive =
            (hasDates && now >= new Date(gift.validFrom) && now <= new Date(gift.validTo)) ||
            gift.alwaysAvailable;

        const color = isActive ? Colors.Green : Colors.Red;

        const container = new ContainerBuilder().setAccentColor(color);

        const dateInfo = hasDates
            ? `📅 ${formatDate(gift.validFrom)} → ${formatDate(gift.validTo)}`
            : '📅 Permanente';

        container.addTextDisplayComponents(
            new TextDisplayBuilder({ content: `🎁 **${gift.title}**` }),
            new TextDisplayBuilder({ content: `➡️ **Code :** ${gift.code || '*À récupérer dans le jeu*'}` }),
            new TextDisplayBuilder({ content: dateInfo }),
            new TextDisplayBuilder({
                content: gift.items?.length
                    ? `**Objet${gift.items.length > 1 ? 's' : ''} :**\n${gift.items.map(i => `- ${i.id} × ${i.count}`).join('\n')}`
                    : 'Pas d’objets',
            }),
            new TextDisplayBuilder({
                content: gift.creatures?.length
                    ? `**Pokémon${gift.creatures.length > 1 ? 's' : ''} :**\n${gift.creatures.map(c => `- ${c.id} (Niv. ${c.level})${c.shiny ? ' ✨' : ''}`).join('\n')}`
                    : 'Pas de Pokémon',
            })
        );



        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });
    } catch (error) {
        console.error('Error fetching gift:', error);
        await interaction.editReply({ content: '❌ Impossible de récupérer ce cadeau pour le moment.' });
    }
}

module.exports = { handleGiftShow };
