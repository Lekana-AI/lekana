<script lang="ts">
	import { Handle, Position, type NodeProps, useEdges, type Node } from '@xyflow/svelte';
	import { icons } from '$lib/icon';
	import { CircleAlert } from 'lucide-svelte';

	interface ActionNodeData {
		onClick?: (params: any) => void;
		onDelete?: (params: any) => void;
		node: any;
		[key: string]: any;
	}

	let { id, data }: NodeProps<Node<ActionNodeData>> = $props();

	const edges = useEdges();
	const incomingEdge = $derived(edges.current.find((e) => e.target === id));
	const sourceNodeId = $derived(incomingEdge?.source);

	const Icon = icons[data.node.action.icon] ?? icons.Zap;

	const errors = $derived.by(() => {
		const config = data.node.config;
		const configMeta = data.node.action.configMeta;
		if (!configMeta) return [];

		const msgs: string[] = [];

		Object.entries(configMeta).forEach(([key, meta]: [string, any]) => {
			if (!meta.required) return;

			// Check if field is visible
			if (meta.visibleWhen) {
				const isVisible = Object.entries(meta.visibleWhen).every(([depKey, depValue]) => {
					return config[depKey] === depValue;
				});
				if (!isVisible) return;
			}

			const value = config[key];
			const label = meta.label || key;

			if (meta.type === 'keyValue') {
				if (!value || value.length === 0 || value.some((v: any) => !v || !v.key || !v.value)) {
					msgs.push(`${label}: All mappings must be filled`);
				}
			} else if (Array.isArray(value)) {
				if (value.length === 0 || value.some((v: any) => v === '')) {
					msgs.push(`${label}: All items must be filled`);
				}
			} else if (value === undefined || value === null || value === '') {
				msgs.push(`${label} is required`);
			}
		});

		return msgs;
	});
</script>

<div class="flex flex-col items-center gap-2">
	<button
		oncontextmenu={(e) => e.preventDefault()}
		ondblclick={() => data.onClick?.({ sourceNodeId, ...data })}
		class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
	>
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/20 text-green-400">
			<Icon class="h-5 w-5" />
		</div>

		<Handle type="target" class="" position={Position.Left} />
		<Handle type="source" class="" position={Position.Right} />

		{#if errors.length > 0}
			<div class="group absolute -top-1 -right-1 z-50">
				<div
					class="flex items-center justify-center rounded-full bg-red-700 p-1 text-white shadow-lg ring-1 ring-zinc-900 transition-colors hover:bg-red-600"
				>
					<CircleAlert class="h-2 w-2" />
				</div>

				<!-- Tooltip -->
				<div
					class="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-md bg-zinc-800 p-2 text-left text-[0.4rem] leading-relaxed text-zinc-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
				>
					<p class="mb-1 font-semibold text-red-400">Configuration Errors:</p>
					<ul class="list-inside list-disc space-y-0.5">
						{#each errors as error}
							<li>{error}</li>
						{/each}
					</ul>
					<div
						class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"
					></div>
				</div>
			</div>
		{/if}
	</button>

	<span class="max-w-[120px] text-center text-[8px] font-medium tracking-tight text-white/70">
		{data.node.config.stepName}
	</span>
</div>
