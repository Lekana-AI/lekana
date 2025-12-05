<script lang="ts">
	import SidePanel from '$lib/components/SidePanel.svelte';
	import { Plus, ArrowUp, ArrowRight } from 'lucide-svelte';

	import FlowCanvas from '$lib/components/FlowCanvas.svelte';
	import Menu from '$lib/components/Menu.svelte';

	export let data;

	const slug = data?.slug;

	let prompt = '';

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
</script>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	<SidePanel />
	<div
		class="relative flex gap-4 h-screen w-full justify-center overflow-clip bg-zinc-950 p-4"
	>
		<div
			class="absolute top-1/2 aspect-square w-full scale-200 justify-self-center rounded-full bg-radial from-green-500/20 to-transparent to-60%"
		></div>
		<section class="z-10 flex h-full w-full flex-col gap-4">
			<div class="mt-2 flex w-fit flex-col gap-2 rounded-lg px-3">
				<input
					class="text-l truncate rounded font-semibold text-zinc-300 outline outline-white/0 focus:px-2 focus:outline-white/50"
					value="Untitled Workflow {slug}"
				/>

				<div class="w-fit rounded-md bg-white/10 p-0.5 px-2">
					<p class="text-xs text-gray-300">Unpublished</p>
				</div>
			</div>
			<FlowCanvas />
		</section>
        <Menu />
	</div>
</main>
