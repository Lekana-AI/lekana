/**
 * Database Service
 * Handles PostgreSQL connection management
 */
const { Client } = require("pg");

/**
 * Connect to a PostgreSQL database
 * @param {string} connectionUrl - PostgreSQL connection URL
 * @returns {Promise<Client>} Connected client
 */
async function connect(connectionUrl) {
  const client = new Client({
    connectionString: connectionUrl,
    ssl: connectionUrl.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  await client.connect();
  console.log("[Database] Connected to PostgreSQL");
  return client;
}

/**
 * Disconnect from database
 * @param {Client} client
 */
async function disconnect(client) {
  if (client) {
    await client.end();
    console.log("[Database] Disconnected from PostgreSQL");
  }
}

/**
 * Execute a query with error handling
 * @param {Client} client
 * @param {string} query
 * @param {any[]} params
 */
async function query(client, queryText, params = []) {
  try {
    const result = await client.query(queryText, params);
    return result;
  } catch (error) {
    console.error("[Database] Query error:", error.message);
    throw error;
  }
}

module.exports = {
  connect,
  disconnect,
  query,
};
