<script>
	let data = {
		username: '',
		password: ''
	};

	let message = '';
	let loading = false;

	let results = [];

	async function adminLogin() {
		loading = true;
		message = '';

		try {
			const response = await fetch('/api/waitlist/admin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Error:', result);
				message = result?.error || 'Failed to submit. Please try again.';
				return;
			}

			message = 'Login successful!';
			results = result;
		} catch (err) {
			console.error('Request failed:', err);
			message = 'Something went wrong. Please check your connection.';
		} finally {
			loading = false;
		}
	}

	const formatDate = (d) => new Date(d).toLocaleString();
</script>

<main class="relative flex flex-col items-center overflow-x-clip bg-neutral-950">
	<!-- NAV -->
	<nav
		class="to white-0 fixed top-0 z-20 flex w-full items-center justify-between bg-linear-to-t from-white/5 px-8 py-4 text-white backdrop-blur-md md:px-24"
	>
		<a href="/" class="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
			<img src="/logo.svg" alt="logo" class="h-6 w-6" />
			<span class="font-semibold">Lekana AI</span>
		</a>

		<div class="hidden items-center gap-8 text-sm text-gray-300 md:flex">
			<a href="/#about" class="transition-colors duration-300 hover:text-green-500">About</a>
			<a href="/#faq" class="transition-colors duration-300 hover:text-green-500">FAQ</a>

			<div
				class="glow-btn flex rounded-full p-0.5 shadow-lg transition-shadow duration-500 hover:shadow-green-500/50"
			>
				<a
					href="#waitlist"
					class="rounded-full bg-black px-6 py-3 transition-colors duration-300 hover:text-white"
				>
					Join Waitlist
				</a>
			</div>
		</div>
	</nav>

	<style>
		.glow-btn {
			background: linear-gradient(var(--gradient-angle), #05df72, rgba(167, 243, 208, 0), #05df72);
			animation: rotation 8s linear infinite;
		}

		@keyframes rotation {
			0% {
				--gradient-angle: 0deg;
			}
			100% {
				--gradient-angle: 360deg;
			}
		}
	</style>

	{#if results.length === 0}
		<!-- LOGIN -->
		<section
			id="admin login"
			class="w-full max-w-sm py-16 pt-20 text-white md:max-w-3xl md:py-24 md:pt-40"
		>
			<h2 class="text-center text-2xl font-semibold md:text-4xl">Admin Login</h2>

			<div class="mt-5 flex rounded-2xl py-0.5">
				<form class="w-full rounded-2xl bg-neutral-900 p-6 md:p-8">
					<div class="grid grid-cols-1 gap-6">
						<!-- userame -->
						<div class="flex flex-col text-sm">
							<label for="userame" class="mb-2 text-gray-300">Username</label>
							<input
								id="userame"
								name="userame"
								type="text"
								bind:value={data.username}
								class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
								required
							/>
						</div>

						<!-- password -->
						<div class="flex flex-col text-sm">
							<label for="password" class="mb-2 text-gray-300">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								bind:value={data.password}
								class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
								required
							/>
						</div>
					</div>
					<!-- submit -->
					<div class="mt-6 flex flex-col items-start gap-6 md:justify-between">
						<p class="text-sm text-white">
							{message}
						</p>

						<div
							class="{loading
								? 'glow-btn'
								: 'bg-black'} flex rounded-full p-0.5 shadow-lg transition-shadow duration-500 hover:shadow-green-500/50"
						>
							<button
								on:click={adminLogin}
								type="button"
								class="rounded-full border border-transparent bg-black px-12 py-3 shadow-xl transition-all duration-500 hover:border-green-500 hover:text-white hover:shadow-green-500/30"
							>
								Next
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	{:else}
		<section id="waitlist" class="mx-auto w-full max-w-5xl py-16 text-white md:py-24 pt-20 md:pt-48">
			<h2 class="mb-8 text-center text-2xl font-semibold md:text-4xl">Waitlist Submissions</h2>

			<div class="overflow-x-auto rounded-2xl bg-neutral-900 p-6">
				<table class="min-w-full text-left text-sm">
					<thead>
						<tr class="border-b border-neutral-700 text-gray-300">
							<th class="px-4 py-3">ID</th>
							<th class="px-4 py-3">Name</th>
							<th class="px-4 py-3">Company</th>
							<th class="px-4 py-3">Email</th>
							<th class="px-4 py-3">Contact</th>
							<th class="px-4 py-3">Role</th>
							<th class="px-4 py-3">Industry</th>
							<th class="px-4 py-3">Volume</th>
							<th class="px-4 py-3">Created</th>
						</tr>
					</thead>

					<tbody>
						{#each results as row, i}
							<tr class="border-b border-neutral-800 transition hover:bg-neutral-800/50">
								<td class="px-4 py-3">{row.id}</td>
								<td class="px-4 py-3">{row.name}</td>
								<td class="px-4 py-3">{row.company}</td>
								<td class="px-4 py-3">{row.email}</td>
								<td class="px-4 py-3">{row.contact}</td>
								<td class="px-4 py-3">{row.role}</td>
								<td class="px-4 py-3">{row.industry}</td>
								<td class="px-4 py-3">{row.volume}</td>
								<td class="px-4 py-3">{formatDate(row.created_at)}</td>
							</tr>
						{/each}

						{#if results.length === 0}
							<tr>
								<td colspan="9" class="py-6 text-center text-gray-400"> No entries found. </td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
	<!-- FOOTER -->
	<footer class="mt-8 w-full border-t border-green-950/60 bg-black/95 md:mt-14">
		<div class="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-400 md:px-8 md:py-12">
			<div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
				<!-- Brand -->
				<div class="max-w-sm space-y-3">
					<p class="text-base font-semibold text-white">Lekana AI</p>
					<p class="text-xs leading-relaxed text-gray-500 md:text-sm">
						An OCR-powered document intake service for businesses. We read your documents,
						understand them, and route them into your workflow — fully managed, end-to-end.
					</p>
				</div>

				<!-- Navigation -->
				<div class="flex flex-1 flex-wrap gap-10 md:justify-center">
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Product</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="#about" class="hover:text-green-500">About</a></li>
							<li><a href="#faq" class="hover:text-green-500">FAQ</a></li>
						</ul>
					</div>
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Company</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="#waitlist" class="hover:text-green-500">Join waitlist</a></li>
							<li><a href="/" class="hover:text-green-500">Contact</a></li>
						</ul>
					</div>
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Legal</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="/privacy" class="hover:text-green-500">Privacy</a></li>
							<li><a href="/terms" class="hover:text-green-500">Terms</a></li>
						</ul>
					</div>
				</div>

				<!-- Call to action -->
				<div class="space-y-3 text-xs md:text-sm">
					<div
						class="glow-btn flex w-fit rounded-full p-0.5 shadow-lg transition-shadow duration-500 hover:shadow-green-500/50"
					>
						<a
							href="#waitlist"
							class="rounded-full bg-black px-6 py-3 text-white transition-colors duration-300"
						>
							Join Waitlist
						</a>
					</div>
				</div>
			</div>

			<hr class="mt-8 border-neutral-800" />

			<div
				class="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-gray-500 md:flex-row md:text-xs"
			>
				<p>Lekana AI © {new Date().getFullYear()}. All rights reserved.</p>
				<p class="text-center md:text-right">
					Built for businesses that are done with the chaos of documents.
				</p>
			</div>
		</div>
	</footer>
</main>
