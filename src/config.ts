import 'dotenv/config';

export const config = {
  // Discord
  token: process.env.DISCORD_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID!,
  guildId: process.env.DISCORD_GUILD_ID!,

  // Channel IDs (mapped from discord_events.channel)
  channels: {
    'logi-kadry': process.env.CHANNEL_KADRY!,
    'logi-kary-nagrody': process.env.CHANNEL_KARY!,
    'logi-egzaminy': process.env.CHANNEL_EGZAMINY!,
    'logi-raporty': process.env.CHANNEL_RAPORTY!,
    'logi-zgloszenia': process.env.CHANNEL_ZGLOSZENIA!,
    'logi-mdt': process.env.CHANNEL_MDT!,
    'patchnotes': process.env.CHANNEL_PATCHNOTES!,
  } as Record<string, string>,

  // Role IDs for permission checks
  roleCS: process.env.ROLE_CS!,
  roleHCS: process.env.ROLE_HCS!,
  devDiscordId: process.env.DEV_DISCORD_ID!,

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
};
