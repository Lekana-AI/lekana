<script>
	import Header from "$lib/components/Header.svelte";


	let currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>Privacy Policy - Lekana</title>
	<meta name="description" content="Privacy Policy for Lekana - AI-Powered Document Automation." />
</svelte:head>

<main
	class="relative flex min-h-screen flex-col items-center overflow-clip bg-neutral-950 text-white"
>
	<!-- NAV -->
	<Header />
	<style>
		.policy-content h2 {
			font-size: 1.5rem;
			font-weight: 600;
			color: #05df72;
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		.policy-content p {
			color: #a1a1aa;
			line-height: 1.7;
			margin-bottom: 1rem;
		}

		.policy-content ul {
			list-style-type: disc;
			padding-left: 1.5rem;
			color: #a1a1aa;
			margin-bottom: 1rem;
		}

		.policy-content li {
			margin-bottom: 0.5rem;
		}
	</style>

	<div
		class="absolute top-0 aspect-square w-full scale-[150%] animate-[pulse_5s_ease-in-out_infinite] justify-self-center rounded-full bg-radial from-green-500/10 to-transparent to-60%"
	></div>

	<section class="relative z-10 w-full max-w-4xl px-6 pt-32 pb-20 md:pt-48">
		<h1 class="mb-4 text-4xl font-bold text-zinc-300 md:text-5xl">Privacy Policy</h1>
		<p class="mb-12 text-xs text-neutral-500">Last Updated: December 20, 2024</p>

		<div class="policy-content">
			<p>
				At Lekana, we take your privacy seriously. This Privacy Policy explains how we collect, use,
				and protect your information when you use our AI-powered document intake service.
			</p>

			<h2>1. Information We Collect</h2>
			<p>We collect information that you provide directly to us, including:</p>
			<ul>
				<li>
					Contact information (such as name, email address, and phone number) when you join our
					waitlist or create an account.
				</li>
				<li>Company information and details about your document workflows.</li>
				<li>
					Documents you upload for processing (which are processed securely and not stored
					permanently unless specifically requested for your workflow).
				</li>
			</ul>

			<h2>2. How We Use Your Information</h2>
			<p>We use the information we collect to:</p>
			<ul>
				<li>Provide and improve our document processing services.</li>
				<li>
					Communicate with you about our services, including updates and promotional materials.
				</li>
				<li>Analyze usage patterns to enhance our platform's performance and user experience.</li>
				<li>Comply with legal obligations and protect our rights.</li>
			</ul>

			<h2>3. Data Security</h2>
			<p>
				We implement industry-standard security measures to protect your information from
				unauthorized access, disclosure, or destruction. Your documents are processed in controlled
				environments, and access is restricted according to strict security protocols.
			</p>

			<h2>4. Data Retention</h2>
			<p>
				We only retain your personal information for as long as necessary to fulfill the purposes
				outlined in this policy or as required by law. For our free demo scanner, documents are
				processed in memory and not permanently stored.
			</p>

			<h2>5. Your Rights</h2>
			<p>
				You have the right to access, correct, or delete your personal information. If you wish to
				exercise these rights, please contact us at privacy@lekana.dev.
			</p>

			<h2>6. Updates to This Policy</h2>
			<p>
				We may update this Privacy Policy from time to time. We will notify you of any significant
				changes by posting the new policy on this page and updating the "Last Updated" date.
			</p>

			<h2>7. Contact Us</h2>
			<p>
				If you have any questions about this Privacy Policy, please contact us at
				support@lekana.dev.
			</p>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="w-full border-t border-green-950/60 bg-black/95 z-10">
		<div class="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-400 md:px-8 md:py-12">
			
			<div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
				<!-- Brand -->
				<div class="max-w-sm space-y-3">
					<p class="text-base font-semibold text-white">Lekana</p>
					<p class="text-xs leading-relaxed text-gray-500 md:text-sm">
						An OCR-powered document intake service for businesses. We read your documents,
						understand them, and route them into your workflow — fully managed, end-to-end.
					</p>
				</div>

				<!-- Navigation -->
				<div class="flex flex-1 flex-wrap gap-10 md:justify-end">
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Product</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="/#about" class="hover:text-green-500">About</a></li>
							<li><a href="/#faq" class="hover:text-green-500">FAQ</a></li>
						</ul>
					</div>
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Company</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="/#waitlist" class="hover:text-green-500">Join waitlist</a></li>
						</ul>
					</div>
					<div class="space-y-3">
						<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Legal</p>
						<ul class="space-y-2 text-xs md:text-sm">
							<li><a href="/privacy" class="text-green-500">Privacy</a></li>
							<li><a href="/terms" class="hover:text-green-500">Terms</a></li>
						</ul>
					</div>
				</div>
			</div>

			<hr class="mt-8 border-neutral-800" />

			<div
				class="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-gray-500 md:flex-row md:text-xs"
			>
				<p>Lekana © {currentYear}. All rights reserved.</p>
				<p class="text-center md:text-right">
					Built for businesses that are done with the chaos of documents.
				</p>
			</div>
		</div>
	</footer>
</main>