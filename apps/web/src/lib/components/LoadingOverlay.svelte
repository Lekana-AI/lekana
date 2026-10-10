<script lang="ts">
	let {
		show = false,
		title = 'Creating Workflow',
		message = 'Sit back. We are getting your workspace ready...',
		prompt = ''
	}: { show: boolean; title?: string; message?: string; prompt?: string } = $props();

	const displayMessage = $derived.by(() => {
		if (prompt && prompt.length > 0) {
			const cleanedPrompt = prompt.trim();
			const shortPrompt =
				cleanedPrompt.length > 60 ? cleanedPrompt.slice(0, 60) + '...' : cleanedPrompt;
			return `Sit back, we are building you a workflow for your request " ${shortPrompt.charAt(0).toLowerCase() + shortPrompt.slice(1)}"`;
		}
		return message;
	});
</script>

{#if show}
	<div
		class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/10 backdrop-blur-xs"
	>
		<div
			class="relative flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-zinc-900 p-6 px-10 shadow-2xl max-w-3xl"
		>
			<div class="flex items-center gap-4">
				<div
					class="h-6 w-6 animate-spin rounded-full border-2 border-green-500/20 border-t-green-500"
				></div>
				<h3 class="text-xl font-semibold text-zinc-100">{title}</h3>
			</div>
			<p class="max-w-md text-center text-sm text-zinc-400">{displayMessage}</p>
		</div>
	</div>
{/if}
