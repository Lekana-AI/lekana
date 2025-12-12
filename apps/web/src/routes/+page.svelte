<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import {
		CloudUpload,
		Sparkles,
		TextSearch,
		ChartColumnBig,
		Server,
		ScanText,
		Workflow,
		Languages,
		ArrowRight,
		Plus,
		ArrowUp
	} from 'lucide-svelte';

	const steps = [
		{
			label: 'Upload Document',
			icon: CloudUpload
		},
		{
			label: 'Identify Content',
			icon: Sparkles
		},
		{
			label: 'Identify Sections',
			icon: TextSearch
		},
		{
			label: 'Generate Insights',
			icon: ChartColumnBig
		}
	];

	let prompt = '';

	let data = {
		name: '',
		company: '',
		email: '',
		contact: '',
		role: '',
		industry: '',
		volume: '',
		docs: ''
	};

	let agreeToContact = false;
	let message = '';
	let loading = false;

	async function submitToWaitlist() {
		if (!agreeToContact) {
			message = 'Please agree to be contacted before submitting.';
			return;
		}

		loading = true;
		message = '';

		try {
			const response = await fetch('/api/waitlist', {
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

			message = 'Successfully submitted to the waitlist!';
		} catch (err) {
			console.error('Request failed:', err);
			message = 'Something went wrong. Please check your connection.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Lekana - Automated Document Workflows</title>
	<meta
		name="description"
		content="Lekana automates document workflows for businesses. Scan, structure, and route documents seamlessly."
	/>
	<meta property="og:image" content="/thumb.png" />
</svelte:head>

<main class="relative flex flex-col items-center overflow-x-clip bg-neutral-950">
	<Header />

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
		.dark-scroll {
			scrollbar-width: thin;
			scrollbar-color: gray transparent;
		}
	</style>

	<div
		class="absolute top-1/12 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60% md:-top-16 md:scale-150 animate-[pulse_5s_ease-in-out_infinite]"
	></div>
	<section
		class="relative z-10 flex min-h-screen w-full max-w-xs flex-col items-center justify-center gap-8 py-16 pt-36 text-white md:max-w-6xl"
	>
		<div class="relative flex flex-col items-center justify-center gap-4 pb-10 text-center">
			<h1 class="text-4xl font-bold text-zinc-300 md:text-5xl">
				Say goodbye to the document chaos.
			</h1>
			<p class="mx-auto mt-1 max-w-2xl text-sm text-gray-400 md:text-base">
				Let’s build the automated workflow for your business you always needed.
			</p>
		</div>
		<div class="glow-btn flex w-fit overflow-clip rounded-3xl pt-0.5 shadow-lg">
			<div
				class="flex h-fit w-full min-w-3xl flex-col items-start justify-between gap-2 rounded-t-3xl bg-neutral-950 px-8 py-4"
			>
				<textarea
					bind:value={prompt}
					rows="5"
					autocomplete="off"
					placeholder="Ask Lekana to create a workflow that ...."
					class="dark-scroll max-h-64 min-h-20 w-full resize-none p-1 text-white outline-none"
				></textarea>

				<div class="inline-flex items-center justify-between self-stretch">
					<button
						class="rounded-lg bg-zinc-900 px-4 py-2 transition-colors duration-300 hover:bg-green-950"
					>
						<Plus size="20" />
					</button>

					<button
						class="rounded-lg bg-white px-4 py-2 text-black transition-colors duration-300 disabled:bg-zinc-400"
						disabled={!prompt}
					>
						<ArrowUp size="20" />
					</button>
				</div>
			</div>
		</div>
		<a
			href="dashboard"
			class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 py-3 text-white shadow-xl shadow-transparent transition-shadow duration-500 hover:shadow-green-500/20"
		>
			Start with Workflow Builder <ArrowRight size="16" />
		</a>
	</section>

	<!-- WORKFLOW -->
	<section class="relative z-10 max-w-sm py-12 text-center text-white md:max-w-6xl md:py-20">
		<h2 class="text-2xl font-semibold md:text-4xl">Automate workflows</h2>
		<p class="mt-3 text-xs text-gray-400 md:text-base">
			Let’s build the automated workflow for your business you always needed.
		</p>

		<div class="mt-16 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
			{#each steps as step, i}
				{@const Icon = step.icon}

				<div class="flex flex-col items-center md:flex-row">
					<!-- Step card -->
					<div class="group flex flex-col items-center hover:cursor-pointer">
						<div
							class="flex items-center justify-center rounded-xl border border-green-900 bg-green-900/20 p-4 shadow-xl transition-shadow duration-300 group-hover:shadow-green-500/50 md:p-6"
						>
							<Icon class="text-3xl text-white md:text-4xl" />
						</div>

						<p
							class="mt-4 text-center text-sm transition-transform duration-300 group-hover:translate-y-1"
						>
							{step.label}
						</p>
					</div>

					<!-- Connector node -->
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
		<h2 class="text-center text-4xl font-semibold">Why businesses use Lekana</h2>

		<div class="mt-16 grid gap-10 px-6 md:grid-cols-4 md:px-16">
			<!-- 1 -->
			<div
				class="group rounded-xl border border-green-950 bg-neutral-900 p-6
				   shadow-xl shadow-green-950/20 transition-all delay-75 duration-500 hover:shadow-green-700/50"
			>
				<Server
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
				<ScanText
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
				<Workflow
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
				<Languages
					class="mb-4 text-4xl text-gray-500 transition-colors duration-300 group-hover:text-green-500"
				/>
				<h3 class="mb-2 text-xl font-semibold">Multilingual Support</h3>
				<p class="text-sm text-gray-400">
					Reads documents across many languages and even handwriting
				</p>
			</div>
		</div>
	</section>

	<!-- ABOUT -->
	<section id="about" class="py-28 text-white">
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<h2 class="text-center text-4xl font-bold md:text-5xl">About Lekana</h2>
			<p class="mx-auto mt-6 text-center text-sm leading-relaxed text-gray-400 md:text-base">
				Lekana is an OCR-powered document intake service for businesses. We read your incoming
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
							models. Lekana is different. We operate as a managed intake layer for your
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
						Lekana is ideal for teams buried in repetitive document work:
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
				Answers to the most common questions about how Lekana fits into your stack and
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
						<span>How does Lekana actually work day-to-day?</span>
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
						<span>Do we need internal engineering resources to use Lekana?</span>
						<span
							class="ml-4 text-xs text-gray-500 transition-transform duration-200 group-open:rotate-90"
							>&rsaquo;</span
						>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-gray-400">
						No. Lekana is designed for operations, finance, and business teams. You describe your
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

	<Footer />
</main>
