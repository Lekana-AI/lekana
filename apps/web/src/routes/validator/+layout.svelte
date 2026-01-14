<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<title>Validator Portal - Lekana</title>
</svelte:head>

<div class="flex min-h-screen bg-zinc-950">
	<!-- Sidebar -->
	<aside class="w-64 border-r border-white/5 bg-zinc-900 p-6">
		<div class="mb-8">
			<h1 class="text-xl font-bold text-white">Validator Portal</h1>
			<p class="text-xs text-zinc-400">Document Review Queue</p>
		</div>

		<nav class="space-y-2">
			<a
				href="/validator"
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm
				{page.url.pathname === '/validator'
					? 'bg-green-500/20 text-green-400'
					: 'text-zinc-400 hover:bg-white/5 hover:text-white'}"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
				Review Queue
			</a>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
