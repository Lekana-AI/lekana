<script>
	import { Copy, Settings, Trash } from 'lucide-svelte';

	import { useEdges, useNodes, useSvelteFlow } from '@xyflow/svelte';

	let {
		id,
		top,
		left,
		right,
		bottom,
		onclick
	}: {
		id: string;
		top: number | undefined;
		left: number | undefined;
		right: number | undefined;
		bottom: number | undefined;
		onclick: () => void;
	} = $props();

	const { deleteElements } = useSvelteFlow();

	const nodes = useNodes();

	function duplicateNode() {
		const node = nodes.current.find((node) => node.id === id);
		if (node) {
			nodes.current = [
				...nodes.current,
				{
					...node,
					// You should use a better id than this in production
					id: `${id}-copy${Math.random()}`,
					position: {
						x: node.position.x,
						y: node.position.y + 50
					}
				}
			];
		}
	}

	function deleteNode() {
		deleteElements({ nodes: [{ id }] });
	}
</script>

<div
	class="absolute top-0 left-full z-30 min-w-full rounded-xl border border-white/10 bg-zinc-900 font-medium text-gray-200 shadow-xl"
>
	<button
		type="button"
		class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
	>
		<Settings class="h-4 w-4" />

		Configure
	</button>

	<button
		class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
		onclick={() => console.log('Duplicate', id)}
	>
		<Copy class="h-4 w-4" />

		Copy
	</button>

	<button
		class="flex w-full items-center gap-2 p-3 text-left text-xs text-red-400 hover:bg-red-500/10"
		onclick={deleteNode}
	>
		<Trash class="h-4 w-4" />

		Delete
	</button>
</div>
