<script lang="ts">
	import { Check, Copy, Key, Terminal, X, Rocket, Clock, ArrowUp } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { workflow, onClose, onSubmit } = $props();

	let isPublishing = $state(false);
	let publishResult = $state<any>(null);
	let copiedKey = $state(false);
	let copiedEndpoint = $state(false);

	async function publishWorkflow() {
		isPublishing = true;
		try {
			const res = await fetch('/rime/publish', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ workflowId: workflow.id })
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Publish error:', errorText);
				throw new Error(`Failed to publish workflow: ${res.status}`);
			}

			publishResult = await res.json();
			console.log('Workflow published successfully response:', publishResult);
			// Refresh workflow status if needed (parent should handle this ideally)
		} catch (error) {
			console.error('Error publishing workflow:', error);
		} finally {
			isPublishing = false;
            onSubmit();
		}
	}

	onMount(async () => {
		if (workflow.isPublished) {
			try {
				const res = await fetch(`/rime/workflows/${workflow.id}/keys`);
				if (res.ok) {
					const data = await res.json();
					console.log('Fetched workflow keys response:', data);
					publishResult = data;
				} else {
					console.error('Failed to fetch keys:', await res.text());
				}
			} catch (error) {
				console.error('Error fetching keys:', error);
			}
		}
	});

	function copyToClipboard(text: string, type: 'key' | 'endpoint') {
		if (!text) return;
		navigator.clipboard.writeText(text);
		if (type === 'key') {
			copiedKey = true;
			setTimeout(() => (copiedKey = false), 2000);
		} else {
			copiedEndpoint = true;
			setTimeout(() => (copiedEndpoint = false), 2000);
		}
	}

	function formatRelativeTime(dateString: string | null) {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	}

	// Helpers to handle different response formats
	const apiKey = $derived(publishResult?.apiKeys?.[0]?.key);
	const apiKeyPrefix = $derived(
		publishResult?.apiKeys?.[0]?.keyPrefix || publishResult?.apiKeys?.[0]?.prefix
	);
	const runEndpoint = $derived(
		publishResult?.runEndpoint || `/api/v1/workflows/${workflow.id}/run`
	);
	const createdAt = $derived(publishResult?.apiKeys?.[0]?.createdAt);
	const lastUsedAt = $derived(publishResult?.apiKeys?.[0]?.lastUsedAt);
</script>

<main
	class="absolute inset-0 z-100 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-sm"
>
	<div class="z-10 flex h-full flex-col justify-center gap-8">
		<div class="w-full max-w-xl rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-2xl">
			<!-- Header -->
			<div class="relative flex w-full flex-col gap-2 pb-6">
				<div class="flex items-center justify-end">
					<button
						onclick={() => onClose()}
						class="rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
				<span class="flex items-center gap-2">
					<Rocket class="h-6 w-6 text-white" />
					<h1 class="text-2xl font-semibold text-white md:text-3xl">
						{workflow.isPublished || publishResult ? 'Workflow Published' : 'Publish Workflow'}
					</h1>
				</span>
				<p class="mt-1 w-full text-sm text-zinc-400">
					{workflow.isPublished || publishResult
						? 'Manage your deployed workflow and its API access.'
						: 'Ready to take your workflow live? This will create a secure API endpoint.'}
				</p>
			</div>

			{#if !workflow.isPublished && !publishResult}
				<div class="space-y-6">
					<div class="rounded-xl border border-dashed border-white/10 bg-white/5 p-6">
						<ul class="space-y-3">
							<li class="flex items-start gap-3">
								<div
									class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500"
								>
									<Check class="h-2.5 w-2.5" />
								</div>
								<p class="text-sm text-zinc-300">Create a secure link to run your workflow from anywhere</p>
							</li>
							<li class="flex items-start gap-3">
								<div
									class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500"
								>
									<Check class="h-2.5 w-2.5" />
								</div>
								<p class="text-sm text-zinc-300">Get a private access key to keep your workflow safe</p>
							</li>
							<li class="flex items-start gap-3">
								<div
									class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500"
								>
									<Check class="h-2.5 w-2.5" />
								</div>
								<p class="text-sm text-zinc-300">
									Connect and run your workflow from other apps and tools
								</p>
							</li>
						</ul>
					</div>

					<div class="flex justify-end pt-2">
						<button
							onclick={publishWorkflow}
							disabled={isPublishing}
							class="group flex items-center gap-2 rounded-lg border border-white/10 bg-green-700 px-6 py-2.5 transition-all duration-300
							hover:bg-green-600 active:scale-95 disabled:opacity-50"
						>
							{#if isPublishing}
								<div
									class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white"
								></div>
							{:else}
								<ArrowUp class="h-3.5 w-3.5 text-white" />
							{/if}
							<span class="text-xs font-semibold tracking-wide text-white">
								{isPublishing ? 'PUBLISHING...' : 'PUBLISH NOW'}
							</span>
						</button>
					</div>
				</div>
			{:else}
				<div class="space-y-6 pt-2">
					<!-- Timing Stats -->
					{#if createdAt}
						<div class="flex items-center gap-6 rounded-xl border border-white/5 bg-white/5 p-4">
							<div class="flex items-center gap-2">
								<Clock class="h-3.5 w-3.5 text-zinc-500" />
								<span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
									>First published</span
								>
								<span class="text-xs font-medium text-zinc-300"
									>{formatRelativeTime(createdAt)}</span
								>
							</div>
							<div class="flex items-center gap-2">
								<div class="h-1 w-1 rounded-full bg-zinc-700"></div>
								<span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
									>Last used</span
								>
								<span class="text-xs font-medium text-zinc-300"
									>{formatRelativeTime(lastUsedAt)}</span
								>
							</div>
						</div>
					{/if}

					<!-- API Key -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label
								class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
							>
								<Key class="h-3.5 w-3.5" />
								{apiKey ? 'API Authentication Key' : 'API Key Prefix'}
							</label>
							<button
								onclick={() => copyToClipboard(apiKey || apiKeyPrefix, 'key')}
								class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
							>
								{copiedKey ? 'Copied!' : 'Copy'}
							</button>
						</div>
						<div class="group relative">
							<input
								type="text"
								readonly
								value={apiKey || apiKeyPrefix}
								class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 font-mono text-sm text-white focus:outline-none"
							/>
						</div>
						{#if apiKey}
							<p class="text-[10px] font-medium text-amber-500">
								IMPORTANT: Save this key now! It will not be shown again.
							</p>
						{:else}
							<p class="text-[10px] text-zinc-500">
								Full key is hidden for security. Use the prefix to identify it.
							</p>
						{/if}
					</div>

					<!-- Endpoint -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<label
								class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
							>
								<Terminal class="h-3.5 w-3.5" />
								Execution Endpoint
							</label>
							<button
								onclick={() => copyToClipboard(runEndpoint, 'endpoint')}
								class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
							>
								{copiedEndpoint ? 'Copied!' : 'Copy'}
							</button>
						</div>
						<div class="relative">
							<input
								type="text"
								readonly
								value={runEndpoint}
								class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 font-mono text-sm text-white focus:outline-none"
							/>
						</div>
					</div>

					<div class="flex justify-end pt-4">
						<button
							onclick={() => onClose()}
							class="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
						>
							DONE
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
