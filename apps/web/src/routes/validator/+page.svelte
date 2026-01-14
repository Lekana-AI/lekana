<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from '$lib/toast.svelte';
	import { ClipboardCheck, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-svelte';

	let loading = $state(true);
	let stats = $state<any>({});
	let queue = $state<any[]>([]);

	const RUNTIME_URL = import.meta.env.VITE_RUNTIME_URL || 'http://localhost:4003';

	onMount(async () => {
		await Promise.all([loadStats(), loadQueue()]);
	});

	async function loadStats() {
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/stats`, {
				credentials: 'include'
			});
			if (res.ok) {
				stats = await res.json();
			}
		} catch (error) {
			console.error('Error loading stats:', error);
		}
	}

	async function loadQueue() {
		loading = true;
		try {
			const res = await fetch(`${RUNTIME_URL}/api/v1/review/queue`, {
				credentials: 'include'
			});
			if (res.ok) {
				const data = await res.json();
				queue = data.tasks || [];
			}
		} catch (error) {
			console.error('Error loading queue:', error);
			toast.error('Failed to load review queue');
		}
		loading = false;
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
			case 'IN_REVIEW': return 'text-blue-400 bg-blue-500/20';
			case 'APPROVED': return 'text-green-400 bg-green-500/20';
			case 'REJECTED': return 'text-red-400 bg-red-500/20';
			case 'NEEDS_CHANGES': return 'text-orange-400 bg-orange-500/20';
			default: return 'text-zinc-400 bg-zinc-500/20';
		}
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-white">Review Queue</h1>
		<p class="text-sm text-zinc-400">Documents pending your validation</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-4 gap-4">
		<div class="rounded-xl border border-white/5 bg-zinc-900 p-4">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-yellow-500/20 p-2">
					<Clock class="h-5 w-5 text-yellow-400" />
				</div>
				<div>
					<p class="text-2xl font-bold text-white">{stats.queue?.pending || 0}</p>
					<p class="text-xs text-zinc-400">Pending</p>
				</div>
			</div>
		</div>

		<div class="rounded-xl border border-white/5 bg-zinc-900 p-4">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-blue-500/20 p-2">
					<ClipboardCheck class="h-5 w-5 text-blue-400" />
				</div>
				<div>
					<p class="text-2xl font-bold text-white">{stats.queue?.inReview || 0}</p>
					<p class="text-xs text-zinc-400">In Review</p>
				</div>
			</div>
		</div>

		<div class="rounded-xl border border-white/5 bg-zinc-900 p-4">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-green-500/20 p-2">
					<CheckCircle class="h-5 w-5 text-green-400" />
				</div>
				<div>
					<p class="text-2xl font-bold text-white">{stats.completed?.approved || 0}</p>
					<p class="text-xs text-zinc-400">Approved</p>
				</div>
			</div>
		</div>

		<div class="rounded-xl border border-white/5 bg-zinc-900 p-4">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-orange-500/20 p-2">
					<AlertTriangle class="h-5 w-5 text-orange-400" />
				</div>
				<div>
					<p class="text-2xl font-bold text-white">{stats.queue?.needsChanges || 0}</p>
					<p class="text-xs text-zinc-400">Needs Changes</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Queue Table -->
	<div class="rounded-xl border border-white/5 bg-zinc-900">
		<div class="border-b border-white/5 px-6 py-4">
			<h2 class="font-semibold text-white">Pending Reviews</h2>
		</div>

		{#if loading}
			<div class="py-12 text-center text-sm text-zinc-500">Loading...</div>
		{:else if queue.length === 0}
			<div class="py-12 text-center">
				<ClipboardCheck class="mx-auto h-12 w-12 text-zinc-600" />
				<p class="mt-4 text-sm text-zinc-400">No documents pending review</p>
			</div>
		{:else}
			<table class="w-full">
				<thead>
					<tr class="border-b border-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
						<th class="px-6 py-3">Document</th>
						<th class="px-6 py-3">Workflow</th>
						<th class="px-6 py-3">Status</th>
						<th class="px-6 py-3">Created</th>
						<th class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each queue as task}
						<tr class="border-b border-white/5 hover:bg-white/5">
							<td class="px-6 py-4">
								<span class="text-sm font-medium text-white">{task.id.slice(0, 8)}...</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-zinc-300">{task.workflowExecution?.workflowName || 'Unknown'}</span>
							</td>
							<td class="px-6 py-4">
								<span class="rounded-full px-2 py-1 text-xs font-medium {getStatusColor(task.status)}">
									{task.status}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-zinc-400">
									{new Date(task.createdAt).toLocaleDateString()}
								</span>
							</td>
							<td class="px-6 py-4">
								<a
									href="/validator/review/{task.id}"
									class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
								>
									Review
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
