<script lang="ts">
	import {
		PanelLeftClose,
		Network,
		ChevronDown,
		Plus,
		PanelRightClose,
		CircleUser,
		Ellipsis,
		EllipsisVertical,
		Trash,
		CopyPlus,
		Settings2,
		LifeBuoy,
		MessageSquare,
		Zap,
		HardDrive
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { SignedIn, UserButton } from 'svelte-clerk';
	import { toast } from '$lib/toast.svelte';
	import LoadingOverlay from './LoadingOverlay.svelte';
	import SupportModal from './SupportModal.svelte';

	let {
		userName,
		activeWorkflow,
		activeWorkflowName
	}: { userName: string; activeWorkflow: string; activeWorkflowName?: string } = $props();

	$effect(() => {
		if (activeWorkflowName && workflows.length > 0) {
			const index = workflows.findIndex((w: any) => w.id === activeWorkflow);
			if (index !== -1 && workflows[index].name !== activeWorkflowName) {
				workflows[index].name = activeWorkflowName;
			}
		}
	});

	let workflowsCollapsed = $state(false);
	let panelCollapsed = $state(false);
	let openMenuId = $state<string | null>(null);
	let menuTop = $state(0);
	let menuWorkflow = $state<any>(null);
	let workflows = $state<any[]>([]);
	let workflowsLoading = $state(false);
	let isActionLoading = $state(false);
	let showSupportModal = $state(false);
	let loadingTitle = $state('Creating Workflow');
	let loadingMessage = $state('Sit back. We are getting your workspace ready...');

	interface UsageData {
		storage: {
			used: number;
			limit: number;
			usedFormatted: string;
			limitFormatted: string;
			percentage: number;
		};
		tokens: {
			used: number;
			limit: number | null;
		};
	}

	let usage = $state<UsageData | null>(null);

	onMount(() => {
		loadWorkflows();
		loadUsage();
	});

	async function loadUsage() {
		try {
			const res = await fetch('/api/usage');
			if (res.ok) {
				usage = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch usage:', e);
		}
	}

	async function loadWorkflows() {
		workflowsLoading = true;
		try {
			const res = await fetch('/api/workflows', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				throw new Error(`Failed to load workflows: ${res.status}`);
			}

			workflows = await res.json();
		} catch (error) {
			console.error('Failed to load workflows:', error);
			toast.error('Failed to load workflows. Please try again in a moment.');
		} finally {
			workflowsLoading = false;
		}
	}

	async function createWorkflow() {
		try {
			isActionLoading = true;
			loadingTitle = 'Creating Workflow';
			loadingMessage = 'Sit back. We are getting your workspace ready...';
			const res = await fetch('/api/workflows', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: 'Untitled' })
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Backend response body:', errorText);
				toast.error('Failed to create workflow');
				throw new Error(`Failed to create workflow: ${res.status}`);
			}
			let workflow = await res.json();

			window.location.replace(`/w/${workflow.id}`);
		} catch (error) {
			console.error('Failed to create workflow:', error);
			toast.error('Something went wrong. Please try again in a moment.');
			isActionLoading = false;
		}
	}

	async function duplicateWorkflow(id: string, name: string) {
		try {
			isActionLoading = true;
			loadingTitle = 'Duplicating Workflow';
			loadingMessage = `Creating a copy of "${name}"...`;

			const res = await fetch(`/api/workflows/${id}/duplicate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Backend response body:', errorText);
				toast.error('Failed to duplicate workflow');
				throw new Error(`Failed to duplicate workflow: ${res.status}`);
			}

			let workflow = await res.json();
			// toast.success('Workflow duplicated');

			window.location.replace(`/w/${workflow.id}`);
		} catch (error) {
			console.error('Failed to duplicate workflow:', error);
			toast.error('Something went wrong. Please try again in a moment.');
			isActionLoading = false;
		}
	}

	function openWorkflow(id: string, name: string, hash: string = '') {
		isActionLoading = id !== activeWorkflow;
		loadingTitle = `Launching ${name}`;
		loadingMessage = 'Sit back. We are getting your workspace ready...';
		window.location.href = `/w/${id}${hash}`;
	}
</script>

<aside
	class="flex h-screen {panelCollapsed
		? 'w-16'
		: 'w-56'} z-0 flex-col justify-between bg-zinc-900 px-2 py-4 backdrop-blur-md transition-[width] duration-300"
	aria-label="Workflow sidebar"
>
	<div class="flex h-full flex-col gap-3">
		<header class="flex items-center {panelCollapsed ? 'justify-center' : 'justify-between'} group">
			<!-- Logo / brand -->
			<a
				href={panelCollapsed ? '' : '/dashboard'}
				class="h-7 w-7 p-1 transition-opacity duration-300 hover:opacity-80 {panelCollapsed
					? 'group-hover:hidden'
					: ''}"
			>
				<img src="/logo.svg" alt="logo" class="" />
			</a>

			<!-- Panel toggle button -->
			<button
				type="button"
				class="h-7 w-7 rounded-lg p-1.5 text-zinc-300 transition-colors duration-300 hover:bg-white/10 hover:text-zinc-100 {panelCollapsed
					? 'hidden group-hover:block'
					: ''}"
				aria-label="Toggle sidebar"
				onclick={() => (panelCollapsed = !panelCollapsed)}
			>
				{#if panelCollapsed}
					<PanelRightClose class="h-full w-full " />
				{:else}
					<PanelLeftClose class="h-full w-full " />
				{/if}
			</button>
		</header>

		<!-- Workflows section -->
		<button
			aria-label="New workflow"
			type="button"
			class="{panelCollapsed
				? 'justify-center'
				: 'justify-start'} flex items-center rounded-md px-1 py-2 text-gray-300 transition-colors duration-300 hover:bg-white/5 hover:text-gray-100 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
			onclick={createWorkflow}
		>
			<div class="flex items-center gap-2">
				<Plus class="p- h-6 w-6" />

				<h2 class="truncate text-xs leading-4 font-medium {panelCollapsed ? 'hidden' : ''}">
					New Workflow
				</h2>
			</div>
		</button>
		{#if workflowsLoading}
			<section class="flex h-full w-full flex-col gap-3 px-1">
				<div class="flex items-center gap-2 p-1">
					<div class="h-6 w-6 animate-pulse rounded-md bg-white/5"></div>
					<div
						class="h-4 w-20 animate-pulse rounded-md bg-white/5 {panelCollapsed ? 'hidden' : ''}"
					></div>
				</div>
				{#if !panelCollapsed}
					<div class="flex flex-col gap-1">
						{#each Array(3) as _}
							<div class="h-10 w-full animate-pulse rounded-lg bg-white/5"></div>
						{/each}
					</div>
				{/if}
			</section>
		{:else if workflows.length > 0}
			<section class="flex h-full w-full flex-col gap-3 px-1">
				<!-- New Workflow button -->
				<button
					aria-label="Collapse workflows"
					onclick={() => (workflowsCollapsed = !workflowsCollapsed)}
					type="button"
					class="flex items-center {panelCollapsed
						? 'justify-center'
						: 'justify-between'}  text-gray-300"
				>
					<div class="flex items-center gap-2">
						<Network class="h-6 w-6 p-1" />

						<h2 class="text-xs leading-4 font-medium {panelCollapsed ? 'hidden' : ''}">
							Workflows
						</h2>
					</div>

					<!-- Collapse button -->
					<div
						class="{panelCollapsed
							? 'hidden'
							: ''} flex items-center justify-center rounded-md p-2 transition-colors duration-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
					>
						<ChevronDown
							class="h-4 w-4 {workflowsCollapsed
								? '-rotate-90'
								: 'rotate-0'} transition-transform duration-300"
						/>
					</div>
				</button>
				{#if !workflowsCollapsed && !panelCollapsed}
					<!-- Workflows list -->
					<nav
						onscroll={() => (openMenuId = null)}
						class="flex max-h-[calc(100vh-250px)] w-full flex-col gap-1 overflow-y-auto pr-1 select-none"
						aria-label="Workflow list"
					>
						{#each workflows as workflow (workflow.id)}
							<div class="relative">
								<a
									href="/w/{workflow.id}"
									onclick={(e) => {
										e.preventDefault();
										if (activeWorkflow !== workflow.id) {
											openWorkflow(workflow.id, workflow.name);
										}
									}}
									class="group relative flex w-full items-center justify-between gap-2 rounded-lg p-3 text-xs focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none
						{activeWorkflow === workflow.id
										? 'bg-green-700 font-semibold text-white'
										: 'font-normal text-white/70 hover:bg-white/5'}"
								>
									<p class="truncate">{workflow.name}</p>

									<!-- OPTIONS BUTTON -->
									<button
										type="button"
										onclick={(event) => {
											event.preventDefault();
											event.stopPropagation();
											const rect = event.currentTarget.getBoundingClientRect();
											menuTop = rect.top;
											menuWorkflow = workflow;
											openMenuId = openMenuId === workflow.id ? null : workflow.id;
										}}
										class="absolute right-1 z-20 items-center justify-center rounded-md p-2 transition-colors duration-300 {openMenuId ===
										workflow.id
											? 'flex'
											: 'hidden group-hover:flex'} 
				{activeWorkflow === workflow.id
											? 'bg-zinc-800 hover:bg-zinc-900'
											: 'bg-zinc-800 hover:bg-zinc-900'}"
									>
										<EllipsisVertical class="h-4 w-4" />
									</button>
								</a>
							</div>
						{/each}
					</nav>
				{/if}
			</section>
		{/if}
	</div>

	<div class="group relative mb-4 w-full">
		{#if usage && !panelCollapsed}
			<div
				class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-full px-2 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
			>
				<div
					class="flex flex-col gap-3 rounded-xl border border-white/5 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md"
				>
					<!-- Tokens -->
					<div class="flex flex-col gap-1.5">
						<div class="flex items-center justify-between text-[10px]">
							<div class="flex items-center gap-1.5 font-medium text-zinc-300">
								<Zap class="h-3 w-3 text-green-400" />
								<span>Tokens</span>
							</div>
							<span class="text-zinc-500">
								{usage.tokens.used.toLocaleString()} <span class="text-zinc-600">/</span>
								{usage.tokens.limit?.toLocaleString() ?? '∞'}
							</span>
						</div>
					</div>

					<!-- Storage (Text Only) -->
					<div class="flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
						<div class="flex items-center gap-1.5 font-medium text-zinc-400">
							<HardDrive class="h-3 w-3 text-blue-400" />
							<span>Storage</span>
						</div>
						<span class="text-zinc-500">
							{usage.storage.usedFormatted} <span class="text-zinc-600">/</span>
							{usage.storage.limitFormatted}
						</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- User Info -->
		<div
			class="flex w-full items-center gap-3 rounded-md text-zinc-300 {panelCollapsed
				? 'justify-center  py-2'
				: 'p-2'} "
		>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<div class="flex w-full flex-col gap-2 {panelCollapsed ? 'hidden' : ''}">
				<div class="flex gap-1">
					<p class="flex items-center gap-1 truncate text-xs">Lekana</p>
					<span class="w-fit rounded-full text-[10px] font-medium text-green-500">Beta</span>
					<!-- <p class="flex truncate text-[10px] {panelCollapsed ? 'hidden' : ''}">
						<span class="text-zinc-400">{userName}</span>
					</p> -->
				</div>
				{#if usage}
					{#if usage.tokens.limit}
						{@const percent = Math.min((usage.tokens.used / usage.tokens.limit) * 100, 100)}
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
							<div
								class=" h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-500"
								style="width: {percent}%"
							>
								<span class="text-[10px] text-zinc-500">
									{usage.tokens.used.toLocaleString()} <span class="text-zinc-600">/</span>
									{usage.tokens.limit?.toLocaleString() ?? '∞'}
								</span>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
	<!-- Support Button -->
	<button
		type="button"
		onclick={() => (showSupportModal = true)}
		class="flex w-full items-center gap-4 rounded-md py-3 text-zinc-400 transition-colors duration-300 hover:bg-white/5 hover:text-white {panelCollapsed
			? 'justify-center'
			: 'p-3'}"
	>
		<MessageSquare class="h-5 w-5" />
		<span class="text-xs font-medium {panelCollapsed ? 'hidden' : ''}">Help & Resources</span>
	</button>
</aside>

<!-- WORKFLOW DROPDOWN MENU (Fixed Position) -->
{#if openMenuId && menuWorkflow}
	<div
		class="fixed z-50 w-fit max-w-xs overflow-hidden rounded-xl border border-white/10 bg-zinc-900 font-medium text-gray-200 shadow-2xl {panelCollapsed
			? 'left-16'
			: 'left-56'} -translate-x-6"
		style="top: {menuTop}px;"
	>
		<a
			onclick={(e) => {
				e.preventDefault();
				openWorkflow(menuWorkflow.id, menuWorkflow.name, '#settings');
			}}
			href="/w/{menuWorkflow.id}#settings"
			type="button"
			class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
		>
			<Settings2 class="h-4 w-4" />

			Workflow Settings
		</a>

		<button
			class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
			onclick={() => duplicateWorkflow(menuWorkflow.id, menuWorkflow.name)}
		>
			<CopyPlus class="h-4 w-4" />

			Duplicate Workflow
		</button>
	</div>
{/if}

<svelte:window onclick={() => (openMenuId = null)} />

{#if showSupportModal}
	<SupportModal
		{workflows}
		activeWorkflowId={activeWorkflow}
		onClose={() => (showSupportModal = false)}
	/>
{/if}

<LoadingOverlay show={isActionLoading} title={loadingTitle} message={loadingMessage} />
