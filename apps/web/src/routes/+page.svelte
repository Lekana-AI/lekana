<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import EnterpriseModal from '$lib/components/EnterpriseModal.svelte';
	import {
		ArrowRight,
		FileText,
		Cpu,
		Database,
		ChevronDown,
		Mail,
		Zap,
		Shield,
		Clock,
		TrendingUp,
		Info,
		HandCoins,
		Users,
		MoveRight,
		ArrowDownRight,
		ArrowUpRight,
		Headset
	} from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import DocumentScan from '$lib/components/DocumentScan.svelte';

	import { navState } from '$lib/nav.svelte.js';

	let expandedFaq = $state(-1);
	let showEnterpriseModal = $state(false);

	function toggleFaq(index: number) {
		expandedFaq = expandedFaq === index ? -1 : index;
	}

	$effect(() => {
		const sections = document.querySelectorAll('section[id]');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						navState.activeSection = entry.target.id;
					}
				});
			},
			{
				rootMargin: '-20% 0px -70% 0px',
				threshold: 0
			}
		);

		sections.forEach((section) => observer.observe(section));

		return () => {
			sections.forEach((section) => observer.unobserve(section));
		};
	});

	const faqs = [
		{
			q: 'How secure is my document data?',
			a: 'All documents are processed with enterprise-grade encryption. Data is never stored longer than necessary for processing, and we maintain SOC 2 compliance standards.'
		},
		{
			q: 'What systems can Lekana integrate with?',
			a: 'We support direct integrations with Google Sheets, Airtable, Notion, PostgreSQL, MySQL, and more. Clean data flows directly into the tools your team already uses.'
		},
		{
			q: 'Is this a beta product?',
			a: 'Yes, Lekana is currently in public beta. You get free access to powerful automation features while we continue refining the platform based on your feedback.'
		},
		{
			q: 'How does the AI understand my documents?',
			a: 'Lekana removes the need for manual checklists. We combine advanced OCR with language models to extract, classify, and structure data automatically—no templates required.'
		},
		{
			q: 'What happens if the AI makes a mistake?',
			a: 'You maintain 100% trust with custom validation rules and human review steps. Stop praying that nothing breaks and start managing reliable data outcomes.'
		}
	];

	let minutesPerDoc = $state(10);
	let docsPerWeek = $state(200);
	let hourlyRate = $state(1);
	let activeUseCase = $state('Finance (Invoices)');

	const useCases = {
		'Finance (Invoices)': { min: 8, docs: 150 },
		'HR Ops (Onboarding)': { min: 15, docs: 100 },
		'Legal (Contracts)': { min: 25, docs: 50 }
	};

	function selectUseCase(name: keyof typeof useCases) {
		activeUseCase = name;
		minutesPerDoc = useCases[name].min;
		docsPerWeek = useCases[name].docs;
	}

	const hoursWasted = $derived(Math.round((minutesPerDoc * docsPerWeek) / 60));
	const annualCost = $derived(hoursWasted * 52 * hourlyRate);
	const fteEquivalence = $derived((hoursWasted / 40).toFixed(1));

	const tweenedHours = tweened(0, {
		duration: 800,
		easing: cubicOut
	});
	const tweenedCost = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});

	$effect(() => {
		tweenedHours.set(hoursWasted);
		tweenedCost.set(annualCost);
	});

	const savingsMessage = $derived(() => {
		if (hoursWasted > 40) return 'Equivalent to a full-time hire dedicated only to data entry.';
		if (hoursWasted > 20) return 'Significant operational drag reducing your team’s scalability.';
		return 'Hidden friction that accumulates as your document volume grows.';
	});
</script>

<svelte:head>
	<title>Lekana - Automated Document Workflows for Business</title>
	<meta
		name="description"
		content="Transform document chaos into structured workflows. Lekana reads, understands, and routes your business documents automatically."
	/>
	<meta property="og:title" content="Lekana - Automated Document Workflows" />
	<meta
		property="og:description"
		content="AI-powered document intake that works the way you need it to."
	/>
	<meta property="og:image" content="/thumb.png" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="dark-scroll relative flex flex-col items-center overflow-x-clip bg-neutral-950">
	<Header />

	<div
		class="absolute top-1/12 aspect-square w-full scale-[400%] animate-[pulse_5s_ease-in-out_infinite] justify-self-center rounded-full bg-radial from-green-500/15 to-transparent to-60% md:top-0 md:scale-150"
	></div>
	<!-- HERO SECTION -->
	<section
		id="hero"
		class="relative z-10 flex min-h-screen max-w-sm flex-col px-3 py-8 pt-24 text-white md:h-screen md:max-w-6xl md:flex-row md:py-32 md:pt-44"
	>
		<div class="relative z-10 flex w-full flex-col justify-center">
			<div class="text-md mb-8 flex items-center justify-center md:justify-start">
				<div class="mr-2 flex items-center gap-1 rounded-full border-2 border-green-600/50 px-4">
					<p class="flex">Lekana</p>
					<span class="text-xs font-medium text-green-500">Beta</span>
				</div>
				is now live!
			</div>

			<div class="mb-6 flex flex-col gap-4 px-2 text-center md:text-left">
				<h1 class="text-5xl leading-tight font-bold text-zinc-300 md:text-6xl">
					Automate repetitive document work <span class="chaos-text -mt-4">in days.</span>
				</h1>
				<p class="mt-4 max-w-2xl text-sm text-gray-400 md:text-base">
					Lekana transforms invoices, contracts, and HR forms into structured data.
					<span class="text-zinc-200">No custom engineering, just reliable business outcomes.</span>
				</p>
			</div>

			<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
				<SignedOut>
					<button
						onclick={() => (navState.showSignInModal = true)}
						class="glow-btn group flex items-center gap-2 rounded-full pt-0.5 shadow-lg shadow-green-500/10 transition-shadow duration-500 hover:shadow-green-500/30"
					>
						<span
							class="flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-sm font-medium text-white transition-colors"
						>
							Try Beta for Free
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</button>
				</SignedOut>
				<SignedIn>
					<a
						href="/dashboard"
						class="glow-btn group flex items-center gap-2 rounded-full pt-0.5 shadow-lg shadow-green-500/10 transition-shadow duration-500 hover:shadow-green-500/30"
					>
						<span
							class="flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-sm font-medium text-white transition-colors"
						>
							Go to Dashboard
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</a>
				</SignedIn>
				<button
					onclick={() => (showEnterpriseModal = true)}
					class="flex items-center gap-2 rounded-full border border-white/10 bg-linear-to-t from-white/10 to-white/5 px-6 py-4 text-sm font-medium text-white transition-colors duration-500 hover:from-white/15 hover:to-white/10"
				>
					Book a 15-min Demo
				</button>
			</div>
		</div>
		<DocumentScan />
		<!-- Scroll indicator -->
		<div
			class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-[bounce_2s_ease-in-out_infinite] md:block"
		>
			<ChevronDown class="h-7 w-7 text-gray-500" />
		</div>
	</section>

	<!-- THE MATH SECTION -->
	<section class="relative z-10 px-6 py-24 md:px-12">
		<div class="mx-auto max-w-6xl">
			<div class="mb-8 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">The Hidden Cost of Manual Work</h2>
				<p class="mt-4 text-gray-400">
					Select a team profile to see typical industry benchmarks for manual document handling.
				</p>
			</div>

			<!-- Use Case Selector -->
			<div class="mb-12 flex flex-wrap justify-center gap-4">
				{#each Object.keys(useCases) as name}
					<button
						onclick={() => selectUseCase(name as keyof typeof useCases)}
						class="rounded-lg px-6 py-2 text-sm font-medium transition-all {activeUseCase === name
							? 'bg-green-500/10 text-green-400'
							: 'bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'}"
					>
						{name}
					</button>
				{/each}
			</div>

			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="mx-auto max-w-xs space-y-10 md:max-w-md">
					<!-- Slider 1 -->
					<div class="space-y-4">
						<div class="flex justify-between">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium text-gray-300">Minutes per document</span>
								<div class="group relative">
									<Info class="h-3.5 w-3.5 cursor-help text-gray-500" />
									<div
										class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-900 p-2 text-[10px] text-gray-400 opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
									>
										Includes extraction, sorting, validation, and manual data entry into your
										systems.
									</div>
								</div>
							</div>
							<span class="text-2xl font-bold text-green-400">{minutesPerDoc}m</span>
						</div>
						<input
							type="range"
							min="1"
							max="60"
							bind:value={minutesPerDoc}
							class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-green-500"
						/>
						<div class="flex justify-between text-[10px] text-gray-500">
							<span>Quick check (1m)</span>
							<span>Deep audit (60m)</span>
						</div>
					</div>

					<!-- Slider 2 -->
					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-sm font-medium text-gray-300">Documents per week</span>
							<span class="text-2xl font-bold text-green-400">{docsPerWeek}</span>
						</div>
						<input
							type="range"
							min="10"
							max="5000"
							step="10"
							bind:value={docsPerWeek}
							class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-green-500"
						/>
						<div class="flex justify-between text-[10px] text-gray-500">
							<span>Small desk (10)</span>
							<span>High volume (5000+)</span>
						</div>
					</div>

					<!-- Slider 3 -->
					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-sm font-medium text-gray-300">Average hourly rate</span>
							<span class="text-2xl font-bold text-green-400">${hourlyRate}/hr</span>
						</div>
						<input
							type="range"
							min="1"
							max="50"
							bind:value={hourlyRate}
							class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-green-500"
						/>
						<div class="flex justify-between text-[10px] text-gray-500">
							<span>Operations ($1)</span>
							<span>Specialist ($50)</span>
						</div>
					</div>

					<p class="text-[11px] leading-relaxed font-medium text-gray-500 italic">
						* Estimates based on average industry benchmarks for document intake, routing, and
						manual verification steps.
					</p>
				</div>
				<div class="relative">
					<div
						class="relative flex flex-col items-center rounded-3xl border border-white/10 bg-zinc-950 p-8 backdrop-blur-sm sm:p-10 sm:py-20 md:min-w-xl"
					>
						<div class="mb-8 grid w-full grid-cols-2 gap-4">
							<div class="rounded-2xl border border-white/5 bg-white/5 p-4">
								<div
									class="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase"
								>
									<Clock class="h-3 w-3 text-green-500" />
									Hours Lost
								</div>
								<div class="text-2xl leading-none font-bold text-white">
									{Math.round($tweenedHours)}<span class="ml-1 text-xs font-normal text-gray-500"
										>/wk</span
									>
								</div>
							</div>
							<div class="rounded-2xl border border-white/5 bg-white/5 p-4">
								<div
									class="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase"
								>
									<Users class="h-3 w-3 text-green-500" />
									FTE Load
								</div>
								<div class="text-2xl leading-none font-bold text-white">{fteEquivalence}</div>
							</div>
						</div>

						<div class="w-full text-center">
							<div class="mb-2 text-xs font-medium tracking-widest text-green-400 uppercase">
								Annual Operational Cost
							</div>
							<div class="mb-6 text-6xl font-bold text-white">
								${Math.round($tweenedCost).toLocaleString()}
							</div>

							<p class="mb-8 px-4 text-[12px] leading-relaxed text-gray-300">
								{savingsMessage()}
							</p>

							<div class="mt-6 flex flex-col items-center gap-2">
								<a
									href="#pricing"
									class="flex items-center gap-2 rounded-xl border border-white/10 bg-linear-to-t from-white/5 to-white/0 px-6 py-4 text-sm font-medium text-green-400 transition-colors duration-500 hover:from-white/10 hover:to-white/5"
								>
									<span class="font-semibold"> Reduce overhead by ~98.4% </span>
									<ArrowUpRight class="h-4 w-4" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ABOUT SECTION - The Engine -->
	<section id="about" class="relative border-t border-white/5 px-6 py-24 md:px-12">
		<div class="mx-auto max-w-6xl">
			<div class="mb-16 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">The Lekana Solution</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-400">
					With no prior technical knowledge, you can replace manual error prone checklists with
					automated workflows that ensure 100% data integrity.
				</p>
			</div>

			<!-- Node-style Flow Visualization -->
			<div class="relative flex flex-col items-center justify-center gap-4 md:flex-row md:gap-1">
				<!-- Node 1: Documents -->
				<div class="flex flex-col items-center gap-3">
					<div
						class="group flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-green-600/20">
							<FileText class="h-8 w-8 text-green-400" />
						</div>
					</div>
					<span class="max-w-[100px] text-center text-xs font-medium tracking-tight text-white/70">
						Your Documents
					</span>
				</div>

				<!-- Connector -->
				<div class="mb-7 hidden h-0.5 w-16 bg-zinc-700 md:block"></div>
				<div class="block h-8 w-0.5 bg-linear-to-b from-white/20 to-white/10 md:hidden"></div>

				<!-- Node 2: Extract -->
				<div class="flex flex-col items-center gap-3">
					<div
						class="group flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-green-600/20">
							<Cpu class="h-8 w-8 text-green-400" />
						</div>
					</div>
					<span class="max-w-[100px] text-center text-xs font-medium tracking-tight text-white/70">
						AI Extraction
					</span>
				</div>

				<!-- Connector -->
				<div class="mb-7 hidden h-0.5 w-16 bg-zinc-700 md:block"></div>
				<div class="block h-8 w-0.5 bg-linear-to-b from-white/10 to-white/20 md:hidden"></div>

				<!-- Node 3: Classify -->
				<div class="flex flex-col items-center gap-3">
					<div
						class="group flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-green-600/20">
							<Zap class="h-8 w-8 text-green-400" />
						</div>
					</div>
					<span class="max-w-[100px] text-center text-xs font-medium tracking-tight text-white/70">
						Auto-Classify
					</span>
				</div>

				<!-- Connector -->
				<div class="mb-7 hidden h-0.5 w-16 bg-zinc-700 md:block"></div>
				<div class="block h-8 w-0.5 bg-linear-to-b from-white/20 to-white/10 md:hidden"></div>

				<!-- Node 4: Validate -->
				<div class="flex flex-col items-center gap-3">
					<div
						class="group flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-green-600/20">
							<Shield class="h-8 w-8 text-green-400" />
						</div>
					</div>
					<span class="max-w-[100px] text-center text-xs font-medium tracking-tight text-white/70">
						Risk Mitigation
					</span>
				</div>

				<!-- Connector -->
				<div class="mb-7 hidden h-0.5 w-16 bg-zinc-700 md:block"></div>
				<div class="block h-8 w-0.5 bg-linear-to-b from-white/10 to-white/20 md:hidden"></div>

				<!-- Node 5: Export -->
				<div class="flex flex-col items-center gap-3">
					<div
						class="group flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-xl bg-green-600/20">
							<Database class="h-8 w-8 text-green-400" />
						</div>
					</div>
					<span class="max-w-[100px] text-center text-xs font-medium tracking-tight text-white/70">
						Instant Sync
					</span>
				</div>
			</div>

			<!-- Description cards below -->
			<div class="mt-16 grid gap-6 md:grid-cols-3">
				<div class="rounded-xl border border-white/5 bg-white/2 p-6">
					<h3 class="mb-2 text-sm font-semibold text-white">Eliminate Data Entry</h3>
					<p class="text-xs leading-relaxed text-gray-400">
						Our AI recognizes document types and extracts key fields with 99%+ accuracy, removing
						the need for manual transcription.
					</p>
				</div>
				<div class="rounded-xl border border-white/5 bg-white/2 p-6">
					<h3 class="mb-2 text-sm font-semibold text-white">Enforce Compliance</h3>
					<p class="text-xs leading-relaxed text-gray-400">
						Set custom validation rules to catch errors before they hit your systems. Stop managing
						papers and start managing audit-ready data.
					</p>
				</div>
				<div class="rounded-xl border border-white/5 bg-white/2 p-6">
					<h3 class="mb-2 text-sm font-semibold text-white">Drive Operational Speed</h3>
					<p class="text-xs leading-relaxed text-gray-400">
						Automatically route clean data to your ERP or spreadsheets. Scale your document volume
						without scaling your headcount.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- PRODUCT SHOWCASE SECTION -->
	<section class="z-10 px-6 py-24 md:px-12">
		<div class="mx-auto max-w-6xl">
			<div class="mb-16 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">See it in action</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-400">
					A powerful interface that makes document automation feel effortless.
				</p>
			</div>

			<!-- Workflow Builder Showcase -->
			<div class="mb-16 flex w-full flex-col items-center gap-8 md:flex-row md:gap-12">
				<div class="flex-1 space-y-4">
					<span class="text-xs font-semibold tracking-widest text-green-400 uppercase"
						>Workflow Builder</span
					>
					<h3 class="text-2xl font-bold text-white">Build for outcomes, not just files</h3>
					<p class="text-sm leading-relaxed text-gray-400">
						You decide the steps: Extract, classify, and validate. Lekana handles the repetitive
						document work so you can finally focus on making decisions, not handling papers.
					</p>
					<SignedOut>
						<button
							onclick={() => (navState.showSignInModal = true)}
							class="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition-colors hover:text-green-300"
						>
							Try the builder
							<ArrowRight class="h-4 w-4" />
						</button>
					</SignedOut>
					<SignedIn>
						<a
							href="/dashboard"
							class="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition-colors hover:text-green-300"
						>
							Try the builder
							<ArrowRight class="h-4 w-4" />
						</a>
					</SignedIn>
				</div>
				<div class="flex-1">
					<img src="workflow.png" alt="Builder Screenshot" />
				</div>
			</div>

			<!-- Monitoring Dashboard Showcase -->
			<div class="flex flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
				<div class="flex-1">
					<img src="monitoring.png" alt="Builder Screenshot" />
				</div>
				<div class="md:w-1/3 space-y-4">
					<span class="text-xs font-semibold tracking-widest text-green-400 uppercase"
						>Monitoring</span
					>
					<h3 class="text-2xl font-bold text-white">Trust in every document</h3>
					<p class="text-sm leading-relaxed text-gray-400">
						Automated validation means you stop praying that nothing breaks. Verify extracted data
						in real-time and export clean results directly to your systems.
					</p>
					<SignedOut>
						<button
							onclick={() => (navState.showSignInModal = true)}
							class="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition-colors hover:text-green-300"
						>
							See monitoring in action
							<ArrowRight class="h-4 w-4" />
						</button>
					</SignedOut>
					<SignedIn>
						<a
							href="/dashboard"
							class="inline-flex items-center gap-2 text-sm font-medium text-green-400 transition-colors hover:text-green-300"
						>
							See monitoring in action
							<ArrowRight class="h-4 w-4" />
						</a>
					</SignedIn>
				</div>
			</div>
		</div>
	</section>

	<!-- VALUE PROPS -->
	<section class="border-t border-white/5 px-6 py-24 md:px-12">
		<div class="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
			<div class="flex flex-col gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
					<TrendingUp class="h-6 w-6 text-green-400" />
				</div>
				<h3 class="text-xl font-semibold text-white">Operational Scalability</h3>
				<p class="text-sm leading-relaxed text-gray-400">
					Process thousands of documents in minutes. Lekana handles the volume spikes so you don't
					have to hire seasonal contractors or temporary staff.
				</p>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
					<Shield class="h-6 w-6 text-green-400" />
				</div>
				<h3 class="text-xl font-semibold text-white">Enterprise-Grade Trust</h3>
				<p class="text-sm leading-relaxed text-gray-400">
					All data is processed with AES-256 encryption. We adhere to SOC 2 compliance standards to
					ensure your documents never leave a secure environment.
				</p>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
					<Zap class="h-6 w-6 text-green-400" />
				</div>
				<h3 class="text-xl font-semibold text-white">Rapid Deployment</h3>
				<p class="text-sm leading-relaxed text-gray-400">
					Go from manual work to an automated pipeline in days, not months. Our no-code builder
					means anyone can set up a workflow without IT tickets.
				</p>
			</div>
		</div>
	</section>

	<!-- PRICING SECTION -->
	<section id="pricing" class="border-t border-white/5 px-6 py-24 md:px-12">
		<div class="mx-auto max-w-5xl">
			<div class="mb-16 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">
					Stop surviving. <span class="text-green-400">Start scaling.</span>
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-gray-400">
					A system that grows with your volume, without growing your errors. Start free, then scale
					as your team focuses on what matters.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2">
				<!-- Free Plan -->
				<div class="relative flex flex-col rounded-2xl border border-white/10 bg-white/2 p-8">
					<div class="mb-6">
						<h3 class="text-xl font-semibold text-white">Free</h3>
						<p class="mt-1 text-sm text-gray-400">For those who want to try out Lekana</p>
					</div>

					<div class="mb-8">
						<span class="text-4xl font-bold text-white">$0</span>
						<span class="text-gray-400">/forever</span>
					</div>

					<ul class="mb-8 flex-1 space-y-4 text-sm text-gray-300">
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Full workflow builder access</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>AI-powered document extraction</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Full API access</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Unlimited workflows</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>100 tokens/month</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Community support</span>
						</li>
					</ul>

					<SignedOut>
						<button
							onclick={() => (navState.showSignInModal = true)}
							class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
						>
							Get Started Free
							<ArrowRight class="h-4 w-4" />
						</button>
					</SignedOut>
					<SignedIn>
						<a
							href="/dashboard"
							class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
						>
							Go to Dashboard
							<ArrowRight class="h-4 w-4" />
						</a>
					</SignedIn>
				</div>

				<!-- Enterprise Plan -->
				<div class="relative flex flex-col rounded-2xl border border-white/10 bg-white/2 p-8">
					<div class="absolute -top-3 left-6">
						<span
							class="rounded-full border border-white/10 bg-zinc-900 px-3 py-0.5 text-xs font-medium text-green-400"
						>
							For Scale
						</span>
					</div>

					<div class="mb-6">
						<h3 class="text-xl font-semibold text-white">Enterprise</h3>
						<p class="mt-1 text-sm text-gray-400">
							Book a call with us, and let us handle your needs.
						</p>
					</div>

					<div class="mb-8">
						<span class="text-4xl font-bold text-white">Custom</span>
					</div>

					<ul class="mb-8 flex-1 space-y-4 text-sm text-gray-300">
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Everything in Free</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Dedicated company portal</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Top of the line OCR Models</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Custom AI model training</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Priority support & SLA</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="mt-0.5 text-green-400">✓</span>
							<span>Dedicated success manager</span>
						</li>
					</ul>

					<button
						onclick={() => (showEnterpriseModal = true)}
						class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
					>
						<Headset class="h-4 w-4" />
						Book a Call
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ SECTION -->
	<section id="faq" class="border-t border-white/5 px-6 py-24 md:px-12">
		<div class="mx-auto max-w-3xl">
			<div class="mb-12 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">Questions & Answers</h2>
			</div>

			<div class="space-y-4">
				{#each faqs as faq, i}
					<button
						onclick={() => toggleFaq(i)}
						class="w-full rounded-xl border border-white/10 bg-white/2 p-6 text-left transition-all hover:border-white/20 hover:bg-white/4"
					>
						<div class="flex items-center justify-between gap-4">
							<h3 class="font-medium text-white">{faq.q}</h3>
							<ChevronDown
								class="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300"
								style="transform: rotate({expandedFaq === i ? 180 : 0}deg)"
							/>
						</div>
						{#if expandedFaq === i}
							<p class="mt-4 text-sm leading-relaxed text-gray-400">
								{faq.a}
							</p>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA SECTION -->
	<section class="border-t border-white/5 px-6 py-24 md:px-12">
		<div
			class="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-green-500/20 bg-linear-to-br from-green-500/10 via-transparent to-transparent p-12 text-center"
		>
			<div
				class="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl"
			></div>

			<h2 class="relative text-3xl font-bold text-white md:text-4xl">
				Ready to reclaim 30+ hours per week?
			</h2>
			<p class="relative mx-auto mt-4 max-w-lg text-gray-400">
				Stop managing files and start managing outcomes. Join businesses automating their data with
				Lekana.
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<SignedOut>
					<button
						onclick={() => (navState.showSignInModal = true)}
						class="glow-btn group flex items-center gap-2 rounded-full pt-0.5 shadow-lg shadow-green-500/10 transition-shadow duration-500 hover:shadow-green-500/30"
					>
						<span
							class="flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-4 text-sm font-medium text-white transition-colors"
						>
							Try Beta for Free
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</button>
				</SignedOut>
				<SignedIn>
					<a
						href="/dashboard"
						class="glow-btn group flex items-center gap-2 rounded-full pt-0.5 shadow-lg shadow-green-500/10 transition-shadow duration-500 hover:shadow-green-500/30"
					>
						<span
							class="flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-4 text-sm font-medium text-white transition-colors"
						>
							Go to Dashboard
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</span>
					</a>
				</SignedIn>
				<button
					onclick={() => (showEnterpriseModal = true)}
					class="flex items-center gap-2 rounded-full border border-white/10 bg-linear-to-t from-white/10 to-white/5 px-9 py-4 text-sm font-medium text-white transition-colors duration-500 hover:from-white/15 hover:to-white/10"
				>
					<Headset class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					Talk to Sales
				</button>
			</div>
		</div>
	</section>

	<Footer />

	{#if showEnterpriseModal}
		<EnterpriseModal onClose={() => (showEnterpriseModal = false)} />
	{/if}
</main>

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
	.chaos-text {
		font-family: 'Caveat', cursive;
		color: #05df72;
		position: relative;
		display: inline-block;
		transform: rotate(-2deg);
		font-size: 1.3em;
		letter-spacing: 0.02em;
		text-decoration: none;
		transition: transform 0.3s ease;
	}

	.chaos-text:hover {
		transform: rotate(-3deg) scale(1.05);
	}

	/* Scribble underline effect - like messy documents */
	.chaos-text::after {
		content: '';
		position: absolute;
		left: -5%;
		right: -5%;
		bottom: 0.1em;
		height: 0.15em;
		background: linear-gradient(
			90deg,
			transparent 0%,
			#05df72 5%,
			#05df72 15%,
			transparent 18%,
			#05df72 22%,
			#05df72 45%,
			transparent 48%,
			#05df72 52%,
			#05df72 78%,
			transparent 82%,
			#05df72 85%,
			#05df72 95%,
			transparent 100%
		);
		transform: rotate(1deg);
		opacity: 0.7;
	}

	/* Custom Range Slider Styling */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: #05df72;
		cursor: pointer;
		border-radius: 50%;
		border: 3px solid #0a0a0a;
		box-shadow: 0 0 10px rgba(5, 223, 114, 0.3);
		transition: all 0.2s ease;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 15px rgba(5, 223, 114, 0.5);
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: #05df72;
		cursor: pointer;
		border-radius: 50%;
		border: 3px solid #0a0a0a;
		box-shadow: 0 0 10px rgba(5, 223, 114, 0.3);
		transition: all 0.2s ease;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 15px rgba(5, 223, 114, 0.5);
	}
</style>
