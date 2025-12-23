<script lang="ts">
	import {
		Background,
		Controls,
		MiniMap,
		SvelteFlow,
		type Connection,
		addEdge,
		type Edge,
		MarkerType
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import CustomEdge from './SvelteFlow/Edge/CustomEdge.svelte';
	import type { EdgeTypes, NodeEventWithPointer } from '@xyflow/svelte';
	import ActiveActionNode from './SvelteFlow/Node/ActiveActionNode.svelte';
	import { toast } from '$lib/toast.svelte';
	import { Copy, Settings, Settings2, Trash } from 'lucide-svelte';

	let { onNodeClick, nodes = $bindable(), edges = $bindable(), workflowId, reloading } = $props();

	const nodeTypes = {
		activeAction: ActiveActionNode
	};

	const edgeTypes: EdgeTypes = {
		'custom-edge': CustomEdge
	};

	async function updateNodePosition(value: any) {
		const res = await fetch(`/api/workflows/${workflowId}/nodes/${value.targetNode.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				positionX: value.targetNode.position.x,
				positionY: value.targetNode.position.y
			})
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Failed to update node:', errorText);

			throw new Error(`Failed to update node: ${res.status}`);
		}
	}

	async function updateEdge(connection: Connection) {
		const tempId = `edge-${Date.now()}`;
		const newEdge = {
			...connection,
			id: tempId,
			type: 'custom-edge',
			markerEnd: { type: MarkerType.ArrowClosed, color: '#52525c' }
		};

		edges = addEdge(newEdge, edges);

		try {
			const res = await fetch(`/api/workflows/${workflowId}/edges`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sourceNodeId: connection.source,
					targetNodeId: connection.target
				})
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => null);
				const errorMessage = errorData?.message || `Failed to update edge: ${res.status}`;

				console.error('Failed to update edge:', errorData || res.statusText);

				// Remove the edge we just added
				edges = edges.filter((e: Edge) => e.id !== tempId);

				toast.error(errorMessage);
			} else {
				const savedEdge = await res.json();
				// Update the edge with the real ID from database
				edges = edges.map((e: Edge) => (e.id === tempId ? { ...e, id: savedEdge.id } : e));
			}
		} catch (err) {
			console.error('Network error updating edge:', err);
			// Remove the edge we just added
			edges = edges.filter((e: Edge) => e.id !== tempId);
			toast.error('Network error. Failed to connect nodes.');
		}
	}

	let showMiniMap = $state(false);

	let menu: {
		id: string;
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	} | null = $state(null);
	let clientWidth: number = $state(0);
	let clientHeight: number = $state(0);

	const handleContextMenu: NodeEventWithPointer<MouseEvent> = ({ event, node }) => {
		// Prevent native context menu from showing
		event.preventDefault();

		// Calculate position of the context menu. We want to make sure it
		// doesn't get positioned off-screen.
		menu = {
			id: node.id,
			top: event.clientY < clientHeight - 200 ? event.clientY : undefined,
			left: event.clientX < clientWidth - 200 ? event.clientX : undefined,
			right: event.clientX >= clientWidth - 200 ? clientWidth - event.clientX : undefined,
			bottom: event.clientY >= clientHeight - 200 ? clientHeight - event.clientY : undefined
		};
	};
</script>

<div class="flow-wrapper relative h-full w-full overflow-clip rounded-xl bg-zinc-900">
	{#if reloading}
		<div class="absolute top-4 right-4 z-50">
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"
			></div>
		</div>
	{/if}
	<SvelteFlow
		connectionLineType="smoothstep"
		defaultEdgeOptions={{
			type: 'custom-edge',
			markerEnd: { type: MarkerType.ArrowClosed, color: '#52525c' }
		}}
		onnodecontextmenu={handleContextMenu}
		onpaneclick={() => (menu = null)}
		onpointerdown={() => (menu = null)}
		onconnect={(connection) => updateEdge(connection)}
		onreconnect={(oldEdge, newConnection) => handleReconnect(oldEdge, newConnection)}
		onnodedragstop={(value: any) => updateNodePosition(value)}
		onmovestart={() => (showMiniMap = true)}
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
		{#if menu}
			<ContextMenu
				onclick={handlePaneClick}
				id={menu.id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
			/>
		{/if}
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
