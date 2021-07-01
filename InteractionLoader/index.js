const slashCommandLoader = require("./slashCommandLoader");
const buttonLoader = require("./buttonLoader");
const selectMenuLoader = require("./selectMenuLoader");

module.exports = async (client) => {
  await slashCommandLoader(client);
  await buttonLoader(client, "interactions/buttons/");
  await selectMenuLoader(client, "interactions/selectMenus/");
};
