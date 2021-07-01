const { DiscordAPIError } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, interaction) => {
  let clientSideInteraction;
  // console.log(interaction);
  if (interaction.isButton()) {
    clientSideInteraction = client.buttons.get(interaction.customID);
    console.log(clientSideInteraction);
    if (!clientSideInteraction) {
      throw new DiscordAPIError("Unknow Button : " + interaction.customID);
    } else {
      clientSideInteraction.run(client, interaction);
    }
  } else if (interaction.isSelectMenu()) {
    clientSideInteraction = client.selectMenus.get(interaction.customID);
    console.log(clientSideInteraction);
    if (!clientSideInteraction) {
      throw new DiscordAPIError("Unknow Select Menu : " + interaction.customID);
    } else {
      clientSideInteraction.run(client, interaction);
    }
  } else if (interaction.isCommand()) {
    if (interaction.inGuild()) {
      //try to get the guild command
      clientSideInteraction = client.guildSpecificCommands.get(interaction.guildID).get(interaction.commandName);
    }

    if (!clientSideInteraction) {
      //if the guild command is not found then try to get a global one
      clientSideInteraction = client.globalSlashCommands.get(interaction.commandName);
    }

    if (!clientSideInteraction) {
      //if this process can't handle this command, throw an error
      throw new DiscordAPIError("Unknow command :" + interaction.commandName);
    } else {
      clientSideInteraction.run(client, interaction);
    }
  } else {
    throw new DiscordAPIError("Unknow Interaction type : " + interaction.type);
  }
};
