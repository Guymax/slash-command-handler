const { readdirSync, read } = require("fs");
const fetch = require("node-fetch");
const axios = require("axios");
const chalk = require("chalk");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const BASE_URL = "https://discord.com/api/v8/applications";

function getGlobalSlashCommands(client) {
  return fetch(`${BASE_URL}/${client.user.id}/commands`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
  }).then((res) => res.json());
}

function getGuildSpecificSlashCommands(client, guildId) {
  return fetch(`${BASE_URL}/${client.user.id}/guilds/${guildId}/commands`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
  }).then((res) => res.json());
}

function postGlobalSlashCommand(client, slashCommandData) {
  console.log(slashCommandData);
  client.api
    .applications(client.user.id)
    .commands.post({ data: slashCommandData })
    .then(() => {
      console.log(
        "Commande Slash globale " +
        chalk.cyan(slashCommandData.name) +
        " envoyée "
      );
    });
}

async function postGuildSpecificSlashCommand(client, guild, slashCommandData) {
  let guildData = await client.guilds.resolve(guild);
  client.api
    .applications(client.user.id)
    .guilds(guild)
    .commands.post({ data: slashCommandData })
    .then(() => {
      console.log(
        "Commande Slash " +
        chalk.cyan(slashCommandData.name) +
        " envoyée sur le serveur " +
        chalk.greenBright(guildData.name)
      );
    });
}

async function deleteGlobalSlashCommand(client, commandID) {
  return await fetch(`${BASE_URL}/${client.user.id}/commands/${commandID}`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
    method: "DELETE",
  });
}

async function deleteGuildSpecificSlashCommand(client, guildId, commandID) {
  return await fetch(
    `${BASE_URL}/${client.user.id}/guilds/${guildId}/commands/${commandID}`,
    {
      headers: { Authorization: `Bot ${client.config.TOKEN}` },
      method: "DELETE",
    }
  );
}

const loadCommands = (client, dir = "./slashCommands/") => {
  readdirSync(dir).forEach((dirs) => {
    if (dirs == "guilds") {
      // commandes slash spécifique à un serveur
      readdirSync(`${dir}${dirs}/`).forEach((guildId) => {
        if (guildId == "guildID") return;
        const commands = readdirSync(
          `${dir}/${dirs}/${guildId}/`
        ).filter((files) => files.endsWith(".js"));
        client.guildSpecificCommands.set(guildId, new Map());
        for (const file of commands) {
          const getFileName = require(`${dir}${dirs}/${guildId}/${file}`);
          client.guildSpecificCommands
            .get(guildId)
            .set(getFileName.help.name, getFileName);
          postGuildSpecificSlashCommand(client, guildId, getFileName.help);
        }
      });
    } else {
      const commands = readdirSync(`${dir}/${dirs}/`).filter((files) =>
        files.endsWith(".js")
      );
      //commande slash globales
      for (const file of commands) {
        const getFileName = require(`${dir}${dirs}/${file}`);
        client.globalSlashCommands.set(getFileName.help.name, getFileName);
        postGlobalSlashCommand(client, getFileName.help);
      }
    }
  });
};

const loadEvents = (client, dir = "./events/") => {
  readdirSync(dir).forEach(() => {
    const events = readdirSync(`${dir}/`).filter((files) =>
      files.endsWith(".js")
    );
    for (const event of events) {
      const evt = require(`${dir}/${event}`);
      const evtName = event.split(".")[0];
      client.on(evtName, evt.bind(null, client));
      console.log(`Event chargé : ${evtName}`);
    }
  });
};


const resetCommands = async client => {
  return await getGlobalSlashCommands(client)
    .then(async (globalCommands) => {
      if (globalCommands.length == 0) return;
      for await (const globalCommand of globalCommands) {
        console.log(globalCommand);
        await deleteGlobalSlashCommand(client, globalCommand.id)
      }
    })
    .then(async () => {
      const guilds = readdirSync("./slashCommands/guilds/");
      for await (const guild of guilds) {
        if (guild == "guildID") return;
        await getGuildSpecificSlashCommands(client, guild).then(
          async (guildCommands) => {
            if (guildCommands.length == 0) return console.log(chalk.yellow(`guild ${guild} didn't have any slash commands actually...`));

            for await (const guildCommand of guildCommands) {
              console.log(guildCommand.name + " has been deleted")
              await deleteGuildSpecificSlashCommand(client, guild, guildCommand.id);
            }
          }
        );
      }
    }).then(() => { return true })
}

module.exports = {
  loadCommands,
  loadEvents,
  resetCommands,
};
