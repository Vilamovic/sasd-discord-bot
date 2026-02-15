import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { sasdEmbed } from '../utils/embeds';

export const stats = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Pokaż statystyki portalu SASD'),

  async execute(interaction: ChatInputCommandInteraction) {
    const [
      { count: userCount },
      { count: materialCount },
      { count: examCount },
      { count: reportCount },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('materials').select('*', { count: 'exact', head: true }),
      supabase.from('exam_results').select('*', { count: 'exact', head: true }),
      supabase.from('division_reports').select('*', { count: 'exact', head: true }),
    ]);

    const embed = sasdEmbed()
      .setTitle('📊 Statystyki SASD Portal')
      .addFields(
        { name: '👤 Użytkownicy', value: `${userCount || 0}`, inline: true },
        { name: '📚 Materiały', value: `${materialCount || 0}`, inline: true },
        { name: '📝 Egzaminy', value: `${examCount || 0}`, inline: true },
        { name: '📋 Raporty', value: `${reportCount || 0}`, inline: true },
      )
      .setFooter({ text: 'SASD Portal v1.6.0' });

    return interaction.reply({ embeds: [embed] });
  },
};
