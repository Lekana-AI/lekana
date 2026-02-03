<script lang="ts">
	import { X, Mail, ArrowRight, PartyPopper, Loader2 } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { toast } from '$lib/toast.svelte';

	let { onClose } = $props();

	let email = $state('');
	let isSubmitting = $state(false);
	let submitted = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!email.trim() || !email.includes('@')) {
			toast.error('Please enter a valid business email.');
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/enterprise/api/users/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			if (!response.ok) {
				throw new Error('Failed to submit email');
			}

			submitted = true;
			toast.success('Inquiry sent successfully!');
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	onclick={onClose}
	transition:fade={{ duration: 200 }}
>
	<div
		class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
		onclick={(e) => e.stopPropagation()}
		transition:scale={{ duration: 300, easing: backOut, start: 0.95 }}
	>
		<!-- Header Gradient -->
		<div
			class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-green-500/10 to-transparent"
		></div>

		<div class="relative p-8">
			<!-- Close Button -->
			<button
				onclick={onClose}
				class="absolute top-4 right-4 z-10 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
			>
				<X class="h-5 w-5" />
			</button>

			{#if !submitted}
				<div class="flex flex-col items-center text-center">
					<div
						class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500"
					>
						<Mail class="h-7 w-7" />
					</div>
					<h2 class="text-2xl font-bold text-white">Enter your email to get started</h2>
					<p class="mt-2 text-sm text-zinc-400">
						Provide your business email to connect you with our team.
					</p>

					<form onsubmit={handleSubmit} class="mt-8 w-full space-y-4">
						<div class="relative">
							<input
								bind:value={email}
								type="email"
								placeholder="name@company.com"
								required
								class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting || !email}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isSubmitting}
								<Loader2 class="h-4 w-4 animate-spin" />
								SENDING...
							{:else}
								GET STARTED
								<ArrowRight class="h-4 w-4" />
							{/if}
						</button>

						<p class="text-[10px] text-zinc-500">
							By clicking, you give permission for our team to contact you regarding your inquiry.
						</p>
					</form>
				</div>
			{:else}
				<div class="flex flex-col items-center py-6 text-center" in:fade>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500"
					>
						<PartyPopper class="h-10 w-10" />
					</div>
					<h3 class="text-2xl font-bold text-white">Check your Inbox!</h3>
					<p class="mt-2 text-sm text-zinc-400">
						We've sent an email to <span class="text-white">{email}</span> <br /> You can now connect
						with our team and discuss your vision.
					</p>
					<button
						onclick={onClose}
						class="mt-8 rounded-xl border border-white/10 bg-white/5 px-8 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
					>
						Close
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
