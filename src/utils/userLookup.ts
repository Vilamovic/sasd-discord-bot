import { supabase } from '../supabase';

/** Find portal user by Discord ID */
export async function getPortalUser(discordId: string) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('discord_id', discordId)
    .single();
  return data;
}

/** Find portal user by MTA nick (case-insensitive) */
export async function getPortalUserByNick(nick: string) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .ilike('mta_nick', nick)
    .single();
  return data;
}

/** Find portal user by Discord mention (resolve @user to discord_id) */
export async function getPortalUserByDiscordUser(discordUserId: string) {
  return getPortalUser(discordUserId);
}
