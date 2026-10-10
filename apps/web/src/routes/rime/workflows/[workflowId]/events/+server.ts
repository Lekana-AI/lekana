/**
 * SSE Proxy for real-time workflow events
 * Proxies SSE connection from runtime service to frontend
 */

import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ params, locals, fetch }) => {
    const { workflowId } = params;
    const { userId, getToken } = locals.auth();

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const token = await getToken();
    const upstreamUrl = `${env.RUNTIME_BASE}/api/v1/workflows/${workflowId}/events`;

    console.log(`[SSE Proxy] Connecting to ${upstreamUrl}`);

    try {
        // Connect to upstream SSE
        const response = await fetch(upstreamUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            }
        });

        if (!response.ok) {
            console.error(`[SSE Proxy] Upstream error: ${response.status}`);
            return new Response(`Upstream error: ${response.status}`, { status: response.status });
        }

        // Return the SSE stream directly, preserving headers
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        });
    } catch (error: any) {
        console.error('[SSE Proxy] Error:', error);
        return new Response(`SSE Proxy Error: ${error.message}`, { status: 500 });
    }
};
