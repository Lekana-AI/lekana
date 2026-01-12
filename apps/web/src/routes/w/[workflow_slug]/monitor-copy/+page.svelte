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
		BookOpen,
		Play
	} from 'lucide-svelte';

	let executions = $state<any[]>([]);
	let loading = $state(true);
	let expandedId = $state<string | null>(null);
	let executionDetails = $state<Record<string, any>>({});
	let detailLoadingId = $state<string | null>(null);

	let filteredExecutions = $derived(executions.filter((e) => e.workflowId === workflow.id));
	// let filteredExecutions = $derived(executions);

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
		try {
			const res = await fetch('/rime/executions?limit=50&offset=0');
			const data = await res.json();
			executions = data;
		} catch (e) {
			console.error('Failed to fetch executions:', e);
		} finally {
			loading = false;
		}
	});

	async function loadDetails(id: string) {
		if (executionDetails[id] || detailLoadingId === id) return;

		detailLoadingId = id;
		try {
			const res = await fetch(`/rime/executions/${id}`);
			const data = await res.json();
			executionDetails[id] = data;
		} catch (e) {
			console.error('Failed to fetch execution details:', e);
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

	function toggleExpand(id: string) {
		if (expandedId === id) {
			expandedId = null;
		} else {
			expandedId = id;
			loadDetails(id);
		}
	}

	function getStepSummary(step: any) {
		if (step.status !== 'COMPLETED') {
			return step.error?.message || step.error || 'Failed';
		}

		// Surface nested errors
		if (step.input?.success === false) {
			return step.input.error?.message || step.input.error || 'Input Error';
		}
		if (step.output?.success === false) {
			return step.output.error?.message || step.output.error || 'Output Error';
		}

		const actionName = step.actionName?.toLowerCase() || '';

		if (actionName.includes('classification')) {
			const classification = step.output?.data?.classifications?.[0];
			if (classification) {
				return `${classification.label} (${Math.round(classification.confidence * 100)}%)`;
			}
		}

		if (actionName.includes('ocr')) {
			const doc = step.output?.data?.documents?.[0];
			if (doc?.result?.documentType) {
				return `Extracted ${doc.result.documentType}`;
			}
			return 'OCR Complete';
		}

		if (actionName.includes('upload')) {
			const files = step.output?.data?.uploadedFiles || [];
			if (files.length > 0) {
				return `Uploaded ${files.length} file${files.length > 1 ? 's' : ''}`;
			}
		}

		if (step.output?.data?.summary) {
			const s = step.output.data.summary;
			if (s.processedDocuments) return `Processed ${s.processedDocuments} docs`;
		}

		return 'Success';
	}
</script>

<svelte:head>
	<title>Monitor Workflow - {workflow.name}</title>
</svelte:head>

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
		<section class="z-10 flex h-full w-full flex-col gap-2">
			<!-- Header -->
			<div class="z-10 flex w-full items-center justify-between gap-6 py-1">
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1 rounded-lg px-2 py-1 text-zinc-400">
						<Activity class="h-4 w-4 text-green-400" />
						<!-- <span class="text-[10px] font-bold tracking-widest uppercase">Monitor</span> -->
					</div>
					<!-- <div class="h-4 w-px bg-white/10"></div> -->
					<div class="flex min-w-[200px] flex-col rounded-lg">
						<span class="truncate font-semibold text-zinc-300">
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

					<a
						href="/w/{workflow.id}/run"
						target="_blank"
						class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
					>
						<Play class="h-3.5 w-3.5" />
						<span>Run</span>
					</a>

					<a
						href="/w/{workflow.id}"
						class="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
					>
						<CornerRightUp class="h-3.5 w-3.5" />
						<span>Editor</span>
					</a>
				</div>
			</div>

			<!-- Main Content -->
			<div class="flex h-full w-full flex-col overflow-hidden px-2">
				<div class="dark-scroll relative flex h-full flex-col w-[80%] mx-auto">
					<!-- Stats and Log Label -->
					<div class="sticky top-0 z-20 bg-zinc-950 pb-4">
						<!-- Stats Grid -->
						<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
							<div
								class="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/2 p-4 transition-colors hover:border-white/10"
							>
								<p class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
									Total Runs
								</p>
								<p class="text-2xl leading-none font-bold text-white">{stats.total}</p>
							</div>
							<div
								class="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/2 p-4 transition-colors hover:border-white/10"
							>
								<p class="text-[10px] font-bold tracking-wider text-green-400 uppercase">
									Success Rate
								</p>
								<p class="text-2xl leading-none font-bold text-white">{stats.successRate}%</p>
							</div>
							<div
								class="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/2 p-4 transition-colors hover:border-white/10"
							>
								<p class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
									Avg Duration
								</p>
								<p class="text-2xl leading-none font-bold text-white">{stats.avgDuration}s</p>
							</div>
						</div>

						<div class="flex items-center justify-between border-b border-white/5 pb-2">
							<h3 class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
								Execution Log
							</h3>
						</div>
					</div>

					<!-- Scrollable Log Content -->
					<div class="flex-1 space-y-2 overflow-y-auto pr-1 pb-6">
						{#if loading}
							<div class="space-y-4">
								{#each Array(5) as _}
									<div class="animate-pulse rounded-xl border border-white/5 bg-white/2 p-4">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-3">
												<div class="h-2 w-2 rounded-full bg-white/10"></div>
												<div class="space-y-2">
													<div class="h-2 w-32 rounded bg-white/10"></div>
													<div class="h-2 w-20 rounded bg-white/5"></div>
												</div>
											</div>
											<div class="flex flex-col items-end gap-2">
												<div class="h-2 w-12 rounded bg-white/10"></div>
												<div class="h-2 w-8 rounded bg-white/5"></div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else if filteredExecutions.length === 0}
							<div
								class="flex h-40 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/5 bg-white/2"
							>
								<p class="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
									No Logs Found
								</p>
							</div>
						{:else}
							{#each filteredExecutions as execution}
								{@const isExpanded = expandedId === execution.id}
								<div
									class="rounded-xl border border-white/5 bg-zinc-900 transition-all {isExpanded
										? 'border-white/10 bg-zinc-900'
										: 'hover:bg-zinc-800'}"
								>
									<button
										onclick={() => toggleExpand(execution.id)}
										class="flex w-full items-center justify-between px-4 py-3 text-left"
									>
										<div class="flex items-center gap-3">
											<div
												class="h-1.5 w-1.5 rounded-full {execution.status === 'COMPLETED'
													? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
													: 'bg-red-500'}"
											></div>
											<div class="flex flex-col">
												<span class="font-mono text-[10px] font-bold text-white opacity-80"
													>{new Date(execution.startedAt).toLocaleString()}</span
												>
												<!-- <span class="text-[9px] text-zinc-500"
												>{new Date(execution.createdAt).toLocaleTimeString()}</span
											> -->
											</div>
										</div>
										<div class="flex items-center gap-4">
											<div class="flex flex-col items-end">
												<span class="text-[10px] font-bold text-white"
													>{getDuration(execution)}s</span
												>
												<span class="text-[9px] text-zinc-600"
													>{execution._count.nodeExecutions} actions</span
												>
											</div>
											<ChevronDown
												class="h-3.5 w-3.5 text-zinc-700 transition-transform {isExpanded
													? 'rotate-180 text-white'
													: ''}"
											/>
										</div>
									</button>

									{#if isExpanded}
										{@const details = executionDetails[execution.id]}
										<div class="px-4 pt-1 pb-4">
											<div class="flex flex-col gap-6">
												<!-- Summary Info -->
												<div
													class="grid grid-cols-2 gap-3 rounded-lg border border-white/5 bg-black/20 p-3 md:grid-cols-4"
												>
													<div class="space-y-1">
														<p class="text-[8px] font-bold text-zinc-500 uppercase">Status</p>
														<div class="flex items-center gap-1.5">
															<div
																class="h-1 w-1 rounded-full {(details || execution).status ===
																'COMPLETED'
																	? 'bg-green-500'
																	: 'bg-red-500'}"
															></div>
															<p
																class="text-[10px] font-bold {(details || execution).status ===
																'COMPLETED'
																	? 'text-green-400'
																	: 'text-red-400'}"
															>
																{(details || execution).status}
															</p>
														</div>
													</div>
													<div class="space-y-1">
														<p class="text-[8px] font-bold text-zinc-500 uppercase">Duration</p>
														<p class="text-[10px] font-medium text-zinc-300">
															{getDuration(details || execution)}s
														</p>
													</div>
													<div class="space-y-1">
														<p class="text-[8px] font-bold text-zinc-500 uppercase">Started</p>
														<p class="text-[10px] font-medium text-zinc-400">
															{new Date((details || execution).startedAt).toLocaleTimeString()}
														</p>
													</div>
													<div class="space-y-1">
														<p class="text-[8px] font-bold text-zinc-500 uppercase">Completed</p>
														<p class="text-[10px] font-medium text-zinc-400">
															{(details || execution).completedAt
																? new Date((details || execution).completedAt).toLocaleTimeString()
																: '—'}
														</p>
													</div>
												</div>

												{#if detailLoadingId === execution.id}
													<!-- Skeleton Loader for Steps -->
													<div class="animate-pulse space-y-4 pt-2">
														<div class="h-4 w-20 rounded bg-white/5"></div>
														<div class="space-y-2">
															{#each Array(3) as _}
																<div class="h-10 w-full rounded bg-white/5"></div>
															{/each}
														</div>
													</div>
												{:else if details}
													<!-- Input Data -->
													{#if details.inputData?.documents?.length > 0}
														<div class="space-y-2">
															<p
																class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
															>
																Input Documents
															</p>
															<div class="flex flex-wrap gap-2">
																{#each details.inputData.documents as doc}
																	<a
																		href={doc.url}
																		target="_blank"
																		class="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/2 p-2 transition-all hover:bg-white/5"
																	>
																		<div
																			class="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-zinc-400"
																		>
																			{#if doc.mimeType?.includes('image')}
																				<Activity class="h-4 w-4" />
																			{:else}
																				<BookOpen class="h-4 w-4" />
																			{/if}
																		</div>
																		<div class="flex flex-col">
																			<span
																				class="max-w-[150px] truncate text-[10px] font-medium text-zinc-300"
																			>
																				{doc.filename}
																			</span>
																			<span class="text-[8px] text-zinc-600 uppercase">
																				{doc.mimeType?.split('/')[1] || 'Unknown'}
																			</span>
																		</div>
																	</a>
																{/each}
															</div>
														</div>
													{/if}

													<!-- Step Timeline -->
													<div class="space-y-3">
														<p
															class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
														>
															Execution Timeline
														</p>
														<div class="space-y-2">
															{#each details.nodeExecutions as step}
																{@const hasNestedError =
																	step.input?.success === false || step.output?.success === false}
																<div
																	class="rounded-xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/4"
																>
																	<div class="flex items-start justify-between">
																		<div class="flex gap-4">
																			<div class="flex flex-col items-center pt-1">
																				<div
																					class="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[10px] font-bold {step.status ===
																					'COMPLETED'
																						? 'text-green-400'
																						: 'text-red-400'}"
																				>
																					{step.executionOrder + 1}
																				</div>
																			</div>
																			<div class="flex flex-col gap-1">
																				<div class="flex items-center gap-2">
																					<h4 class="text-xs font-bold text-white">
																						{step.actionName}
																					</h4>
																					{#if step.status !== 'COMPLETED'}
																						<span
																							class="rounded-full bg-red-400/10 px-1.5 py-0.5 text-[8px] font-bold text-red-400 uppercase"
																						>
																							Failed
																						</span>
																					{/if}
																				</div>
																				<p class="text-[10px] text-zinc-500">
																					{step.stepName} • {(
																						(new Date(step.completedAt).getTime() -
																							new Date(step.startedAt).getTime()) /
																						1000
																					).toFixed(2)}s
																				</p>
																			</div>
																		</div>
																		<div class="flex items-center gap-2">
																			<div class="flex flex-col items-end gap-1">
																				<span
																					class="text-[10px] font-medium {step.status ===
																						'COMPLETED' && !hasNestedError
																						? 'text-zinc-300'
																						: 'text-red-400/80'}"
																				>
																					{getStepSummary(step)}
																				</span>
																			</div>
																		</div>
																	</div>

																	<!-- Detailed Data for Specific Actions -->
																	{#if step.actionName === 'OCR' && step.output?.data?.documents}
																		<div class="mt-3 space-y-2 border-t border-white/5 pt-3">
																			{#each step.output.data.documents as doc}
																				<div class="rounded-lg bg-black/40 p-3">
																					<div class="mb-2 flex items-center justify-between">
																						<span
																							class="text-[9px] font-bold text-zinc-500 uppercase"
																						>
																							OCR RESULT: {doc.result?.documentType || 'General'}
																						</span>
																					</div>
																					<p class="line-clamp-2 text-[10px] text-zinc-400 italic">
																						"{doc.result?.text}"
																					</p>
																					{#if doc.result?.sections?.length > 0}
																						<div class="mt-2 flex flex-wrap gap-1">
																							{#each doc.result.sections as section}
																								<span
																									class="rounded bg-white/5 px-1.5 py-0.5 text-[8px] text-zinc-400"
																								>
																									{section.heading}
																								</span>
																							{/each}
																						</div>
																					{/if}
																				</div>
																			{/each}
																		</div>
																	{/if}
																</div>
															{/each}
														</div>
													</div>

													<div
														class="flex items-center justify-between rounded-lg border border-white/5 bg-black/10 px-3 py-2"
													>
														<div class="flex flex-col gap-0.5">
															<p class="text-[8px] font-bold text-zinc-600 uppercase">
																Execution ID
															</p>
															<p class="font-mono text-[9px] text-zinc-600">{execution.id}</p>
														</div>
														<button
															onclick={() => console.log(details)}
															class="flex items-center gap-1 text-[8px] font-bold text-zinc-500 transition-colors hover:text-white"
														>
															<RefreshCcw class="h-2 w-2" />
															Debug Response
														</button>
													</div>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
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
