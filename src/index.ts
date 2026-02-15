import { Client, GatewayIntentBits, Collection } from 'discord.js';
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

  // Register event handlers
  client.once('ready', () => onReady(client));
  client.on('interactionCreate', (interaction) => onInteractionCreate(interaction, client));

  // Login
  await client.login(config.token);
}

main().catch(console.error);
