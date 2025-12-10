<script>
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
		Settings2
	} from 'lucide-svelte';

	let { userName, workflows, onSettings } = $props();

	let workflowsCollapsed = $state(false);
	let panelCollapsed = $state(false);

	let openMenuId = $state(null);
</script>

<aside
	class="flex h-screen {panelCollapsed
		? 'w-16'
		: 'w-56'} z-30 flex-col justify-between bg-zinc-900 px-2 py-6 backdrop-blur-md transition-[width] duration-300"
	aria-label="Workflow sidebar"
>
	<div class="flex h-full flex-col gap-3">
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
		>
			<div class="flex items-center gap-2">
				<Plus class="p- h-6 w-6" />

				<h2 class="truncate text-xs leading-4 font-medium {panelCollapsed ? 'hidden' : ''}">
					New Workflow
				</h2>
			</div>
		</button>

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

					<h2 class="text-xs leading-4 font-medium {panelCollapsed ? 'hidden' : ''}">Workflows</h2>
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
				<nav class="flex max-h-[60vh] w-full flex-col gap-1" aria-label="Workflow list">
					{#each workflows as workflow (workflow.id)}
						<div class="relative">
							<a
								onclick={() => (window.location.href = '/w/' + workflow.id)}
								href="/w/{workflow.id}"
								class="group relative flex w-full items-center justify-between gap-2 rounded-lg p-3 text-xs focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none
						{workflow.active
									? 'bg-green-700 font-semibold text-white'
									: 'font-normal text-white/70 hover:bg-white/5'}"
							>
								<p class="truncate">{workflow.name}</p>

								<!-- OPTIONS BUTTON -->
								<button
									type="button"
									onclick={(event) => (
										event.preventDefault(),
										event.stopPropagation(),
										(openMenuId = openMenuId === workflow.id ? null : workflow.id)
									)}
									class="absolute right-1 z-20 items-center justify-center rounded-md p-2 transition-colors duration-300 {openMenuId ===
									workflow.id
										? 'flex'
										: 'hidden group-hover:flex'} 
				{workflow.active ? 'bg-green-900 hover:bg-green-950' : 'bg-zinc-900 hover:bg-zinc-950'}"
								>
									<EllipsisVertical class="h-4 w-4" />
								</button>
							</a>
							<!-- DROPDOWN MENU -->
							{#if openMenuId === workflow.id}
								<div
									class="absolute top-10 left-full z-30 min-w-full -translate-x-9 rounded-xl border border-white/10 bg-zinc-900 font-medium text-gray-200 shadow-xl"
								>
									<button
										onclick={() => onSettings?.(workflow.id)}
										type="button"
										class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
									>
										<Settings2 class="h-4 w-4" />

										Workflow Settings
									</button>

									<button
										class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
										onclick={() => console.log('Duplicate', workflow.id)}
									>
										<CopyPlus class="h-4 w-4" />

										Duplicate Workflow
									</button>

									<button
										class="flex w-full items-center gap-2 p-3 text-left text-xs text-red-400 hover:bg-red-500/10"
										onclick={() => console.log('Delete', workflow.id)}
									>
										<Trash class="h-4 w-4" />

										Delete Workflow
									</button>
								</div>
							{/if}
						</div>
					{/each}
				</nav>
			{/if}
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

<svelte:window on:click={(openMenuId = null)} />
