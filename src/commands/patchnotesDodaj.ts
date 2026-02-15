import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { supabase } from '../supabase';
import { isDev } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { formatChangelog } from './patchnotes';
import { config } from '../config';

export const patchnotesDodaj = {
  data: new SlashCommandBuilder()
    .setName('patchnotes-dodaj')
    .setDescription('[DEV] Dodaj wpis patchnotes i opublikuj na kanał')
    .addStringOption((o) => o.setName('wersja').setDescription('Wersja (np. v1.7.0)').setRequired(true))
    .addStringOption((o) => o.setName('tytul').setDescription('Krótki tytuł aktualizacji').setRequired(true))
    .addStringOption((o) =>
      o.setName('zmiany').setDescription('Zmiany w formacie: new:tekst|fix:tekst|change:tekst').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !isDev(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Tylko DEV może dodawać patchnotes.')], ephemeral: true });
    }

    const version = interaction.options.getString('wersja', true);
    const title = interaction.options.getString('tytul', true);
    const changesRaw = interaction.options.getString('zmiany', true);

    // Parse changes: "new:tekst|fix:tekst|change:tekst"
    const changes = changesRaw.split('|').map((item) => {
      const colonIdx = item.indexOf(':');
      if (colonIdx === -1) return { type: 'other', text: item.trim() };
      return {
        type: item.slice(0, colonIdx).trim(),
        text: item.slice(colonIdx + 1).trim(),
      };
    });

    const actor = await getPortalUser(interaction.user.id);

    const { data: entry, error } = await supabase
      .from('changelogs')
      .insert({
        version,
        title,
        changes,
        created_by: actor?.id,
      })
      .select()
      .single();

    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    // Auto-post to patchnotes channel
    const channelId = config.channels['patchnotes'];
    if (channelId) {
      try {
        const channel = interaction.client.channels.cache.get(channelId) as TextChannel | undefined;
        if (channel) {
          const embed = formatChangelog(entry);
          await channel.send({ embeds: [embed] });
        }
      } catch (e) {
        console.error('Patchnotes auto-post error:', e);
      }
    }

    return interaction.reply({
      embeds: [successEmbed(`Patchnotes **${version}** opublikowane na kanał! (${changes.length} zmian)`)],
      ephemeral: true,
    });
  },
};
