<script lang="ts">
	import { Handle, Position, type NodeProps, useEdges, type Node } from '@xyflow/svelte';
	import { icons } from '$lib/icon';

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
	</button>

	<span class="max-w-[120px] text-center text-[8px] font-medium tracking-tight text-white/70">
		{data.node.config.stepName}
	</span>
</div>
