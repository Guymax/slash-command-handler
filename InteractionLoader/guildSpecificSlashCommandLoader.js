const fetch = require("node-fetch");
const chalk = require("chalk");
const { API_URL } = require("../config");
const { readdirSync } = require("fs")


function getGuildSpecificSlashCommands(client, guildId) {
  return fetch(`${API_URL}/${client.user.id}/guilds/${guildId}/commands`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
  }).then((res) => res.json());
}

async function postGuildSpecificSlashCommand(client, guild, slashCommandData) {
  let guildData = await client.guilds.resolve(guild);
  client.api
    .applications(client.user.id)
    .guilds(guild)
    .commands.post({ data: slashCommandData })
    .then(() => {
      console.log(
        `Slash Command ${chalk.cyan(slashCommandData.name)} sent on guild ${chalk.greenBright(guildData.name)}`
      );
    });
}
async function deleteGuildSpecificSlashCommand(client, guildId, commandID) {
  return await fetch(`${API_URL}/${client.user.id}/guilds/${guildId}/commands/${commandID}`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
    method: "DELETE",
  });
}

async function loadGuildSpecificSlashCommands(client, folder) {
  // guild specific slash Commands are processed here
  readdirSync(`${folder}/`).forEach((guildId) => {
    if (
      client.guilds.cache.map((g) => g.id).includes(guildId) // test if the guild is in the cache of the bot to prevent errors
    ) {
      const commands = readdirSync(`${folder}/${guildId}/`).filter((files) => files.endsWith(".js"));
      client.guildSpecificCommands.set(guildId, new Map());
      for (const file of commands) {
        const getFileName = require(`../${folder}/${guildId}/${file}`);
        client.guildSpecificCommands.get(guildId).set(getFileName.help.name, getFileName);
        postGuildSpecificSlashCommand(client, guildId, getFileName.help);
      }
    }
  });
}

module.exports = async (client, folder) => {
  for await (const guild of client.guilds.cache.array()) {
    await getGuildSpecificSlashCommands(client, guild.id).then(async (guildCommands) => {
      if (guildCommands.length == 0) {
        return console.log(chalk.yellow(`guild ${guild.name} didn't have any slash commands actually...`));
      } else {
        for await (const guildCommand of guildCommands) {
          await deleteGuildSpecificSlashCommand(client, guild, guildCommand.id);
          console.log(
            `${chalk.cyanBright(guildCommand.name)} has been deleted of guild ${chalk.greenBright(guild.name)}`
          );
        }
      }
    });
  }
  return loadGuildSpecificSlashCommands(client, folder);
};
