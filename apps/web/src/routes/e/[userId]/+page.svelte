<script>
	import { ArrowRight } from 'lucide-svelte';

	let { data } = $props();
	let user = $state(data?.user);
	let submitted = $state(data?.submitted);
	let loading = $state(false);
	let message = $state('');

	// Step state
	let currentStep = $state(0);
	const steps = [
		{ title: 'Identity', fields: ['name', 'email'] },
		{ title: 'Information', fields: ['company', 'industry', 'volume'] },
		{ title: 'Agenda', fields: ['role', 'docs'] }
	];

	let formData = $state({
		name: '',
		email: data?.user?.email || '',
		company: '',
		contactNumber: '',
		role: '',
		industry: '',
		industryOther: '',
		volume: '',
		docs: ''
	});

	// Derived value for submission
	let finalIndustry = $derived(
		formData.industry === 'Other' ? formData.industryOther : formData.industry
	);

	function nextStep() {
		// Basic validation for current step
		const currentFields = steps[currentStep].fields;
		let valid = true;

		// Simple check: required fields must be filled
		if (currentStep === 0) {
			if (!formData.name || !formData.email) valid = false;
		} else if (currentStep === 1) {
			if (!formData.company || !formData.industry || !formData.volume) valid = false;
			if (formData.industry === 'Other' && !formData.industryOther) valid = false;
		}

		if (valid) {
			currentStep++;
		} else {
			// Trigger browser validation UI
			const forms = document.querySelectorAll('form');
			if (forms[0] && !forms[0].checkValidity()) {
				forms[0].reportValidity();
				return;
			}
			// If browser thought it was valid (e.g. no 'required' on current inputs), progress.
			// But we manually checked above too. If manual check failed but browser didn't catch (e.g. hidden inputs?), stop.
			if (!valid && forms[0].checkValidity()) {
				// This shouldn't happen often if we use required attributes correctly
				message = 'Please fill in all required fields.';
				// Clear message after 3s
				setTimeout(() => (message = ''), 3000);
			} else {
				currentStep++;
			}
		}
	}

	function prevStep() {
		if (currentStep > 0) currentStep--;
	}

	async function submitForm() {
		loading = true;
		message = '';

		try {
			const payload = {
				name: formData.name,
				email: formData.email,
				company: formData.company,
				contact: formData.contactNumber,
				role: formData.role,
				industry: finalIndustry,
				volume: formData.volume,
				workflows: formData.docs
			};

			const res = await fetch(`/enterprise/api/users/${data.userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await res.json();

			if (!res.ok) {
				message = result.error || 'Failed to submit details. Please try again.';
			} else {
				user = result;
				submitted = true;
			}
		} catch (err) {
			console.error('Error submitting waitlist form:', err);
			message = 'An unexpected error occurred. Please try again later.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<meta name="theme-color" content="#05df72" />
</svelte:head>

<section
	id="waitlist"
	class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4 py-16 text-white md:py-24"
>
	<div
		class="absolute top-1/12 aspect-square w-full scale-[400%] animate-[pulse_5s_ease-in-out_infinite] justify-self-center rounded-full bg-radial from-green-500/15 to-transparent to-60% md:top-0 md:scale-150"
	></div>
	<div class="z-10 w-full max-w-2xl">
		<h2 class="text-center text-3xl font-semibold md:text-5xl">Book a Consultation</h2>
		<p class="mt-4 text-center text-sm text-zinc-400 md:text-lg">
			Discover how Lekana can transform your enterprise workflows.
		</p>

		{#if submitted}
			<div
				class="mt-12 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 p-8 text-center shadow-2xl md:p-12"
			>
				<h3 class="mb-3 text-3xl font-semibold text-green-500">Consultation Requested</h3>
				<p class="mb-10 text-zinc-400">
					We've received your request. Our team will soon get in touch with you to schedule your
					consultation.
				</p>

				{#if user}
					<div
						class="mb-10 w-full max-w-md space-y-4 rounded-2xl border border-white/5 bg-zinc-950/50 p-6 text-left"
					>
						<h4 class="mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">
							Request Details
						</h4>

						<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
							<div class="space-y-1">
								<span class="block text-zinc-500">Name</span>
								<span class="font-medium text-white">{user.name || '—'}</span>
							</div>
							<div class="space-y-1">
								<span class="block text-zinc-500">Email</span>
								<span class="font-medium text-white">{user.email || '—'}</span>
							</div>
							<div class="space-y-1">
								<span class="block text-zinc-500">Company</span>
								<span class="font-medium text-white">{user.company || '—'}</span>
							</div>
							<div class="space-y-1">
								<span class="block text-zinc-500">Role</span>
								<span class="font-medium text-white">{user.role || '—'}</span>
							</div>
							<div class="space-y-1">
								<span class="block text-zinc-500">Industry</span>
								<span class="font-medium text-white">{user.industry || '—'}</span>
							</div>
							<div class="space-y-1">
								<span class="block text-zinc-500">Volume</span>
								<span class="font-medium text-white">{user.volume || '—'}</span>
							</div>
							{#if user.contact}
								<div class="space-y-1 md:col-span-2">
									<span class="block text-zinc-500">Contact</span>
									<span class="font-medium text-white">
										{user.contact}
									</span>
								</div>
							{/if}
							{#if user.workflows || user.docs}
								<div class="space-y-1 md:col-span-2">
									<span class="block text-zinc-500">Target Workflows</span>
									<span class="line-clamp-2 font-medium text-white"
										>{user.workflows || user.docs || '—'}</span
									>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<div class="flex flex-col items-center gap-6">
					<a href="/" class="text-sm text-zinc-400 transition-colors hover:text-white">
						Back to Home
					</a>
				</div>
			</div>
		{:else}
			<!-- Progress Bar -->
			<div
				class="mx-auto mt-10 mb-8 flex w-full max-w-xs items-center justify-center gap-3 md:max-w-sm"
			>
				{#each steps as step, i}
					<div class="flex flex-1 items-center gap-2">
						<div
							class="h-1.5 w-full rounded-full transition-all duration-500 {i <= currentStep
								? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
								: 'bg-zinc-800'}"
						></div>
					</div>
				{/each}
			</div>

			<div class="glow-btn relative mt-4 flex rounded-3xl py-px shadow-2xl shadow-green-500/5">
				<form
					class="w-full rounded-3xl bg-zinc-900 p-6 backdrop-blur-xl md:p-10"
					onsubmit={(e) => e.preventDefault()}
				>
					<!-- Form Steps -->
					<div class="h-fit">
						<!-- STEP 1: Identity -->
						{#if currentStep === 0}
							<div class="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
								<div class="mb-4 space-y-1">
									<h3 class="text-xl font-bold text-white">Your Information</h3>
									<p class="text-sm text-zinc-400">Let's start with who we'll be meeting.</p>
								</div>
								<div class="grid gap-6">
									<!-- Name -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="name" class="font-medium text-zinc-300">
											Full Name <span class="text-green-500">*</span>
										</label>
										<input
											id="name"
											name="name"
											type="text"
											bind:value={formData.name}
											placeholder="Alex Johnson"
											class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
											required
										/>
									</div>

									<!-- Work email -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="email" class="font-medium text-zinc-300">
											Work Email <span class="text-green-500">*</span>
										</label>
										<input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											disabled
											class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-zinc-400 transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
											required
										/>
									</div>
								</div>
							</div>
						{/if}

						<!-- STEP 2: Company Profile -->
						{#if currentStep === 1}
							<div class="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
								<div class="mb-4 space-y-1">
									<h3 class="text-xl font-bold text-white">
										Hey {formData.name},
									</h3>
									<p class="text-sm text-zinc-400">
										Tell us about your organization to help us prepare.
									</p>
								</div>
								<div class="grid gap-6">
									<!-- Company name -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="company" class="font-medium text-zinc-300">
											Company Name <span class="text-green-500">*</span>
										</label>
										<input
											id="company"
											name="company"
											type="text"
											bind:value={formData.company}
											placeholder="Acme Corp"
											class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
											required
										/>
									</div>

									<!-- Industry -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="industry" class="font-medium text-zinc-300">
											Industry <span class="text-green-500">*</span>
										</label>
										<select
											id="industry"
											name="industry"
											bind:value={formData.industry}
											class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white transition-all focus:border-green-500/50 focus:outline-none"
											required
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

									{#if formData.industry === 'Other'}
										<div class="animate-in fade-in slide-in-from-top-2 flex flex-col gap-2 text-sm">
											<label for="industryOther" class="font-medium text-zinc-300">
												Please specify <span class="text-green-500">*</span>
											</label>
											<input
												id="industryOther"
												name="industryOther"
												type="text"
												bind:value={formData.industryOther}
												placeholder="e.g. Education, Retail..."
												class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
												required
											/>
										</div>
									{/if}

									<!-- Document volume -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="volume" class="font-medium text-zinc-300">
											Monthly Document Volume <span class="text-green-500">*</span>
										</label>
										<select
											id="volume"
											name="documentVolume"
											bind:value={formData.volume}
											class="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white transition-all focus:border-green-500/50 focus:outline-none"
											required
										>
											<option value="" disabled selected>Select a range</option>
											<option>&lt; 100</option>
											<option>100 – 500</option>
											<option>500 – 2,000</option>
											<option>2,000 – 10,000</option>
											<option>10,000+</option>
										</select>
									</div>
								</div>
							</div>
						{/if}

						<!-- STEP 3: Intent & Contact -->
						{#if currentStep === 2}
							<div class="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
								<div class="mb-4">
									<h3 class="text-xl font-bold text-white">Meeting Agenda</h3>
									<p class="text-sm text-zinc-400">Identify the key areas you'd like to discuss.</p>
								</div>

								<div class="grid gap-6">
									<!-- Role -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="role" class="font-medium text-zinc-300">Your Role</label>
										<input
											id="role"
											name="role"
											type="text"
											bind:value={formData.role}
											placeholder="e.g. CTO, Operations Lead"
											class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
										/>
									</div>

									<!-- Workflows -->
									<div class="flex flex-col gap-2 text-sm">
										<label for="workflows" class="font-medium text-zinc-300">
											What specific workflows should we explore?
										</label>
										<textarea
											id="workflows"
											name="workflows"
											bind:value={formData.docs}
											rows="3"
											placeholder="e.g. Automating invoice processing, contract analysis..."
											class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
										></textarea>
									</div>

									<!-- Contact Number -->
									<div class="space-y-4">
										<div class="flex flex-col gap-2 text-sm">
											<label for="contact" class="font-medium text-zinc-300">
												Contact Number <span class="text-xs font-normal text-zinc-500"
													>(Optional)</span
												>
											</label>
											<input
												id="contact"
												name="contact"
												type="tel"
												bind:value={formData.contactNumber}
												placeholder="+1 555 000 0000"
												class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-white transition-all placeholder:text-zinc-600 focus:border-green-500/50 focus:outline-none"
											/>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Navigation Buttons -->
					<div class="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
						<!-- Back Button -->
						<button
							type="button"
							class="text-sm font-medium text-zinc-500 transition-colors hover:text-white disabled:opacity-0"
							onclick={prevStep}
							disabled={currentStep === 0}
						>
							&larr; Back
						</button>

						<!-- Error Message -->
						{#if message}
							<div class="absolute right-0 bottom-24 left-0 text-center">
								<span
									class="rounded-full border border-red-500/30 bg-red-900/80 px-4 py-2 text-xs font-medium text-red-100 backdrop-blur-sm"
								>
									{message}
								</span>
							</div>
						{/if}

						<!-- Next / Submit Button -->
						{#if currentStep < steps.length - 1}
							<button
								type="button"
								onclick={nextStep}
								class="rounded-xl bg-green-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700 active:scale-95"
							>
								Next
							</button>
						{:else}
							<button
								onclick={submitForm}
								disabled={loading}
								type="button"
								class="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if loading}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
									></div>
									Submitting...
								{:else}
									Submit
								{/if}
							</button>
						{/if}
					</div>
				</form>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Copying the glow effect from landing page */
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
