<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		Copy,
		Check,
		Terminal,
		Globe,
		Shield,
		Code2,
		ChevronRight,
		Info,
		AlertTriangle
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { apiDocs } = data;

	let copiedId = $state('');

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedId = id;
		setTimeout(() => (copiedId = ''), 2000);
	}

	const getMethodColor = (method: string) => {
		switch (method) {
			case 'GET':
				return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
			case 'POST':
				return 'text-green-400 bg-green-400/10 border-green-400/20';
			case 'PUT':
				return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
			case 'DELETE':
				return 'text-red-400 bg-red-400/10 border-red-400/20';
			default:
				return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
		}
	};

	let activeSection = $state('introduction');

	onMount(() => {
		// Initialize from hash
		if (window.location.hash) {
			activeSection = window.location.hash.slice(1);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.1, rootMargin: '-10% 0% -70% 0%' }
		);

		document.querySelectorAll('section[id]').forEach((section) => {
			observer.observe(section);
		});

		const handleHashChange = () => {
			if (window.location.hash) {
				activeSection = window.location.hash.slice(1);
			}
		};

		window.addEventListener('hashchange', handleHashChange);

		return () => {
			observer.disconnect();
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<svelte:head>
	<title>API Reference - Lekana</title>
</svelte:head>

<main class="min-h-screen bg-neutral-950 font-sans text-zinc-400 selection:bg-green-500/30">
	<Header />

	<div class="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
		<div class="relative flex flex-col gap-16 lg:flex-row">
			<!-- Sidebar (Sticky) -->
			<aside class="hidden w-64 shrink-0 lg:block">
				<div class="sticky top-32 space-y-8">
					<nav class="space-y-6">
						<div>
							<h4 class="mb-4 px-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
								Getting Started
							</h4>
							<ul class="space-y-1">
								<li>
									<a
										href="#introduction"
										class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection ===
										'introduction'
											? 'bg-green-400/5 text-green-400'
											: 'hover:text-zinc-200'}"
									>
										Introduction
									</a>
								</li>
								<li>
									<a
										href="#authentication"
										class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection ===
										'authentication'
											? 'bg-green-400/5 text-green-400'
											: 'hover:text-zinc-200'}"
									>
										Authentication
									</a>
								</li>
								<li>
									<a
										href="#concepts"
										class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection ===
										'concepts'
											? 'bg-green-400/5 text-green-400'
											: 'hover:text-zinc-200'}"
									>
										Core Concepts
									</a>
								</li>
							</ul>
						</div>

						{#each apiDocs.categories as category}
							<div>
								<h4 class="mb-4 px-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
									{category.name}
								</h4>
								<ul class="space-y-1">
									{#each category.endpoints as endpoint}
										<li>
											<a
												href="#{endpoint.id}"
												class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection ===
												endpoint.id
													? 'bg-green-400/5 text-green-400'
													: 'hover:text-zinc-200'}"
											>
												{endpoint.name}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/each}

						<div>
							<h4 class="mb-4 px-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
								Reference
							</h4>
							<ul class="space-y-1">
								<li>
									<a
										href="#errors"
										class="block rounded-lg px-3 py-2 text-sm transition-colors {activeSection ===
										'errors'
											? 'bg-green-400/5 text-green-400'
											: 'hover:text-zinc-200'}"
									>
										Error Codes
									</a>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</aside>

			<!-- Main Content (Single Column) -->
			<div class="max-w-3xl flex-1 space-y-24">
				<!-- Introduction -->
				<section id="introduction" class="scroll-mt-32 space-y-6">
					<h1 class="text-4xl font-bold tracking-tight text-white">{apiDocs.introduction.title}</h1>
					<p class="text-lg leading-relaxed text-zinc-300">
						{apiDocs.introduction.content}
					</p>
				</section>

				<!-- Authentication -->
				<section id="authentication" class="scroll-mt-32 space-y-6">
					<div class="flex items-center gap-3">
						<Shield class="text-green-500" size={24} />
						<h2 class="text-2xl font-bold text-white">{apiDocs.authentication.title}</h2>
					</div>
					<p class="leading-relaxed">
						{apiDocs.authentication.content}
					</p>
					<div
						class="relative rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-green-400"
					>
						<code>{apiDocs.authentication.header_example}</code>
						<button
							onclick={() => copyToClipboard(apiDocs.authentication.header_example, 'auth')}
							class="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800"
						>
							{#if copiedId === 'auth'}
								<Check size={16} class="text-green-500" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					</div>
				</section>

				<!-- Core Concepts -->
				<section id="concepts" class="scroll-mt-32 space-y-12">
					<h2 class="text-2xl font-bold text-white">Core Concepts</h2>
					<div class="grid gap-8">
						{#each apiDocs.core_concepts as concept}
							<div class="space-y-3">
								<h3 class="text-lg font-semibold text-zinc-200">{concept.title}</h3>
								<p class="leading-relaxed">{concept.content}</p>
							</div>
						{/each}
					</div>
				</section>

				<!-- Endpoints -->
				{#each apiDocs.categories as category}
					<div class="space-y-24">
						{#each category.endpoints as endpoint}
							<section id={endpoint.id} class="scroll-mt-32 space-y-8">
								<!-- Header -->
								<div class="space-y-4">
									<div class="flex items-center gap-3">
										<span
											class="rounded border px-2 py-0.5 text-[10px] font-bold {getMethodColor(
												endpoint.method
											)}"
										>
											{endpoint.method}
										</span>
										<h2 class="text-2xl font-bold tracking-tight text-white">{endpoint.name}</h2>
									</div>
									<p class="leading-relaxed text-zinc-300">
										{endpoint.description}
									</p>
								</div>

								<!-- URL -->
								<div
									class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-black p-4"
								>
									<div class="scrollbar-hide overflow-x-auto font-mono text-sm">
										<span class="text-zinc-600">https://api.lekana.dev</span>{endpoint.path}
									</div>
									<button
										onclick={() =>
											copyToClipboard(
												`https://api.lekana.dev${endpoint.path}`,
												endpoint.id + '_path'
											)}
										class="rounded-lg p-2 text-zinc-600 transition-colors group-hover:text-zinc-400 hover:bg-zinc-900"
									>
										{#if copiedId === endpoint.id + '_path'}
											<Check size={14} class="text-green-500" />
										{:else}
											<Copy size={14} />
										{/if}
									</button>
								</div>

								<!-- Long Description -->
								<div class="space-y-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
									<div class="flex items-start gap-3">
										<Info size={18} class="mt-1 shrink-0 text-green-500" />
										<p class="text-sm leading-relaxed text-zinc-400">
											{endpoint.long_description}
										</p>
									</div>
								</div>

								<!-- Headers -->
								{#if endpoint.headers?.length}
									<div class="space-y-4">
										<h3 class="text-sm font-bold tracking-widest text-zinc-500 uppercase">
											Headers
										</h3>
										<div class="space-y-2">
											{#each endpoint.headers as header}
												<div
													class="flex items-baseline gap-4 border-b border-zinc-900 py-2 last:border-0"
												>
													<div class="w-32 shrink-0 font-mono text-xs text-green-400">
														{header.key}
													</div>
													<div class="text-sm text-zinc-500">{header.description}</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Body Parameters -->
								{#if endpoint.body?.fields?.length}
									<div class="space-y-4">
										<h3 class="text-sm font-bold tracking-widest text-zinc-500 uppercase">
											Body Parameters
										</h3>
										<div class="space-y-6">
											{#each endpoint.body.fields as field}
												<div class="space-y-2">
													<div class="flex items-center gap-3">
														<span class="font-mono text-sm text-zinc-200">{field.name}</span>
														<span
															class="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500"
															>{field.type}</span
														>
													</div>
													<p class="text-sm leading-relaxed text-zinc-500">
														{field.description}
													</p>
												</div>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Example Request -->
								<div class="space-y-4">
									<h3 class="text-sm font-bold tracking-widest text-zinc-500 uppercase">
										Request Example
									</h3>
									<div
										class="group/code relative overflow-hidden rounded-xl border border-zinc-800 bg-black"
									>
										<div
											class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2"
										>
											<div class="flex gap-1.5">
												<div class="h-2 w-2 rounded-full bg-red-500/20"></div>
												<div class="h-2 w-2 rounded-full bg-yellow-500/20"></div>
												<div class="h-2 w-2 rounded-full bg-green-500/20"></div>
											</div>
											<button
												onclick={() => copyToClipboard(endpoint.body.raw, endpoint.id + '_req')}
												class="p-1 text-zinc-600 opacity-0 transition-opacity group-hover/code:opacity-100 hover:text-zinc-400"
											>
												{#if copiedId === endpoint.id + '_req'}
													<Check size={14} class="text-green-500" />
												{:else}
													<Copy size={14} />
												{/if}
											</button>
										</div>
										<pre
											class="overflow-x-auto p-6 font-mono text-xs leading-relaxed text-zinc-400"><code
												>{endpoint.body.raw}</code
											></pre>
									</div>
								</div>

								<!-- Responses -->
								<div class="space-y-6">
									<h3 class="text-sm font-bold tracking-widest text-zinc-500 uppercase">
										Responses
									</h3>
									{#each endpoint.responses as res}
										<div class="space-y-4">
											<div class="flex items-center gap-3">
												<div
													class="h-1.5 w-1.5 rounded-full {res.status < 300
														? 'bg-green-500'
														: 'bg-red-500'}"
												></div>
												<span class="text-sm font-semibold text-zinc-200">{res.status}</span>
												<span class="text-sm text-zinc-500">{res.description}</span>
											</div>
											<div class="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
												<pre
													class="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-500"><code
														>{res.body}</code
													></pre>
											</div>
										</div>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				{/each}

				<!-- Error Codes -->
				<section id="errors" class="scroll-mt-32 space-y-8">
					<div class="flex items-center gap-3">
						<AlertTriangle class="text-yellow-500" size={24} />
						<h2 class="text-2xl font-bold text-white">Error Codes</h2>
					</div>
					<p>
						Lekana uses conventional HTTP response codes to indicate the success or failure of an
						API request.
					</p>
					<div class="overflow-hidden rounded-xl border border-zinc-800">
						<table class="w-full text-left text-sm">
							<thead>
								<tr class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-500">
									<th class="px-6 py-4 text-[10px] font-bold tracking-widest uppercase">Code</th>
									<th class="px-6 py-4 text-[10px] font-bold tracking-widest uppercase"
										>Description</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-zinc-900 bg-black/20">
								{#each apiDocs.error_codes as error}
									<tr class="transition-colors hover:bg-zinc-900/30">
										<td class="px-6 py-4 font-mono text-zinc-200">{error.code}</td>
										<td class="px-6 py-4 text-zinc-500">{error.description}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	</div>

	<Footer />
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
