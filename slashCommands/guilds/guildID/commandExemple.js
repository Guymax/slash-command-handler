module.exports.run = async (client, interaction) => {
  client.sendMessage(
    interaction,
    "Cette commande est unique à ce serveur",
    true
  );
};

module.exports.help = {
  name: "test_guild",
  description:
    "test sur un serveur",
  options: [],
};
