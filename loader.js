const { readdirSync } = require("fs");
const fetch = require("node-fetch");
const chalk = require("chalk");
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
  client.api
    .applications(client.user.id)
    .commands.post({ data: slashCommandData })
    .then(() => {
      console.log("global Slash Command " + chalk.cyan(slashCommandData.name) + " sent ");
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
        `Slash Command ${chalk.cyan(slashCommandData.name)} sent on guild ${chalk.greenBright(guildData.name)}`
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
  return await fetch(`${BASE_URL}/${client.user.id}/guilds/${guildId}/commands/${commandID}`, {
    headers: { Authorization: `Bot ${client.config.TOKEN}` },
    method: "DELETE",
  });
}

const loadCommands = (client, dir = "./slashCommands/") => {
  readdirSync(dir).forEach((dirs) => {
    if (dirs == "guilds") {
      // guild specific slash Commands are processed here
      readdirSync(`${dir}${dirs}/`).forEach((guildId) => {
        if (
          client.guilds.cache.map((g) => g.id).includes(guildId) // test if the guild is in the cache of the bot to prevent errors
        ) {
          const commands = readdirSync(`${dir}/${dirs}/${guildId}/`).filter((files) => files.endsWith(".js"));
          client.guildSpecificCommands.set(guildId, new Map());
          for (const file of commands) {
            const getFileName = require(`${dir}${dirs}/${guildId}/${file}`);
            client.guildSpecificCommands.get(guildId).set(getFileName.help.name, getFileName);
            postGuildSpecificSlashCommand(client, guildId, getFileName.help);
          }
        }
      });
    } else {
      const commands = readdirSync(`${dir}${dirs}/`).filter((files) => files.endsWith(".js"));
      //global slash commands are processed here
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
    const events = readdirSync(`${dir}/`).filter((files) => files.endsWith(".js"));
    for (const event of events) {
      const evt = require(`${dir}/${event}`);
      const evtName = event.split(".")[0];
      client.on(evtName, evt.bind(null, client));
      console.log(`Event loaded : ${evtName}`);
    }
  });
};

const resetCommands = async (client) => {
  return await getGlobalSlashCommands(client)
    .then(async (globalCommands) => {
      if (globalCommands.length == 0) return;
      for await (const globalCommand of globalCommands) {
        await deleteGlobalSlashCommand(client, globalCommand.id);
      }
    })
    .then(async () => {
      for await (const guild of client.guilds.cache.array()) {
        await getGuildSpecificSlashCommands(client, guild.id).then(async (guildCommands) => {
          if (guildCommands.length == 0)
            return console.log(chalk.yellow(`guild ${guild.name} didn't have any slash commands actually...`));

          for await (const guildCommand of guildCommands) {
            await deleteGuildSpecificSlashCommand(client, guild, guildCommand.id);
            console.log(
              `${chalk.cyanBright(guildCommand.name)} has been deleted of guild ${chalk.greenBright(guild.name)}`
            );
          }
        });
      }
    })
    .then(() => {
      return true;
    });
};

module.exports = {
  loadCommands,
  loadEvents,
  resetCommands,
};
