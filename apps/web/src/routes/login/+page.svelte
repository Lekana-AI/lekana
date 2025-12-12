<script lang="ts">
	import { SignIn, SignedOut } from 'svelte-clerk';

</script>

<SignedOut>
	<main class="flex h-screen w-screen bg-zinc-900 py-12">
		<div class="flex h-full w-full flex-col items-center justify-center gap-12 px-8 md:px-24">
			<div class="">
				<p class="text-xs font-semibold tracking-[0.2em] text-green-400/80 uppercase">
					welcome back
				</p>
				<h1 class="mt-3 text-3xl font-semibold text-white md:text-5xl">Login to Lekana</h1>
			</div>

			<div class="flex w-full max-w-md flex-col items-center gap-6">
				<SignIn
					signUpUrl="/signup"
					afterSignInUrl="/dashboard"
				/>
			</div>
		</div>
		<div
			class="relative md:flex hidden h-full w-full items-center justify-center overflow-clip rounded-l-2xl bg-black"
		>
			<div class="z-10 flex items-center gap-4">
				<img src="/logo.svg" alt="logo" class="h-12 w-12" />
				<span class="text-3xl font-semibold text-white">Lekana</span>
			</div>
			<div
				class="absolute top-1/2 left-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
			></div>
			<div
				class="absolute right-1/2 bottom-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
			></div>
		</div>
	</main>
</SignedOut>
