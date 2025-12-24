<script>
	import { CheckCircle, AlertCircle, Info, X } from 'lucide-svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { toast } from '$lib/toast.svelte';

	let { message, type = 'info', id, count = 1 } = $props();

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info
	};

	const colors = {
		success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
		error: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
		info: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
	};

	const Icon = icons[type];
</script>

<div
	role="status"
	in:slide={{ duration: 400, easing: backOut, axis: 'y' }}
	out:fade={{ duration: 200 }}
	class="pointer-events-auto flex max-w-md min-w-[300px] items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md {colors[
		type
	]}"
>
	<div class="shrink-0">
		<Icon size={20} strokeWidth={2.5} />
	</div>

	<p class="flex-1 text-sm leading-tight font-medium text-white/90">
		{message}
	</p>

	<button
		onclick={() => toast.remove(id)}
		class="shrink-0 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
		aria-label="Dismiss"
	>
		<X size={16} />
	</button>

	{#if count > 1}
		<div
			class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black shadow-lg ring-1 ring-black/5"
			in:scale={{ duration: 200, start: 0.5 }}
		>
			{count}
		</div>
	{/if}
</div>
