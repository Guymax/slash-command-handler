module.exports.run = async (client, interaction) => {
  interaction.reply({ content: "prout" });
};

module.exports.help = {
  name: "global_test", //you can't put a whitespace char in slash Commands names
  description: "This is a global test Command",
  options: [],
};
