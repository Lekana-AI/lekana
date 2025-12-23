<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';
	import type { User } from 'svelte-clerk/server';
	import { ArrowLeft, Settings2, Puzzle, Trash2, Save, ExternalLink, Pen } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const workflow = data?.workflow;
	const user: User = data?.user;

	let workflowName = $state(workflow.name);

	let confirmName = $state('');
	let isDeleting = $state(false);

	async function deleteWorkflow() {
		if (confirmName !== workflow.name) return;

		isDeleting = true;
		try {
			const res = await fetch(`/api/workflows/${workflow.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Backend response body:', errorText);
				throw new Error(`Failed to delete workflow: ${res.status}`);
			}

			goto('/dashboard');
		} catch (error) {
			console.error('Error deleting workflow:', error);
			isDeleting = false;
		}
	}

	let wName = $state(workflow.name);

	async function updateName() {
		if (!workflowName || workflowName === workflow.name) {
			workflowName = workflow.name;
			return;
		}
		wName = workflowName;

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

	let deletePrompt = $state(false);
</script>

<svelte:head>
	<title>{workflow.name} Settings - Lekana</title>
</svelte:head>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	{#if deletePrompt}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
			>
				<div class="bg-red-500/10 p-6 text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500"
					>
						<Trash2 class="h-6 w-6" />
					</div>
					<h3 class="text-xl font-bold text-white">Delete Workflow</h3>
					<p class="mt-2 text-sm text-zinc-400">
						This action is irreversible. All data associated with <span
							class="font-semibold text-white">"{workflow.name}"</span
						> will be permanently removed.
					</p>
				</div>

				<div class="p-6">
					<div class="space-y-4">
						<label for="confirm-name" class="block text-sm font-medium text-zinc-300">
							Type <span class="rounded bg-white/5 px-1.5 py-0.5 font-mono text-white select-all"
								>{workflow.name}</span
							> to confirm
						</label>
						<input
							id="confirm-name"
							type="text"
							bind:value={confirmName}
							placeholder="Enter workflow name"
							class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
						/>
					</div>

					<div class="mt-8 flex gap-3">
						<button
							onclick={() => {
								deletePrompt = false;
								confirmName = '';
							}}
							class="flex-1 rounded-xl bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
						>
							Cancel
						</button>
						<button
							onclick={deleteWorkflow}
							disabled={confirmName !== workflow.name || isDeleting}
							class="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
						>
							{isDeleting ? 'Deleting...' : 'Delete Workflow'}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<SidePanel activeWorkflow={workflow.id} userName={user.firstName} activeWorkflowName={wName} />

	<div class="relative flex h-screen w-full flex-col overflow-y-auto bg-zinc-950 p-8 pt-12">
		<!-- Background Glow -->
		<div
			class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-full -translate-x-1/2 rounded-full bg-radial from-green-500/10 to-transparent to-70%"
		></div>

		<div class="relative z-10 mx-auto w-full max-w-4xl">
			<!-- Header -->
			<header class="mb-10 flex items-center justify-between">
				<div class="flex items-center gap-4">
					<!-- <button
						onclick={() => goto(`/w/${workflow.id}`)}
						class="flex items-center justify-center rounded-xl bg-white/5 p-3 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
					>
						<ArrowLeft class="h-5 w-5" />
					</button> -->
					<div>
						<button
							onclick={() => goto(`/w/${workflow.id}`)}
							class="mb-5 flex items-center gap-2 rounded-xl py-4 text-sm text-zinc-400 transition-all hover:text-white"
						>
							<ArrowLeft class="h-5 w-5" /> Back to Workflow
						</button>
						<h1 class="text-2xl font-bold text-white">Workflow Settings</h1>
						<p class="text-sm text-zinc-500">
							Manage {workflow.name}'s configuration
						</p>
					</div>
				</div>
			</header>

			<div class="flex flex-col gap-8 md:flex-row">
				<!-- Tab Content -->
				<div
					class="flex w-full flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-sm"
				>
					<div class="flex flex-col gap-2">
						<label for="name" class="text-sm font-medium text-zinc-300">Workflow Name</label>

						<div class="flex items-center gap-2">
							<input
								id="name"
								type="text"
								bind:value={workflowName}
								class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white transition-all focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
								placeholder="Enter workflow name"
							/>
							<button
								onclick={updateName}
								class="flex items-center gap-2 rounded-lg bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
							>
								<Pen class="h-4 w-4" />
								Rename
							</button>
						</div>
					</div>
					<div
						class="mt-8 flex flex-col gap-6 rounded-xl border border-red-500/20 bg-red-500/5 p-2"
					>
						<div class=" p-4">
							<h3 class="text-lg font-semibold text-white">Danger Zone</h3>
							<p class="text-sm text-white/60">Irreversible actions that affect your workflow</p>
						</div>

						<div class="flex items-center justify-between rounded-xl bg-zinc-950 p-4">
							<div>
								<h4 class="font-medium text-white">Delete this workflow</h4>
								<p class="text-xs text-zinc-500">
									Once deleted, it cannot be recovered. All associated data will be gone.
								</p>
							</div>
							<button
								onclick={() => (deletePrompt = true)}
								class="flex items-center gap-2 rounded-xl border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/20 hover:text-white active:scale-95"
							>
								<Trash2 class="h-4 w-4" />
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
</style>
