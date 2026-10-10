<script lang="ts">
	import {
		BaseEdge,
		getSmoothStepPath,
		useSvelteFlow,
		type EdgeProps,
		EdgeToolbar
	} from '@xyflow/svelte';
	import { X } from 'lucide-svelte';

	let {
		id,
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		...props
	}: EdgeProps = $props();

	// console.log(id)

	const [edgePath, labelX, labelY] = $derived(
		getSmoothStepPath({
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition
		})
	);

	const { markerStart, markerEnd, interactionWidth, label, labelStyle } = props;
	const { deleteElements } = useSvelteFlow();
</script>

<BaseEdge {id} path={edgePath} {markerStart} {markerEnd} {interactionWidth} {label} {labelStyle} />

<EdgeToolbar {id} x={labelX} y={labelY} isVisible={props.selected}>
	<button
		class="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-300 hover:text-zinc-900"
		onclick={() => deleteElements({ edges: [{ id }] })}
		aria-label="Delete edge"
	>
		<X class="h-4 w-4" />
	</button>
</EdgeToolbar>
