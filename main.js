const chalk = require("chalk");
const Discord = require("discord.js");
const { loadEvents } = require("./loader");

const client = new Discord.Client();

client.config = require("./config");
["guildSpecificCommands", "globalSlashCommands"].forEach((x) => (client[x] = new Discord.Collection()));

loadEvents(client);
require("./functions")(client);

client.login(client.config.TOKEN);
