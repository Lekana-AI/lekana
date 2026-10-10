<script lang="ts">
	import { Copy, Settings, Trash } from 'lucide-svelte';
	import { useEdges, useSvelteFlow } from '@xyflow/svelte';

	let {
		id,
		data,
		top,
		left,
		right,
		bottom,
		onclick
	}: {
		id: string;
		data: any;
		top: number | undefined;
		left: number | undefined;
		right: number | undefined;
		bottom: number | undefined;
		onclick: () => void;
	} = $props();

	const edges = useEdges();
	const incomingEdge = $derived(edges.current.find((e) => e.target === id));
	const sourceNodeId = $derived(incomingEdge?.source);

	function deleteNode() {
		data.onDelete?.({ id, ...data });
		onclick();
	}

	function configureNode() {
		data.onClick?.({ sourceNodeId, ...data });
		onclick();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	style:top={top ? `${top}px` : 'auto'}
	style:left={left ? `${left}px` : 'auto'}
	style:right={right ? `${right}px` : 'auto'}
	style:bottom={bottom ? `${bottom}px` : 'auto'}
	class="absolute z-50 min-w-[160px] overflow-clip rounded-xl border border-white/10 bg-zinc-900 font-medium text-gray-200 shadow-xl"
	onclick={(e) => e.stopPropagation()}
	onpointerdown={(e) => e.stopPropagation()}
	onmousedown={(e) => e.stopPropagation()}
>
	<button
		type="button"
		class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
		onclick={configureNode}
	>
		<Settings class="h-4 w-4" />

		Configure
	</button>

	<button
		class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
		onclick={() => {
			data.onDuplicate?.({ id, ...data });
			onclick();
		}}
	>
		<Copy class="h-4 w-4" />

		Duplicate
	</button>

	<button
		class="flex w-full items-center gap-2 p-3 text-left text-xs text-red-400 hover:bg-red-500/10"
		onclick={deleteNode}
	>
		<Trash class="h-4 w-4" />

		Delete
	</button>
</div>
