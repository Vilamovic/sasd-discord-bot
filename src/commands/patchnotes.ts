import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { supabase } from '../supabase';
import { sasdEmbed, errorEmbed } from '../utils/embeds';

function formatChangelog(entry: any): EmbedBuilder {
  const changes = entry.changes as { type: string; text: string }[];

  const grouped: Record<string, string[]> = {};
  for (const c of changes) {
    const key = c.type || 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c.text);
  }

  const sectionEmojis: Record<string, string> = {
    new: '🆕 Nowości',
    fix: '🔧 Poprawki',
    change: '🔄 Zmiany',
    remove: '🗑️ Usunięte',
    other: '📋 Inne',
  };

  const sections = Object.entries(grouped)
    .map(([type, items]) => {
      const header = sectionEmojis[type] || `📋 ${type}`;
      const list = items.map((i) => `• ${i}`).join('\n');
      return `**${header}**\n${list}`;
    })
    .join('\n\n');

  const date = new Date(entry.created_at).toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return sasdEmbed()
    .setTitle(`📦 ${entry.version} — ${entry.title}`)
    .setDescription(sections)
    .setFooter({ text: `SASD Portal • ${date}` })
    .setColor(0x3a6a3a);
}

export const patchnotes = {
  data: new SlashCommandBuilder()
    .setName('patchnotes')
    .setDescription('Pokaż ostatnie aktualizacje portalu')
    .addIntegerOption((o) => o.setName('ile').setDescription('Ile wersji pokazać (domyślnie 1)').setMinValue(1).setMaxValue(5)),

  async execute(interaction: ChatInputCommandInteraction) {
    const count = interaction.options.getInteger('ile') || 1;

    const { data: entries } = await supabase
      .from('changelogs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(count);

    if (!entries || entries.length === 0) {
      return interaction.reply({ embeds: [errorEmbed('Brak wpisów patchnotes.')], ephemeral: true });
    }

    const embeds = entries.map(formatChangelog);
    return interaction.reply({ embeds });
  },
};

// Export formatter for auto-post
export { formatChangelog };
