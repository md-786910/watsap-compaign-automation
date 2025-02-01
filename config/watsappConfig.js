const { Client, LocalAuth } = require("whatsapp-web.js");

let client = null; // Store the WhatsApp client instance

const initializeClientWebjs = (clientId = "default") => {
  if (client) {
    console.log("WhatsApp client is already initialized.");
    return client;
  }
  client = new Client({
    puppeteer: {
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({ clientId }),
  });

  return client;
};

const disconnectClient = () => {
  if (client) {
    client.destroy();
    client = null;
    console.log("WhatsApp client disconnected.");
  } else {
    console.log("No active WhatsApp client to disconnect.");
    throw new Error("No active WhatsApp client to disconnect.");
  }
};

const getClient = () => {
  if (!client) {
    console.log("WhatsApp client is not initialized.");
    return false;
  }
  return client;
};

module.exports = { initializeClientWebjs, disconnectClient, getClient };
