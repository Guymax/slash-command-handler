const { loadInteractions } = require("../loader");
const chalk = require("chalk");

module.exports = (client) => {
  console.log(`Connected as ${chalk.cyanBright(client.user.username)}`);
  loadInteractions(client);

};
