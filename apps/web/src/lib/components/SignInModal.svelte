<script lang="ts">
	import { SignedOut, SignIn, SignUp } from 'svelte-clerk';
	import { X } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { navState } from '$lib/nav.svelte.js';

	let mode = $state<'sign-in' | 'sign-up'>('sign-in');

	function onClose() {
		navState.showSignInModal = false;
	}

	const appearance = {
		elements: {
			footer: { display: 'none' }
		}
	};
</script>

<SignedOut>
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

			<div class="relative p-6 pt-12">
				<!-- Close Button -->
				<button
					onclick={onClose}
					class="absolute top-4 right-4 z-10 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
				>
					<X class="h-5 w-5" />
				</button>

				<div class="flex flex-col items-center">
					<div class="mb-6 flex flex-col items-center text-center">
						<!-- <div class="mb-4 flex items-center gap-2">
							<img src="/logo.svg" alt="logo" class="h-8 w-8" />
							<span class="text-xl font-bold text-white">Lekana</span>
						</div> -->
						<h2 class="text-2xl font-bold text-white">
							{mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
						</h2>
						<p class="mt-1 text-sm text-zinc-400">
							{mode === 'sign-in' ? 'Sign in to your account' : 'Start automating today'}
						</p>
					</div>

					<div class="flex flex-col items-center w-full">
						{#if mode === 'sign-in'}
							<SignIn {appearance} signUpUrl="/sign-up" afterSignInUrl="/dashboard" />
							<button
								onclick={() => (mode = 'sign-up')}
								class="mt-4 w-full text-center text-sm text-zinc-400"
							>
								Don't have an account? <span class="text-green-500 hover:text-green-400 transition-colors">Sign Up</span>
							</button>
						{:else}
							<SignUp {appearance} signInUrl="/sign-in" afterSignUpUrl="/dashboard" />
							<button
								onclick={() => (mode = 'sign-in')}
								class="mt-4 w-full text-center text-sm text-zinc-400"
							>
								Already have an account? <span class="text-green-500 hover:text-green-400 transition-colors">Sign In</span>
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</SignedOut>
