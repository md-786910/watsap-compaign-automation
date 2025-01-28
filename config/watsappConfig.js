const { Client, LocalAuth } = require("whatsapp-web.js");
// const { emitIOMessage } = require("./socketManager");

// WhatsApp client configuration
const client = new Client({
  puppeteer: {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth({ clientId: "LOCAL_ID" }),
});

// Event handlers
client.on("qr", (qr) => {
  console.log("QR Code:", qr);
});
client.on("ready", () => {
  console.log("WhatsApp Web is ready!");
  // emitIOMessage("watsapp connected successfully");
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
  // emitIOMessage("whatsapp authentication failed");
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  // Implement reconnection logic
  // emitIOMessage("whatsapp disconnected " + reason);
});

module.exports = client;
