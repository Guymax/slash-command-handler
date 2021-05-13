module.exports.run = async (client, interaction) => {
  await client.sleep(2000);
  client.sendMessage(interaction, "Hello Global World !!", true);
};

module.exports.help = {
  name: "global_test", //you can't put a whitespace char in slash Commands names
  description: "This is a global test Command",
  options: [],
};
