<script>
	import {
		PanelLeftClose,
		Network,
		ChevronDown,
		Plus,
		PanelRightClose,
		CircleUser
	} from 'lucide-svelte';
	export let userName = 'Lasandu';

	export let workflows = [
		{ id: '1', name: 'Untitled Workflow 1', active: true },
		{ id: '2', name: 'Registration Application Workflow', active: false }
	];
	let workflowsCollapsed = false;
	let panelCollapsed = false;

	
</script>

<aside
	class="flex h-screen {panelCollapsed
		? 'w-16'
		: 'w-56'} flex-col justify-between bg-zinc-900 px-4 py-6 backdrop-blur-md transition-[width] duration-300"
	aria-label="Workflow sidebar"
>
	<div class="flex flex-col gap-3 h-full">
		<header class="flex items-center {panelCollapsed ? 'justify-center' : 'justify-between'} group">
			<!-- Logo / brand -->
			<a
				href={panelCollapsed ? '' : '/'}
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
				on:click={() => (panelCollapsed = !panelCollapsed)}
			>
				{#if panelCollapsed}
					<PanelRightClose class="h-full w-full " />
				{:else}
					<PanelLeftClose class="h-full w-full " />
				{/if}
			</button>
		</header>

		<!-- Workflows section -->
		<section class="flex flex-col gap-3 h-full w-full">
			<!-- Workflows header row -->
			<header
				class="flex items-center {panelCollapsed ? 'justify-center' : 'justify-between'} text-white"
			>
				<div class="flex items-center gap-2">
					<Network class="h-4 w-4 " />

					<h2 class="text-xs leading-4 font-normal {panelCollapsed ? 'hidden' : ''}">Workflows</h2>
				</div>

				<!-- Collapse button -->
				<button
					type="button"
					class="{panelCollapsed
						? 'hidden'
						: ''} flex items-center justify-center rounded-md p-2 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
					aria-label="Collapse workflows"
					on:click={() => (workflowsCollapsed = !workflowsCollapsed)}
				>
					<ChevronDown
						class="h-4 w-4 {workflowsCollapsed
							? '-rotate-90'
							: 'rotate-0'} transition-transform duration-300"
					/>
				</button>
			</header>
			{#if !workflowsCollapsed && !panelCollapsed}
				<!-- Workflows list -->
				<nav
					class="flex max-h-[60vh] w-full flex-col gap-1 overflow-auto pr-1"
					aria-label="Workflow list"
				>
					{#each workflows as workflow}
						<a
							on:click={() => (window.location.href = '/w/' + workflow.id)}
							href="/w/{workflow.id}"
							type="button"
							class="flex w-full items-center gap-2 truncate rounded px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none
              					{workflow.active
								? 'bg-white/10 font-semibold text-white'
								: 'font-normal text-white/70 hover:bg-white/5'}"
						>
							<span
								class="h-1.5 w-1.5 rounded-full {workflow.active
									? 'bg-emerald-400'
									: 'bg-white/30'}"
								aria-hidden="true"
							></span>
							<p>
								{workflow.name}
							</p>
						</a>
					{/each}
				</nav>
			{/if}
			<!-- New Workflow button -->
			<button
				type="button"
				class="{panelCollapsed
					? 'hidden'
					: ''} flex items-center gap-2 truncate rounded-md p-2 text-xs text-white/70 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
			>
				<Plus class="h-4 w-4" />
				New Workflow
			</button>
		</section>
	</div>

	<!-- Bottom welcome strip -->
	<footer
		class="flex w-full items-center gap-2 rounded-md text-zinc-300 transition-colors duration-300 hover:bg-white/5 {panelCollapsed
			? 'justify-center  py-2'
			: 'p-2'} "
	>
		<CircleUser class="h-5 w-5" />
		<p class="flex truncate text-xs {panelCollapsed ? 'hidden' : ''}">
			Welcome<span class="font-medium">, {userName}</span>
		</p>
	</footer>
</aside>
