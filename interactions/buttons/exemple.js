module.exports.run = (client, interaction) => {
  interaction.update({ content: "The button was pressed", components:[] });
};

module.exports.help = {
  id: "buttonTest",
};
