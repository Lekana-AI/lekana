<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>Terms of Service - Lekana</title>
	<meta
		name="description"
		content="Terms of Service for Lekana - AI-Powered Document Automation."
	/>
	<link rel="canonical" href="https://lekana.dev/terms" />
</svelte:head>

<main
	class="relative flex min-h-screen flex-col items-center overflow-clip bg-neutral-950 text-white"
>
	<!-- NAV -->
	<Header />
	<style>
		.policy-content h2 {
			font-size: 1.2rem;
			font-weight: 600;
			color: #d4d4d8;
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

	<section class="relative z-10 w-full max-w-5xl px-6 pt-32 pb-20 md:pt-48">
		<h1 class="mb-4 text-3xl font-bold text-zinc-300 md:text-4xl">Terms of Service</h1>
		<p class="mb-6 md:mb-12 text-[10px] text-neutral-500">
			Last Updated: February 09, 2026
		</p>

		<div class="policy-content space-y-8 text-[11px] md:text-[12px]">
			<section>
				<p class="leading-relaxed">
					These Terms of Service ("Terms") constitute a legally binding agreement between you
					("User", "you") and <strong>Berl (PVT) LTD</strong>, a software company registered under
					the Companies Act No. 7 of 2007 ("Company", "we", "us"), governing your access to and use
					of the Lekana platform ("Service").
				</p>
			</section>

			<section>
				<h2>1. Acceptance and Digital Signature</h2>
				<p>
					By registering for an account, accessing our cloud dashboard, or utilizing our document
					extraction APIs, you acknowledge that you have read, understood, and agreed to be bound by
					these Terms. If you are entering into these Terms on behalf of a company or other legal
					entity, you represent that you have the authority to bind such entity to these Terms.
				</p>
			</section>

			<section>
				<h2>2. Subscription and Billing Structures</h2>
				<p>
					We provide Service access on a subscription basis. Billing cycles are established at the
					time of subscription (monthly or annually). All fees are exclusive of taxes, which you are
					responsible for paying. We reserve the right to modify our pricing tiers upon thirty (30)
					days' notice via email or dashboard notification.
				</p>
			</section>

			<section>
				<h2>3. Refund and Cancellation Policy</h2>
				<p>
					We maintain a strict refund policy to ensure the sustainability of our AI infrastructure.
					Please review these conditions carefully:
				</p>
				<ul class="space-y-2">
					<li>
						<strong>Eligibility Window:</strong> Refund requests must be formally submitted within
						<strong>seven (7) calendar days</strong> of the initial purchase or renewal date.
					</li>
					<li>
						<strong>Token Usage Constraint:</strong> A refund is <strong>only</strong> available if zero
						(0) AI document tokens or credits have been utilized during the current billing cycle. Any
						utilization of the extraction engine voids eligibility.
					</li>
					<li>
						<strong>Partial Refunds Only:</strong> To cover administrative overhead and transaction
						processing fees, <strong>full refunds are never issued</strong>. All approved refunds
						will be processed as partial refunds, with the specific deduction amount determined by
						the Company at the time of processing.
					</li>
					<li>
						<strong>Verification Protocol:</strong> Refund requests <strong>must</strong> be sent to
						<strong>support@lekana.dev</strong> from the original email address registered to the account.
						Requests received from unauthorized or secondary email addresses will not be recognized or
						processed, and the Company assumes no responsibility for delays resulting from non-compliance
						with this protocol.
					</li>
				</ul>
			</section>

			<section>
				<h2>4. Acceptable Use and Prohibited Activities</h2>
				<p>
					You agree not to use the Service for any purpose that is unlawful or prohibited by these
					Terms. Prohibited activities include, but are not limited to:
				</p>
				<ul class="space-y-2">
					<li>
						Uploading or processing documents containing malware, viruses, or malicious scripts.
					</li>
					<li>
						Engaging in data scraping, harvesting, or automated extraction from the Service that
						bypasses our standard APIs.
					</li>
					<li>
						Attempting to circumvent, disable, or interfere with security-related features of the
						Service.
					</li>
					<li>
						Using the Service to process material that infringes upon the intellectual property or
						privacy rights of any third party.
					</li>
					<li>
						Reverse engineering, decompiling, or attempting to derive the source code of the Lekana
						extraction models.
					</li>
					<li>
						Using the Service to facilitate activities that violate international trade sanctions or
						export control laws.
					</li>
				</ul>
			</section>

			<section>
				<h2>5. Proprietary Rights and Data License</h2>
				<p>
					The Service architecture, including AI models, UI/UX components, and proprietary
					algorithms, remains the exclusive property of Berl (PVT) LTD. You retain all ownership
					rights to the documents you upload. However, by using the Service, you grant us a limited,
					worldwide license to process, host, and extract data from your content solely for the
					purpose of providing the requested Service outcomes to you.
				</p>
			</section>

			<section>
				<h2>6. Limitation of Liability and Indemnification</h2>
				<p>
					To the maximum extent permitted by law, Berl (PVT) LTD shall not be liable for any
					indirect, incidental, or consequential damages arising from the use or inability to use
					the Service. You agree to indemnify and hold the Company harmless from any claims or
					losses arising from your breach of these Terms or your violation of any law or third-party
					rights.
				</p>
			</section>

			<section>
				<h2>7. Termination of Service</h2>
				<p>
					We reserve the right to suspend or terminate your access to the Service at our sole
					discretion, without notice, if we believe you have violated these Terms or engaged in
					conduct that harms the Service's integrity or other users' experiences.
				</p>
			</section>

			<section>
				<h2>8. Contact Information</h2>
				<p>For inquiries regarding these Terms or legal matters, please contact us at:</p>
				<p><strong>Legal Department</strong><br />Email: support@lekana.dev</p>
			</section>
		</div>
	</section>

	<Footer />
</main>
