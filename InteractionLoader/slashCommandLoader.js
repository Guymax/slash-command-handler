const guildSpecificSlashCommandLoader = require("./guildSpecificSlashCommandLoader");
const globalSlashCommandLoader = require("./globalSlashCommandLoader");

module.exports = async (client) => {
  await globalSlashCommandLoader(client, "interactions/slashCommands/global");
  await guildSpecificSlashCommandLoader(client, "interactions/slashCommands/guilds");
};
