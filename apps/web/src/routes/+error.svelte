<script>
	import { page } from '$app/state';
	import { Home, ArrowLeft, TriangleAlert } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let status = $derived(page.status);
	let message = $derived(page.error?.message || 'Something went wrong');
</script>

<svelte:head>
	<title>{status} - {message}</title>
</svelte:head>

<main
	class="relative flex overflow-hidden h-screen flex-col items-center bg-neutral-950 text-white"
>
	<!-- Background Glows -->
	<div
		class="absolute top-1/4 left-1/2 scale-200 aspect-square w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-radial from-green-500/15 to-transparent to-70% blur-3xl"
	></div>

	<div class="relative z-10 flex flex-1 flex-col items-center justify-center px-6 w-full">
		<div
			class="group relative flex flex-col items-center rounded-3xl border border-white/5 bg-white/2 p-8 text-center shadow-2xl backdrop-blur-xl w-full max-w-2xl md:p-12"
		>
			<!-- Animated Icon Container -->
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20 transition-transform duration-500 group-hover:scale-110"
			>
				<TriangleAlert size="40" />
			</div>

			<h1 class="mb-2 text-6xl font-black tracking-tighter text-zinc-400">
				{status}
			</h1>

			<h2 class="mb-4 text-2xl font-bold text-white">
				{message}
			</h2>

			<div class="flex gap-6 self-stretch justify-center">
				<button
					onclick={() => window.history.back()}
					class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium transition-all hover:bg-white/10"
				>
					<ArrowLeft size="18" />
					Go Back
				</button>

				<a
					href="/"
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-medium text-black transition-all hover:bg-zinc-200"
				>
					<Home size="18" />
					Go Home
				</a>
			</div>
		</div>
	</div>
</main>

<style>
	/* Custom animations if needed */
</style>
