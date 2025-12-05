<script lang="ts">
	import {
		ChevronLeft,
		ChevronRight,
		Search,
		UploadCloud,
		ListChecks,
		Grid3x3,
		ScanText,
		ShieldCheck,
		CopyCheck,
		UserCheck,
		Database,
		Share2,
		Webhook,
		Mail,
		FileSpreadsheet,
		FileText,
		FileOutput,
		Calculator,
		Sparkles,
		Bot,
		ArrowRightToLine,
		Plus,
		ArrowUp,
		LayoutGrid
	} from 'lucide-svelte';

	let collapsed = false;
	let activeTab: 'actions' | 'assistant' = 'actions';

	let prompt = '';

	type IconComponent = typeof UploadCloud;

	const actionSections: {
		title: string;
		items: { label: string; icon: IconComponent }[];
	}[] = [
		{
			title: 'Input & Pre-Processing',
			items: [
				{ label: 'Upload files', icon: UploadCloud },
				{ label: 'Classification', icon: ListChecks },
				{ label: 'Segmentation', icon: Grid3x3 },
				{ label: 'OCR', icon: ScanText }
			]
		},
		{
			title: 'Data Quality & Validation',
			items: [
				{ label: 'Validation', icon: ShieldCheck },
				{ label: 'De-duplication', icon: CopyCheck }
			]
		},
		{
			title: 'Human Review',
			items: [
				{ label: 'Human Review OCR', icon: UserCheck },
				{ label: 'Human Review Classification', icon: UserCheck },
				{ label: 'Human Review Segments', icon: UserCheck }
			]
		},
		{
			title: 'Storage & Integrations',
			items: [
				{ label: 'Database', icon: Database },
				{ label: 'Export to ERP, CRM, DMS', icon: Share2 },
				{ label: 'Webhook / API', icon: Webhook },
				{ label: 'Email Notification / API', icon: Mail },
				{ label: 'Google Sheets', icon: FileSpreadsheet }
			]
		},
		{
			title: 'Understanding & Structuring',
			items: [
				{ label: 'Summarization', icon: FileText },
				{ label: 'Generate Document', icon: FileOutput }
			]
		},
		{
			title: 'Logic & Computation',
			items: [{ label: 'Arithmetic Operations', icon: Calculator }]
		}
	];

	const assistantQuickActions = [
		'Summarize Documents',
		'Validate field data',
		'Extract data into Spreadsheet'
	];
</script>

<!-- Expanded state -->
<div
	class="inline-flex {collapsed
		? 'absolute right-0 z-20 mr-4 h-fit'
		: 'h-full'} w-fit flex-col items-start justify-start overflow-clip rounded-lg bg-white/10 backdrop-blur-[20px] transition-all duration-500"
>
	<!-- Top bar with collapse button -->
	<div class="inline-flex w-full items-center justify-end gap-4 p-2">
		<button
			type="button"
			class="flex items-center justify-center rounded-md bg-white/0 p-2 transition-colors duration-300 hover:bg-white/10"
			on:click={() => (collapsed = !collapsed)}
			aria-label="Collapse panel"
		>
			{#if collapsed}
				<LayoutGrid class="h-4 w-4 text-white" />
			{:else}
				<ArrowRightToLine class="h-4 w-4 text-white" />
			{/if}
		</button>
	</div>
	{#if !collapsed}
		<!-- Main content -->
		<div class="flex h-full w-full flex-col items-start justify-start gap-3">
			<!-- Tabs -->
			<div class="inline-flex w-full items-center justify-start gap-2.5 px-4 pb-1">
				<button
					type="button"
					class={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition ${
						activeTab === 'actions'
							? 'border border-white/50 bg-white/10 text-white'
							: 'text-white/80 hover:text-white'
					}`}
					on:click={() => (activeTab = 'actions')}
				>
					<span>Actions</span>
				</button>

				<button
					type="button"
					class={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition ${
						activeTab === 'assistant'
							? 'border border-white/50 bg-white/10 text-white'
							: 'text-white/80 hover:text-white'
					}`}
					on:click={() => (activeTab = 'assistant')}
				>
					<span>Assistant</span>
				</button>
			</div>

			<!-- ACTIONS VIEW -->
			{#if activeTab === 'actions'}
				<!-- Search -->
				<div
					class="inline-flex w-full min-w-2xs items-center justify-between rounded border border-white/10 bg-white/0 px-4 py-1.5 text-xs text-white/50"
				>
					<input
						type="search"
						placeholder="Search"
						class="flex-1 bg-transparent text-xs text-white/70 outline-none placeholder:text-white/40"
					/>
					<Search class="h-3 w-3 text-white/60" />
				</div>

				<div
					class="dark-scroll mb-14 flex h-full w-full flex-col items-start justify-start gap-3 overflow-y-auto rounded-xl px-3"
				>
					{#each actionSections as section}
						<section class="flex w-full flex-col gap-2">
							<div class="inline-flex w-full items-center justify-between pt-1.5">
								<h2 class="text-xs font-semibold text-zinc-300">
									{section.title}
								</h2>
							</div>

							{#each section.items as item}
								<button
									type="button"
									class="border-white/50/50 inline-flex w-full items-center justify-start gap-4 rounded-lg border bg-white/5 px-3 py-2 backdrop-blur transition hover:bg-white/10"
								>
									<span
										class="flex items-center justify-center rounded-full bg-radial from-green-500 from-0% to-green-700 to-60% p-1.5"
									>
										<item.icon class="h-3 w-3 text-white" />
									</span>
									<span class="truncate text-xs leading-5 font-semibold text-zinc-300">
										{item.label}
									</span>
								</button>
							{/each}
						</section>
					{/each}
				</div>
			{:else}
				<!-- ASSISTANT VIEW -->
				<div
					class="flex w-full min-w-2xs flex-1 flex-col items-center justify-end gap-4 overflow-hidden rounded-xl bg-neutral-900"
				>
					<!-- Quick actions -->
					{#each assistantQuickActions as label}
						<button
							type="button"
							class="inline-flex items-center justify-center gap-1.5 rounded bg-stone-900 px-3 py-1 text-[10px] leading-5 text-white transition hover:bg-stone-800"
							on:click={(prompt = label)}
						>
							<Sparkles class="h-3 w-3" />
							<span>{label}</span>
						</button>
					{/each}

					<!-- Main assistant card -->
					<div class="glow-btn flex w-full rounded-t-2xl pt-0.5 shadow-lg">
						<div
							class="flex h-fit w-full flex-col items-start justify-between gap-2 rounded-t-2xl bg-neutral-950 px-3 py-4"
						>
							<textarea
								bind:value={prompt}
								rows="5"
								autocomplete="off"
								placeholder="Ask Lekana to create a workflow that ...."
								class="dark-scroll max-h-32 min-h-20 w-full resize-none p-1 text-xs text-white outline-none"
							></textarea>

							<div class="inline-flex items-center justify-between self-stretch">
								<button
									class="rounded-md bg-zinc-900 px-3 py-2 text-white transition-colors duration-300 hover:bg-green-950"
								>
									<Plus size="12" />
								</button>

								<button
									class="rounded-md bg-white px-3 py-2 text-black transition-colors duration-300 disabled:bg-zinc-400"
									disabled={!prompt}
								>
									<ArrowUp size="12" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

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
