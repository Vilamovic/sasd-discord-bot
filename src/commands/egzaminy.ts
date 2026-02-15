import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { sasdEmbed } from '../utils/embeds';

export const egzaminy = {
  data: new SlashCommandBuilder()
    .setName('egzaminy')
    .setDescription('Pokaż wolne sloty egzaminacyjne (ten tydzień)'),

  async execute(interaction: ChatInputCommandInteraction) {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    const { data: slots } = await supabase
      .from('exam_slots')
      .select('*, users!exam_slots_created_by_fkey(username, mta_nick)')
      .eq('status', 'available')
      .gte('time_start', now.toISOString())
      .lte('time_start', weekEnd.toISOString())
      .order('time_start', { ascending: true })
      .limit(15);

    const embed = sasdEmbed().setTitle('📋 Wolne sloty egzaminacyjne');

    if (!slots || slots.length === 0) {
      embed.setDescription('Brak wolnych slotów w tym tygodniu.');
    } else {
      const lines = slots.map((s: any) => {
        const date = new Date(s.time_start).toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' });
        const time = new Date(s.time_start).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const examiner = s.users?.mta_nick || s.users?.username || '?';
        return `**${s.exam_type}** — ${date} ${time} (${examiner})`;
      });
      embed.setDescription(lines.join('\n'));
    }

    return interaction.reply({ embeds: [embed] });
  },
};
