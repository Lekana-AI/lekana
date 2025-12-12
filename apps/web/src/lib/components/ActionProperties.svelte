<script>
	import { icons } from '$lib/icon';
	import { CornerRightUp, X } from 'lucide-svelte';
	import Input from './Input.svelte';
	import { onMount } from 'svelte';

	let { onClose, actionId } = $props();

	// use step + fields as state; no separate name/description/icon
	let step = $state(null);
	let fields = $state([]);

	onMount(() => {
		if (actionId) {
			loadFields();
		}
	});

	async function loadFields() {
		const res = await fetch(`/api/actions/${actionId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Backend response body:', errorText);
			throw new Error(`Failed to load action: ${res.status}`);
		}

		const data = await res.json();
		step = data; // full action object

		// build the fields array that the <Input> loop expects
		fields = step.uiSchema.fields;
	}

	function formSubmit() {
		const result = fields.reduce((acc, field) => {
			acc[field.name] = field.value;
			return acc;
		}, {});

		console.log(result);
	}
</script>

<main
	class="absolute inset-0 z-40 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-xs"
>
	<div class="z-10 flex h-full flex-col justify-center gap-8">
		<div class="h-full max-h-4/5 w-xl rounded-2xl bg-zinc-900 shadow-2xl p-3">
			<div class="dark-scroll h-full overflow-y-auto p-3">
				<!-- Header -->
				<div class="flex w-full justify-end">
					<button
						onclick={() => onClose?.(false)}
						class="p-2 text-white/60 transition-colors duration-300 hover:text-white/80"
					>
						<X class="h-4 w-4" />
					</button>
				</div>

				{#if fields.length > 0}
					{@const Icon = icons[step.icon]}
					<div class="flex w-full flex-col gap-2 pb-4">
						<p class="text-xs font-semibold tracking-widest text-green-400 uppercase">properties</p>
						<span class="flex items-center gap-2">
							<Icon class="aspect-square h-full text-white" />
							<h1 class="text-2xl font-semibold text-white md:text-3xl">
								{step.name}
							</h1>
						</span>
						<p class="mt-2 w-full text-sm text-zinc-300">
							{step.description}
						</p>
					</div>

					<div class="space-y-6 py-2">
						{#each fields as fieldData}
							<Input onInput {fieldData} />
							<pre class="text-xs leading-4 text-wrap text-zinc-400">Field: {JSON.stringify(
									fieldData
								)}</pre>
						{/each}
					</div>

					<div class="mt-7 flex items-center justify-end">
						<button
							type="button"
							onclick={formSubmit}
							class="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-green-800 disabled:opacity-50"
						>
							Add Action to Workflow
							<CornerRightUp class="h-3.5 w-3.5" />
						</button>
					</div>
				{:else}
					<div class="flex w-full items-center justify-center py-10">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"
						></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.dark-scroll {
		scrollbar-width: thin;
		scrollbar-color: gray transparent;
	}
</style>
