<script>
	import { toast } from '$lib/toast.svelte';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
</script>

<div
	class="pointer-events-none fixed bottom-8 left-1/2 z-100 flex -translate-x-1/2 flex-col items-center gap-3"
>
	{#each toast.toasts as t (t.id)}
		<div animate:flip={{ duration: 300 }}>
			<Toast {...t} />
		</div>
	{/each}
</div>
