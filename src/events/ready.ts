import { Client, TextChannel } from 'discord.js';
import { config } from '../config';
import { supabase } from '../supabase';
import { formatEvent } from '../formatters';

export function onReady(client: Client) {
  console.log(`✅ Bot zalogowany jako ${client.user?.tag}`);
  console.log(`📡 Guild: ${config.guildId}`);

  // Subscribe to discord_events Realtime
  supabase
    .channel('discord-events')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'discord_events',
      },
      async (payload) => {
        const event = payload.new as {
          id: string;
          event_type: string;
          channel: string;
          data: Record<string, any>;
          processed: boolean;
        };

        if (event.processed) return;

        const channelId = config.channels[event.channel];
        if (!channelId) {
          console.warn(`⚠️ Nieznany kanał: ${event.channel}`);
          return;
        }

        try {
          const channel = client.channels.cache.get(channelId) as TextChannel | undefined;
          if (!channel) {
            console.warn(`⚠️ Kanał ${event.channel} (${channelId}) nie znaleziony w cache`);
            return;
          }

          const embed = formatEvent(event.event_type, event.data);
          if (embed) {
            await channel.send({ embeds: [embed] });
          }

          // Mark as processed
          await supabase
            .from('discord_events')
            .update({ processed: true })
            .eq('id', event.id);
        } catch (error) {
          console.error(`❌ Błąd przetwarzania eventu ${event.id}:`, error);
        }
      }
    )
    .subscribe((status) => {
      console.log(`📡 Realtime status: ${status}`);
    });
}
