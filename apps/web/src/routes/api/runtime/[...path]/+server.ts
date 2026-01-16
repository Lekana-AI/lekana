// src/routes/api/runtime/[...path]/+server.ts
// Proxy requests to the runtime service
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const RUNTIME_BASE = env.RUNTIME_BASE;

const handler: RequestHandler = async (event) => {
    const { locals, params, url, fetch, request } = event;
    const { userId, getToken } = locals.auth();

    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const token = await getToken();

    // Build upstream URL: base + /api/v1 + path + query
    const path = params.path ? `/${params.path}` : '';
    const upstreamUrl = new URL(`${RUNTIME_BASE}/api/v1${path}`);
    upstreamUrl.search = url.search;

    const headers = new Headers(request.headers);
    headers.set('Authorization', `Bearer ${token}`);

    const hasBody = !(request.method === 'GET' || request.method === 'HEAD');

    const init: RequestInit & { duplex?: 'half' } = {
        method: request.method,
        headers,
        body: hasBody ? request.body : undefined,
        ...(hasBody ? { duplex: 'half' } : {})
    };

    const upstreamRes = await fetch(upstreamUrl, init);

    return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: upstreamRes.headers
    });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
