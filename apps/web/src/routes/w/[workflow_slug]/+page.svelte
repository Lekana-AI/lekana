<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';

	import FlowCanvas from '$lib/components/FlowCanvas.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import ActionProperties from '$lib/components/ActionProperties.svelte';
	import { goto } from '$app/navigation';
	import type { User } from 'svelte-clerk/server';
	import { onMount } from 'svelte';

	let { data } = $props();

	const workflow = data?.workflow;

	const user: User = data?.user;

	type Template = {
		id: number;
		name: string;
	};

	const templates: Template[] = [
		{
			id: 1,
			name: 'Start from scratch'
		},
		{
			id: 2,
			name: 'Summarisation'
		},
		{
			id: 3,
			name: 'Connect to API'
		},
		{
			id: 4,
			name: 'Classify'
		}
	];

	let propertiesVisible = $state(false);
	let settingsVisible = $state(false);
	let actionId: string = $state('');

	let open = $state(false);
	let selectedScreen = $state('Workflow Designer');
	let nodes = $state.raw(workflow.nodes);
	let edges = $state.raw(workflow.edges);

	const screens = ['Workflow Designer', 'Workflow Settings', 'Workflow Insights'];

	// const actionSections: {
	// 	category: string;
	// 	action: { label: string; icon: IconComponent }[];
	// }[] = [
	// 	{
	// 		category: 'Input & Pre-Processing',
	// 		action: [
	// 			{ label: 'Upload files', icon: CloudUpload },
	// 			{ label: 'Classification', icon: ListChecks },
	// 			{ label: 'Segmentation', icon: Grid3x3 },
	// 			{ label: 'OCR', icon: ScanText }
	// 		]
	// 	},
	// 	{
	// 		category: 'Data Quality & Validation',
	// 		action: [
	// 			{ label: 'Validation', icon: ShieldCheck },
	// 			{ label: 'De-duplication', icon: CopyCheck }
	// 		]
	// 	},
	// 	{
	// 		category: 'Human Review',
	// 		action: [
	// 			{ label: 'Human Review OCR', icon: UserCheck },
	// 			{ label: 'Human Review Classification', icon: UserCheck },
	// 			{ label: 'Human Review Segments', icon: UserCheck }
	// 		]
	// 	},
	// 	{
	// 		category: 'Storage & Integrations',
	// 		action: [
	// 			{ label: 'Database', icon: Database },
	// 			{ label: 'Export to ERP, CRM, DMS', icon: Share2 },
	// 			{ label: 'Webhook / API', icon: Webhook },
	// 			{ label: 'Email Notification / API', icon: Mail },
	// 			{ label: 'Google Sheets', icon: FileSpreadsheet }
	// 		]
	// 	},
	// 	{
	// 		category: 'Understanding & Structuring',
	// 		action: [
	// 			{ label: 'Summarization', icon: FileText },
	// 			{ label: 'Generate Document', icon: FileOutput }
	// 		]
	// 	},
	// 	{
	// 		category: 'Logic & Computation',
	// 		action: [{ label: 'Arithmetic Operations', icon: Calculator }]
	// 	}
	// ];

	nodes = [
		{
			id: '1',
			position: { x: 100, y: 100 },
			data: { label: 'Upload files' }
		}
	];

	edges = [];
	// edges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' }];
</script>

<svelte:head>
	<title>{workflow.name} - Lekana</title>
	<meta
		name="description"
		content="Lekana automates document workflows for businesses. Scan, structure, and route documents seamlessly."
	/>
	<meta property="og:image" content="/thumb.png" />
</svelte:head>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	{#if propertiesVisible}
		<ActionProperties {actionId} onClose={() => (propertiesVisible = false)} />
	{/if}
	<SidePanel
		activeWorkflow={workflow.id}
		userName={user.firstName}
		onSettings={(value: string) => goto(`/w/${value}/settings`)}
	/>
	<div class="relative flex h-screen w-full justify-center gap-4 overflow-clip bg-zinc-950 p-4">
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<section class="z-10 flex h-full w-full flex-col gap-4">
			<div class="mt-2 flex w-fit flex-col gap-2 rounded-lg px-3">
				<input
					class="text-l truncate rounded font-semibold text-zinc-300 outline outline-white/0 focus:px-2 focus:outline-white/50"
					value={workflow?.name}
				/>
			</div>

			<!-- <div class="relative w-fit">
								<div class="flex items-center gap-4 rounded-md bg-white/10 p-1 px-2 text-gray-300">
									<p class="text-xs font-medium tracking-wide">{selectedScreen}</p>
			
									<button
										type="button"
										on:click|stopPropagation={() => (open = !open)}
										class="flex items-center justify-center rounded-sm p-1 transition-colors duration-300 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
										aria-haspopup="true"
										aria-expanded={open}
									>
										<ChevronDown
											class="h-4 w-4 transition-transform duration-300 ease-in {open
												? 'rotate-0'
												: 'rotate-180'}"
										/>
									</button>
								</div>
			
								{#if open}
									<div
										class="absolute left-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-lg"
									>
										{#each screens as screen}
											<button
												class="block w-full p-3 text-left text-xs {selectedScreen == screen
													? 'font-semibold  text-gray-100'
													: 'text-gray-200  hover:bg-white/10'}"
												on:click={() => {
													selectedScreen = screen;
													open = false;
												}}
											>
												{screen}
											</button>
										{/each}
									</div>
								{/if}
							</div> -->
			<div class="flex gap-2">
				{#each screens as screen}
					<button
						class="block rounded-md p-2 px-3 text-left text-xs {selectedScreen == screen
							? 'bg-zinc-800 text-gray-100'
							: 'bg-zinc-900 text-gray-200'}"
						on:click={() => {
							selectedScreen = screen;
							open = false;
						}}
					>
						{screen}
					</button>
				{/each}
			</div>
			<FlowCanvas
				{nodes}
				{edges}
				onNodeClick={(value: string) => ((propertiesVisible = true), (actionId = value))}
			/>
		</section>
		<Menu onAction={(value: string) => ((propertiesVisible = true), (actionId = value))} />
	</div>
</main>

<svelte:window on:click={() => (open = false)} />
