const { loadCommands, resetCommands } = require("../loader");
const chalk = require("chalk");

module.exports = (client) => {
  console.log(`Connected as ${chalk.cyanBright(client.user.username)}`);
  resetCommands(client).then(() => {
    loadCommands(client);
  });

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const commandName = interaction.data.name.toLowerCase();

    await client.sendResponse(interaction, 5);

    let command = client.guildSpecificCommands.get(interaction.guild_id).get(commandName);
    if (!command) {
      // if this interaction isn't a guild specific command

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
