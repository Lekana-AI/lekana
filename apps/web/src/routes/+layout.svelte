<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ClerkProvider } from 'svelte-clerk';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import { dark } from '@clerk/themes';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import AlertDialog from '$lib/components/ui/AlertDialog.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
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
</ClerkProvider>
