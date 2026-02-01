<script lang="ts">
	import { X, MessageSquare, Megaphone, Sparkles, Bug, ArrowRight } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	let { onClose, onFeedback } = $props<{
		onClose: () => void;
		onFeedback: () => void;
	}>();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
	onclick={onClose}
	transition:fade={{ duration: 200 }}
>
	<div
		class="relative max-h-4/5 w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
		onclick={(e) => e.stopPropagation()}
		transition:scale={{ duration: 300, easing: backOut, start: 0.95 }}
	>
		<div class="relative">
			<!-- Close Button -->
			<button
				onclick={onClose}
				class="absolute top-4 right-4 z-10 p-1 text-zinc-400 transition-colors hover:text-white"
			>
				<X class="h-5 w-5" />
			</button>

			<!-- Image Placeholder -->
			<div class="flex h-64 w-full items-center justify-center bg-zinc-950">
				<img
					src="/beta.png"
					alt="Beta"
					class="h-full w-full object-contain transition-opacity duration-300 hover:opacity-70"
				/>
			</div>

			<div class="p-8 pt-6">
				<div class="mb-6">
					<h2 class="flex gap-1 text-2xl font-bold text-white">
						Welcome to Lekana <span class="text-lg font-semibold text-green-500">Beta</span>
					</h2>
					<p class="mt-3 text-xs leading-relaxed text-zinc-400">
						We're thrilled to have you! Lekana is evolving rapidly. As we build the future of
						document automation, we'd love your help in making it perfect.
					</p>
				</div>

				<div class="space-y-4">
					<div class="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 p-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-500/10 text-green-500"
						>
							<Bug class="h-5 w-5" />
						</div>
						<div>
							<h4 class="text-sm font-semibold text-white">Expect some bumps</h4>
							<p class="mt-1 text-xs leading-relaxed text-zinc-400">
								You might encounter bugs or rough edges. We're squashing them as fast as we can!
							</p>
						</div>
					</div>

					<div class="flex items-center gap-4 rounded-xl border border-white/5 bg-white/2 p-4">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-500/10 text-green-500"
						>
							<Sparkles class="h-5 w-5" />
						</div>
						<div>
							<h4 class="text-sm font-semibold text-white">More is coming</h4>
							<p class="mt-1 text-xs leading-relaxed text-zinc-400">
								Exciting new features and stability updates are landing every week.
							</p>
						</div>
					</div>
				</div>

				<div class="mt-8 flex flex-col gap-3">
					<button
						onclick={onClose}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
					>
						Explore Platform
					</button>

					<button
						onclick={onFeedback}
						class="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
					>
						<MessageSquare class="h-4 w-4" />
						Submit Feedback
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
