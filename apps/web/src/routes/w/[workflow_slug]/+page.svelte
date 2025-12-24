<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';

	import FlowCanvas from '$lib/components/FlowCanvas.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import ActionProperties from '$lib/components/ActionProperties.svelte';
	import { goto } from '$app/navigation';
	import type { User } from 'svelte-clerk/server';
	import { onMount } from 'svelte';
	import { Settings2 } from 'lucide-svelte';
	import { confirmStore } from '$lib/confirm.svelte';
	import { toast } from '$lib/toast.svelte';

	let { data } = $props();

	let workflow = $state(data?.workflow);
	console.log(workflow);

	const user: User = data?.user;

	let propertiesVisible = $state(false);
	let actionId: string = $state('');
	let actionNode: any = $state(null);
	let open = $state(false);
	let nodes = $state.raw([]);
	let edges = $state.raw([]);

	let reloading = $state(false);

	async function reloadWorkflow() {
		reloading = true;
		const res = await fetch(`/api/workflows/${workflow.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Backend response body:', errorText);
			throw new Error(`Failed to load workflow: ${res.status}`);
		}

		workflow = await res.json();
		initFlow();
		reloading = false;
	}

	function initFlow() {
		nodes = workflow.nodes.map((node: any) => ({
			id: node.id,
			type: 'activeAction',
			position: { x: node.positionX, y: node.positionY },
			data: {
				onClick: (value: any) => (
					(propertiesVisible = true),
					(actionNode = value.node),
					(actionId = '')
				),
				onDelete: (value: any) => deleteNode(value.id),
				node: node,
				...node
			}
		}));

		edges = workflow.edges.map((edge: any) => ({
			id: edge.id,
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: 'smoothstep'
		}));
	}

	async function deleteNode(id: string) {
		const confirmed = await confirmStore.confirm(
			'Are you sure you want to delete this action?',
			'Delete Action'
		);
		if (!confirmed) return;

		const res = await fetch(`/api/workflows/${workflow.id}/nodes/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Backend response body:', errorText);
			toast.error('Failed to delete action');
			throw new Error(`Failed to delete node: ${res.status}`);
		}

		toast.success('Action deleted');
		reloadWorkflow();
	}

	onMount(() => {
		initFlow();
	});

	let workflowName = $derived(workflow.name);
	let wName = $derived(workflow.name);

	async function updateName() {
		if (!workflowName || workflowName === workflow.name) {
			workflowName = workflow.name;
			return;
		}

		workflow.name = workflowName;
		const res = await fetch(`/api/workflows/${workflow.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: workflowName })
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('Backend response body:', errorText);

			throw new Error(`Failed to create workflow: ${res.status}`);
		}
	}
</script>

<svelte:head>
	<title>{workflow.name} - Lekana</title>
	<meta
		name="description"
		content="Lekana automates document workflows for businesses. Scan, structure, and route documents seamlessly."
	/>
	<meta property="og:image" content="/thumb.png" />
</svelte:head>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	{#if propertiesVisible}
		<ActionProperties
			node={actionNode}
			{actionId}
			onClose={() => (propertiesVisible = false)}
			onSubmit={async () => {
				await reloadWorkflow();
			}}
			workflowId={workflow.id}
		/>
	{/if}
	<SidePanel
		activeWorkflow={workflow.id ?? ''}
		userName={user.firstName ?? 'User'}
		activeWorkflowName={wName}
	/>
	<div class="relative flex h-screen w-full justify-center gap-2 overflow-clip bg-zinc-950 p-2">
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<section class="z-10 flex h-full w-full flex-col gap-2">
			<div class="flex w-fit items-center gap-2">
				<a href="/w/{workflow.id}/settings" class="rounded-lg p-3 text-white hover:bg-white/10">
					<Settings2 class="h-5 w-5" />
				</a>
				<div class="flex w-fit flex-col rounded-xl">
					<input
						onblur={() => updateName()}
						class="truncate rounded-lg text-lg font-semibold text-zinc-300 outline outline-white/0 focus:p-2 focus:outline-white/50"
						bind:value={workflowName}
					/>
				</div>
			</div>
			<FlowCanvas
				{nodes}
				{edges}
				onNodeClick={(value: string) => (
					(propertiesVisible = true),
					(actionNode = value),
					(actionId = '')
				)}
				workflowId={workflow.id}
				{reloading}
			/>
		</section>
		<Menu
			onAction={(value: string) => (
				(propertiesVisible = true),
				(actionId = value),
				(actionNode = null)
			)}
		/>
	</div>
</main>

<svelte:window on:click={() => (open = false)} />
