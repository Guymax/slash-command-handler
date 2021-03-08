const chalk = require("chalk");
const Discord = require("discord.js");
const { loadEvents } = require("./loader");

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_PRESENCES",
      "GUILD_BANS",
      "GUILD_MEMBERS",
      "GUILD_VOICE_STATES",
      "GUILD_MESSAGE_REACTIONS",
    ],
  },
});

client.config = require("./config");
["guildSpecificCommands", "globalSlashCommands"].forEach(
  (x) => (client[x] = new Discord.Collection())
);

loadEvents(client);
require("./functions")(client);

client.login(client.config.TOKEN).then(console.log(chalk.yellow("Client Connecté")));
