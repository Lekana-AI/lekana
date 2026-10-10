import adapterAuto from '@sveltejs/adapter-auto';
import adapterNode from '@sveltejs/adapter-node';

// SVELTE_ADAPTER=node builds a standalone Node server (Docker / VM / Cloud Run).
// Otherwise adapter-auto picks the right adapter for Vercel, Netlify, Cloudflare, etc.
const useNode = process.env.SVELTE_ADAPTER === 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: useNode ? adapterNode({ out: 'build' }) : adapterAuto()
	}
};

export default config;
