<script lang="ts">
	import { Background, Controls, MiniMap, SvelteFlow } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import CustomEdge from './SvelteFlow/Edge/CustomEdge.svelte';
	import type { EdgeTypes } from '@xyflow/svelte';
	import ActiveActionNode from './SvelteFlow/Node/ActiveActionNode.svelte';
	import NewActionNode from './SvelteFlow/Node/NewActionNode.svelte';

	let { onNodeClick, nodes, edges } = $props();
	
	const nodeTypes = {
		activeAction: ActiveActionNode,
	};

	const edgeTypes: EdgeTypes = {
		'custom-edge': CustomEdge
	};


	$effect: nodes = nodes.map((node) => ({
		...node,
		type: node.type ?? "activeAction",
		data: {
			...node.data,
			onClick: onNodeClick
		}
	}));

	let showMiniMap = $state(false);
</script>

<div class="flow-wrapper h-full w-full overflow-clip rounded-xl bg-zinc-900">
	<SvelteFlow
		onmovestart={() => ((showMiniMap = true))}
		onmoveend={() =>
			setTimeout(() => {
				showMiniMap = false;
			}, 500)}
		proOptions={{ hideAttribution: true }}
		bind:nodes
		bind:edges
		{nodeTypes}
		{edgeTypes}
		fitView
	>
		<MiniMap
			maskColor="#27272a"
			class="{showMiniMap ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300"
		/>

		<Controls />
		<Background bgColor="#18181b" patternColor="#52525c" />
	</SvelteFlow>
</div>

<style>
	.flow-wrapper :global(.svelte-flow__minimap) {
		background-color: #1c1c1f !important;
		border-radius: 0.5rem;
		margin-bottom: 30px;
		margin-right: 30px;
	}

	.flow-wrapper :global(.svelte-flow__controls button) {
		background-color: #27272a !important;
		border: 1px solid #3f3f46 !important;
		color: #e4e4e7 !important;
		border-radius: 0.2rem;
		padding: 7px;
	}
	.flow-wrapper :global(.svelte-flow__controls button):hover {
		background-color: #38383c !important;
		transition-property: background-color;
		transition-duration: 300ms;
	}
	.flow-wrapper :global(.svelte-flow__controls) {
		scale: 130%;
		margin-bottom: 30px;
		margin-left: 40px;
		display: flex;
		flex-direction: row;
		gap: 5px;
	}
</style>
