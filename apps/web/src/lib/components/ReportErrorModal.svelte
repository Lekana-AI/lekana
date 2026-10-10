<script lang="ts">
	import { X, Flag, Loader2, AlertTriangle } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		executionId: string;
		nodeExecutionId?: string | null;
		stepName?: string | null;
		errorDetails?: any;
		workflowId: string;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		isOpen,
		executionId,
		nodeExecutionId = null,
		stepName = null,
		errorDetails = null,
		workflowId,
		onClose,
		onSuccess
	}: Props = $props();

	let comment = $state('');
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit() {
		if (!comment.trim()) {
			error = 'Please describe the issue you encountered';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					comment: comment.trim(),
					workflowId,
					executionId,
					nodeExecutionId,
					errorDetails
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to submit report');
			}

			comment = '';
			onSuccess();
			onClose();
		} catch (err: any) {
			error = err.message || 'Failed to submit error report';
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		onclick={onClose}
		role="button"
		tabindex="-1"
	>
		<!-- Modal -->
		<div
			class="relative mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-white/5 px-6 py-4">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10"
					>
						<Flag class="h-5 w-5 text-red-400" />
					</div>
					<div>
						<h2 class="text-lg font-bold text-white">Report Issue</h2>
						<p class="text-xs text-zinc-500">
							{#if stepName}
								Step: {stepName}
							{:else}
								Execution: {executionId.slice(0, 8)}...
							{/if}
						</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Body -->
			<div class="space-y-4 p-6">
				<!-- Error Context -->
				{#if errorDetails}
					<div class="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
						<div class="mb-2 flex items-center gap-2">
							<AlertTriangle class="h-4 w-4 text-red-400" />
							<span class="text-xs font-bold uppercase text-red-400">Error Context</span>
						</div>
						<p class="line-clamp-3 font-mono text-xs text-red-300/80">
							{typeof errorDetails === 'string'
								? errorDetails
								: errorDetails?.message || JSON.stringify(errorDetails).slice(0, 200)}
						</p>
					</div>
				{/if}

				<!-- Comment Input -->
				<div>
					<label for="error-comment" class="mb-2 block text-xs font-bold uppercase text-zinc-500">
						Describe the Issue
					</label>
					<textarea
						id="error-comment"
						bind:value={comment}
						placeholder="What went wrong? Please provide any details that might help us investigate..."
						rows="4"
						class="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50"
					></textarea>
				</div>

				<!-- Error Message -->
				{#if error}
					<p class="text-sm text-red-400">{error}</p>
				{/if}
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-4">
				<button
					onclick={onClose}
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-white/5 hover:text-white disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					onclick={handleSubmit}
					disabled={isSubmitting || !comment.trim()}
					class="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Submitting...</span>
					{:else}
						<Flag class="h-4 w-4" />
						<span>Submit Report</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
