<script lang="ts">
	import { X, Settings2, Pen, Trash2, ExternalLink, ArrowRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { workflow, onClose, onRename } = $props();

	let workflowName = $state(workflow.name);
	let confirmName = $state('');
	let isDeleting = $state(false);
	let deletePrompt = $state(false);

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

	async function updateName() {
		if (!workflowName || workflowName === workflow.name) {
			workflowName = workflow.name;
			return;
		}

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
			throw new Error(`Failed to update workflow name: ${res.status}`);
		}

		onRename(workflowName);
	}
</script>

<main
	class="absolute inset-0 z-100 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-sm"
>
	<div class="z-10 flex h-full flex-col justify-center gap-8">
		<div class="w-full min-w-2xl rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-2xl">
			{#if deletePrompt}
				<!-- Delete Confirmation View -->
				<div class="space-y-6">
					<div class="relative flex w-full flex-col gap-2 pb-2">
						<div class="flex items-center justify-end">
							<button
								onclick={() => {
									deletePrompt = false;
									confirmName = '';
								}}
								class="rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
						<p class="text-[10px] font-bold tracking-widest text-red-500 uppercase">danger zone</p>
						<span class="flex items-center gap-2">
							<Trash2 class="h-6 w-6 text-white" />
							<h1 class="text-2xl font-semibold text-white md:text-3xl">Delete Workflow</h1>
						</span>
						<p class="mt-1 w-full text-sm text-zinc-400">
							This action is irreversible. All data associated with <span
								class="font-semibold text-white">"{workflow.name}"</span
							> will be permanently removed.
						</p>
					</div>

					<div class="space-y-4">
						<div class="space-y-2">
							<label
								for="confirm-name"
								class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
							>
								Type <span class="text-white select-all">{workflow.name}</span> to confirm
							</label>
							<input
								id="confirm-name"
								type="text"
								bind:value={confirmName}
								placeholder="Enter workflow name"
								class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 font-mono text-sm text-white focus:border-red-500/50 focus:outline-none"
							/>
						</div>

						<div class="flex justify-end gap-3 pt-2">
							<button
								onclick={() => {
									deletePrompt = false;
									confirmName = '';
								}}
								class="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
							>
								CANCEL
							</button>
							<button
								onclick={deleteWorkflow}
								disabled={confirmName !== workflow.name || isDeleting}
								class="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-xs font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isDeleting ? 'DELETING...' : 'DELETE WORKFLOW'}
							</button>
						</div>
					</div>
				</div>
			{:else}
				<!-- Main Settings View -->
				<div class="relative flex w-full flex-col gap-2 pb-6">
					<div class="flex items-center justify-end">
						<button
							onclick={onClose}
							class="rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
					<span class="flex items-center gap-2">
						<Settings2 class="h-6 w-6 text-white" />
						<h1 class="text-2xl font-semibold text-white md:text-3xl">Workflow Settings</h1>
					</span>
					<p class="mt-1 w-full text-sm text-zinc-400">
						Manage configuration for <span class="font-medium text-white">{workflow.name}</span>.
					</p>
				</div>

				<div class="space-y-8">
					<!-- Rename Section -->
					<div class="space-y-3">
						<label
							for="workflow-name-input"
							class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
							>Workflow Name</label
						>
						<div class="flex items-center gap-2">
							<input
								id="workflow-name-input"
								type="text"
								bind:value={workflowName}
								class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white transition-all focus:border-green-500/50 focus:outline-none"
								placeholder="Enter workflow name"
							/>
							<button
								onclick={updateName}
								class="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
							>
								<Pen class="h-3.5 w-3.5" />
								RENAME
							</button>
						</div>
					</div>

					<!-- Danger Zone -->
					<div class="space-y-3">
						<p class="text-[10px] font-bold tracking-widest text-red-500 uppercase">Danger Zone</p>
						<div
							class="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4"
						>
							<div>
								<h4 class="text-sm font-medium text-white">Delete Workflow</h4>
								<p class="text-[11px] text-zinc-400">
									Permanently remove this workflow and all its data.
								</p>
							</div>
							<button
								onclick={() => (deletePrompt = true)}
								class="flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-500/20 hover:text-white active:scale-95"
							>
								<Trash2 class="h-3.5 w-3.5" />
								DELETE
							</button>
						</div>
					</div>

					<div class="flex justify-end pt-2">
						<button
							onclick={onClose}
							class="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
						>
							DONE
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
