<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';

	import FlowCanvas from '$lib/components/FlowCanvas.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import ActionProperties from '$lib/components/ActionProperties.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { User } from 'svelte-clerk/server';
	import { onMount } from 'svelte';
	import {
		Settings2,
		CheckCircle2,
		Key,
		Terminal,
		Check,
		Copy,
		ExternalLink,
		RefreshCw,
		ChevronUp,
		ArrowUp,
		KeyRound,
		CheckCheckIcon,
		Play,
		BookOpen,
		CornerRightUp
	} from 'lucide-svelte';
	import { confirmStore } from '$lib/confirm.svelte';
	import { toast } from '$lib/toast.svelte';
	import Publish from '$lib/components/Publish.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import RoleManagement from '$lib/components/RoleManagement.svelte';
	import { Activity, LineChart } from 'lucide-svelte';

	let { data } = $props();

	let workflow = $state(data?.workflow);
	// console.log(workflow);

	const user: User = data?.user;

	let propertiesVisible = $state(false);
	let actionId: string = $state('');
	let actionNode: any = $state(null);
	let sourceNodeId: string = $state('');
	let open = $state(false);
	let nodes = $state.raw([]);
	let edges = $state.raw([]);

	let reloading = $state(false);

	async function reloadWorkflow() {
		try {
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
				toast.error('Failed to reload workflow');
				throw new Error(`Failed to load workflow: ${res.status}`);
			}

			workflow = await res.json();
			initFlow();
		} catch (error) {
			console.error('Error reloading workflow:', error);
			toast.error('Something went wrong. Please try again in a moment.');
		} finally {
			reloading = false;
		}
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
					(sourceNodeId = value.sourceNodeId),
					(actionId = '')
				),
				onDelete: (value: any) => deleteNode(value.id),
				onDuplicate: (value: any) => duplicateNode(value.id),
				node: node,
				...node
			}
		}));

		edges = workflow.edges.map((edge: any) => ({
			id: edge.id,
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: 'custom-edge'
		}));
	}

	async function deleteNode(id: string) {
		const confirmed = await confirmStore.confirm(
			'Are you sure you want to delete this action?',
			'Delete Action'
		);
		if (!confirmed) return;

		try {
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
		} catch (error) {
			console.error('Error deleting node:', error);
			toast.error('Something went wrong. Please try again in a moment.');
		}
	}

	async function duplicateNode(id: string) {
		try {
			const res = await fetch(`/api/workflows/${workflow.id}/nodes/${id}/duplicate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Backend response body:', errorText);
				toast.error('Failed to duplicate action');
				throw new Error(`Failed to duplicate node: ${res.status}`);
			}

			toast.success('Action duplicated');
			reloadWorkflow();
		} catch (error) {
			console.error('Error duplicating node:', error);
			toast.error('Something went wrong. Please try again in a moment.');
		}
	}

	let showPublishModal = $state(false);
	let showSettingsModal = $state(false);
	let showRoleModal = $state(false);

	let workflowName = $state(workflow.name);
	let wName = $derived(workflow.name);

	$effect(() => {
		workflowName = workflow.name;
	});

	let isSynced = $derived(
		workflow.isPublished &&
			workflow.lastPublishedAt &&
			new Date(workflow.lastPublishedAt).getTime() >= new Date(workflow.updatedAt).getTime() - 1000
	);

	async function updateName() {
		if (!workflowName || workflowName === workflow.name) {
			workflowName = workflow.name;
			return;
		}

		try {
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
				toast.error('Failed to update workflow name');
				throw new Error(`Failed to update name: ${res.status}`);
			}
			workflow.name = workflowName;
		} catch (error) {
			console.error('Error updating name:', error);
			toast.error('Something went wrong. Please try again in a moment.');
			workflowName = workflow.name;
		}
	}

	onMount(() => {
		initFlow();
		const checkHash = () => {
			if (window.location.hash === '#settings') {
				showSettingsModal = true;
			}
		};
		checkHash();
		window.addEventListener('hashchange', checkHash);
		return () => window.removeEventListener('hashchange', checkHash);
	});

	function closeSettings() {
		showSettingsModal = false;
		if (window.location.hash === '#settings') {
			history.pushState('', document.title, window.location.pathname + window.location.search);
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
			{sourceNodeId}
			{actionId}
			onClose={() => (propertiesVisible = false)}
			onSubmit={async () => {
				await reloadWorkflow();
			}}
			{workflow}
		/>
	{/if}

	{#if showSettingsModal}
		<SettingsModal
			{workflow}
			onClose={closeSettings}
			onRename={async (newName) => {
				workflow.name = newName;
				await reloadWorkflow();
			}}
			onOpenRoles={() => {
				showSettingsModal = false;
				showRoleModal = true;
			}}
		/>
	{/if}

	{#if showRoleModal}
		<RoleManagement {workflow} onClose={() => (showRoleModal = false)} />
	{/if}
	<SidePanel
		activeWorkflow={workflow.id ?? ''}
		userName={user.firstName ?? 'User'}
		activeWorkflowName={wName}
	/>
	<div class="relative h-screen w-full overflow-clip bg-zinc-950 p-2">
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<section class="z-10 flex h-full w-full flex-col gap-2">
			<div class="z-10 flex w-full items-center justify-between gap-6 py-1">
				<div class="flex items-center gap-2">
					<button
						onclick={() => (showSettingsModal = true)}
						class="rounded-lg p-2 text-white hover:bg-white/10"
					>
						<Settings2 class="h-4 w-4" />
					</button>
					<div class="flex min-w-[200px] flex-col rounded-lg">
						<input
							onblur={() => updateName()}
							class="w-auto truncate rounded-lg bg-transparent py-1 font-semibold text-zinc-300 transition-all outline-none focus:bg-white/5 focus:px-2"
							bind:value={workflowName}
						/>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<a
						href="/docs"
						target="_blank"
						class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
					>
						<BookOpen class="h-3.5 w-3.5" />
						<span>Docs</span>
					</a>

					{#if !workflow.isPublished}
						<div class="relative">
							<button
								onclick={(e) => {
									e.stopPropagation();
									showPublishModal = !showPublishModal;
								}}
								class="group flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 transition-all duration-300 hover:bg-green-800 active:scale-95"
							>
								<ArrowUp class="h-3.5 w-3.5 text-white" />
								<span class="text-xs font-medium tracking-wide text-white transition-colors">
									Publish
								</span>
							</button>

							{#if showPublishModal}
								<Publish
									{workflow}
									onClose={() => (showPublishModal = false)}
									onSubmit={async () => {
										await reloadWorkflow();
									}}
								/>
							{/if}
						</div>
					{:else}
						<a
							href="{workflow.id}/run"
							target="_blank"
							class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
						>
							<Play class="h-3.5 w-3.5 text-white" />
							<span>Run</span>
						</a>
						<a
							href="{workflow.id}/monitor"
							target="_blank"
							class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
						>
							<Activity class="h-3.5 w-3.5 text-green-400" />
							<span>Monitor</span>
						</a>
						<div class="relative">
							<button
								onclick={(e) => {
									e.stopPropagation();
									showPublishModal = !showPublishModal;
								}}
								class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 {isSynced
									? 'hover:bg-white/10'
									: 'bg-green-700 hover:bg-green-800'} active:scale-95"
							>
								<CornerRightUp class="h-3.5 w-3.5" />
								<span>Publish</span>
							</button>

							{#if showPublishModal}
								<Publish
									{workflow}
									onClose={() => (showPublishModal = false)}
									onSubmit={async () => {
										await reloadWorkflow();
									}}
								/>
							{/if}
						</div>
					{/if}
				</div>
			</div>
			<div class="flex h-full w-full justify-center gap-2">
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
				<Menu
					workflowId={workflow.id}
					initialPrompt={page.url.searchParams.get('prompt') || ''}
					onAction={(value: string) => (
						(propertiesVisible = true),
						(actionId = value),
						(actionNode = null)
					)}
					onGenerate={async () => {
						await reloadWorkflow();
					}}
				/>
			</div>
		</section>
	</div>
</main>

<svelte:window on:click={() => ((open = false), (showPublishModal = false))} />
