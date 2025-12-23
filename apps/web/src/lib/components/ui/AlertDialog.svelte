<script>
	import { fade, slide } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { confirmStore } from '$lib/confirm.svelte';
	import { Check, X, AlertCircle, HelpCircle } from 'lucide-svelte';

	let { isOpen, title, message, confirmText, cancelText, type } = $derived(confirmStore.state);

	function handleConfirm() {
		confirmStore.close(true);
	}

	function handleCancel() {
		confirmStore.close(false);
	}
</script>

{#if isOpen}
	<div class="pointer-events-none fixed inset-x-0 bottom-8 z-200 flex justify-center p-4">
		<!-- Dialog Container -->
		<div
			class="pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a]/80 p-4 shadow-2xl backdrop-blur-xl"
			in:slide={{ duration: 400, easing: backOut, axis: 'y' }}
			out:fade={{ duration: 200 }}
		>
			<!-- Icon/Type Indicator -->
			<div class="shrink-0">
				{#if type === 'confirm'}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500"
					>
						<HelpCircle size={22} />
					</div>
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"
					>
						<AlertCircle size={22} />
					</div>
				{/if}
			</div>

			<!-- Content -->
			<div class="min-w-0 flex-1">
				<h3 class="truncate text-sm font-semibold text-white">{title}</h3>
				<p class="line-clamp-1 text-xs text-white/60">{message}</p>
			</div>

			<!-- Actions -->
			<div class="ml-2 flex shrink-0 items-center gap-2">
				{#if type === 'confirm'}
					<button
						onclick={handleCancel}
						class="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all hover:bg-white/5 hover:text-rose-500 active:scale-90"
						title={cancelText}
					>
						<X size={18} />
					</button>
				{/if}
				<button
					onclick={handleConfirm}
					class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all hover:bg-white/90 active:scale-90"
					title={confirmText}
				>
					<Check size={18} />
				</button>
			</div>
		</div>
	</div>
{/if}
