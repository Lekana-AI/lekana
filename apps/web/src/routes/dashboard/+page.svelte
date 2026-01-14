<script lang="ts">
	import { goto } from '$app/navigation';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import { Plus, ArrowUp, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import type { User } from 'svelte-clerk/server';
	let prompt = $state('');
	let generating = $state(false);

	async function handleGenerate(suggestedPrompt?: string) {
		const finalPrompt = suggestedPrompt || prompt;
		if (!finalPrompt || generating) return;

		try {
			generating = true;
			if (suggestedPrompt) {
				prompt = suggestedPrompt;
			}
			const res = await fetch('/api/workflows', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: 'Untitled' })
			});

			if (!res.ok) {
				toast.error('Failed to create workflow');
				throw new Error(`Failed to create workflow: ${res.status}`);
			}

			const workflow = await res.json();
			goto(`/w/${workflow.id}?prompt=${encodeURIComponent(finalPrompt)}`);
		} catch (error) {
			console.error('Failed to start generation:', error);
			toast.error('Something went wrong. Please try again.');
			generating = false;
		}
	}

	onMount(() => {
		const pendingPrompt = localStorage.getItem('pending_prompt');
		if (pendingPrompt) {
			localStorage.removeItem('pending_prompt');
			prompt = pendingPrompt;
			handleGenerate();
		}
	});

	let { data }: { data: any } = $props();

	const user: User = data?.user;

	const suggestedPrompts = [
		{
			text: 'Extract data from insurance claims'
		},
		{
			text: 'Process and export invoices'
		},
		{
			text: 'Classify documents and route them'
		},
		{
			text: 'Clean and export document data'
		},
		{
			text: 'Create a summary of this document'
		},
		{
			text: 'Export data to Google Sheets'
		}
	];

	let scrollContainer = $state<HTMLDivElement>();
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	function updateScrollButtons() {
		if (scrollContainer) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
			canScrollLeft = scrollLeft > 10;
			canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;
		}
	}

	function scroll(direction: 'left' | 'right') {
		if (scrollContainer) {
			const scrollAmount = direction === 'left' ? -300 : 300;
			scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		}
	}

	$effect(() => {
		updateScrollButtons();
	});
</script>

<svelte:head>
	<title>Dashboard - Lekana</title>
	<meta
		name="description"
		content="Lekana automates document workflows for businesses. Scan, structure, and route documents seamlessly."
	/>
	<meta property="og:image" content="/thumb.png" />
</svelte:head>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	<LoadingOverlay show={generating} title="Generating Workflow" {prompt} />
	<SidePanel
		userName={user.firstName}
		onSettings={(value: string) => goto(`/w/${value}/settings`)}
	/>
	<div
		class="relative flex min-h-screen w-full items-center justify-center overflow-clip bg-zinc-950 px-4 py-10"
	>
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 animate-[pulse_5s_ease-in-out_infinite] justify-self-center rounded-full bg-radial from-green-500/30 to-transparent to-60%"
		></div>
		<section class="z-10 flex w-full max-w-4xl flex-col items-center gap-6">
			<div class="relative flex flex-col items-center justify-center gap-4 pb-2 text-center">
				<h1 class="text-4xl font-bold text-zinc-300 md:text-5xl">Let's build your workflow</h1>
				<p class="mx-auto mt-1 max-w-2xl text-sm text-gray-400 md:text-base">
					Explain what you want to achieve, and Lekana will create a custom workflow for you.
				</p>
			</div>

			<div class="flex w-full flex-col items-center gap-4">
				<!-- Suggested Prompts -->
				<div class="group/container relative w-full max-w-4xl px-2">
					{#if canScrollLeft}
						<button
							onclick={() => scroll('left')}
							class="absolute top-1/2 -left-5 z-20 -translate-y-1/2 rounded-md p-1.5 text-white transition-all duration-300 group-hover/container:opacity-30 hover:opacity-100 md:opacity-0"
						>
							<ChevronLeft size="20" />
						</button>
					{/if}

					<div
						bind:this={scrollContainer}
						onscroll={updateScrollButtons}
						class="no-scrollbar flex w-full gap-3 overflow-x-auto px-4 py-2"
					>
						{#each suggestedPrompts as item}
							<button
								onclick={() => handleGenerate(item.text)}
								class="group relative flex min-w-fit items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left transition-all duration-300 hover:scale-[1.01] hover:bg-white/10 active:scale-[0.98]"
							>
								<Sparkles class="h-3 w-3 text-zinc-400" />
								<span
									class="text-sm whitespace-nowrap text-zinc-400 transition-colors group-hover:text-zinc-200"
								>
									{item.text}
								</span>
							</button>
						{/each}
					</div>

					{#if canScrollRight}
						<button
							onclick={() => scroll('right')}
							class="absolute top-1/2 -right-5 z-20 -translate-y-1/2 rounded-md p-1.5 text-white transition-all duration-300 group-hover/container:opacity-30 hover:opacity-100 md:opacity-0"
						>
							<ChevronRight size="20" />
						</button>
					{/if}
				</div>

				<div
					class="glow-btn flex w-full max-w-3xl overflow-clip rounded-3xl pt-0.5 shadow-2xl shadow-green-500/0"
				>
					<div
						class="flex h-fit w-full flex-col items-start justify-between gap-2 rounded-t-3xl bg-neutral-950 px-8 py-4"
					>
						<textarea
							bind:value={prompt}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleGenerate();
								}
							}}
							rows="4"
							autocomplete="off"
							placeholder="Ask Lekana to create a workflow that ...."
							class="dark-scroll max-h-64 min-h-20 w-full resize-none p-1 text-white outline-none"
						></textarea>

						<div class="inline-flex w-full items-center justify-end self-stretch">
							<button
								onclick={() => handleGenerate()}
								class="rounded-lg bg-white px-4 py-2 text-black transition-all duration-300 hover:bg-green-500 hover:text-white disabled:bg-zinc-400"
								disabled={!prompt || generating}
							>
								{#if generating}
									<div
										class="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"
									></div>
								{:else}
									<ArrowUp size="20" />
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.glow-btn {
		background: linear-gradient(var(--gradient-angle), #05df72, rgba(167, 243, 208, 0), #05df72);
		animation: rotation 8s linear infinite;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	@keyframes rotation {
		0% {
			--gradient-angle: 0deg;
		}
		100% {
			--gradient-angle: 360deg;
		}
	}
</style>
