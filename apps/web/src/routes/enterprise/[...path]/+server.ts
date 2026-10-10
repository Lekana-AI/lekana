// src/routes/api/[...path]/+server.ts
import type { RequestHandler } from '../$types';

import { env } from '$env/dynamic/private';

const ENTERPRISE_BASE = env.ENTERPRISE_BASE;
const ENTERPRISE_TOKEN = env.ENTERPRISE_TOKEN;

const handler: RequestHandler = async (event) => {
	const { params, url, fetch, request } = event;
	
	// Build upstream URL: base + path + query
	const path = params.path ? `/${params.path}` : '';
	const upstreamUrl = new URL(ENTERPRISE_BASE + path);
	upstreamUrl.search = url.search;

	// Prepare headers and body. If we forward a streaming body we must set
	// `duplex: 'half'` for undici/node-fetch compatibility when running in
	// the dev server (Vite uses undici under the hood).
	const headers = new Headers(request.headers);
	headers.set('Authorization', `Bearer ${ENTERPRISE_TOKEN}`);

	const hasBody = !(request.method === 'GET' || request.method === 'HEAD');

	// RequestInit doesn't include `duplex` in the TS types, so use a
	// widened type for the init object at runtime.
	const init: RequestInit & { duplex?: 'half' } = {
		method: request.method,
		headers,
		body: hasBody ? request.body : undefined,
		...(hasBody ? { duplex: 'half' } : {})
	};

	const upstreamRes = await fetch(upstreamUrl, init);

	// Stream back the response
	return new Response(upstreamRes.body, {
		status: upstreamRes.status,
		headers: upstreamRes.headers
	});
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
