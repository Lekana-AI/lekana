<script>
	import DocumentScan from '$lib/components/DocumentScan.svelte';
	import Icon from '@iconify/svelte';

	let email = '';
	let name = '';
	let company = '';

	const steps = [
		{ label: 'Upload Document', icon: 'mdi:cloud-upload-outline' },
		{ label: 'Identify Content', icon: 'mdi:sparkles' },
		{ label: 'Identify Sections', icon: 'mdi:file-find-outline' },
		{ label: 'Generate Insights', icon: 'mdi:chart-box-outline' }
	];

	let activeIndex = 0;
	const STEP_DURATION = 1600; // ms per step

	const isActive = (i) => i === activeIndex;
	const isCompleted = (i) => i < activeIndex;

	import { onMount, onDestroy } from 'svelte';

	let timer;

	onMount(() => {
		timer = window.setInterval(() => {
			activeIndex = (activeIndex + 1) % steps.length;
		}, STEP_DURATION);

		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>Lekana AI - Automated Document Workflows</title>
	<meta
		name="description"
		content="Lekana AI automates document workflows for businesses. Scan, structure, and route documents seamlessly."
	/>
	<meta property="og:image" content="/thumb.png" />
</svelte:head>

<main class="relative flex flex-col items-center overflow-x-clip bg-neutral-950">
	<!-- NAV -->
	<nav
		class="to white-0 fixed top-0 z-20 flex w-full items-center justify-between bg-linear-to-t from-white/5 px-8 py-4 text-white backdrop-blur-md md:px-24"
	>
		<div class="flex items-center gap-2">
			<img src="/logo.svg" alt="logo" class="h-6 w-6" />
			<span class="font-semibold">Lekana AI</span>
		</div>

		<div class="hidden items-center gap-8 text-sm text-gray-300 md:flex">
			<a href="#about" class="transition-colors duration-300 hover:text-green-500">About</a>
			<a href="#faq" class="transition-colors duration-300 hover:text-green-500">FAQ</a>

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

	<div
		class="absolute top-1/12 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60% md:top-0 md:scale-100"
	></div>
	<section class="relative z-10 min-h-screen max-w-xs text-white md:max-w-6xl">
		<div
			class="relative z-10 flex flex-col items-center justify-center gap-4 py-16 pt-48 text-center md:py-32 md:pt-72"
		>
			<h1 class="text-4xl font-bold text-zinc-300 md:text-6xl">
				Say goodbye to the document chaos.
			</h1>
			<p class="mx-auto mt-1 max-w-2xl text-sm text-gray-400 md:text-lg">
				Let’s build the automated workflow for your business you always needed.
			</p>

			<div class="glow-btn mt-12 flex w-fit rounded-full p-0.5">
				<a
					href="#waitlist"
					class="rounded-full bg-black px-8 py-4 shadow-lg transition-shadow duration-500 hover:shadow-green-500/50"
				>
					Join Waitlist
				</a>
			</div>
		</div>
		<DocumentScan />
	</section>

	<!-- WORKFLOW -->
	<section class="relative z-10 max-w-sm py-12 text-center text-white md:max-w-6xl md:py-28">
		<h2 class="text-2xl font-semibold md:text-4xl">Automate workflows</h2>
		<p class="mt-3 text-xs text-gray-400 md:text-base">
			Let’s build the automated workflow for your business you always needed.
		</p>

		<div class="mt-16 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
			{#each steps as step, i}
				<div class="flex flex-col items-center md:flex-row">
					<!-- Step card -->
					<div class="group flex flex-col items-center hover:cursor-pointer">
						<div
							class="flex items-center justify-center rounded-xl border border-green-900 bg-green-900/20 p-4 shadow-xl transition-shadow duration-300 group-hover:shadow-green-500/50 md:p-6"
						>
							<Icon icon={step.icon} class="text-3xl text-white md:text-4xl" />
						</div>
						<p
							class="mt-4 text-center text-sm transition-transform duration-300 group-hover:translate-y-1"
						>
							{step.label}
						</p>
					</div>

					<!-- Connector node (between steps) -->
					{#if i < steps.length - 1}
						<div class="group mt-2 flex flex-col items-center md:mt-0 md:ml-4 md:flex-row">
							<div class="mx-1 h-2 w-2 rounded-full bg-green-400 shadow-md shadow-green-500"></div>
							<div
								class="h-8 w-0.5 bg-linear-to-r from-green-500 to-green-800 md:h-0.5 md:w-16"
							></div>
							<div class="mx-1 h-2 w-2 rounded-full bg-green-700 shadow-md shadow-green-800"></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- FEATURES -->
	<section class="max-w-7xl py-28 text-white">
		<h2 class="text-center text-4xl font-semibold">Why businesses use Lekana AI</h2>

		<div class="mt-16 grid gap-10 px-6 md:grid-cols-4 md:px-16">
			<!-- 1 -->
			<div
				class="group rounded-xl border border-green-950 bg-neutral-900 p-6
				   shadow-xl shadow-green-950/20 transition-all delay-75 duration-500 hover:shadow-green-700/50"
			>
					<Icon
						icon="mdi:server-network-outline"
						class="mb-4 text-4xl text-gray-500 transition-colors duration-300 group-hover:text-green-500"
					/>
					<h3 class="mb-2 text-xl font-semibold">No Infrastructure Required</h3>
				<p class="text-sm text-gray-400">
					You tell us the workflow — we set everything up for you.
				</p>
			</div>

			<!-- 2 -->
			<div
				class="group rounded-xl border border-green-950 bg-neutral-900 p-6
				   shadow-xl shadow-green-950/20 transition-all delay-75 duration-500 hover:shadow-green-700/50"
			>
					<Icon
						icon="mdi:text-recognition"
						class="mb-4 text-4xl text-gray-500 transition-colors duration-300 group-hover:text-green-500"
					/>
					<h3 class="mb-2 text-xl font-semibold">Deep OCR Understanding</h3>
				<p class="text-sm text-gray-400">
					We extract structured data from PDFs, scans, invoices, forms, and more.
				</p>
			</div>

			<!-- 3 -->
			<div
				class="group rounded-xl border border-green-950 bg-neutral-900 p-6
				   shadow-xl shadow-green-950/20 transition-all delay-75 duration-500 hover:shadow-green-700/50"
			>
					<Icon
						icon="mdi:flowchart"
						class="mb-4 text-4xl text-gray-500 transition-colors duration-300 group-hover:text-green-500"
					/>
					<h3 class="mb-2 text-xl font-semibold">Custom Routing</h3>
				<p class="text-sm text-gray-400">
					Data flows directly into your internal tools, CRMs, or automations.
				</p>
			</div>

			<!-- 4 -->
			<div
				class="group rounded-xl border border-green-950 bg-neutral-900 p-6
		   shadow-xl shadow-green-950/20 transition-all delay-75 duration-500 hover:shadow-green-700/50"
			>
					<Icon
						icon="mdi:translate"
						class="mb-4 text-4xl text-gray-500 transition-colors duration-300 group-hover:text-green-500"
					/>
					<h3 class="mb-2 text-xl font-semibold">Multilingual Support</h3>
				<p class="text-sm text-gray-400">
					Reads documents across many languages and even handwriting
				</p>
			</div>
		</div>
	</section>

	<!-- JOIN WAITLIST -->
	<section id="waitlist" class="max-w-sm py-16 text-white md:max-w-3xl md:py-24">
		<h2 class="text-center text-2xl font-semibold md:text-4xl">Join the Lekana AI Waitlist</h2>
		<p class="mt-3 text-center text-xs text-gray-400 md:text-base">
			Share a bit about your team and workflows — we’ll reach out when there’s a perfect fit.
		</p>
		<div class="glow-btn mt-10 flex rounded-2xl py-0.5">
			<form class="rounded-2xl bg-neutral-900 p-6 md:p-8">
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Name -->
					<div class="flex flex-col text-sm">
						<label for="name" class="mb-2 text-gray-300">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Alex Johnson"
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
							required
						/>
					</div>

					<!-- Company name -->
					<div class="flex flex-col text-sm">
						<label for="company" class="mb-2 text-gray-300">Company name</label>
						<input
							id="company"
							name="company"
							type="text"
							placeholder="Acme Corp"
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
							required
						/>
					</div>

					<!-- Work email -->
					<div class="flex flex-col text-sm">
						<label for="email" class="mb-2 text-gray-300">Work email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@company.com"
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
							required
						/>
					</div>

					<!-- Contact -->
					<div class="flex flex-col text-sm">
						<label for="contact" class="mb-2 text-gray-300">Contact</label>
						<input
							id="contact"
							name="contact"
							type="tel"
							placeholder="+1 555 123 4567"
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						/>
					</div>

					<!-- Role -->
					<div class="flex flex-col text-sm">
						<label for="role" class="mb-2 text-gray-300">Role</label>
						<input
							id="role"
							name="role"
							type="text"
							placeholder="Operations Lead, CTO, etc."
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						/>
					</div>

					<!-- Industry -->
					<div class="flex flex-col text-sm">
						<label for="industry" class="mb-2 text-gray-300">Industry</label>
						<select
							id="industry"
							name="industry"
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						>
							<option value="" disabled selected>Select an industry</option>
							<option>Financial Services</option>
							<option>Healthcare</option>
							<option>Logistics & Supply Chain</option>
							<option>Legal & Compliance</option>
							<option>Real Estate</option>
							<option>Manufacturing</option>
							<option>Technology</option>
							<option>Other</option>
						</select>
					</div>

					<!-- Document volume -->
					<div class="flex flex-col text-sm">
						<label for="volume" class="mb-2 text-gray-300">Document volume (per month)</label>
						<select
							id="volume"
							name="documentVolume"
							class="w-full rounded-lg border border-neutral-700 bg-black px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						>
							<option value="" disabled selected>Select a rough range</option>
							<option>&lt; 100</option>
							<option>100 – 500</option>
							<option>500 – 2,000</option>
							<option>2,000 – 10,000</option>
							<option>10,000+</option>
						</select>
					</div>

					<!-- Workflows textarea -->
					<div class="flex flex-col text-sm md:col-span-2">
						<label for="workflows" class="mb-2 text-gray-300">
							What documents/workflows do you want automated?
						</label>
						<textarea
							id="workflows"
							name="workflows"
							rows="4"
							placeholder="e.g. invoice processing, KYC document review, contract intake, shipping docs, claims forms..."
							class="w-full rounded-lg border border-neutral-700 bg-black/40 px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
						></textarea>
					</div>
				</div>

				<!-- Checkbox + submit -->
				<div class="mt-6 flex flex-col items-start gap-6 md:justify-between">
					<label class="flex cursor-pointer items-start gap-3 text-xs text-gray-400 md:text-sm">
						<input
							type="checkbox"
							name="consent"
							class="mt-1 h-6 w-6 rounded border-neutral-600 bg-black/60 text-green-500 outline-none focus:ring-1 focus:ring-green-500"
							required
						/>
						<span class="text-sm">
							I agree to be contacted about Lekana AI and understand my information may be used to
							follow up about relevant products and services.
						</span>
					</label>

					<a
						href="#waitlist"
						class="rounded-full border border-transparent bg-black px-12 py-3 shadow-xl transition-all duration-500 hover:border-green-500 hover:text-white hover:shadow-green-500/30"
					>
						Submit
					</a>
				</div>
			</form>
		</div>
	</section>

	<!-- ABOUT -->
	<section id="about" class="py-28 text-white">
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<h2 class="text-center text-4xl font-bold md:text-5xl">About Lekana AI</h2>
			<p class="mx-auto mt-6 text-center text-sm leading-relaxed text-gray-400 md:text-base">
				Lekana AI is an OCR-powered document intake service for businesses. We read your incoming
				documents — PDFs, scans, invoices, and forms — understand them using advanced OCR + LLM
				models, and route the data into your custom workflow. You don’t build or maintain anything:
				you describe the workflow, we set it up, and give you a secure private portal.
			</p>

			<div class="mt-24 grid gap-10 md:grid-cols-[1.5fr,1.2fr] md:items-start">
				<!-- Left column: narrative -->
				<div class="space-y-8 text-sm text-gray-300 md:text-base">
					<div>
						<h3 class="text-lg font-semibold text-white md:text-xl">Fully managed from day one</h3>
						<p class="mt-3 leading-relaxed text-gray-400">
							Most “automation” tools still expect you to wire up APIs, build pipelines, and manage
							models. Lekana AI is different. We operate as a managed intake layer for your
							business: we connect to your inboxes, storage, or uploads, and deliver structured,
							validated data where it needs to go — with humans completely out of the loop.
						</p>
					</div>

					<div>
						<h3 class="text-lg font-semibold text-white md:text-xl">
							OCR + LLMs tuned for real documents
						</h3>
						<p class="mt-3 leading-relaxed text-gray-400">
							Under the hood, we combine high-accuracy OCR with large language models and
							domain-specific validation. That means we can handle blurry scans, multi-page PDFs,
							mixed layouts, tables, signatures, and edge cases — not just perfect templates.
						</p>
					</div>

					<div>
						<h3 class="text-lg font-semibold text-white md:text-xl">
							Plug into your existing workflow
						</h3>
						<p class="mt-3 leading-relaxed text-gray-400">
							Whether you work out of a CRM, ERP, ticketing system, shared inbox, or internal
							database, we adapt to you. We map each document type to your internal fields and
							actions, set up routing logic, and keep everything synchronized as your processes
							evolve.
						</p>
					</div>
				</div>

				<!-- Right column: highlight card -->
				<div
					class="rounded-2xl border border-green-950 bg-neutral-900/80 p-6 shadow-2xl shadow-green-950/40 md:mt-12 md:p-7"
				>
					<h3 class="text-lg font-semibold text-white md:text-xl">Built for operations teams</h3>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						Lekana AI is ideal for teams buried in repetitive document work:
					</p>

					<ul class="mt-4 space-y-3 text-sm text-gray-300">
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
							<span>Invoice and billing intake for finance and accounting.</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
							<span>KYC, onboarding, and compliance documents for financial services.</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
							<span>Contracts, submissions, and case files for legal and operations teams.</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-1 h-1.5 w-1.5 rounded-full bg-green-400"></span>
							<span>Logistics, shipping, and customs paperwork for supply chain teams.</span>
						</li>
					</ul>

					<div class="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-300">
						<div class="rounded-xl border border-green-950/80 bg-black/40 p-4">
							<p class="text-xs tracking-wide text-gray-500 uppercase">Setup</p>
							<p class="mt-2 text-lg font-semibold text-white">Done-for-you</p>
							<p class="mt-1 text-xs text-gray-400">You describe the workflow, we implement it.</p>
						</div>
						<div class="rounded-xl border border-green-950/80 bg-black/40 p-4">
							<p class="text-xs tracking-wide text-gray-500 uppercase">Access</p>
							<p class="mt-2 text-lg font-semibold text-white">Private portal</p>
							<p class="mt-1 text-xs text-gray-400">
								Monitor status, exports, and analytics in one place.
							</p>
						</div>
					</div>

					<p class="mt-6 text-xs text-gray-500">
						You keep ownership of your data. We handle ingestion, structure, routing, and
						reliability.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section id="faq" class="py-16 text-white">
		<div class="mx-auto w-full max-w-4xl px-4 md:px-8">
			<h2 class="text-center text-4xl font-bold md:text-5xl">FAQ</h2>
			<p
				class="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-gray-400 md:text-base"
			>
				Answers to the most common questions about how Lekana AI fits into your stack and
				operations.
			</p>

			<div class="mx-auto mt-10 space-y-6">
				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
					open
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>How does Lekana AI actually work day-to-day?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						You connect your document sources (email inboxes, uploads, storage, or APIs) and tell us
						what you want to happen. We configure document types, fields to extract, validation
						rules, and routing destinations. Once live, new documents are automatically read,
						structured, and sent into your systems — without your team touching each file.
					</p>
				</details>

				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>What kinds of documents can you handle?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						We work with PDFs, scans, and image-based documents including invoices, forms,
						contracts, ID documents, shipping documents, statements, and more. Layout-heavy
						documents, multipage files, tables, and semi-structured forms are all supported thanks
						to our OCR + LLM stack.
					</p>
				</details>

				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>Can you integrate with our existing tools and APIs?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						Yes. We can push structured data into CRMs, ERPs, helpdesk tools, internal databases,
						webhooks, or custom APIs. During onboarding, we map your document fields to the exact
						objects and endpoints you use today, so your team continues to work inside the tools
						they already know.
					</p>
				</details>

				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>Do we need internal engineering resources to use Lekana AI?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						No. Lekana AI is designed for operations, finance, and business teams. You describe your
						current process, share example documents, and confirm the outputs you need. We handle
						all configuration, integrations, and maintenance behind the scenes.
					</p>
				</details>

				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>How do you handle security and data privacy?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						Data security is a core part of the product. Your documents are processed in controlled
						environments, and access is restricted through your private portal. We can discuss data
						retention, encryption, and compliance requirements during onboarding and align with your
						internal standards.
					</p>
				</details>

				<details
					class="group rounded-lg border border-green-950 bg-neutral-900 p-5 shadow-lg shadow-green-950/20 transition-all duration-300 hover:shadow-green-700/40"
				>
					<summary
						class="flex cursor-pointer items-center justify-between text-sm font-semibold md:text-base"
					>
						<span>What does the private portal include?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						Your portal gives you visibility into document intake, processing status, extracted
						fields, and delivery logs. You can review edge cases, export data, and adjust workflows
						with our team — without touching any low-level infrastructure.
					</p>
				</details>
			</div>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="mt-14 w-full border-t border-green-950/60 bg-black/95">
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
					<!-- <p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
						Get early access
					</p>
					<p class="max-w-xs text-gray-500">
						Share your use case and document volume — we’ll help design your first automated intake
						workflows.
					</p> -->
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
