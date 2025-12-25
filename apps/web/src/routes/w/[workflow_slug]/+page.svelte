<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';

	import FlowCanvas from '$lib/components/FlowCanvas.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import ActionProperties from '$lib/components/ActionProperties.svelte';
	import { goto } from '$app/navigation';
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
		RefreshCw
	} from 'lucide-svelte';
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

	let isPublishing = $state(false);
	let publishResult = $state<any>(null);
	let showPublishModal = $state(false);

	let copiedKey = $state(false);
	let copiedEndpoint = $state(false);

	function copyToClipboard(text: string, type: 'key' | 'endpoint') {
		navigator.clipboard.writeText(text);
		if (type === 'key') {
			copiedKey = true;
			setTimeout(() => (copiedKey = false), 2000);
		} else {
			copiedEndpoint = true;
			setTimeout(() => (copiedEndpoint = false), 2000);
		}
	}

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

	async function publishWorkflow() {
		isPublishing = true;
		try {
			const res = await fetch('/rime/publish', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ workflowId: workflow.id })
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Publish error:', errorText);
				toast.error('Failed to publish');
				throw new Error(`Failed to publish workflow: ${res.status}`);
			}

			publishResult = await res.json();
			workflow.isPublished = true;
			showPublishModal = true;
			toast.success('Workflow published!');
		} catch (error) {
			console.error('Error publishing workflow:', error);
		} finally {
			isPublishing = false;
		}
	}

	async function togglePublished() {
		if (isPublishing) return;
		if (!workflow.isPublished) {
			await publishWorkflow();
		} else {
			const confirmed = await confirmStore.confirm(
				'Are you sure you want to unpublish this workflow? It will no longer respond to external requests.',
				'Unpublish Workflow'
			);
			if (!confirmed) return;

			const res = await fetch(`/api/workflows/${workflow.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ isPublished: false })
			});

			if (res.ok) {
				workflow.isPublished = false;
				toast.success('Workflow set to draft');
			} else {
				toast.error('Failed to unpublish');
			}
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
			<div class="flex w-fit items-center gap-6">
				<div class="flex items-center gap-2">
					<a href="/w/{workflow.id}/settings" class="rounded-lg p-3 text-white hover:bg-white/10">
						<Settings2 class="h-5 w-5" />
					</a>
					<div class="flex w-fit flex-col rounded-xl">
						<input
							onblur={() => updateName()}
							class="w-auto truncate rounded-lg bg-transparent text-lg font-semibold text-zinc-300 transition-all outline-none focus:bg-white/5 focus:px-2"
							bind:value={workflowName}
						/>
					</div>
				</div>

				<!-- Publication Toggle -->
				<button
					onclick={togglePublished}
					disabled={isPublishing}
					class="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pr-4 pl-2.5 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
				>
					<div
						class="relative h-5 w-9 rounded-full transition-colors duration-300 {workflow.isPublished
							? 'bg-green-500'
							: 'bg-zinc-600'}"
					>
						<div
							class="absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-all duration-300 {workflow.isPublished
								? 'left-5'
								: 'left-1'}"
						></div>
					</div>
					<div class="flex flex-col items-start leading-none">
						<span
							class="text-[10px] font-bold tracking-widest uppercase {workflow.isPublished
								? 'text-green-400'
								: 'text-zinc-400'}"
						>
							{workflow.isPublished ? 'Published' : 'Draft'}
						</span>
						{#if isPublishing}
							<span class="text-[8px] text-zinc-500">Syncing...</span>
						{/if}
					</div>
				</button>
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
	{#if showPublishModal}
		<div
			class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
			>
				<div class="bg-green-500/10 p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500"
					>
						<CheckCircle2 class="h-6 w-6" />
					</div>
					<h3 class="text-xl font-bold text-white">Workflow Published Successfully</h3>
					<p class="mt-2 text-sm text-zinc-400">
						Your workflow <span class="font-semibold text-white"
							>"{publishResult?.workflowName || workflow.name}"</span
						> is now live!
					</p>
				</div>

				<div class="scrollbar-hide max-h-[70vh] overflow-y-auto p-6">
					<div class="space-y-6">
						<!-- Basic Info -->
						<div class="grid grid-cols-1 gap-4">
							<div class="rounded-xl bg-white/5 p-3">
								<p class="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
									Published ID
								</p>
								<p class="mt-1 truncate font-mono text-sm text-white">
									{publishResult?.publishedWorkflowId}
								</p>
							</div>
						</div>

						<!-- API Key Section -->
						{#if publishResult?.apiKeys?.[0]?.key}
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<label class="flex items-center gap-2 text-sm font-medium text-zinc-300">
										<Key class="h-4 w-4 text-amber-500" />
										API Key
									</label>
									<button
										onclick={() => copyToClipboard(publishResult.apiKeys[0].key, 'key')}
										class="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
									>
										{#if copiedKey}
											<Check class="h-3 w-3 text-green-500" />
											<span class="text-green-500">Copied!</span>
										{:else}
											<Copy class="h-3 w-3" />
											Copy
										{/if}
									</button>
								</div>
								<div class="relative">
									<input
										type="text"
										readonly
										value={publishResult.apiKeys[0].key}
										class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 font-mono text-sm text-white"
									/>
								</div>
								<p class="text-[10px] text-amber-500/80">
									{publishResult.apiKeys[0].warning}
								</p>
							</div>
						{:else if publishResult?.apiKeys?.[0]?.prefix}
							<div class="space-y-2">
								<div class="flex items-center justify-between">
									<label class="flex items-center gap-2 text-sm font-medium text-zinc-300">
										<Key class="h-4 w-4 text-amber-500" />
										API Key Prefix
									</label>
									<button
										onclick={() => copyToClipboard(publishResult.apiKeys[0].prefix, 'key')}
										class="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
									>
										{#if copiedKey}
											<Check class="h-3 w-3 text-green-500" />
											<span class="text-green-500">Copied!</span>
										{:else}
											<Copy class="h-3 w-3" />
											Copy
										{/if}
									</button>
								</div>
								<div class="relative">
									<input
										type="text"
										readonly
										value={publishResult.apiKeys[0].prefix}
										class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 font-mono text-sm text-white"
									/>
								</div>
								<p class="text-[10px] text-amber-500/80">
									{publishResult.note}
								</p>
							</div>
						{/if}

						<!-- Endpoint Section -->
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<label class="flex items-center gap-2 text-sm font-medium text-zinc-300">
									<Terminal class="h-4 w-4 text-blue-500" />
									Run Endpoint
								</label>
								<button
									onclick={() => copyToClipboard(publishResult?.runEndpoint, 'endpoint')}
									class="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
								>
									{#if copiedEndpoint}
										<Check class="h-3 w-3 text-green-500" />
										<span class="text-green-500">Copied!</span>
									{:else}
										<Copy class="h-3 w-3" />
										Copy
									{/if}
								</button>
							</div>
							<div class="relative">
								<input
									type="text"
									readonly
									value={publishResult?.runEndpoint}
									class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 font-mono text-sm text-white"
								/>
							</div>
						</div>
					</div>

					<div class="mt-8">
						<button
							onclick={() => (showPublishModal = false)}
							class="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95"
						>
							Got it, thanks!
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<svelte:window on:click={() => (open = false)} />
