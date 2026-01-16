<script>
	import Header from "$lib/components/Header.svelte";


	let currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>Terms of Service - Lekana</title>
	<meta
		name="description"
		content="Terms of Service for Lekana - AI-Powered Document Automation."
	/>
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
		<h1 class="mb-4 text-4xl font-bold text-zinc-300 md:text-5xl">Terms of Service</h1>
		<p class="mb-12 text-xs text-neutral-500">Last Updated: December 20, 2024</p>

		<div class="policy-content">
			<p>
				Welcome to Lekana. By using our service, you agree to comply with and be bound by the
				following terms and conditions. Please read them carefully.
			</p>

			<h2>1. Acceptance of Terms</h2>
			<p>
				By accessing or using Lekana's document intake service, you agree to be bound by these Terms
				of Service and all applicable laws and regulations. If you do not agree with any part of
				these terms, you are prohibited from using or accessing this site.
			</p>

			<h2>2. Use License</h2>
			<p>
				Permission is granted to temporarily use Lekana's services for personal or business
				purposes. This is the grant of a license, not a transfer of title, and under this license,
				you may not:
			</p>
			<ul>
				<li>Modify or copy the materials on this site for competitive purposes.</li>
				<li>Use the materials for any commercial purpose without prior authorization.</li>
				<li>
					Attempt to decompile or reverse engineer any software contained on Lekana's platform.
				</li>
				<li>Remove any copyright or other proprietary notations from the materials.</li>
			</ul>

			<h2>3. Disclaimer</h2>
			<p>
				The materials on Lekana's website are provided on an 'as is' basis. Lekana makes no
				warranties, expressed or implied, and hereby disclaims and negates all other warranties
				including, without limitation, implied warranties or conditions of merchantability, fitness
				for a particular purpose, or non-infringement of intellectual property or other violation of
				rights.
			</p>

			<h2>4. Limitations</h2>
			<p>
				In no event shall Lekana or its suppliers be liable for any damages (including, without
				limitation, damages for loss of data or profit, or due to business interruption) arising out
				of the use or inability to use the materials on Lekana's website, even if Lekana or a Lekana
				authorized representative has been notified orally or in writing of the possibility of such
				damage.
			</p>

			<h2>5. Accuracy of Materials</h2>
			<p>
				The materials appearing on Lekana's website could include technical, typographical, or
				photographic errors. Lekana does not warrant that any of the materials on its website are
				accurate, complete, or current. Lekana may make changes to the materials contained on its
				website at any time without notice.
			</p>

			<h2>6. Links</h2>
			<p>
				Lekana has not reviewed all of the sites linked to its website and is not responsible for
				the contents of any such linked site. The inclusion of any link does not imply endorsement
				by Lekana of the site. Use of any such linked website is at the user's own risk.
			</p>

			<h2>7. Modifications</h2>
			<p>
				Lekana may revise these terms of service for its website at any time without notice. By
				using this website, you are agreeing to be bound by the then-current version of these terms
				of service.
			</p>

			<h2>8. Governing Law</h2>
			<p>
				These terms and conditions are governed by and construed in accordance with the laws of the
				jurisdiction in which Lekana operates, and you irrevocably submit to the exclusive
				jurisdiction of the courts in that State or location.
			</p>

			<h2>9. Contact Information</h2>
			<p>
				If you have any questions about these Terms of Service, please contact us at
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
							<li><a href="/privacy" class="hover:text-green-500">Privacy</a></li>
							<li><a href="/terms" class="text-green-500">Terms</a></li>
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