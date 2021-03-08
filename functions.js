const axios = require("axios");
const fetch = require("node-fetch");
const BASE_URL = "https://discord.com/api/v8";

module.exports = (client) => {
  client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  client.sendMessage = (interaction, message = "placeholder", ephemeral = false) => {
    message = typeof message == "string" ? { content: message } : message;
    message.flags = ephemeral ? 64 : null;
    return axios({
      url: `${BASE_URL}/webhooks/${client.user.id}/${interaction.token}`,
      method: "POST",
      data: message,
    }).catch((e) => console.log(e));
  };

  client.editOriginalResponse = (interaction, message) => {
    message = typeof message == "string" ? { content: message } : message;
    return axios({
      url: `${BASE_URL}/webhooks/${client.user.id}/${interaction.token}/messages/@original`,
      method: "PATCH",
      data: message,
    }).catch((e) => console.log(e));
  };

  client.sendResponse = (interaction, type, message = "placeholder", ephemeral = false) => {
    if (type > 5 || type < 1)
      throw new Error("Ce type d'interaction n'est pas valide");
    let data = typeof message == "string" ? { content: message } : message;
    data.flags = ephemeral ? 64 : null;
    let dataToSend = {
      type,
    };

    if ([3, 4].includes(type)) dataToSend["data"] = data;

    // console.log(dataToSend);
    // console.log(interaction);

    return axios({
      url: `${BASE_URL}/interactions/${interaction.id}/${interaction.token}/callback`,
      method: "POST",
      headers: {
        Authorization: `Bot ${client.config.TOKEN}`,
        "Content-Type": "application/json",
      },
      data: dataToSend,
    })
      .then(() =>
        console.log(require("chalk").blueBright("Normalement c'est bon"))
      )
      .catch((e) => console.log(e));
  };
};
