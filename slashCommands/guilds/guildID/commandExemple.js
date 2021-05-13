module.exports.run = async (client, interaction) => {
  client.sendMessage(interaction, "Hello Guild", true);
};

module.exports.help = {
  name: "guild_test",
  description: "This is a guild test command",
  options: [],
};
