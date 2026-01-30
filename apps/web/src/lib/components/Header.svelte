<script>
	import { SignedIn, SignedOut, SignInButton, UserButton } from 'svelte-clerk';
	import { navState } from '$lib/nav.svelte.js';
	import { page } from '$app/stores';

	const activeClass = 'text-green-500';
	const baseClass = 'transition-colors duration-300 hover:text-green-500';

	let isHome = $derived($page.url.pathname === '/');
</script>

<!-- NAV -->
<nav
	class="to white-0 fixed top-0 z-20 w-full bg-linear-to-t from-white/5 px-8 py-5 text-white backdrop-blur-md"
>
	<div class="mx-auto flex w-full items-center justify-between md:max-w-6xl">
		<a href="/" class="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
			<img src="/logo.svg" alt="logo" class="h-6 w-6" />
			<span class="font-semibold">Lekana</span>
		</a>

		<div class="hidden items-center gap-8 text-sm text-gray-300 md:flex">
			<!-- <a href="/" class="{baseClass} {isHome && navState.activeSection === 'hero' ? activeClass : ''}">Home</a> -->
			<a
				href="/#about"
				class="{baseClass} {isHome && navState.activeSection === 'about' ? activeClass : ''}"
				>About</a
			>
			<a
				href="/#pricing"
				class="{baseClass} {isHome && navState.activeSection === 'pricing' ? activeClass : ''}"
				>Pricing</a
			>
			<a
				href="/#faq"
				class="{baseClass} {isHome && navState.activeSection === 'faq' ? activeClass : ''}">FAQ</a
			>
			<a
				href="/docs"
				class="{baseClass} {$page.url.pathname.startsWith('/docs') ? activeClass : ''}">Docs</a
			>
		</div>
		<div class="hidden items-center gap-8 text-sm text-gray-300 md:flex">
			<SignedIn
				><a href="/dashboard" class="transition-colors duration-300 hover:text-green-500"
					>Dashboard</a
				>
				<UserButton />
			</SignedIn>
			<SignedOut>
				<button
					onclick={() => (navState.showSignInModal = true)}
					class="transition-colors duration-300 hover:text-green-500">Try Beta</button
				>
				<button
					onclick={() => (navState.showSignInModal = true)}
					class="transition-colors duration-300 hover:text-green-500">Sign In</button
				>
			</SignedOut>
		</div>
	</div>
</nav>
