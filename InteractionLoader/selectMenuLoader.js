const { readdirSync } = require("fs")

module.exports = (client, folder) => {
  // return true;
  const buttons = readdirSync(folder).filter((files) => files.endsWith(".js"));
  //global slash buttons are processed here
  for (const file of buttons) {
    const getFileName = require(`../${folder}/${file}`);
    client.selectMenus.set(getFileName.help.id, getFileName);
    console.log(`SelectMenu Loaded : ${getFileName.help.id}`)
  }
};
