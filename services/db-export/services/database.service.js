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
 * Test database connection
 * @param {string} connectionUrl - PostgreSQL connection URL
 * @returns {Promise<{success: boolean, message: string, details?: object}>}
 */
async function testConnection(connectionUrl) {
  const startTime = Date.now();
  let client;

  try {
    client = new Client({
      connectionString: connectionUrl,
      ssl: connectionUrl.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
      connectionTimeoutMillis: 10000, // 10 second timeout
    });

    await client.connect();

    // Run a simple query to verify connection
    const result = await client.query(
      "SELECT current_database(), current_user, version()"
    );
    const row = result.rows[0];

    const connectionTime = Date.now() - startTime;
    console.log(`[Database] Connection test successful in ${connectionTime}ms`);

    return {
      success: true,
      message: "Connection successful",
      details: {
        database: row.current_database,
        user: row.current_user,
        version: row.version.split(" ").slice(0, 2).join(" "),
        connectionTimeMs: connectionTime,
      },
    };
  } catch (error) {
    const connectionTime = Date.now() - startTime;
    console.error(
      `[Database] Connection test failed in ${connectionTime}ms:`,
      error.message
    );

    return {
      success: false,
      message: error.message,
      details: {
        code: error.code,
        connectionTimeMs: connectionTime,
      },
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
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
    // Log query details
    console.log(
      "[Database] QUERY:",
      queryText.replace(/\s+/g, " ").substring(0, 200) +
        (queryText.length > 200 ? "..." : "")
    );
    if (params.length > 0) {
      const truncatedParams = params.map((p) => {
        const str = String(p);
        return str.length > 50 ? str.substring(0, 50) + "..." : str;
      });
      console.log("[Database] PARAMS:", JSON.stringify(truncatedParams));
    }

    const result = await client.query(queryText, params);
    console.log(`[Database] Query OK - ${result.rowCount ?? 0} rows affected`);
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
  testConnection,
};
