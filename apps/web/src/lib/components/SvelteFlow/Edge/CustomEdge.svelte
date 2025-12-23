<script lang="ts">
	import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/svelte';

	let { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, ...props }: EdgeProps =
		$props();

	const [edgePath] = $derived(
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
</script>

<BaseEdge path={edgePath} {markerStart} {markerEnd} {interactionWidth} {label} {labelStyle} />
