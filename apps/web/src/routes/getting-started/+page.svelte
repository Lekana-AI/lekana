<script lang="ts">
	import { SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import {
		User,
		Building2,
		Users,
		ArrowRight,
		ArrowLeft,
		CheckCircle2,
		Sparkles,
		Crown,
		Minus,
		Info,
		Check,
		LogOut
	} from 'lucide-svelte';

	let step = 1;

	let form = {
		accountType: '' as '' | 'individual' | 'company',
		name: '',
		companyName: '',
		role: '',
		teamEmails: [''] as string[],
		planId: 'pro' as PlanId,
		billingCycle: 'monthly' as 'monthly' | 'yearly'
	};

	let teammates = 1;

	const addTeammate = () => {
		if (teammates >= 7) return;
		teammates += 1;

		if (form.teamEmails.length < teammates) {
			form.teamEmails = [...form.teamEmails, ''];
		}
	};

	const removeTeammate = (index: number) => {
		if (teammates <= 1) return;
		teammates -= 1;
		form.teamEmails = form.teamEmails.filter((_, i) => i !== index);
	};

	type PlanId = 'free' | 'pro' | 'business';

	type Plan = {
		id: PlanId;
		name: string;
		description: string;
		badge?: string;
		features: string[];
		monthlyPrice?: string;
		yearlyPrice?: string;
		contactOnly?: boolean;
		CTA: string;
	};

	const plans: Plan[] = [
		{
			id: 'free',
			name: 'Free',
			description: 'Great for testing workflows and small personal use.',
			badge: 'Best to try things out',
			features: ['Generous free tier', 'Core OCR & workflows', 'Single workspace'],
			monthlyPrice: '$0',
			yearlyPrice: '$0',
			CTA: 'Start with Free'
		},
		{
			id: 'pro',
			name: 'Pro',
			description: 'For teams and individuals running document workflows regularly.',
			badge: 'Most popular',
			features: [
				'Higher monthly document limits',
				'Faster processing & priority queue',
				'Integrations (email, DB, APIs)',
				'Invite your team'
			],
			monthlyPrice: '$49',
			yearlyPrice: '$39',
			CTA: 'Start Pro Plan'
		},
		{
			id: 'business',
			name: 'Business',
			description: 'For larger teams with higher volumes and advanced needs.',
			badge: 'Most powerful',
			features: ['Custom limits & SLAs', 'Advanced permissions & SSO', 'Priority support'],
			contactOnly: true,
			CTA: 'Book a Demo'
		}
	];
</script>

<main
	class="relative z-10 flex min-h-screen w-screen items-center justify-center overflow-clip bg-zinc-950 px-4 py-10"
>
	<div
		class="absolute top-1/2 right-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
	></div>

	<div class="z-10 flex flex-col gap-8">
		<!-- Header -->
		<div class="">
			<p class="text-[11px] font-semibold tracking-[0.18em] text-green-400 uppercase">
				Getting started
			</p>
			<h1 class="text-2xl font-semibold text-white md:text-3xl">
				Welcome to
				<span class="text-green-400">your Workflow builder</span>.
			</h1>
		</div>
		<div class="mt-2 flex w-full max-w-lg items-center px-6 text-zinc-400">
			<div class="flex gap-2">
				{#each Array(3) as _, i}
					<div
						class="h-3 w-3 rounded-full transition-all duration-300
					{i + 1 <= step ? 'bg-green-400' : 'bg-zinc-700'}"
					></div>
				{/each}
			</div>
			<!-- <span class="ml-3 text-[11px] whitespace-nowrap">Step {step} of {totalSteps}</span> -->
		</div>
		<div class="w-full max-w-3xl rounded-2xl bg-zinc-900 p-6 shadow-2xl">
			<!-- Progress -->

			<!-- Steps wrapper -->
			<div class="space-y-6 py-2">
				<!-- STEP 1: Individual vs Company -->
				{#if step === 1}
					<section class="space-y-6">
						<div>
							<h2 class="text-lg font-semibold text-white">Who are we setting this up for?</h2>
							<p class="mt-1 text-xs text-zinc-400">
								Choose the option that fits best. You can always invite more people later.
							</p>
						</div>

						<div class="flex gap-3">
							<button
								type="button"
								on:click={() => (form.accountType = 'individual')}
								class="flex w-full flex-col items-center justify-center gap-4 rounded-xl px-3 py-4 text-sm transition-all duration-200
								{form.accountType === 'individual'
									? ' bg-green-400/50 hover:bg-green-400/40'
									: ' bg-zinc-800 hover:bg-zinc-800/80'}
							"
							>
								<User class="h-6 w-6 text-white" />
								<p class="font-medium text-white">Just me</p>
							</button>

							<button
								type="button"
								on:click={() => (form.accountType = 'company')}
								class="flex w-full flex-col items-center justify-center gap-4 rounded-xl px-3 py-4 text-sm transition-all duration-200
								{form.accountType === 'company'
									? ' bg-green-400/50 hover:bg-green-400/40'
									: ' bg-zinc-800 hover:bg-zinc-800/80'}
							"
							>
								<Building2 class="h-6 w-6 text-white" />
								<p class="font-medium text-white">My Team / Company</p>
							</button>
						</div>
						<div class="mt-7 flex items-center justify-end">
							<button
								type="button"
								on:click={() => {
									step++;
								}}
								disabled={form.accountType === ''}
								class="flex items-center gap-2 rounded-md bg-white px-8 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/90 disabled:bg-white/50"
							>
								Continue
								<ArrowRight class="h-3.5 w-3.5" />
							</button>
						</div>
					</section>
				{/if}

				<!-- STEP 2: User / Company details -->
				{#if step === 2}
					<section class="space-y-5">
						<div>
							<h2 class="text-lg font-semibold text-white">
								{#if form.accountType === 'company'}
									Tell us about your company
								{:else}
									Tell us about you
								{/if}
							</h2>
							<p class="mt-1 text-xs text-zinc-400">
								We use this to personalise your workspace and emails. You can change it later.
							</p>
						</div>

						<div class="space-y-6">
							{#if form.accountType === 'company'}
								<div class="flex flex-col gap-2 text-sm">
									<label for="companyName" class="text-zinc-200">Company name</label>
									<input
										id="companyName"
										type="text"
										bind:value={form.companyName}
										class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-sm text-white transition-all outline-none placeholder:text-zinc-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
										placeholder="Your company or team name"
									/>
									<p class="text-[11px] text-zinc-500">This will be the name of your workspace.</p>
								</div>
							{/if}
							<div class="flex flex-col gap-2 text-sm">
								<label for="contactName" class="text-zinc-200">Your name</label>
								<input
									id="contactName"
									type="text"
									bind:value={form.name}
									class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-sm text-white transition-all outline-none placeholder:text-zinc-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
									placeholder="You’ll be the main contact"
								/>
							</div>

							<div class="flex flex-col gap-2 text-sm">
								<label for="role" class="text-zinc-200">Your role (optional)</label>
								<input
									id="role"
									type="text"
									bind:value={form.role}
									class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-sm text-white transition-all outline-none placeholder:text-zinc-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
									placeholder={form.accountType === 'individual'
										? 'Ex: Developer, Finance, Legal, Founder'
										: 'Ex: Founder, CTO, Admin, Finance'}
								/>
							</div>

							<div class="flex flex-col gap-2 text-sm">
								<div class="flex items-stretch justify-between">
									<div class="flex flex-col gap-1">
										<label for="teamEmailsCompany" class="text-zinc-200">
											{form.accountType === 'company'
												? 'Invite upto 6 - 7 teammates (optional)'
												: 'Add upto 6 - 7 Collaborators (optional)'}
										</label>

										<span class="text-xs text-zinc-500">
											{form.accountType === 'company'
												? 'Works best with your work emails.'
												: "We'll send them an invite"}
										</span>
									</div>
									<button
										type="button"
										class="flex items-center self-stretch rounded-md bg-zinc-800/70 px-4 text-[11px] text-zinc-200 transition-colors hover:bg-zinc-800 disabled:bg-zinc-800/50 disabled:opacity-50"
										on:click={addTeammate}
										disabled={teammates >= 7}
									>
										Add {form.accountType === 'company' ? 'Teammate' : 'Collaborator'}
									</button>
								</div>

								{#each Array.from({ length: teammates }) as _, index}
									<div
										class="flex w-full items-stretch overflow-clip rounded-lg border border-zinc-700 bg-black/50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
									>
										<input
											id={`teamEmailsCompany-${index}`}
											type="email"
											bind:value={form.teamEmails[index]}
											class="w-full px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
											placeholder={`${form.accountType === 'company' ? 'Teammate' : 'Collaborator'} ${index + 1} email`}
										/>

										<button
											disabled={teammates <= 1}
											type="button"
											on:click={() => removeTeammate(index)}
											class="flex items-center self-stretch px-4 text-white transition-colors hover:text-white/70 disabled:text-white/30"
										>
											<Minus size="16" />
										</button>
									</div>
								{/each}
							</div>
						</div>
						<div class="mt-7 flex items-center justify-between">
							<button
								type="button"
								on:click={() => {
									step--;
								}}
								class="flex items-center gap-2 px-8 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
							>
								<ArrowLeft class="h-3.5 w-3.5" />
								Previous
							</button>
							<button
								type="button"
								on:click={() => {
									step++;
								}}
								disabled={form.name === '' &&
									(form.accountType === 'individual' || form.companyName === '')}
								class="flex items-center gap-2 rounded-md bg-white px-8 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/90 disabled:bg-white/50"
							>
								Continue
								<ArrowRight class="h-3.5 w-3.5" />
							</button>
						</div>
					</section>
				{/if}

				<!-- STEP 3: Pricing / Plan -->
				{#if step === 3}
					<section class="space-y-6">
						<div>
							<h2 class="text-lg font-semibold text-white">
								Almost there, pick a plan to start with
							</h2>
							<p class="mt-1 text-xs text-zinc-400">
								You can switch or cancel anytime from the billing section.
							</p>
						</div>

						<!-- Billing cycle toggle -->
						<div
							class="inline-flex w-full items-center justify-center gap-1 rounded-full bg-zinc-900 p-1 text-xs"
						>
							<button
								type="button"
								on:click={() => (form.billingCycle = 'monthly')}
								class="rounded-md px-3 py-1.5 transition-all
				{form.billingCycle === 'monthly'
									? ' bg-zinc-800 text-white'
									: ' text-zinc-400 hover:text-zinc-200'}"
							>
								Monthly
							</button>
							<button
								type="button"
								on:click={() => (form.billingCycle = 'yearly')}
								class="rounded-md px-3 py-1.5 transition-all
				{form.billingCycle === 'yearly' ? ' bg-zinc-800 text-white' : ' text-zinc-400 hover:text-zinc-200'}"
							>
								Yearly
								<span
									class="ml-1 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] text-green-300"
								>
									Save up to 20%
								</span>
							</button>
						</div>

						<!-- Three plans as columns styled like step 1 -->
						<div class="flex-c flex gap-3">
							{#each plans as plan}
								<div
									class="{plan.id === 'pro'
										? 'glow-btn'
										: 'bg-green-700/30 hover:bg-green-700/80'} flex w-full self-stretch rounded-xl py-0.5 transition-colors duration-300"
								>
									<div
										class="flex w-full flex-col items-stretch gap-4 rounded-xl bg-linear-to-t from-zinc-900 to-zinc-800 px-4 py-5 text-sm transition-all duration-200"
									>
										<!-- Content -->
										<div class="text- flex flex-1 flex-col gap-3">
											<div class="flex flex-col items-center gap-4">
												<div class="flex items-center gap-1 md:flex-col">
													<p class="text-xl font-medium text-white">{plan.name}</p>

													{#if plan.badge}
														<span
															class="rounded-full bg-zinc-900/60 px-2 py-0.5 text-[10px] text-zinc-200"
														>
															{plan.badge}
														</span>
													{/if}
												</div>

												{#if !plan.contactOnly}
													<div class="text-center text-xs text-zinc-200">
														<p class="text-base font-semibold text-white">
															{form.billingCycle === 'monthly'
																? plan.monthlyPrice
																: plan.yearlyPrice}
														</p>
														<p class="text-[11px] text-zinc-100/80">
															per month
															{#if form.billingCycle === 'yearly'}
																billed yearly
															{/if}
														</p>
													</div>
												{:else}
													<div class="text-center text-xs text-zinc-200">
														<p class="text-base font-semibold text-white">Let’s talk</p>
														<p class="text-[11px] text-zinc-100/80">Custom pricing</p>
													</div>
												{/if}
											</div>

											<p class="mt-1 text-xs text-zinc-100/80">{plan.description}</p>

											<ul class="mt-1 space-y-2 text-[11px] text-zinc-100/80">
												{#each plan.features as feature}
													<li class="flex gap-2"><Check class="h-3 w-3" /> {feature}</li>
												{/each}
											</ul>
										</div>

										<!-- Per-plan CTA button -->
										<button
											type="button"
											on:click={() => {
												form.planId = plan.id;
												console.log(form);
											}}
											class="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/90"
										>
											{plan.CTA}
										</button>
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-7 flex items-center justify-between">
							<button
								type="button"
								on:click={() => {
									step--;
								}}
								class="flex items-center gap-2 px-8 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
							>
								<ArrowLeft class="h-3.5 w-3.5" />
								Previous
							</button>
						</div>
					</section>
				{/if}
			</div>
		</div>
	</div>
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
</style>
