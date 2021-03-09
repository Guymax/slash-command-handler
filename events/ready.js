const { loadCommands, resetCommands } = require("../loader");
const chalk = require("chalk");
const axios = require("axios");

module.exports = (client) => {
  console.log(`connecté en tant que ${client.user.username}`);
  resetCommands(client).then(() => {
    loadCommands(client);
  });

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const commandName = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    await client.sendResponse(interaction, 5);

    let command = client.guildSpecificCommands
      .get(interaction.guild_id)
      .get(commandName);
    if (!command) {
      // si jamais la commande n'est pas dans celles spécifique au serveur

      command = client.globalSlashCommands.get(commandName);
      if (!command) {
        console.log(chalk.red("this is due because someone asked a command that isn't here"));
      } else {
        command.run(client, interaction);
      }
    } else {
      command.run(client, interaction);
    }
  });
};
