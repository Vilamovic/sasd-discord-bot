import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { sasdEmbed } from '../utils/embeds';

export const bolo = {
  data: new SlashCommandBuilder()
    .setName('bolo')
    .setDescription('Pokaż aktywne BOLO (pojazdy poszukiwane)'),

  async execute(interaction: ChatInputCommandInteraction) {
    const { data: vehicles } = await supabase
      .from('mdt_bolo_vehicles')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(15);

    const embed = sasdEmbed().setTitle('🚗 Aktywne BOLO').setColor(0xff8c00);

    if (!vehicles || vehicles.length === 0) {
      embed.setDescription('Brak aktywnych BOLO.');
    } else {
      const lines = vehicles.map((v: any) => {
        const vehicle = [v.make, v.model, v.color].filter(Boolean).join(' ');
        return `**${v.plate}** — ${vehicle || '?'}\n> ${v.reason || 'Brak opisu'}`;
      });
      embed.setDescription(lines.join('\n\n'));
    }

    return interaction.reply({ embeds: [embed] });
  },
};
