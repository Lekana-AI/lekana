<script lang="ts">
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';

	let { id, data }: NodeProps = $props();

	import { Plus } from 'lucide-svelte';
</script>

<div
	class="border-white/50 inline-flex w-full items-center border-dashed justify-start gap-4 rounded-lg border bg-white/0 px-3 py-2 backdrop-blur transition-colors duration-300 hover:bg-white/5 text-zinc-300"
>
	<span
		class="flex items-center justify-center rounded-full bg-radial from-zinc-700 from-0% to-zinc-900 to-60% p-1.5 "
	>
		<Plus size="12" />
	</span>
	<span class="truncate text-xs leading-5 font-semibold">
		{data.label}
	</span>
</div>

<Handle type="target" position={Position.Top} />
<Handle type="source" position={Position.Bottom} />
