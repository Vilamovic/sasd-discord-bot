import { EmbedBuilder } from 'discord.js';
import { formatChangelog } from '../commands/patchnotes';

export function formatPatchnotes(_type: string, data: Record<string, any>): EmbedBuilder | null {
  return formatChangelog({
    version: data.version,
    title: data.title,
    changes: data.changes,
    created_at: data.created_at || new Date().toISOString(),
  });
}
