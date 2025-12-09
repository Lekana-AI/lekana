<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { fetchWithAuth } from '$lib/auth';

	let token = $state('');
	let userId = $state('');
	let userEmail = $state('');
	let userFirstName = $state('');
	let userLastName = $state('');
	let apiResponse = $state('');
	let isLoading = $state(false);
	let copied = $state(false);
	let apiUrl = $state('http://localhost:4001/validate');

	// Load user data from Clerk
	$effect(() => {
		if (!browser) return;

		console.log('🔍 Starting Clerk data load...');

		const loadData = async () => {
			try {
				const Clerk = (window as any).Clerk;
				
				if (!Clerk) {
					console.log('⏳ Clerk not ready yet, retrying...');
					setTimeout(loadData, 100);
					return;
				}

				console.log('✅ Clerk object found, waiting for session...');

				// Wait for Clerk to be fully loaded with user session
				await Clerk.load();
				
				console.log('✅ Clerk fully loaded!');
				console.log('🔍 Clerk.user:', Clerk.user);
				console.log('🔍 Clerk.session:', Clerk.session);

				// Get user info
				if (Clerk.user) {
					userId = Clerk.user.id || '';
					userEmail = Clerk.user.primaryEmailAddress?.emailAddress || '';
					userFirstName = Clerk.user.firstName || '';
					userLastName = Clerk.user.lastName || '';
					console.log('✅ User data loaded:', { userId, userEmail, userFirstName, userLastName });
				} else {
					console.log('❌ No Clerk.user found after load()');
				}

				// Get token
				if (Clerk.session) {
					token = await Clerk.session.getToken();
					console.log('✅ Token loaded:', token?.substring(0, 20) + '...');
				} else {
					console.log('❌ No Clerk.session found after load()');
				}
			} catch (err) {
				console.error('❌ Error loading Clerk data:', err);
			}
		};

		loadData();
	});

	async function testApiCall() {
		isLoading = true;
		apiResponse = '';
		
		try {
			const response = await fetchWithAuth(apiUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();
			apiResponse = JSON.stringify(data, null, 2);
		} catch (err) {
			apiResponse = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			isLoading = false;
		}
	}

	function copyToken() {
		navigator.clipboard.writeText(token);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<SignedOut>
	{#snippet children()}
		{@const _ = browser && goto('/login')}
	{/snippet}
</SignedOut>

<SignedIn>
	{#snippet children()}
		<div class="min-h-screen bg-zinc-900 p-8">
			<div class="mx-auto max-w-4xl">
				<div class="mb-8">
					<h1 class="text-4xl font-bold text-white">API Test Page</h1>
					<p class="mt-2 text-zinc-400">Test your Clerk authentication and API calls</p>
				</div>

				<!-- User Info Card -->
				<div class="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
					<h2 class="mb-4 text-xl font-semibold text-white">User Information</h2>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-zinc-400">User ID:</span>
							<code class="rounded bg-zinc-900 px-2 py-1 text-sm text-green-400">
								{userId || 'Loading...'}
							</code>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-zinc-400">Email:</span>
							<code class="rounded bg-zinc-900 px-2 py-1 text-sm text-green-400">
								{userEmail || 'Loading...'}
							</code>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-zinc-400">First Name:</span>
							<code class="rounded bg-zinc-900 px-2 py-1 text-sm text-green-400">
								{userFirstName || 'N/A'}
							</code>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-zinc-400">Last Name:</span>
							<code class="rounded bg-zinc-900 px-2 py-1 text-sm text-green-400">
								{userLastName || 'N/A'}
							</code>
						</div>
					</div>
				</div>

				<!-- Token Card -->
				<div class="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-white">Authentication Token</h2>
						<button
							onclick={copyToken}
							class="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
						>
							{copied ? '✓ Copied!' : 'Copy Token'}
						</button>
					</div>
					<div class="rounded bg-zinc-900 p-4">
						<code class="break-all text-xs text-green-400">
							{token || 'Loading token...'}
						</code>
					</div>
				</div>

				<!-- API Test Card -->
				<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
					<h2 class="mb-4 text-xl font-semibold text-white">Test API Call</h2>

					<div class="mb-4">
						<label for="api-url" class="mb-2 block text-sm font-medium text-zinc-300">
							API Endpoint
						</label>
						<input
							id="api-url"
							type="text"
							bind:value={apiUrl}
							class="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-green-500 focus:outline-none"
							placeholder="http://localhost:4001/validate"
						/>
					</div>

					<button
						onclick={testApiCall}
						disabled={isLoading}
						class="w-full rounded bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-zinc-600"
					>
						{isLoading ? 'Loading...' : 'Test API Call'}
					</button>

					{#if apiResponse}
						<div class="mt-4">
							<h3 class="mb-2 text-sm font-medium text-zinc-300">Response:</h3>
							<pre class="overflow-x-auto rounded bg-zinc-900 p-4">
								<code class="text-xs text-green-400">{apiResponse}</code>
							</pre>
						</div>
					{/if}
				</div>

				<!-- Back Button -->
				<div class="mt-8">
					<a
						href="/getting-started"
						class="inline-block rounded bg-zinc-700 px-6 py-2 text-white transition-colors hover:bg-zinc-600"
					>
						← Back to Dashboard
					</a>
				</div>
			</div>
		</div>
	{/snippet}
</SignedIn>
