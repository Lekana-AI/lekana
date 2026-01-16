<script lang="ts">
	import {
		X,
		Mail,
		MessageSquare,
		Send,
		CheckCircle2,
		ChevronDown,
		ChevronRight,
		Play
	} from 'lucide-svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { toast } from '$lib/toast.svelte';

	let { onClose, workflows = [], activeWorkflowId = '' } = $props();

	let activeTab = $state<'video' | 'feedback' | 'email' | null>(null);
	let feedback = $state('');
	let selectedWorkflowId = $state(activeWorkflowId);
	let isSubmitting = $state(false);
	let submitted = $state(false);

	async function handleSubmit() {
		if (!feedback.trim()) return;

		isSubmitting = true;

		try {
			const res = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment: feedback,
					workflowId: selectedWorkflowId || null
				})
			});

			if (!res.ok) {
				throw new Error('Failed to submit feedback');
			}

			isSubmitting = false;
			submitted = true;
			toast.success('Feedback sent successfully!');

			setTimeout(() => {
				onClose();
			}, 2000);
		} catch (error) {
			console.error('Feedback submission error:', error);
			toast.error('Failed to send feedback. Please try again.');
			isSubmitting = false;
		}
	}

	function toggleTab(tab: 'video' | 'feedback' | 'email') {
		if (activeTab === tab) {
			activeTab = null;
		} else {
			activeTab = tab;
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	onclick={onClose}
>
	<div
		class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Header Gradient -->
		<div
			class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-green-500/10 to-transparent"
		></div>

		<div class="relative p-6">
			<!-- Close Button -->
			<button
				onclick={onClose}
				class="absolute top-4 right-4 z-10 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
			>
				<X class="h-5 w-5" />
			</button>

			<div class="mb-6 flex flex-col items-center text-center">
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500"
				>
					<MessageSquare class="h-6 w-6" />
				</div>
				<h2 class="text-xl font-bold text-white">How can we help?</h2>
				<p class="mt-1 text-sm text-zinc-400">Get support or share your thoughts with us.</p>
			</div>

			<div class="space-y-3">
				<!-- Section 1: Video Tutorial -->
				<div
					class="overflow-hidden rounded-xl border border-white/5 bg-white/2 transition-colors {activeTab ===
					'video'
						? 'border-green-500/30 bg-green-500/5'
						: 'hover:bg-white/5'}"
				>
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left"
						onclick={() => toggleTab('video')}
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500"
							>
								<Play class="h-4 w-4 fill-current" />
							</div>
							<span class="text-sm font-semibold text-white">Video Tutorial</span>
						</div>
						{#if activeTab === 'video'}
							<ChevronDown class="h-4 w-4 text-zinc-500" />
						{:else}
							<ChevronRight class="h-4 w-4 text-zinc-500" />
						{/if}
					</button>

					{#if activeTab === 'video'}
						<div class="px-4 pb-4" transition:slide>
							<div class="aspect-video w-full overflow-hidden rounded-lg bg-black">
								<iframe
									width="100%"
									height="100%"
									src="https://www.youtube.com/embed/dQw4w9WgXcQ"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowfullscreen
								></iframe>
							</div>
						</div>
					{/if}
				</div>

				<!-- Section 2: Feedback Box -->
				<div
					class="overflow-hidden rounded-xl border border-white/5 bg-white/2 transition-colors {activeTab ===
					'feedback'
						? 'border-green-500/30 bg-green-500/5'
						: 'hover:bg-white/5'}"
				>
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left"
						onclick={() => toggleTab('feedback')}
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500"
							>
								<MessageSquare class="h-4 w-4" />
							</div>
							<span class="text-sm font-semibold text-white">Send Feedback</span>
						</div>
						{#if activeTab === 'feedback'}
							<ChevronDown class="h-4 w-4 text-zinc-500" />
						{:else}
							<ChevronRight class="h-4 w-4 text-zinc-500" />
						{/if}
					</button>

					{#if activeTab === 'feedback'}
						<div class="px-4 pb-4" transition:slide>
							{#if !submitted}
								<div class="space-y-4 pt-2">
									<div class="flex flex-col gap-1.5">
										<label
											for="workflow-select"
											class="px-1 text-[10px] font-bold text-zinc-500 uppercase"
										>
											Related Workflow (Optional)
										</label>
										<select
											id="workflow-select"
											bind:value={selectedWorkflowId}
											class="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white transition-all focus:border-green-500/50 focus:outline-none"
										>
											<option value="">None</option>
											{#each workflows as workflow}
												<option value={workflow.id}>{workflow.name}</option>
											{/each}
										</select>
									</div>

									<textarea
										bind:value={feedback}
										placeholder="What can we do better?"
										class="min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
									></textarea>
									<button
										onclick={handleSubmit}
										disabled={!feedback.trim() || isSubmitting}
										class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if isSubmitting}
											<div
												class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
											></div>
											SENDING...
										{:else}
											<Send class="h-4 w-4" />
											SUBMIT
										{/if}
									</button>
								</div>
							{:else}
								<div class="flex flex-col items-center py-4 text-center" in:fade>
									<div
										class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500"
									>
										<CheckCircle2 class="h-8 w-8" />
									</div>
									<h3 class="text-lg font-bold text-white">Thank You!</h3>
									<p class="mt-1 text-xs text-zinc-400">Your feedback has been received.</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Section 3: Email Support -->
				<div
					class="overflow-hidden rounded-xl border border-white/5 bg-white/2 transition-colors {activeTab ===
					'email'
						? 'border-green-500/30 bg-green-500/5'
						: 'hover:bg-white/5'}"
				>
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left"
						onclick={() => toggleTab('email')}
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500"
							>
								<Mail class="h-4 w-4" />
							</div>
							<span class="text-sm font-semibold text-white">Contact Email</span>
						</div>
						{#if activeTab === 'email'}
							<ChevronDown class="h-4 w-4 text-zinc-500" />
						{:else}
							<ChevronRight class="h-4 w-4 text-zinc-500" />
						{/if}
					</button>

					{#if activeTab === 'email'}
						<div class="px-4 pb-4" transition:slide>
							<div class="flex items-center justify-between rounded-lg bg-white/5 p-3 pt-2">
								<div class="flex flex-col">
									<span class="mb-1 text-[10px] leading-none font-bold text-zinc-500 uppercase"
										>Support Email</span
									>
									<a
										href="mailto:support@lekana.dev"
										class="text-sm text-white transition-colors hover:text-green-400"
									>
										support@lekana.dev
									</a>
								</div>
								<a
									href="mailto:support@lekana.dev"
									class="rounded-lg bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
								>
									<Mail class="h-4 w-4" />
								</a>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
