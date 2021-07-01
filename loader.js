const { readdirSync, readFileSync } = require("fs");

const loadInteractions = require("./InteractionLoader/index.js");

const loadEvents = (client, dir = "./events/") => {
  readdirSync(dir)
    .filter((files) => files.endsWith(".js"))
    .forEach((event) => {
      const evt = require(`${dir}/${event}`);
      const evtName = event.split(".")[0];
      client.on(evtName, evt.bind(null, client));
      console.log(`Event loaded : ${evtName}`);
    });
};

module.exports = {
  loadEvents,
  loadInteractions,
};
