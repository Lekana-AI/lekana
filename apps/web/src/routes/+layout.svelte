<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider } from 'svelte-clerk';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import { dark } from '@clerk/themes';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import AlertDialog from '$lib/components/ui/AlertDialog.svelte';
	import { navState } from '$lib/nav.svelte.js';
	import SignInModal from '$lib/components/SignInModal.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="author" content="Lekana" />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content="#05df72" />
	<meta name="application-name" content="Lekana" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

<ClerkProvider
	appearance={{
		theme: [dark]
	}}
	publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
>
	{@render children()}
	<ToastContainer />
	<AlertDialog />
	{#if navState.showSignInModal}
		<SignInModal />
	{/if}
</ClerkProvider>
