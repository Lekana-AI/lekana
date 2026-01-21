<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';
	import type { User } from 'svelte-clerk/server';

	let { data } = $props();

	const workflow = data?.workflow;

	let wName = $derived(workflow.name);
	const user: User = data?.user;

	import { onMount } from 'svelte';
	import {
		Activity,
		X,
		RefreshCcw,
		CornerRightUp,
		ChevronDown,
		ChevronRight,
		BookOpen,
		Play,
		CircleCheck,
		CircleAlert,
		Clock,
		Layers,
		RefreshCcwDot,
		FileText,
		ExternalLink,
		Loader2,
		Image,
		File,
		Workflow
	} from 'lucide-svelte';
	import { toast } from '$lib/toast.svelte';

	let executions = $state<any[]>([]);
	let loading = $state(true);
	let selectedExecutionId = $state<string | null>(null);
	let selectedStepId = $state<string | null>(null);
	let executionDetails = $state<Record<string, any>>({});
	let detailLoadingId = $state<string | null>(null);

	// New: Documents and Usage state
	interface Document {
		id: string;
		filename: string;
		size: number;
		sizeFormatted: string;
		mimeType: string;
		uploadedAt: string;
		workflowExecution?: {
			id: string;
			workflowName: string;
			status: string;
		};
	}

	let documents = $state<Document[]>([]);
	let documentsLoading = $state(false);

	let openingDocId = $state<string | null>(null);
	let showDocuments = $state(false);

	let selectedExecution = $derived(executions.find((e) => e.id === selectedExecutionId) || null);

	let selectedExecutionSteps = $derived(
		selectedExecutionId ? executionDetails[selectedExecutionId]?.nodeExecutions || [] : []
	);

	let selectedStep = $derived(
		selectedExecutionSteps.find((s: any) => s.id === selectedStepId) || null
	);

	// let filteredExecutions = $derived(executions.filter((e) => e.workflowId === workflow.id));
	let filteredExecutions = $derived(executions);

	let stats = $derived.by(() => {
		if (filteredExecutions.length === 0)
			return { total: 0, successRate: 0, avgDuration: 0, completed: 0, failed: 0 };

		const completed = filteredExecutions.filter((e) => e.status === 'COMPLETED').length;
		const total = filteredExecutions.length;
		const durations = filteredExecutions
			.filter((e) => e.completedAt && e.startedAt)
			.map((e) => new Date(e.completedAt).getTime() - new Date(e.startedAt).getTime());

		const avgDuration =
			durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

		return {
			total,
			completed,
			failed: total - completed,
			successRate: Math.round((completed / total) * 100),
			avgDuration: (avgDuration / 1000).toFixed(2)
		};
	});

	onMount(async () => {
		await Promise.all([loadExecutions(), loadDocuments()]);
	});

	async function loadExecutions() {
		loading = true;
		const id = selectedExecutionId;
			selectedExecutionId = null;
		try {
			const res = await fetch('/rime/executions?limit=50&offset=0');
			const data = await res.json();
			executions = data;
			if (id) {
				selectExecution(id)
			}
		} catch (e) {
			console.error('Failed to fetch executions:', e);
			toast.error('Failed to load executions. Please try again in a moment.');
		} finally {
			loading = false;
		}
	}

	async function loadDocuments() {
		documentsLoading = true;
		try {
			const res = await fetch(`/rime/documents/by-workflow-id/${workflow.id}`);
			if (res.ok) {
				const data = await res.json();
				documents = data.documents || [];
			}
		} catch (e) {
			console.error('Failed to fetch documents:', e);
		} finally {
			documentsLoading = false;
		}
	}

	async function openDocument(doc: Document) {
		openingDocId = doc.id;
		try {
			const res = await fetch(`/rime/documents/${doc.id}/url`);
			if (!res.ok) throw new Error('Failed to get document URL');
			const data = await res.json();
			window.open(data.url, '_blank');
		} catch (e: any) {
			console.error('Error opening document:', e);
			toast.error('Failed to open document. Please try again in a moment.');
		} finally {
			openingDocId = null;
		}
	}

	async function loadDetails(id: string) {
		if (executionDetails[id] || detailLoadingId === id) return;

		detailLoadingId = id;
		try {
			const res = await fetch(`/rime/executions/${id}`);
			const data = await res.json();
			executionDetails[id] = data;
		} catch (e) {
			console.error('Failed to fetch execution details:', e);
			toast.error('Failed to load execution details. Please try again in a moment.');
		} finally {
			detailLoadingId = null;
		}
	}

	function getDuration(execution: any) {
		if (!execution.startedAt || !execution.completedAt) return '0.00';
		const start = new Date(execution.startedAt).getTime();
		const end = new Date(execution.completedAt).getTime();
		return ((end - start) / 1000).toFixed(2);
	}

	async function selectExecution(id: string) {
		selectedExecutionId = id;
		selectedStepId = null;
		await loadDetails(id);
		// Select first step by default if available
		if (executionDetails[id]?.nodeExecutions?.length > 0) {
			selectedStepId = executionDetails[id].nodeExecutions[0].id;
		}
	}

	function selectStep(id: string) {
		selectedStepId = id;
	}
</script>

<svelte:head>
	<title>Monitor Workflow - {workflow.name}</title>
</svelte:head>

{#snippet CollapsibleJson(data: any)}
	<details class="group">
		<summary
			class="flex cursor-pointer list-none items-center gap-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
		>
			<ChevronRight class="h-3 w-3 transition-transform group-open:rotate-90" />
			<span>{Object.keys(data || {}).length} fields</span>
		</summary>
		<div class="mt-2 overflow-hidden rounded-xl border border-white/5 bg-black/20 p-4">
			<pre
				class="dark-scroll overflow-x-auto font-mono text-xs leading-relaxed text-zinc-400">{JSON.stringify(
					data,
					null,
					2
				)}</pre>
		</div>
	</details>
{/snippet}

{#snippet FileIconItem(mimeType: string)}
	{#if mimeType.includes('pdf')}
		<FileText class="h-4 w-4 text-red-400" />
	{:else if mimeType.includes('image')}
		<Image class="h-4 w-4 text-purple-400" />
	{:else}
		<File class="h-4 w-4 text-zinc-500" />
	{/if}
{/snippet}

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	<SidePanel
		activeWorkflow={workflow.id ?? ''}
		userName={user.firstName ?? 'User'}
		activeWorkflowName={wName}
	/>
	<div class="relative h-screen w-full overflow-clip bg-zinc-950 p-2">
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<section class="z-10 flex h-full w-full flex-col gap-2 py-1">
			<!-- Header -->
			<div class="z-10 flex w-full items-center justify-between gap-6">
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1 rounded-lg px-2 py-1 text-zinc-400">
						<Activity class="h-4 w-4 text-green-400" />
						<!-- <span class="text-[10px] font-bold tracking-widest uppercase">Monitor</span> -->
					</div>
					<!-- <div class="h-4 w-px bg-white/10"></div> -->
					<div class="flex min-w-[200px] flex-col rounded-lg">
						<span class="text-md truncate font-semibold text-zinc-300">
							{workflow.name}
						</span>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<a
						href="/docs"
						target="_blank"
						class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
					>
						<BookOpen class="h-3.5 w-3.5" />
						<span>Docs</span>
					</a>
					{#if workflow.isPublished}
						<a
							href="run"
							target="_blank"
							class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
						>
							<Play class="h-3.5 w-3.5 text-white" />
							<span>Run</span>
						</a>
					{/if}
					<a
						href="/docs"
						target="_blank"
						class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
					>
						<CornerRightUp class="h-3.5 w-3.5" />
						<span>Editor</span>
					</a>
				</div>
			</div>

			<!-- Main Content -->
			{#if workflow.isPublished}
				<div class="flex h-[calc(100%-48px)] w-full overflow-hidden">
					<!-- Left Panel: Execution List -->
					<div class="flex w-[380px] flex-col border-r border-white/5 bg-zinc-950/50">
						<!-- Stats Overview -->
						<div class="border-b border-white/5 p-4">
							<div class="grid grid-cols-3 gap-2">
								<div class="rounded-lg bg-white/2 p-2 text-center">
									<p class="text-xs font-bold text-zinc-500 uppercase">Runs</p>
									<p class="text-base font-bold text-white">{stats.total}</p>
								</div>
								<div class="rounded-lg bg-white/2 p-2 text-center">
									<p class="text-xs font-bold text-zinc-500 uppercase">Success</p>
									<p class="text-base font-bold text-green-400">{stats.successRate}%</p>
								</div>
								<div class="rounded-lg bg-white/2 p-2 text-center">
									<p class="text-xs font-bold text-zinc-500 uppercase">Avg</p>
									<p class="text-base font-bold text-white">{stats.avgDuration}s</p>
								</div>
							</div>

							<!-- User Usage Stats -->
						</div>

						<!-- Execution Log Header -->
						<div
							class="sticky top-0 z-10 flex items-center justify-between bg-zinc-950/80 px-4 py-3"
						>
						<div class="flex items-center gap-2">
							<Workflow class="h-3.5 w-3.5 text-zinc-500" />
							<h3 class="rounded-lg text-xs font-bold tracking-widest text-zinc-500 uppercase">
								Execution Log
							</h3>
							</div>
							<button
								onclick={() => {
									(loadExecutions(), loadDocuments());
								}}
								class="text-zinc-500 transition-colors hover:text-white"
							>
								<RefreshCcw class="h-3 w-3 {loading ? 'animate-spin' : ''}" />
							</button>
						</div>

						<!-- Scrollable List -->
						<div class="dark-scroll z-10 flex-1 space-y-1 overflow-y-auto p-2">
							{#if loading}
								{#each Array(8) as _}
									<div class="animate-pulse rounded-lg border border-white/5 bg-white/2 p-3">
										<div class="mb-2 flex items-center justify-between">
											<div class="h-2 w-24 rounded bg-white/10"></div>
											<div class="h-2 w-8 rounded bg-white/10"></div>
										</div>
										<div class="h-2 w-16 rounded bg-white/5"></div>
									</div>
								{/each}
							{:else if filteredExecutions.length === 0}
								<div class="flex h-40 flex-col items-center justify-center gap-2 text-zinc-600">
									<Activity class="h-8 w-8 opacity-20" />
									<p class="text-xs font-bold uppercase">No Logs Found</p>
								</div>
							{:else}
								{#each filteredExecutions as execution}
									<button
										onclick={() => selectExecution(execution.id)}
										class="group w-full rounded-lg border p-3 text-left transition-all {selectedExecutionId ===
										execution.id
											? 'border-green-500/30 bg-green-500/5 '
											: 'border-white/5 hover:bg-white/5'}"
									>
										<div class="mb-1 flex items-center justify-between">
											<div class="flex items-center gap-2">
												<div
													class="h-1.5 w-1.5 rounded-full {execution.status === 'COMPLETED'
														? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
														: 'bg-red-500'}"
												></div>
												<span
													class="font-mono text-xs font-bold {selectedExecutionId === execution.id
														? 'text-white'
														: 'text-zinc-400 group-hover:text-zinc-300'}"
												>
													{new Date(execution.startedAt).toLocaleTimeString()}
												</span>
											</div>
											<span class="text-xs font-bold text-zinc-500">{getDuration(execution)}s</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="max-w-[150px] truncate font-mono text-xs text-zinc-600"
												>{execution.id.slice(0, 8)}...</span
											>
											<ChevronRight
												class="h-3 w-3 text-zinc-700 transition-transform {selectedExecutionId ===
												execution.id
													? 'translate-x-0.5 text-green-500'
													: 'group-hover:translate-x-0.5'}"
											/>
										</div>
									</button>
								{/each}
							{/if}
						</div>

						<!-- Documents Section -->
						<div class="border-t border-white/5">
							<button
								type="button"
								onclick={() => (showDocuments = !showDocuments)}
								class="relative z-20 flex w-full cursor-pointer items-center justify-between rounded-lg bg-zinc-950/80 px-4 py-3 hover:bg-zinc-900/80"
							>
								<div class="flex items-center gap-2">
									<FileText class="h-3.5 w-3.5 text-zinc-500" />
									<h3 class="text-xs font-bold tracking-widest text-zinc-500 uppercase">
										Documents
									</h3>
									<span
										class="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-400"
									>
										{documents.length}
									</span>
								</div>
								<ChevronDown
									class="h-3 w-3 text-zinc-500 transition-transform {showDocuments
										? 'rotate-180'
										: ''}"
								/>
							</button>

							{#if showDocuments}
								<div class="dark-scroll max-h-48 space-y-1 overflow-y-auto p-2">
									{#if documentsLoading}
										{#each Array(2) as _}
											<div class="animate-pulse rounded-lg bg-white/2 p-2.5 py-4">
												<div class="h-3 w-24 rounded bg-white/10"></div>
											</div>
										{/each}
									{:else if documents.length === 0}
										<div class="flex flex-col items-center justify-center gap-2 py-6 text-zinc-600">
											<FileText class="h-6 w-6 opacity-20" />
											<p class="text-[10px] font-bold uppercase">No Documents</p>
										</div>
									{:else}
										{#each documents as doc}
											<div
												class="flex items-center justify-between rounded-lg bg-white/2 p-2.5 transition-colors hover:bg-white/5"
											>
												<div class="flex min-w-0 flex-1 items-center gap-2">
													<span class="shrink-0 text-sm">{@render FileIconItem(doc.mimeType)}</span>
													<div class="min-w-0 flex-1">
														<p class="truncate text-xs font-medium text-zinc-300">{doc.filename}</p>
														<p class="text-[10px] text-zinc-600">{doc.sizeFormatted}</p>
													</div>
												</div>
												<button
													type="button"
													onclick={(e) => {
														e.stopPropagation();
														openDocument(doc);
													}}
													disabled={openingDocId === doc.id}
													class="relative z-30 ml-2 shrink-0 cursor-pointer rounded-md px-2 py-1.5 text-zinc-200 transition-all hover:text-green-400 disabled:opacity-50"
												>
													{#if openingDocId === doc.id}
														<Loader2 class="h-3 w-3 animate-spin" />
													{:else}
														<ExternalLink class="h-3 w-3" />
													{/if}
												</button>
											</div>
										{/each}
									{/if}
								</div>
							{/if}
						</div>
					</div>

					<!-- Right Panel: Execution Details -->
					<div class="z-10 flex flex-1 flex-col overflow-hidden bg-zinc-950/30">
						{#if !selectedExecutionId}
							<div class="flex flex-1 flex-col items-center justify-center gap-4 text-zinc-700">
								<div class="rounded-full border border-dashed border-white/5 bg-white/2 p-6">
									<Layers class="h-12 w-12 opacity-20" />
								</div>
								<div class="text-center">
									<p class="text-sm font-bold tracking-widest text-zinc-500 uppercase">
										Select an execution
									</p>
									<p class="mt-1 text-xs text-zinc-600">
										Select a run from the list to view detailed steps and logs
									</p>
								</div>
							</div>
						{:else}
							{@const execution = selectedExecution}
							{@const details = executionDetails[selectedExecutionId]}

							<!-- Detail Panel Header -->
							<div class="border-b border-white/5 bg-zinc-900/50 p-4">
								<div class="mb-4 flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
										>
											<Activity
												class="h-5 w-5 {execution.status === 'COMPLETED'
													? 'text-green-400'
													: 'text-red-400'}"
											/>
										</div>
										<div>
											<h2 class="flex items-center gap-2 text-base font-bold text-white">
												Execution {execution.id.slice(0, 8)}
												{#if execution.status === 'COMPLETED'}
													<CircleCheck class="h-4 w-4 text-green-500" />
												{:else}
													<CircleAlert class="h-4 w-4 text-red-500" />
												{/if}
											</h2>
											<p class="font-mono text-xs text-zinc-500">{execution.id}</p>
										</div>
									</div>
									<div class="flex items-center gap-4">
										<div class="text-right">
											<p class="text-[10px] font-bold text-zinc-600 uppercase">Started At</p>
											<p class="text-xs font-medium text-white">
												{new Date(execution.startedAt).toLocaleString()}
											</p>
										</div>
										<div class="h-8 w-px bg-white/5"></div>
										<div class="text-right">
											<p class="text-[10px] font-bold text-zinc-600 uppercase">Duration</p>
											<p class="text-xs font-bold text-green-400">{getDuration(execution)}s</p>
										</div>
									</div>
								</div>

								<!-- Input Documents Mini-view -->
								{#if details?.inputData?.documents?.length > 0}
									<div class="flex flex-wrap gap-2 px-4 pb-4">
										{#each details.inputData.documents as doc}
											<div
												class="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5"
											>
												<BookOpen class="h-3.5 w-3.5 text-zinc-400" />
												<span class="max-w-[120px] truncate text-xs text-zinc-300"
													>{doc.filename}</span
												>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Details Split: Steps & Step Info -->
							<div class="flex flex-1 overflow-hidden">
								<!-- Steps Timeline -->
								<div
									class="flex w-80 flex-col overflow-hidden border-r border-white/5 bg-zinc-900/20"
								>
									<div class="border-b border-white/5 bg-zinc-900/40 px-4 py-3">
										<h3 class="text-xs font-bold tracking-widest text-zinc-500 uppercase">
											Process Steps
										</h3>
									</div>
									<div class="dark-scroll flex-1 space-y-2 overflow-y-auto p-3">
										{#if detailLoadingId === selectedExecutionId}
											{#each Array(4) as _}
												<div class="flex animate-pulse items-start gap-3 p-3">
													<div class="h-6 w-6 shrink-0 rounded-full bg-white/5"></div>
													<div class="flex-1 space-y-2">
														<div class="h-2 w-20 rounded bg-white/10"></div>
														<div class="h-2 w-12 rounded bg-white/5"></div>
													</div>
												</div>
											{/each}
										{:else}
											{#each selectedExecutionSteps as step}
												<button
													onclick={() => selectStep(step.id)}
													class="group flex w-full items-start gap-3 rounded-xl border p-3 transition-all {selectedStepId ===
													step.id
														? 'border-white/10 bg-white/5 shadow-lg'
														: 'border-transparent hover:border-white/5 hover:bg-white/2'}"
												>
													<div class="flex flex-col items-center">
														<div
															class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xs font-bold transition-colors {step.status ===
															'COMPLETED'
																? 'text-green-400 group-hover:text-green-300'
																: 'text-red-400'} {selectedStepId === step.id
																? 'border-green-500/50'
																: ''}"
														>
															{step.executionOrder + 1}
														</div>
														{#if step.executionOrder < selectedExecutionSteps.length - 1}
															<div class="my-1 w-px flex-1 bg-white/10"></div>
														{/if}
													</div>
													<div class="min-w-0 flex-1 text-left">
														<div class="flex items-center justify-between gap-2">
															<span
																class="truncate text-xs font-bold {selectedStepId === step.id
																	? 'text-white'
																	: 'text-zinc-400 group-hover:text-zinc-200'}"
															>
																{step.actionName}
															</span>
															{#if step.status !== 'COMPLETED'}
																<CircleAlert class="h-3 w-3 text-red-500" />
															{/if}
														</div>
														<div class="mt-0.5 flex items-center gap-2">
															<Clock class="h-3 w-3 text-zinc-600" />
															<span class="text-xs text-zinc-600">
																{(
																	(new Date(step.completedAt).getTime() -
																		new Date(step.startedAt).getTime()) /
																	1000
																).toFixed(2)}s
															</span>
														</div>
													</div>
												</button>
											{/each}
										{/if}
									</div>
								</div>

								<!-- Step Detailed Data -->
								<div class="dark-scroll flex-1 overflow-y-auto bg-zinc-950/20 p-6">
									{#if !selectedStepId}
										<div
											class="flex h-full flex-col items-center justify-center gap-3 text-zinc-700 opacity-50 grayscale"
										>
											<ChevronRight class="h-10 w-10 opacity-10" />
											<p class="text-xs font-bold tracking-widest uppercase">
												Select a step for details
											</p>
										</div>
									{:else if detailLoadingId === selectedExecutionId}
										<div class="h-full animate-pulse space-y-6">
											<div class="h-10 w-48 rounded bg-white/5"></div>
											<div class="grid grid-cols-2 gap-4">
												<div class="h-40 rounded-xl bg-white/5"></div>
												<div class="h-40 rounded-xl bg-white/5"></div>
											</div>
										</div>
									{:else}
										{@const step = selectedStep}
										<div class="mx-auto max-w-3xl space-y-6">
											<!-- Action Specific Display (e.g. OCR) -->
											{#if step.actionName === 'OCR' && step.output?.data?.documents}
												<div class="space-y-3">
													<h3 class="text-xs font-bold tracking-widest text-zinc-500 uppercase">
														Extracted Content
													</h3>
													<div class="grid grid-cols-1 gap-3">
														{#each step.output.data.documents as doc}
															<div class="rounded-xl border border-white/5 bg-white/2 p-4">
																<div
																	class="mb-3 flex items-center justify-between border-b border-white/5 pb-2"
																>
																	<span class="text-xs font-bold text-zinc-400 uppercase"
																		>Document Result: {doc.result?.documentType || 'General'}</span
																	>
																</div>
																<p class="text-sm leading-relaxed text-zinc-300 italic">
																	"{doc.result?.text}"
																</p>
																{#if doc.result?.sections?.length > 0}
																	<div class="mt-4 flex flex-wrap gap-1.5">
																		{#each doc.result.sections as section}
																			<span
																				class="rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-[10px] font-medium text-zinc-400"
																			>
																				{section.heading}
																			</span>
																		{/each}
																	</div>
																{/if}
															</div>
														{/each}
													</div>
												</div>
											{/if}

											<!-- Step Banner -->
											<div class="flex items-center justify-between">
												<div>
													<div class="mb-1 flex items-center gap-2">
														<span
															class="rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase {step.status ===
															'COMPLETED'
																? 'bg-green-500/10 text-green-400'
																: 'bg-red-500/10 text-red-400'}"
														>
															{step.status}
														</span>
														<span class="text-xs text-zinc-600">Step {step.executionOrder + 1}</span
														>
													</div>
													<h1 class="text-3xl font-bold tracking-tight text-white">
														{step.actionName}
													</h1>
													<p class="mt-1 text-sm text-zinc-500">{step.stepName}</p>
												</div>
												<div class="flex flex-col items-end gap-1">
													<span class="text-[10px] font-bold text-zinc-600 uppercase"
														>Time Taken</span
													>
													<span class="font-mono text-2xl font-bold text-white">
														{(
															(new Date(step.completedAt).getTime() -
																new Date(step.startedAt).getTime()) /
															1000
														).toFixed(2)}s
													</span>
												</div>
											</div>

											<div class="grid grid-cols-1 gap-4">
												<!-- Input Section -->
												<div class="space-y-3">
													<h3
														class="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase"
													>
														<CornerRightUp class="h-4 w-4 rotate-90" />
														Input Data
													</h3>
													{@render CollapsibleJson(step.input?.data || step.input || {})}
												</div>

												<!-- Output Section -->
												<div class="space-y-3">
													<h3
														class="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase"
													>
														<CornerRightUp class="h-4 w-4" />
														Output Results
													</h3>
													{@render CollapsibleJson(
														step.output?.data || step.output || step.error || {}
													)}
												</div>
											</div>

											<!-- Errors section if any -->
											{#if step.status !== 'COMPLETED' || step.error}
												<div class="space-y-3">
													<h3
														class="flex items-center gap-2 text-xs font-bold tracking-widest text-red-400 uppercase"
													>
														<CircleAlert class="h-4 w-4" />
														Error Details
													</h3>
													<div class="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
														<p class="mb-2 text-sm font-bold text-red-500">
															{step.error?.message || 'Execution Failed'}
														</p>
														<pre
															class="dark-scroll overflow-x-auto font-mono text-xs tracking-tight text-red-400/80">{JSON.stringify(
																step.error || {},
																null,
																2
															)}</pre>
													</div>
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="flex h-[calc(100%-48px)] w-full flex-col items-center justify-center gap-6">
					<div
						class="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
					>
						<Activity class="h-10 w-10 text-zinc-500 opacity-20" />
					</div>
					<div class="space-y-2 text-center">
						<h3 class="text-xl font-bold tracking-tight text-white/90">Monitoring Not Available</h3>
						<p class="text-sm font-medium text-zinc-500">
							Publish workflow first to monitor executions
						</p>
					</div>
				</div>
			{/if}
		</section>
	</div>
</main>

<style>
	.dark-scroll {
		scrollbar-width: thin;
		scrollbar-color: #3f3f46 transparent;
	}
	.dark-scroll::-webkit-scrollbar {
		width: 4px;
	}
	.dark-scroll::-webkit-scrollbar-track {
		background: transparent;
	}
	.dark-scroll::-webkit-scrollbar-thumb {
		background: #3f3f46;
		border-radius: 10px;
	}
</style>
