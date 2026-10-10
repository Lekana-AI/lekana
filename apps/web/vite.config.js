import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: true,
		// Comma-separated extra hosts allowed by the dev server (e.g. an ngrok tunnel)
		allowedHosts: process.env.VITE_ALLOWED_HOSTS?.split(',').filter(Boolean) ?? []
	}
});
