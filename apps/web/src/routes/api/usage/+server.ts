// src/routes/api/usage/+server.ts
// Proxy requests to the workflow-builder usage endpoint
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const WORKFLOW_BASE = env.WORKFLOW_BASE;

export const GET: RequestHandler = async (event) => {
    const { locals, fetch } = event;
    const { userId, getToken } = locals.auth();

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const token = await getToken();

    const upstreamUrl = `${WORKFLOW_BASE}/usage`;

    const upstreamRes = await fetch(upstreamUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: upstreamRes.headers
    });
};
