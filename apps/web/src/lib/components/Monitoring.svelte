<script lang="ts">
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
	import { fade, fly } from 'svelte/transition';

	let { workflow, onClose, onPublish } = $props<{
		workflow: any;
		onClose: (v: boolean) => void;
		onPublish: () => void;
	}>();

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class="absolute inset-0 z-40 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-xs"
	onclick={onClose}
>
	<div
		class="z-10 flex h-full w-full max-w-6xl flex-col justify-center gap-8"
		onclick={(e) => e.stopPropagation()}
	>
		<div
			class="flex max-h-4/5 w-full flex-col overflow-hidden rounded-2xl bg-zinc-900 p-3 shadow-2xl"
		>
			<div class="dark-scroll relative flex h-full flex-col px-3">
				<!-- Header - Sticky -->
				<div class="sticky top-0 z-20 bg-zinc-900 pt-3 pb-4">
					<div class="mb-2 flex w-full justify-end">
						<button
							onclick={() => onClose?.(false)}
							class="p-2 text-white/60 transition-colors duration-300 hover:text-white/80"
						>
							<X class="h-4 w-4" />
						</button>
					</div>

					<div class="mb-6 flex w-full flex-col gap-2">
						<p class="text-xs font-semibold tracking-widest text-green-400 uppercase">Monitoring</p>
						<span class="flex items-center gap-2">
							<Activity class="h-8 w-8 text-white" />
							<h1 class="text-2xl font-semibold text-white md:text-3xl">
								{workflow.name}
							</h1>
						</span>
						<p class="mt-2 w-full text-sm text-zinc-300">
							Track and monitor real-time executions for this workflow version.
						</p>
					</div>

					<div class="mb-4 flex items-center gap-3">
						<a
							href="/docs"
							target="_blank"
							class="flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5 text-[10px] font-medium text-white transition-colors duration-300 hover:bg-zinc-700"
						>
							<BookOpen class="h-3 w-3" />
							Documentation
						</a>
						<button
							onclick={onPublish}
							class="flex items-center gap-2 rounded-md bg-green-700/80 px-3 py-1.5 text-[10px] font-medium text-white transition-colors duration-300 hover:bg-green-700"
						>
							<CornerRightUp class="h-3 w-3" />
							Republish Workflow
						</button>
					</div>

					<!-- Stats Grid -->
					<div class="mb-4 grid grid-cols-3 gap-3">
						<div class="rounded-xl border border-white/5 bg-white/5 p-3">
							<p class="mb-0.5 text-[10px] font-bold text-zinc-500 uppercase">Total Runs</p>
							<p class="text-lg font-bold text-white">{stats.total}</p>
						</div>
						<div class="rounded-xl border border-white/5 bg-white/5 p-3">
							<p class="mb-0.5 text-[10px] font-bold text-green-400 uppercase">Success</p>
							<p class="text-lg font-bold text-white">{stats.successRate}%</p>
						</div>
						<div class="rounded-xl border border-white/5 bg-white/5 p-3">
							<p class="mb-0.5 text-[10px] font-bold text-zinc-500 uppercase">Avg Time</p>
							<p class="text-lg font-bold text-white">{stats.avgDuration}s</p>
						</div>
					</div>

					<div class="flex items-center justify-between border-t border-white/5 pt-4">
						<h3 class="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
							Execution Log
						</h3>
					</div>
				</div>

				<!-- Scrollable Log Content -->
				<div class="flex-1 space-y-2 overflow-y-auto pr-1 pb-6">
					{#if loading}
						<div class="flex h-40 flex-col items-center justify-center gap-3 text-zinc-500">
							<RefreshCcw class="h-6 w-6 animate-spin text-green-500/50" />
							<p class="text-[10px] font-medium tracking-wider uppercase">Loading...</p>
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
								class="rounded-xl border border-white/5 bg-white/2 transition-all {isExpanded
									? 'border-white/10 bg-white/5'
									: 'hover:bg-white/4'}"
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
											<span class="text-[10px] font-bold text-white">{getDuration(execution)}s</span
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
										<div class="flex flex-col gap-4">
											<!-- Summary Info - Always Visible when expanded -->
											<div
												class="grid grid-cols-2 gap-3 rounded-lg border border-white/5 bg-black/20 p-3 md:grid-cols-4"
											>
												<div class="space-y-0.5">
													<p class="text-[8px] font-bold text-zinc-500 uppercase">Status</p>
													<p
														class="text-[10px] font-bold {(details || execution).status ===
														'COMPLETED'
															? 'text-green-400'
															: 'text-red-400'}"
													>
														{(details || execution).status}
													</p>
												</div>
												<div class="space-y-0.5">
													<p class="text-[8px] font-bold text-zinc-500 uppercase">Duration</p>
													<p class="text-[10px] font-medium text-zinc-300">
														{getDuration(details || execution)}s
													</p>
												</div>
												<div class="space-y-0.5">
													<p class="text-[8px] font-bold text-zinc-500 uppercase">Started</p>
													<p class="text-[10px] font-medium text-zinc-400">
														{new Date((details || execution).startedAt).toLocaleTimeString()}
													</p>
												</div>
												<div class="space-y-0.5">
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
												<!-- Node Executions (Steps) Table -->
												<div class="space-y-3">
													<p class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
														Steps
													</p>
													<div
														class="overflow-hidden rounded-lg border border-white/5 bg-zinc-800/20"
													>
														<table class="w-full text-left">
															<thead>
																<tr class="border-b border-white/5 bg-black/20">
																	<th class="px-4 py-2 text-[8px] font-bold text-zinc-500 uppercase"
																		>Step</th
																	>
																	<th class="px-4 py-2 text-[8px] font-bold text-zinc-500 uppercase"
																		>Status</th
																	>
																	<th class="px-4 py-2 text-[8px] font-bold text-zinc-500 uppercase"
																		>Duration</th
																	>
																	<th class="px-4 py-2 text-[8px] font-bold text-zinc-500 uppercase"
																		>Result</th
																	>
																</tr>
															</thead>
															<tbody>
																{#each details.nodeExecutions as step}
																	{@const hasNestedError =
																		step.input?.success === false || step.output?.success === false}
																	<tr
																		class="border-b border-white/5 transition-colors hover:bg-white/2"
																	>
																		<td class="px-4 py-3">
																			<div class="flex flex-col">
																				<span class="text-[10px] font-bold text-white"
																					>{step.actionName}</span
																				>
																				<span class="text-[9px] text-zinc-500">{step.stepName}</span
																				>
																			</div>
																		</td>
																		<td class="px-4 py-3">
																			<div class="flex items-center gap-2">
																				<div
																					class="h-1.5 w-1.5 rounded-full {step.status ===
																					'COMPLETED'
																						? 'bg-green-500'
																						: 'bg-red-500'}"
																				></div>
																				<span
																					class="text-[9px] font-bold {step.status === 'COMPLETED'
																						? 'text-green-400'
																						: 'text-red-400'}"
																				>
																					{step.status}
																				</span>
																			</div>
																		</td>
																		<td class="px-4 py-3">
																			<span class="font-mono text-[9px] text-zinc-400">
																				{(
																					(new Date(step.completedAt).getTime() -
																						new Date(step.startedAt).getTime()) /
																					1000
																				).toFixed(2)}s
																			</span>
																		</td>
																		<td class="px-4 py-3">
																			<p
																				class="max-w-full truncate text-[9px] font-medium {step.status ===
																					'COMPLETED' && !hasNestedError
																					? 'text-zinc-300'
																					: 'text-red-400/80'}"
																				title={getStepSummary(step)}
																			>
																				{getStepSummary(step)}
																			</p>
																		</td>
																	</tr>
																{/each}
															</tbody>
														</table>
													</div>
												</div>

												<div
													class="flex items-center justify-between rounded-lg border border-white/5 bg-black/10 px-3 py-2"
												>
													<div class="flex flex-col gap-0.5">
														<p class="text-[8px] font-bold text-zinc-600 uppercase">Execution ID</p>
														<p class="font-mono text-[9px] text-zinc-600">{execution.id}</p>
													</div>
													<button
														onclick={() => console.log(details)}
														class="text-[8px] font-bold text-zinc-500 transition-colors hover:text-white"
													>
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
