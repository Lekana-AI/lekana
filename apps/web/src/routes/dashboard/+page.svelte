<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';
	import { Plus, ArrowUp, ArrowRight } from 'lucide-svelte';
	let prompt = '';

	type Template = {
		id: number;
		name: string;
	};

	const templates: Template[] = [
		{
			id: 1,
			name: 'Start from scratch'
		},
		{
			id: 2,
			name: 'Summarisation'
		},
		{
			id: 3,
			name: 'Connect to API'
		},
		{
			id: 4,
			name: 'Classify'
		}
	];
</script>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	<SidePanel />
	<div
		class="relative flex min-h-screen w-full items-center justify-center overflow-clip bg-zinc-950 px-4 py-10"
	>
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 animate-[pulse_5s_ease-in-out_infinite] justify-self-center rounded-full bg-radial from-green-500/30 to-transparent to-60%"
		></div>
		<section class="z-10 flex flex-col items-center gap-4">
			<div class="relative flex flex-col items-center justify-center gap-4 pb-10 text-center">
				<h1 class="text-4xl font-bold text-zinc-300 md:text-5xl">Let's build your workflow</h1>
				<p class="mx-auto mt-1 max-w-2xl text-sm text-gray-400 md:text-base">
					Explain what you want to achieve, and Lekana will create a custom workflow for you.
				</p>
			</div>
			<div
				class="glow-btn flex w-fit overflow-clip rounded-3xl pt-0.5 shadow-2xl shadow-green-500/0"
			>
				<div
					class="flex h-fit w-full min-w-3xl flex-col items-start justify-between gap-2 rounded-t-3xl bg-neutral-950 px-8 py-4"
				>
					<textarea
						bind:value={prompt}
						rows="5"
						autocomplete="off"
						placeholder="Ask Lekana to create a workflow that ...."
						class="dark-scroll max-h-64 min-h-20 w-full resize-none p-1 text-white outline-none"
					></textarea>

					<div class="inline-flex items-center justify-between self-stretch">
						<button
							class="rounded-lg bg-zinc-900 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-950"
						>
							<Plus size="20" />
						</button>

						<button
							class="rounded-lg bg-white px-4 py-2 text-black transition-colors duration-300 disabled:bg-zinc-400"
							disabled={!prompt}
						>
							<ArrowUp size="20" />
						</button>
					</div>
				</div>
			</div>
			<div class="mt-6 grid max-w-2xl grid-cols-1 gap-6 px-12 md:grid-cols-4">
				{#each templates as template}
					<button
						class="flex flex-col gap-3 rounded-lg bg-white/5 p-3 text-zinc-300 transition-colors duration-300 hover:bg-white/10"
					>
						<div class="aspect-square rounded-md bg-gray-300">
							<!-- <img src="/templates/template-{template.id}.png" alt={template.name} /> -->
						</div>
						<h3 class="text-center text-xs">
							{template.name}
						</h3>
					</button>
				{/each}
			</div>
			<div class="mt-6 flex w-full max-w-xl justify-end">
				<a
					href="dashboard"
					class="transition-color inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-6 py-2 text-sm text-zinc-300 duration-500 hover:bg-white/10"
				>
					More Templates <ArrowRight size="16" />
				</a>
			</div>
		</section>
	</div>
</main>

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
</style>
