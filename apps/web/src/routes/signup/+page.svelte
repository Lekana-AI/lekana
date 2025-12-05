<script>
	import { goto } from '$app/navigation';
	import { ArrowRight } from 'lucide-svelte';
</script>

<main class="flex h-screen w-screen bg-zinc-900 py-12">
	<div class=" flex h-full w-full flex-col items-center justify-center gap-12 px-8 md:px-24">
		<div class="">
			<p class="text-xs font-semibold tracking-[0.2em] text-green-400/80 uppercase">signup</p>
			<h1 class="mt-3 text-3xl font-semibold text-white md:text-5xl">Join Lekana AI</h1>
		</div>

		<form class="flex w-full max-w-md flex-col gap-4 text-white">
			<div class="flex flex-col text-sm">
				<label for="email" class="mb-2 text-gray-300">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
					placeholder="Email"
				/>
			</div>
			<div class="flex flex-col text-sm">
				<label for="password" class="mb-2 text-gray-300">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					class="peer w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
					placeholder="Password"
				/>
				<p
					class="pt-2 text-xs text-gray-400 opacity-0 transition-opacity duration-200 peer-focus:opacity-100"
				>
					Password must be at least 8 characters long and include at least one number.
				</p>
			</div>
			<div class="flex flex-col gap-4 pt-3">
				<p class="text-xs text-gray-200">
					By continuing, you agree to the Terms of Service and Privacy Policy.
				</p>

				<button
					type="button"
					on:click={() => goto('getting-started')}
					class="flex w-full items-center justify-center gap-2 rounded-md bg-white p-2 text-sm font-semibold text-black transition-colors duration-300 hover:bg-green-50"
				>
					Continue <ArrowRight size="16" />
				</button>
			</div>
		</form>
	</div>
	<div
		class="relative flex h-full w-full items-center justify-center overflow-clip rounded-l-2xl bg-black"
	>
		<div class="z-10 flex items-center gap-4">
			<img src="/logo.svg" alt="logo" class="h-12 w-12" />
			<span class="text-3xl font-semibold text-white">Lekana AI</span>
		</div>
		<div
			class="absolute top-1/2 left-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<div
			class="absolute right-1/2 bottom-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
	</div>
</main>
