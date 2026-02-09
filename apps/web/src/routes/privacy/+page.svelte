<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	let currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>Privacy Policy - Lekana</title>
	<meta name="description" content="Privacy Policy for Lekana - AI-Powered Document Automation." />
	<link rel="canonical" href="https://lekana.dev/privacy" />
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
		<h1 class="mb-4 text-3xl font-bold text-zinc-300 md:text-4xl">Privacy Policy</h1>
		<p class="mb-6 md:mb-12 text-[10px] text-neutral-500">
			Last Updated: February 09, 2026
		</p>

		<div class="policy-content space-y-8 text-[11px] md:text-[12px]">
			<section>
				<p class="leading-relaxed">
					This Privacy Policy ("Policy") describes the practices of Berl (PVT) LTD ("Company", "we",
					"us", or "our") regarding the collection, use, and disclosure of information through our
					AI-powered document automation platform, Lekana (the "Service"). By accessing or using the
					Service, you consent to the information practices described in this Policy.
				</p>
			</section>

			<section>
				<h2>1. Information Collection and Categorization</h2>
				<p>We categorize collected information into the following primary types:</p>
				<ul class="space-y-2">
					<li>
						<strong>Personal Identification Data:</strong> includes but is not limited to name, professional
						email addresses, billing information, and contact credentials provided during account registration
						or waitlist onboarding.
					</li>
					<li>
						<strong>Document Metadata:</strong> includes non-sensitive structural information about documents
						processed (file type, size, upload timestamps).
					</li>
					<li>
						<strong>User-Provided Content:</strong> includes the actual documents, images, and data structures
						submitted for AI extraction and workflow processing.
					</li>
					<li>
						<strong>Technical Log Data:</strong> includes IP addresses, browser types, interaction logs,
						and device identifiers collected automatically for security and performance monitoring.
					</li>
				</ul>
			</section>

			<section>
				<h2>2. Data Encryption and Technical Safeguards</h2>
				<p>
					The security of your data is a fundamental cornerstone of our Service architecture. We
					implement the following technical safeguards:
				</p>
				<ul class="space-y-2">
					<li>
						<strong>Encryption at Rest:</strong> All user-provided content and processed data are encrypted
						using the Industry-Standard Advanced Encryption Standard (AES-256) when stored on our physical
						or cloud infrastructure.
					</li>
					<li>
						<strong>Encryption in Transit:</strong> All data transmissions between the user and our Service,
						and between our internal service components, are protected using Transport Layer Security
						(TLS 1.2 or higher).
					</li>
					<li>
						<strong>Access Controls:</strong> We maintain strict internal logical access controls based
						on the Principle of Least Privilege (PoLP). No Company personnel access raw document content
						except when explicitly authorized for support or technical troubleshooting.
					</li>
				</ul>
			</section>

			<section>
				<h2>3. Global Data Residency and Infrastructure</h2>
				<p>
					Lekana utilizes a geographically distributed infrastructure to ensure high availability
					and performance. All primary data storage and processing facilities are located within
					multiple regions across the <strong>United States</strong>. By using the Service, you
					acknowledge and agree that your data will be transferred to and processed in the United
					States.
				</p>
			</section>

			<section>
				<h2>4. Utilization of Information</h2>
				<p>Information is utilized exclusively for the following purposes:</p>
				<ul class="space-y-2">
					<li>Facilitating AI-driven document recognition, extraction, and automated routing.</li>
					<li>
						Continuous improvement of our proprietary extraction algorithms and user interface
						experiences.
					</li>
					<li>Billing, account management, and provision of technical support services.</li>
					<li>Detection and prevention of fraudulent or unauthorized access to the Service.</li>
				</ul>
				<p>
					We do not sell, rent, or trade your document content or personal identification data to
					third parties for marketing purposes.
				</p>
			</section>

			<section>
				<h2>5. Third-Party Service Providers</h2>
				<p>
					We may engage trusted third-party service providers to perform functions and provide
					services to us, such as hosting, maintenance, and analytics. These providers are bound by
					strict confidentiality and data protection agreements and are only permitted to use your
					information as necessary to provide their services to us.
				</p>
			</section>

			<section>
				<h2>6. Retention and Deletion Architecture</h2>
				<p>
					We retain data only for the duration required to provide the requested Services or as
					mandated by legal obligations. For users of our "Free Beta" or "Demo" entry points,
					document content is typically processed in volatile memory and is not persisted in
					long-term storage, unless the user explicitly saves the workflow or document to their
					account.
				</p>
			</section>

			<section>
				<h2>7. Regulatory Compliance and User Rights</h2>
				<p>
					Depending on your jurisdiction, you may have rights under the General Data Protection
					Regulation (GDPR), the California Consumer Privacy Act (CCPA), or other regional data
					protection laws. These may include the right to access, correct, or delete your personal
					data. To exercise these rights, please contact our Data Protection Officer at <strong
						>privacy@lekana.dev</strong
					>.
				</p>
			</section>

			<section>
				<h2>8. Contact Information</h2>
				<p>Questions, concerns, or requests regarding this Privacy Policy should be directed to:</p>
				<p><strong>Lekana Support Team</strong><br />Email: support@lekana.dev</p>
			</section>
		</div>
	</section>

	<Footer />
</main>
