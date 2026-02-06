/**
 * Database Utility Controller
 * Handles database connection testing
 */
import { Request, Response } from 'express';
import { Client } from 'pg';

/**
 * POST /utils/test-connection
 * Test a PostgreSQL database connection
 */
export const testConnection = async (req: Request, res: Response) => {
    const { databaseUrl } = req.body;

    if (!databaseUrl) {
        return res.status(400).json({
            success: false,
            message: 'databaseUrl is required'
        });
    }

    const startTime = Date.now();
    let client: Client | null = null;

    try {
        client = new Client({
            connectionString: databaseUrl,
            ssl: databaseUrl.includes('sslmode=require')
                ? { rejectUnauthorized: false }
                : undefined,
            connectionTimeoutMillis: 10000 // 10 second timeout
        });

        await client.connect();

        // Run a simple query to verify connection
        const result = await client.query(
            'SELECT current_database(), current_user, version()'
        );
        const row = result.rows[0];


        const currentUser = row.current_user;
        let warning = null;

        // Check for admin/superuser accounts
        const adminKeywords = ['postgres', 'admin', 'owner', 'root'];
        if (adminKeywords.some(keyword => currentUser.toLowerCase().includes(keyword))) {
            warning = `You are connected as '${currentUser}'. It is recommended to use a service account with limited permissions.`;
        }


        const connectionTime = Date.now() - startTime;
        console.log(`[Database] Connection test successfull in ${connectionTime}ms`);

        res.json({
            success: true,
            message: 'Connection successfull',
            warning,
            details: {
                database: row.current_database,
                user: row.current_user,
                version: row.version.split(' ').slice(0, 2).join(' '),
                connectionTimeMs: connectionTime
            }
        });
    } catch (error: any) {
        const connectionTime = Date.now() - startTime;
        console.error(`[Database] Connection test failed in ${connectionTime}ms:`, error.message);

        res.json({
            success: false,
            message: error.message,
            details: {
                code: error.code,
                connectionTimeMs: connectionTime
            }
        });
    } finally {
        if (client) {
            try {
                await client.end();
            } catch (e) {
                // Ignore disconnect errors
            }
        }
    }
};
