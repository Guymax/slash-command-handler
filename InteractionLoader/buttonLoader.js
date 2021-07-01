const { readdirSync } = require("fs")

module.exports = (client, folder) => {
  // return true;
  const buttons = readdirSync(folder).filter((files) => files.endsWith(".js"));
  //global slash buttons are processed here
  for (const file of buttons) {
    const getFileName = require(`../${folder}/${file}`);
    client.buttons.set(getFileName.help.id, getFileName);
    console.log(`Button Loaded : ${getFileName.help.id}`)
  }
};
