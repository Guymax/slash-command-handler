module.exports.run = (client, interaction) => {
  interaction.update({
    content: `You choose the following classes :\n${interaction.values.join("\n")}`,
    components: [],
  });
};

module.exports.help = {
  id: "selectMenuTest",
};
