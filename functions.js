module.exports = (client) => {
  client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
};
