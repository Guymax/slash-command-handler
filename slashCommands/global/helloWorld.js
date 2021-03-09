module.exports.run = async (client, interaction) => {
  client.sendEphemeralMessage(interaction, "Cette commande est globale");
};

module.exports.help = {
  name: "test_global",
  description: "test global",
  options: [],
};
