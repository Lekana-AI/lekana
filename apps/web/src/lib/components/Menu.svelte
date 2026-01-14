<script lang="ts">
	import { icons } from '$lib/icon';
	import { Search, Sparkles, ArrowRightToLine, Plus, ArrowUp, LayoutGrid, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	let {
		onAction,
		workflowId,
		onGenerate,
		initialPrompt
	}: {
		onAction?: (id: string) => void;
		workflowId?: string;
		onGenerate?: () => Promise<void> | void;
		initialPrompt?: string;
	} = $props();

	let thoughts = $state('');
	let sentPrompt = $state('');
	let generating = $state(false);
	const examplePrompts = [
		'Build a workflow that extracts and exports data from insurance claims.',
		'Create a workflow that automatically processes and exports invoices.',
		'Build a workflow that classifies documents and routes them to the correct databases.',
		'Create a workflow that extracts, cleans, and exports data from documents.'
	];

	let parsedThoughts = $derived.by(() => {
		try {
			return marked.parse(thoughts);
		} catch (e) {
			return thoughts;
		}
	});

	let collapsed = $state(false);
	let activeTab = $state<'actions' | 'assistant'>(initialPrompt ? 'assistant' : 'actions');
	let actionSections = $state<any[]>([]);
	let prompt = $state('');
	let searchQuery = $state('');
	let actionsLoading = $state(false);

	let filteredSections = $derived.by(() => {
		if (!searchQuery.trim()) return actionSections;

		const query = searchQuery.toLowerCase();
		return actionSections
			.map((section) => ({
				...section,
				actions: section.actions.filter((action: any) => action.label.toLowerCase().includes(query))
			}))
			.filter((section) => section.actions.length > 0);
	});

	onMount(() => {
		loadActions();
		if (initialPrompt) {
			prompt = initialPrompt;
			generateWorkflow();

			// Clear the prompt from URL to avoid re-triggering on refresh
			const url = new URL(window.location.href);
			if (url.searchParams.has('prompt')) {
				url.searchParams.delete('prompt');
				window.history.replaceState({}, '', url.toString());
			}
		}
	});

	async function loadActions() {
		try {
			actionsLoading = true;
			const res = await fetch('/api/categories/with-actions', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				throw new Error(`Failed to load actions: ${res.status}`);
			}

			actionSections = await res.json();
		} catch (error) {
			console.error('Failed to load actions:', error);
		} finally {
			actionsLoading = false;
		}
	}

	async function generateWorkflow() {
		if (!prompt || generating) return;

		try {
			generating = true;
			thoughts = '';
			sentPrompt = prompt;
			prompt = '';
			const res = await fetch('/api/workflows/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt: sentPrompt,
					workflowId
				})
			});

			if (!res.ok) {
				throw new Error(`Failed to generate: ${res.status}`);
			}

			const reader = res.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();
			let buffer = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					const trimmedLine = line.trim();
					if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

					try {
						const jsonStr = trimmedLine.replace(/^data:\s*/, '');
						const data = JSON.parse(jsonStr);

						if (data.type === 'text' && data.content) {
							thoughts += data.content;
						}
					} catch (e) {
						console.error('Error parsing stream line:', trimmedLine, e);
					} finally {
						generating = false;
					}
				}
			}

			// After generation is complete, trigger reload
			await onGenerate?.();
		} catch (error) {
			console.error('Failed to generate workflow:', error);
			thoughts = 'Error: Failed to generate workflow. Please try again.';
		}
	}
	async function generateExample(text: string) {
		prompt = text;
		generateWorkflow();
	}
</script>

<!-- Expanded state -->
<div
	class="inline-flex {collapsed
		? 'absolute right-0 z-20 mr-4 h-fit'
		: 'h-full'} w-fit flex-col items-start justify-start overflow-clip rounded-lg bg-white/10 backdrop-blur-[20px] transition-all duration-500"
>
	<!-- Top bar with collapse button -->
	<div class="inline-flex w-full items-center justify-end gap-4 p-2">
		<button
			type="button"
			class="flex items-center justify-center rounded-md bg-white/0 p-2 transition-colors duration-300 hover:bg-white/10"
			onclick={() => (collapsed = !collapsed)}
			aria-label="Collapse panel"
		>
			{#if collapsed}
				<LayoutGrid class="h-4 w-4 text-white" />
			{:else}
				<ArrowRightToLine class="h-4 w-4 text-white" />
			{/if}
		</button>
	</div>
	{#if !collapsed}
		<!-- Main content -->
		<div class="flex h-full w-full flex-col items-start justify-start gap-3">
			<!-- Tabs -->
			<div class="inline-flex w-full items-center justify-start gap-2.5 px-3 pb-1">
				<button
					type="button"
					class={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs transition ${
						activeTab === 'actions' ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'
					}`}
					onclick={() => (activeTab = 'actions')}
				>
					<span>Actions</span>
				</button>

				<button
					type="button"
					class={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs transition ${
						activeTab === 'assistant' ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'
					}`}
					onclick={() => (activeTab = 'assistant')}
				>
					<span>Assistant</span>
				</button>
			</div>

			<!-- ACTIONS VIEW -->
			{#if activeTab === 'actions'}
				<!-- Search -->
				<div class="w-full min-w-xs px-3">
					<div
						class="inline-flex w-full items-center justify-between rounded bg-white/5 px-4 text-xs text-white/50 transition-colors duration-300 focus-within:bg-white/10"
					>
						<input
							type="text"
							placeholder="Search"
							bind:value={searchQuery}
							class="flex-1 bg-transparent py-2 text-sm text-white/70 outline-none placeholder:text-white/40"
						/>
						{#if searchQuery}
							<button class="h-full py-2 text-white/60 hover:text-white">
								<X class="h-3 w-3" onclick={() => (searchQuery = '')} />
							</button>
						{:else}
							<Search class="h-3 w-3 text-white/60" />
						{/if}
					</div>
				</div>

				<div
					class="dark-scroll mb-14 flex h-full w-full flex-col items-start justify-start gap-3 overflow-y-auto rounded-xl px-3"
				>
					{#if actionsLoading}
						<div class="flex w-full flex-col gap-4">
							{#each Array(2) as _}
								<div class="flex w-full flex-col gap-2">
									<div class="h-3 w-20 animate-pulse rounded bg-white/5 pt-1.5"></div>
									{#each Array(3) as _}
										<div class="flex w-full items-center gap-4 rounded-lg bg-white/5 px-3 py-3">
											<div class="h-7 w-7 animate-pulse rounded-md bg-white/5"></div>
											<div class="h-4 w-24 animate-pulse rounded bg-white/5"></div>
											<div class="ml-auto h-4 w-4 animate-pulse rounded bg-white/5"></div>
										</div>
									{/each}
								</div>
							{/each}
						</div>
					{:else}
						{#each filteredSections as section}
							{#if section.actions.length !== 0}
								<section class="flex w-full flex-col gap-2">
									<div class="inline-flex w-full items-center justify-between pt-1.5">
										<h2 class="text-xs font-semibold text-zinc-300">
											{section.category}
										</h2>
									</div>

									{#each section.actions as item}
										{@const Icon = (icons as any)[item.icon]}
										<button
											onclick={() => onAction?.(item.id)}
											type="button"
											class="group inline-flex w-full items-center justify-start gap-4 rounded-lg border bg-white/5 px-3 py-2 pr-5 backdrop-blur transition"
										>
											<span
												class="flex items-center justify-center rounded-md bg-green-950/40 p-2 transition-colors group-hover:bg-green-950/80"
											>
												<!-- <item.icon class="h-3 w-3 text-white" /> -->
												<Icon class="h-5 w-5 text-green-400" />
												<!-- <svelte:component this={icons[item.icon]} class="h-3 w-3 text-white" /> -->
											</span>
											<span class="truncate text-xs leading-5 font-semibold text-zinc-300">
												{item.label}
											</span>
											<Plus
												class="ml-auto h-4 w-4 text-white/50 transition-colors group-hover:text-white"
											/>
										</button>
									{/each}
								</section>
							{/if}
						{/each}
					{/if}
				</div>
			{:else}
				<!-- ASSISTANT VIEW -->
				<div
					class="p- flex w-xs flex-1 flex-col items-center justify-end gap-4 overflow-hidden rounded-xl bg-neutral-900"
				>
					{#if thoughts || generating || sentPrompt}
						<div
							class="dark-scroll flex w-full flex-1 flex-col gap-4 overflow-y-auto px-2 py-4 text-xs"
						>
							{#if sentPrompt}
								<div class="flex flex-col items-end gap-1.5">
									<div class="flex items-center gap-2 text-zinc-500">
										<span class="text-[10px] font-semibold tracking-wider uppercase">You</span>
									</div>
									<div
										class="max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-800 px-3 py-2 text-white/90"
									>
										{sentPrompt}
									</div>
								</div>
							{/if}

							{#if thoughts || generating}
								<div class="flex flex-col items-start gap-1.5">
									<div class="flex items-center gap-2 text-green-500">
										<Sparkles class="h-3 w-3" />
										<span class="text-[10px] font-semibold tracking-wider uppercase">Assistant</span
										>
									</div>
									<div
										class="markdown-content dark-scroll w-full max-w-[95%] leading-relaxed text-white/70"
									>
										{@html parsedThoughts}
										{#if generating && !thoughts}
											<span class="animate-pulse">Thinking...</span>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex h-full w-full flex-col items-center justify-between p-3">
							<div class="mb-4 flex h-full flex-col items-center justify-center gap-3 text-center">
								<img src="/logo.svg" alt="Lekana Logo" class="h-12 w-12" />
								<h2 class="text-lg font-bold text-white">Lekana Assistant</h2>
								<p class="text-[12px] leading-relaxed text-white/60">
									I can help you build powerful automation workflows, find the right actions, and
									connect them with logic effortlessly.
								</p>
							</div>

							<div class="flex w-full flex-col gap-2.5">
								<h3 class="px-2 text-[10px] font-semibold tracking-wider text-white/40 uppercase">
									Try these examples
								</h3>
								<div class="flex flex-col gap-2">
									{#each examplePrompts as example}
										<button
											onclick={() => generateExample(example)}
											class="group relative flex w-full flex-col items-start gap-1 rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3 text-left transition-all hover:bg-white/10 active:scale-[0.98]"
										>
											<span class="text-xs text-white/80 transition-colors group-hover:text-white">
												{example}
												<!-- <Sparkles class="h-2.5 w-2.5 text-green-500" /> -->
											</span>
										</button>
									{/each}
								</div>
							</div>
						</div>

						<div class="px-1 text-[10px] text-white/30">
							AI may make mistakes. Double-check all generated content.
						</div>
					{/if}

					<!-- Main assistant card -->
					<div class="glow-btn flex w-full rounded-t-2xl pt-0.5 shadow-lg">
						<div
							class="flex h-fit w-full flex-col items-start justify-between gap-2 rounded-t-2xl bg-neutral-950 px-3 py-4"
						>
							<textarea
								bind:value={prompt}
								onkeydown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										generateWorkflow();
									}
								}}
								rows="5"
								autocomplete="off"
								placeholder="Ask Lekana to create a workflow that ...."
								class="dark-scroll max-h-32 min-h-20 w-full resize-none p-1 text-xs text-white outline-none"
							></textarea>

							<div class="inline-flex items-center justify-end self-stretch">
								<!-- <button
									class="rounded-md bg-zinc-900 px-3 py-2 text-white transition-colors duration-300 hover:bg-green-950"
								>
									<Plus size="12" />
								</button> -->

								<button
									onclick={generateWorkflow}
									class="rounded-md bg-white px-3 py-2 text-black transition-colors duration-300 disabled:bg-zinc-400"
									disabled={!prompt || generating}
								>
									{#if generating}
										<div
											class="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent"
										></div>
									{:else}
										<ArrowUp size="12" />
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.glow-btn {
		background: linear-gradient(var(--gradient-angle), #05df72, rgba(167, 243, 208, 0), #05df72);
		animation: rotation 8s linear infinite;
	}

	@keyframes rotation {
		0% {
			--gradient-angle: 0deg;
		}
		100% {
			--gradient-angle: 360deg;
		}
	}
	.dark-scroll {
		scrollbar-width: thin;
		scrollbar-color: gray transparent;
	}

	.markdown-content :global(strong) {
		color: #fff;
		font-weight: 700;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.markdown-content :global(ul) {
		list-style-type: disc;
	}

	.markdown-content :global(ol) {
		list-style-type: decimal;
	}

	.markdown-content :global(li) {
		line-height: 1.5;
	}

	.markdown-content :global(p) {
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(h1) {
		font-size: 1.125rem;
	}
	.markdown-content :global(h2) {
		font-size: 1rem;
	}
	.markdown-content :global(h3) {
		font-size: 0.875rem;
	}

	.markdown-content :global(code) {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.9em;
	}

	.markdown-content :global(pre) {
		background: rgba(0, 0, 0, 0.3);
		padding: 0.75rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0.75rem 0;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
		font-size: 0.85rem;
	}
</style>
