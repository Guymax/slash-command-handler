const chalk = require("chalk");
const fetch = require("node-fetch");
const { API_URL } = require("../config");
const { readdirSync } = require("fs");

function getGlobalSlashCommands(client) {
  return fetch(`${API_URL}/${client.user.id}/commands`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
  }).then((res) => res.json());
}

function postGlobalSlashCommand(client, slashCommandData) {
  client.api
    .applications(client.user.id)
    .commands.post({ data: slashCommandData })
    .then(() => {
      console.log("global Slash Command " + chalk.cyan(slashCommandData.name) + " sent ");
    });
}

async function deleteGlobalSlashCommand(client, commandID) {
  return await fetch(`${API_URL}/${client.user.id}/commands/${commandID}`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
    method: "DELETE",
  });
}

async function loadGlobalSlashCommands(client, folder) {
  const commands = readdirSync(`${folder}/`).filter((files) => files.endsWith(".js"));
  //global slash commands are processed here
  for (const file of commands) {
    const getFileName = require(`../${folder}/${file}`);
    client.globalSlashCommands.set(getFileName.help.name, getFileName);
    postGlobalSlashCommand(client, getFileName.help);
  }
}

module.exports = async (client, folder) => {
  return await getGlobalSlashCommands(client)
    .then(async (globalCommands) => {
      if (globalCommands.length == 0) return;
      for await (const globalCommand of globalCommands) {
        await deleteGlobalSlashCommand(client, globalCommand.id);
      }
    })
    .then(loadGlobalSlashCommands(client, folder));
};
