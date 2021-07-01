const { Client, Intents, Collection } = require("discord.js");
const { loadEvents } = require("./loader");

const client = new Client({ intents: Intents.ALL });

client.config = require("./config");
["guildSpecificCommands", "globalSlashCommands", "buttons", "selectMenus"].forEach(
  (x) => (client[x] = new Collection())
);

loadEvents(client);
require("./functions")(client);

client.login(client.config.TOKEN);
