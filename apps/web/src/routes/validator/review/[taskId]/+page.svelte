<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';
	import { ArrowLeft, Check, X, Edit3, FileText, AlertCircle } from 'lucide-svelte';

	const taskId = $derived($page.params.taskId);

	let loading = $state(true);
	let task = $state<any>(null);
	let reviewedData = $state<any>({});
	let reviewNotes = $state('');
	let submitting = $state(false);

	const RUNTIME_URL = import.meta.env.VITE_RUNTIME_URL || 'http://localhost:4003';

	onMount(async () => {
		await loadTask();
	});

	async function loadTask() {
		loading = true;
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/${taskId}`, {
				credentials: 'include'
			});
			if (res.ok) {
				task = await res.json();
				reviewedData = { ...task.originalData };
			} else {
				toast.error('Failed to load review task');
			}
		} catch (error) {
			console.error('Error loading task:', error);
			toast.error('Failed to load review task');
		}
		loading = false;
	}

	async function claimTask() {
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/${taskId}/claim`, {
				method: 'POST',
				credentials: 'include'
			});
			if (res.ok) {
				task = await res.json();
				toast.success('Task claimed');
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to claim task');
			}
		} catch (error) {
			toast.error('Failed to claim task');
		}
	}

	async function approveTask() {
		submitting = true;
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/${taskId}/approve`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					reviewedData,
					reviewNotes
				})
			});
			if (res.ok) {
				toast.success('Document approved');
				goto('/validator');
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to approve');
			}
		} catch (error) {
			toast.error('Failed to approve');
		}
		submitting = false;
	}

	async function rejectTask(needsChanges = false) {
		if (!reviewNotes.trim()) {
			toast.error('Please provide review notes');
			return;
		}
		submitting = true;
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/${taskId}/reject`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					reviewNotes,
					needsChanges
				})
			});
			if (res.ok) {
				toast.success(needsChanges ? 'Changes requested' : 'Document rejected');
				goto('/validator');
			} else {
				const data = await res.json();
				toast.error(data.error || 'Failed to reject');
			}
		} catch (error) {
			toast.error('Failed to reject');
		}
		submitting = false;
	}

	function updateField(key: string, value: any) {
		reviewedData = { ...reviewedData, [key]: value };
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a
				href="/validator"
				class="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
			>
				<ArrowLeft class="h-5 w-5" />
			</a>
			<div>
				<h1 class="text-xl font-bold text-white">Document Review</h1>
				<p class="text-sm text-zinc-400">
					{task?.workflowExecution?.workflowName || 'Loading...'}
				</p>
			</div>
		</div>

		{#if task && task.status !== 'IN_REVIEW' && !task.assignedTo}
			<button
				onclick={claimTask}
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				Claim Task
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="py-12 text-center text-sm text-zinc-500">Loading...</div>
	{:else if !task}
		<div class="py-12 text-center">
			<AlertCircle class="mx-auto h-12 w-12 text-red-400" />
			<p class="mt-4 text-sm text-zinc-400">Task not found</p>
		</div>
	{:else}
		<!-- Side by Side View -->
		<div class="grid grid-cols-2 gap-6">
			<!-- Original Data (OCR Output) -->
			<div class="rounded-xl border border-white/5 bg-zinc-900">
				<div class="border-b border-white/5 px-4 py-3">
					<div class="flex items-center gap-2">
						<FileText class="h-4 w-4 text-zinc-400" />
						<h2 class="font-semibold text-white">Extracted Data (OCR)</h2>
					</div>
				</div>
				<div class="max-h-[500px] overflow-y-auto p-4">
					<div class="space-y-4">
						{#each Object.entries(task.originalData || {}) as [key, value]}
							<div class="rounded-lg border border-white/5 bg-zinc-950 p-3">
								<label class="text-xs font-medium uppercase tracking-wider text-zinc-500">
									{key}
								</label>
								<div class="mt-1 text-sm text-white">
									{#if typeof value === 'object'}
										<pre class="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
									{:else}
										{value}
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Editable Data (Review) -->
			<div class="rounded-xl border border-white/5 bg-zinc-900">
				<div class="border-b border-white/5 px-4 py-3">
					<div class="flex items-center gap-2">
						<Edit3 class="h-4 w-4 text-green-400" />
						<h2 class="font-semibold text-white">Review & Correct</h2>
					</div>
				</div>
				<div class="max-h-[500px] overflow-y-auto p-4">
					<div class="space-y-4">
						{#each Object.entries(reviewedData || {}) as [key, value]}
							<div class="rounded-lg border border-green-500/20 bg-zinc-950 p-3">
								<label
									for="field-{key}"
									class="text-xs font-medium uppercase tracking-wider text-green-400"
								>
									{key}
								</label>
								{#if typeof value === 'object'}
									<textarea
										id="field-{key}"
										class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-green-500/50 focus:outline-none"
										rows="3"
										value={JSON.stringify(value, null, 2)}
										onchange={(e) => {
											try {
												updateField(key, JSON.parse(e.currentTarget.value));
											} catch {
												// Keep as string if not valid JSON
											}
										}}
									></textarea>
								{:else}
									<input
										id="field-{key}"
										type="text"
										class="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-green-500/50 focus:outline-none"
										value={value}
										oninput={(e) => updateField(key, e.currentTarget.value)}
									/>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Review Notes -->
		<div class="rounded-xl border border-white/5 bg-zinc-900 p-4">
			<label for="review-notes" class="text-sm font-medium text-zinc-300">
				Review Notes
			</label>
			<textarea
				id="review-notes"
				bind:value={reviewNotes}
				placeholder="Add any notes about your review..."
				rows="3"
				class="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-green-500/50 focus:outline-none"
			></textarea>
		</div>

		<!-- Action Buttons -->
		{#if task.status === 'IN_REVIEW' || task.assignedTo}
			<div class="flex items-center justify-end gap-3">
				<button
					onclick={() => rejectTask(false)}
					disabled={submitting}
					class="flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
				>
					<X class="h-4 w-4" />
					Reject
				</button>
				<button
					onclick={() => rejectTask(true)}
					disabled={submitting}
					class="flex items-center gap-2 rounded-lg border border-orange-500/50 px-4 py-2 text-sm font-medium text-orange-400 transition-all hover:bg-orange-500/20 disabled:opacity-50"
				>
					<AlertCircle class="h-4 w-4" />
					Request Changes
				</button>
				<button
					onclick={approveTask}
					disabled={submitting}
					class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:opacity-50"
				>
					<Check class="h-4 w-4" />
					Approve
				</button>
			</div>
		{/if}
	{/if}
</div>
