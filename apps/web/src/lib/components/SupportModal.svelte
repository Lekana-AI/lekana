<script lang="ts">
	import { X, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { toast } from '$lib/toast.svelte';

	let { onClose } = $props();

	let feedback = $state('');
	let isSubmitting = $state(false);
	let submitted = $state(false);

	async function handleSubmit() {
		if (!feedback.trim()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('Feedback submitted:', feedback);
		isSubmitting = false;
		submitted = true;
		toast.success('Feedback sent successfully!');

		setTimeout(() => {
			onClose();
		}, 2000);
	}
</script>

<div
	class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
	onclick={onClose}
>
	<div
		class="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
		transition:scale={{ duration: 400, easing: backOut, start: 0.95 }}
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
				class="absolute top-4 right-4 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
			>
				<X class="h-5 w-5" />
			</button>

			{#if !submitted}
				<div class="mb-6 flex flex-col items-center text-center">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500"
					>
						<MessageSquare class="h-6 w-6" />
					</div>
					<h2 class="text-xl font-bold text-white">Share Your Feedback</h2>
					<p class="mt-1 text-sm text-zinc-400">
						Help us improve Lekana. We'd love to hear your thoughts!
					</p>
				</div>

				<div class="space-y-4">
					<div class="space-y-2">
						<label
							for="feedback"
							class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
						>
							Your Message
						</label>
						<textarea
							id="feedback"
							bind:value={feedback}
							placeholder="What can we do better?"
							class="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
						></textarea>
					</div>

					<div class="flex flex-col gap-4">
						<button
							onclick={handleSubmit}
							disabled={!feedback.trim() || isSubmitting}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isSubmitting}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
								></div>
								SENDING...
							{:else}
								<Send class="h-4 w-4" />
								SUBMIT FEEDBACK
							{/if}
						</button>

						<div
							class="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3"
						>
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-400"
							>
								<Mail class="h-4 w-4" />
							</div>
							<div class="flex flex-col">
								<span class="mb-1 text-[10px] leading-none font-bold text-zinc-500 uppercase"
									>Support Email</span
								>
								<a
									href="mailto:support@lekana.ai"
									class="text-xs text-white transition-colors hover:text-green-400"
								>
									support@lekana.ai
								</a>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center py-8 text-center" in:fade>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500"
					>
						<CheckCircle2 class="h-10 w-10" />
					</div>
					<h2 class="text-2xl font-bold text-white">Thank You!</h2>
					<p class="mt-2 text-zinc-400">
						Your feedback has been received. We appreciate your input!
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
