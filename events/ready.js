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
    // console.log(interaction);

    //permet de signifier à l'api qu'on a bien pris en compte son appel et qu'on va traiter ça même si ça peut prendre un peu de temps
    console.log(chalk.redBright("triggered"));
    // await axios({
    //   url: `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`,
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bot ${client.config.TOKEN}`,
    //     "Content-Type": "application/json",
    //   },
    //   // data: dataToSend,
    //   data: {
    //     type: "5",
    //     data: {
    //       content: "test",
    //       flags: 64,
    //     },
    //   },
    // }).catch((e) => console.log("Erreur création callback"));

    await client.sendResponse(interaction, 5);

    let command = client.guildSpecificCommands
      .get(interaction.guild_id)
      .get(commandName);
    if (!command) {
      // si jamais la commande n'est pas dans celles spécifique au serveur

      command = client.globalSlashCommands.get(commandName);
      if (!command) {
        console.log(chalk.red("alors là c'est pas normal"));
      } else {
        command.run(client, interaction);
      }
    } else {
      command.run(client, interaction);
    }
  });
};
