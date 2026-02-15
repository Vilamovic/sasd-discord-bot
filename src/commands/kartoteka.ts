import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { sasdEmbed, errorEmbed } from '../utils/embeds';

export const kartoteka = {
  data: new SlashCommandBuilder()
    .setName('kartoteka')
    .setDescription('Pokaż kartotekę MDT osoby')
    .addStringOption((o) => o.setName('nick').setDescription('Imię lub nazwisko').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    const nick = interaction.options.getString('nick', true);

    const { data: records } = await supabase
      .from('mdt_records')
      .select('*')
      .or(`first_name.ilike.%${nick}%,last_name.ilike.%${nick}%`)
      .limit(5);

    if (!records || records.length === 0) {
      return interaction.reply({ embeds: [errorEmbed(`Nie znaleziono kartoteki dla: "${nick}"`)], ephemeral: true });
    }

    const embeds = records.map((r: any) => {
      const embed = sasdEmbed()
        .setTitle(`📋 ${r.last_name}, ${r.first_name}`)
        .addFields(
          { name: 'Status', value: r.wanted_status || 'BRAK', inline: true },
          { name: 'Priors', value: `${r.priors || 0}`, inline: true },
          { name: 'Poziom', value: `${r.record_level || 1}`, inline: true },
        );

      if (r.gang_affiliation) embed.addFields({ name: 'Gang', value: r.gang_affiliation, inline: true });
      if (r.wanted_status === 'POSZUKIWANY') embed.setColor(0xff0000);

      return embed;
    });

    return interaction.reply({ embeds });
  },
};
