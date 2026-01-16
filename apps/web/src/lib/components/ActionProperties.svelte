<script>
	import { icons } from '$lib/icon';
	import { CornerRightUp, X } from 'lucide-svelte';
	import Input from './Input.svelte';
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';

	let { onClose, onSubmit, actionId, workflow, node, sourceNodeId } = $props();

	// use step + fields as state; no separate name/description/icon
	let step = $state(null);
	let loading = $state(false);
	let fields = $state([]);

	onMount(() => {
		loadFields();
	});

	async function loadFields() {
		const idToFetch = node?.action?.id || actionId;
		if (!idToFetch) return;

		try {
			const res = await fetch(`/api/actions/${idToFetch}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Backend response body:', errorText);
				toast.error('Failed to load action details');
				throw new Error(`Failed to load action: ${res.status}`);
			}

			const data = await res.json();
			step = data; // full action object

			// build the fields array that the <Input> loop expects
			// dynamically match node.config with step.uiSchema.fields
			fields = step.uiSchema.fields.map((field) => ({
				...field,
				value: node?.config?.[field.name] ?? field.value ?? field.defaultValue,
				testConnectionStatus: field.testConnection ? (node?.config?.testConnection ?? false) : false
			}));
		} catch (error) {
			console.error('Error loading fields:', error);
			toast.error('Something went wrong. Please try again in a moment.');
		}
	}

	let extractedFields = $derived.by(() => {
		const sourceNode = workflow?.nodes?.find((n) => n.id === sourceNodeId);
		if (!sourceNode) return [];

		// Get the field source key from the source action's configMeta
		// This allows any action to define which config key provides downstream fields
		const sourceAction = sourceNode?.action;
		const fieldSourceKey = sourceAction?.configMeta?.outputFieldsSource;

		// Fallback to 'extractFields' for backward compatibility
		const configKey = fieldSourceKey || 'extractFields';
		const fields = sourceNode?.config?.[configKey];

		if (Array.isArray(fields)) {
			return fields.map((f) => (typeof f === 'string' ? f : f.key));
		}
		return [];
	});

	// Get upstream output variables for dynamic field selection (e.g., label, confidence)
	let upstreamOutputVariables = $derived.by(() => {
		const sourceNode = workflow?.nodes?.find((n) => n.id === sourceNodeId);
		if (!sourceNode) return [];

		// Get outputVariables from source node's config or action's configSchema
		const variables =
			sourceNode?.config?.outputVariables ||
			sourceNode?.action?.configSchema?.outputVariables ||
			[];

		return variables;
	});

	function isVisible(field) {
		if (!field.visibleWhen) return true;
		return Object.entries(field.visibleWhen).every(([key, value]) => {
			const dependentField = fields.find((f) => f.name === key);
			return dependentField && dependentField.value === value;
		});
	}

	let isValid = $derived(
		fields.every((field) => {
			if (!isVisible(field) || !field.required) return true;

			// If field requires connection test, it must be successful
			if (field.testConnection && !field.testConnectionStatus) return false;

			if (field.type === 'keyValue') {
				return (field.value?.length ?? 0) > 0 && field.value.every((p) => p.key && p.value);
			}
			if (field.type === 'array') {
				return (field.value?.length ?? 0) > 0 && field.value.every((v) => v !== '');
			}
			return field.value !== undefined && field.value !== null && field.value !== '';
		})
	);

	async function formSubmit() {
		if (!isValid) return;
		try {
			loading = true;
			const config = fields.reduce((acc, field) => {
				if (!isVisible(field)) return acc; // Don't submit hidden fields
				acc[field.name] = field.value;
				if (field.testConnection) {
					acc['testConnection'] = field.testConnectionStatus;
				}
				return acc;
			}, {});

			// console.log(result);

			let res;

			if (node) {
				// Update existing node
				res = await fetch(`/api/workflows/${workflow.id}/nodes/${node.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						config
					})
				});
			} else {
				// Create new node
				res = await fetch(`/api/workflows/${workflow.id}/nodes`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						actionId: actionId,
						positionX: 50,
						positionY: 150,
						config
					})
				});
			}

			if (!res.ok) {
				const errorText = await res.text();
				console.error(`Failed to ${node ? 'update' : 'create'} node:`, errorText);

				throw new Error(`Failed to ${node ? 'update' : 'create'} node: ${res.status}`);
			}

			onSubmit();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong. Please try again in a moment.');
		} finally {
			loading = false;
		}
	}
</script>

<main
	class="absolute inset-0 z-40 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-xs"
>
	<div class="z-10 flex h-full flex-col justify-center gap-8">
		<div class="max-h-4/5 w-xl rounded-2xl bg-zinc-900 p-3 shadow-2xl">
			<div class="dark-scroll relative h-full overflow-y-auto px-3">
				<!-- Header -->
				<div class="sticky top-0 right-0 z-10 flex w-full justify-end bg-zinc-900 pt-3">
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
							{#if isVisible(fieldData)}
								<Input onInput {fieldData} {extractedFields} {upstreamOutputVariables} />
								<!-- <pre class="text-xs leading-4 text-wrap text-zinc-400">Field: {JSON.stringify(
									fieldData
								)}</pre> -->
							{/if}
						{/each}
					</div>

					<div class="mt-7 flex items-center justify-end pb-6">
						<button
							type="button"
							onclick={formSubmit}
							disabled={!isValid || loading}
							class="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-green-800 disabled:bg-zinc-800 disabled:opacity-50"
						>
							{node ? 'Update Action' : 'Add Action to Workflow'}
							{#if loading}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
								></div>
							{:else}
								<CornerRightUp class="h-3.5 w-3.5" />
							{/if}
						</button>
					</div>
				{:else}
					<div class="flex animate-pulse flex-col gap-2 pb-4">
						<div class="h-3 w-16 rounded bg-white/5"></div>
						<div class="flex items-center gap-2">
							<div class="h-8 w-8 rounded bg-white/5"></div>
							<div class="h-8 w-48 rounded bg-white/5"></div>
						</div>
						<div class="mt-2 space-y-2">
							<div class="h-3 w-full rounded bg-white/5"></div>
							<div class="h-3 w-5/6 rounded bg-white/5"></div>
						</div>
					</div>

					<div class="space-y-6 py-2">
						{#each Array(3) as _}
							<div class="space-y-2">
								<div class="h-3 w-20 rounded bg-white/5"></div>
								<div class="h-10 w-full rounded-md bg-white/5"></div>
							</div>
						{/each}
					</div>

					<div class="mt-7 flex items-center justify-end pb-6">
						<div class="h-9 w-40 rounded-md bg-white/5"></div>
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
