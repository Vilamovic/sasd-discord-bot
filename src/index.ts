import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from './config';
import { onReady } from './events/ready';
import { onInteractionCreate } from './events/interactionCreate';
import { loadCommands } from './commands';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Store commands on client for interactionCreate handler
(client as any).commands = new Collection();

async function main() {
  // Load all slash commands
  const commands = loadCommands();
  for (const cmd of commands) {
    (client as any).commands.set(cmd.data.name, cmd);
  }

  // Register event handlers (clientReady = discord.js v15 compat)
  client.once('ready', async () => {
    onReady(client);

    // Auto-register slash commands on startup
    try {
      const rest = new REST().setToken(config.token);
      const commandData = commands.map((c) => c.data.toJSON());
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commandData });
      console.log(`✅ Zarejestrowano ${commandData.length} slash commands`);
    } catch (err) {
      console.error('❌ Błąd rejestracji komend:', err);
    }
  });
  client.on('interactionCreate', (interaction) => onInteractionCreate(interaction, client));

  // Login
  await client.login(config.token);
}

main().catch(console.error);
