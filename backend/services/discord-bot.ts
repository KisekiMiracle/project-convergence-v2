import { Client, Events, GatewayIntentBits } from "discord.js";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export async function startDiscordBot() {
  discordClient.on(Events.ClientReady, () => {
    console.log(`🚀 Discord Bot logged in as ${discordClient.user?.tag}`);
  });

  // Example: Listen for a command
  discordClient.on(Events.MessageCreate, (message) => {
    if (message.content === "!ping") {
      console.log(message.content);
      message.reply("Pong! The backend is alive.");
    }
  });

  await discordClient.login(process.env.DISCORD_TOKEN);
}
