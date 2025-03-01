const { Client, LocalAuth } = require("whatsapp-web.js");

const clients = new Map();

const initializeClientWebjs = (session_id) => {
  if (!session_id) throw new Error("Session ID is required");

  if (clients.has(session_id)) {
    console.log(`Client for session ${session_id} already exists`);
    return clients.get(session_id);
  }

  const client = new Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({ clientId: session_id }),
  });

  clients.set(session_id, client);
  return client;
};

const disconnectClient = (session_id) => {
  if (clients.has(session_id)) {
    const client = clients.get(session_id);
    client.destroy();
    clients.delete(session_id);
    console.log(`Disconnected client for session ${session_id}`);
  }
};

const getClient = (session_id) => clients.get(session_id) || null;

module.exports = { initializeClientWebjs, disconnectClient, getClient };
