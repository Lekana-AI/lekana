<script lang="ts">
	import {
		Check,
		Copy,
		Key,
		Terminal,
		X,
		Rocket,
		Clock,
		ArrowUp,
		Plus,
		Trash2,
		ExternalLink,
		ChevronDown,
		AlertTriangle,
		ShieldAlert,
		ArrowRight,
		BookOpen,
		Play,

		TriangleAlert

	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { workflow, onClose, onSubmit } = $props();

	let isPublishing = $state(false);
	let publishResult = $state<any>(null);
	let keys = $state<any[]>([]);
	let newlyCreatedKeyData = $state<any>(null);
	let expandedKeyId = $state<string | null>(null);
	let isLoadingKeys = $state(false);
	let copiedKey = $state(false);
	let copiedEndpoint = $state(false);

	// Revoke state
	let revokePrompt = $state(false);
	let keyToRevoke = $state<any>(null);
	let confirmKeyName = $state('');
	let isRevoking = $state(false);

	// Key creation state
	let isCreatingKey = $state(false);
	let newKeyName = $state('');
	let publishError = $state<any>(null);
	let keyExpiration = $state('never'); // '7d', '30d', '90d', 'never'

	async function publishWorkflow() {
		isPublishing = true;
		publishError = null;
		try {
			const res = await fetch('/rime/publish', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ workflowId: workflow.id })
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => null);
				if (errorData) {
					publishError = errorData;
				} else {
					console.error('Publish error:', await res.text());
					throw new Error(`Failed to publish workflow: ${res.status}`);
				}
				return;
			}

			const result = await res.json();
			publishResult = result;

			// If it returns a key, store it as newlyCreatedKeyData
			if (result.apiKey) {
				newlyCreatedKeyData = result.apiKey;
			} else if (result.apiKeys?.[0]) {
				newlyCreatedKeyData = result.apiKeys[0];
			}

			await fetchKeys();
		} catch (error) {
			console.error('Error publishing workflow:', error);
		} finally {
			isPublishing = false;
		}
	}

	async function fetchKeys() {
		isLoadingKeys = true;
		try {
			const res = await fetch(`/rime/workflows/${workflow.id}/keys`);
			if (res.ok) {
				const data = await res.json();
				keys = data.apiKeys || data;
			} else {
				console.error('Failed to fetch keys:', await res.text());
			}
		} catch (error) {
			console.error('Error fetching keys:', error);
		} finally {
			isLoadingKeys = false;
		}
	}

	async function createKey() {
		if (!newKeyName.trim()) return;
		isCreatingKey = true;

		let expiresAt: string | null = null;
		if (keyExpiration !== 'never') {
			const date = new Date();
			if (keyExpiration === '7d') date.setDate(date.getDate() + 7);
			else if (keyExpiration === '30d') date.setDate(date.getDate() + 30);
			else if (keyExpiration === '90d') date.setDate(date.getDate() + 90);
			expiresAt = date.toISOString();
		}

		try {
			const res = await fetch(`/rime/workflows/${workflow.id}/keys`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newKeyName, expiresAt })
			});

			if (res.ok) {
				const result = await res.json();
				newlyCreatedKeyData = result.apiKey || result;
				newKeyName = '';
				isCreatingKey = false;
				await fetchKeys();
			}
		} catch (error) {
			console.error('Error creating key:', error);
		} finally {
			isCreatingKey = false;
		}
	}

	async function revokeKey() {
		if (!keyToRevoke || confirmKeyName !== keyToRevoke.name) return;

		isRevoking = true;
		try {
			const res = await fetch(`/rime/workflows/${workflow.id}/keys/${keyToRevoke.id}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				await fetchKeys();
				revokePrompt = false;
				keyToRevoke = null;
				confirmKeyName = '';
			}
		} catch (error) {
			console.error('Error revoking key:', error);
		} finally {
			isRevoking = false;
		}
	}

	onMount(async () => {
		if (workflow.isPublished) {
			await fetchKeys();
		}
	});

	function copyToClipboard(text: string, type: 'key' | 'endpoint') {
		if (!text) return;
		navigator.clipboard.writeText(text);
		if (type === 'key') {
			copiedKey = true;
			setTimeout(() => (copiedKey = false), 2000);
		} else {
			copiedEndpoint = true;
			setTimeout(() => (copiedEndpoint = false), 2000);
		}
	}

	function formatRelativeTime(dateString: string | null) {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
		return date.toLocaleDateString();
	}

	function formatFullDate(dateString: string | null) {
		if (!dateString) return 'never';
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const runEndpoint = $derived(
		publishResult?.runEndpoint || `/api/v1/workflows/${workflow.id}/run`
	);
	const activeKeys = $derived(keys.filter((k) => k.isActive));
	const firstPublishedAt = $derived(
		activeKeys.length > 0 ? activeKeys[activeKeys.length - 1].createdAt : null
	);
	const lastUsedAt = $derived(
		activeKeys.reduce((latest, key) => {
			if (!key.lastUsedAt) return latest;
			const current = new Date(key.lastUsedAt).getTime();
			return latest === null || current > new Date(latest).getTime() ? key.lastUsedAt : latest;
		}, null)
	);

	const expirationOptions = [
		{ label: '7 Days', value: '7d' },
		{ label: '30 Days', value: '30d' },
		{ label: '90 Days', value: '90d' },
		{ label: 'Never', value: 'never' }
	];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if revokePrompt && keyToRevoke}
	<div
		class="fixed inset-0 z-400 flex items-center justify-center bg-black/60 backdrop-blur-sm"
		onclick={(e) => e.stopPropagation()}
	>
		<div
			class="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
		>
			<div class="relative flex w-full flex-col gap-3 pb-2">
				<div class="flex items-center justify-between">
					<p class="text-xs font-bold tracking-widest text-red-500 uppercase">danger zone</p>
					<button
						onclick={() => {
							revokePrompt = false;
							keyToRevoke = null;
							confirmKeyName = '';
						}}
						class="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
				<span class="flex items-center gap-3">
					<ShieldAlert class="h-6 w-6 text-red-500" />
					<h1 class="text-2xl font-semibold text-white">Revoke API Key</h1>
				</span>
				<p class="mt-1 w-full text-sm text-zinc-400">
					This action is irreversible. The API key <span class="font-semibold text-white"
						>"{keyToRevoke.name}" ({keyToRevoke.keyPrefix}...)</span
					> will be permanently deactivated.
				</p>
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<label
						for="confirm-key-name"
						class="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500"
					>
						Type <span class="text-white select-all">{keyToRevoke.name}</span> to confirm
					</label>
					<input
						id="confirm-key-name"
						type="text"
						bind:value={confirmKeyName}
						placeholder="Enter key name"
						class="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 font-mono text-sm text-white focus:border-red-500/50 focus:outline-none"
					/>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						onclick={() => {
							revokePrompt = false;
							keyToRevoke = null;
							confirmKeyName = '';
						}}
						class="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
					>
						CANCEL
					</button>
					<button
						onclick={revokeKey}
						disabled={confirmKeyName !== keyToRevoke.name || isRevoking}
						class="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isRevoking ? 'REVOKING...' : 'REVOKE KEY'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={(e) => e.stopPropagation()}
	class="absolute top-full right-0 z-100 mt-2 flex w-[500px] flex-col rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl ring-1 ring-black/50"
>
	<div class="flex flex-col gap-4">
		<style>
			.dark-scroll {
				scrollbar-width: thin;
				scrollbar-color: gray transparent;
			}
		</style>

		<section class="dark-scroll flex flex-col gap-4 overflow-y-auto pr-1">
			{#if workflow.isPublished || publishResult}
				<!-- Subtle Endpoint Display -->
				<div class="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-4 group">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase"
							>Production Endpoint</span
						>
						<button
							onclick={() => copyToClipboard(runEndpoint, 'endpoint')}
							class="flex items-center gap-2 text-xs font-bold text-zinc-400 transition-colors hover:text-white"
						>
							{#if copiedEndpoint}
								<Check class="h-3 w-3 text-green-500" />
								<span class="text-green-500">Copied</span>
							{:else}
								<Copy class="h-3 w-3" />
								<span class="">Copy</span>
							{/if}
						</button>
					</div>
					<div class="flex items-center gap-3 overflow-hidden">
						<div
							class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-800 text-zinc-500"
						>
							<Terminal class="h-4 w-4" />
						</div>
						<span class="truncate font-mono text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">{runEndpoint}</span>
					</div>
				</div>
			{/if}

			<div class="space-y-4">
				<!-- Publish / Re-publish Section -->
				{#if !workflow.isPublished && !publishResult}
					<p class="px-2 text-xs leading-relaxed text-zinc-400">
						Create a secure, scalable production link to execute this workflow from any external
						application or service.
					</p>
				{/if}

				{#if publishError}
					<div class="space-y-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
						<div class="flex items-center gap-2 text-red-400">
							<AlertTriangle class="h-4 w-4" />
							<span class="text-sm font-semibold">{publishError.error || 'Publish Failed'}</span>
						</div>
						<p class="text-xs whitespace-pre-line text-zinc-400">{publishError.message}</p>

						{#if publishError.validationErrors}
							<div class="mt-2 space-y-2">
								{#each publishError.validationErrors as err}
									<div
										class="flex flex-col gap-1 "
									>
										<div class="flex items-center justify-between">
											<span class="text-xs font-bold text-red-400 uppercase">{err.nodeName}</span>
											<span class="font-mono text-[10px] text-zinc-500">{err.fieldLabel}</span>
										</div>
										<p class="text-xs text-zinc-300">{err.message}</p>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<div class="flex items-center justify-between py-2">
					<div class="flex flex-col gap-1">
						<h2 class="text-sm font-medium text-white">Deployment</h2>
						<p class="text-xs text-zinc-500">
							{#if workflow.isPublished}
								Last published {formatRelativeTime(workflow.updatedAt)}
							{:else}
								Ready to go live
							{/if}
						</p>
					</div>
					<button
						onclick={publishWorkflow}
						disabled={isPublishing}
						class="group flex items-center gap-2 rounded-lg border border-green-500/10 bg-green-500/5 px-5 py-2.5 transition-all duration-300
                    hover:bg-green-500/10 disabled:opacity-50"
					>
						{#if isPublishing}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
							></div>
						{:else}
							<ArrowUp class="h-4 w-4 text-zinc-400 group-hover:text-white" />
						{/if}
						<span class="text-xs font-bold tracking-wide text-green-500 group-hover:text-green-400">
							{isPublishing ? 'Publishing...' : workflow.isPublished ? 'Re-publish' : 'Publish Now'}
						</span>
					</button>
				</div>

				{#if workflow.isPublished || publishResult}
					<div class="space-y-4">
						<!-- API Keys Section -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<div class="flex flex-col gap-1">
									<h2 class="text-sm font-medium text-white">API Keys</h2>
									<p class="text-xs text-zinc-500">Authenticate requests securely</p>
								</div>
								<button
									onclick={() => (isCreatingKey = true)}
									class="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-bold text-green-500 transition-all hover:bg-green-500/20"
								>
									<Plus class="h-3 w-3" />
									New Key
								</button>
							</div>

							{#if isCreatingKey}
								<div class="space-y-4 rounded-xl border border-white/5 bg-white/2 p-4">
									<div class="grid grid-cols-2 gap-4">
										<div class="flex flex-col gap-2">
											<label
												for="key-name"
												class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
												>Key Name</label
											>
											<input
												id="key-name"
												type="text"
												bind:value={newKeyName}
												placeholder="Production Access"
												class="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white transition-all placeholder:text-zinc-700 focus:border-green-500/50 focus:outline-none"
											/>
										</div>
										<div class="flex flex-col gap-2">
											<label
												for="key-expiration"
												class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
												>Expiration</label
											>
											<select
												id="key-expiration"
												bind:value={keyExpiration}
												class="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white transition-all focus:border-green-500/50 focus:outline-none"
											>
												{#each expirationOptions as opt}
													<option value={opt.value}>{opt.label}</option>
												{/each}
											</select>
										</div>
									</div>
									<div class="flex justify-end gap-3 pt-1">
										<button
											onclick={() => {
												isCreatingKey = false;
												newKeyName = '';
											}}
											class="px-4 py-2 text-xs font-bold text-zinc-500 uppercase transition-colors hover:text-white"
										>
											Cancel
										</button>
										<button
											onclick={createKey}
											class="rounded-md bg-green-700 px-5 py-2 text-xs font-bold text-white uppercase transition-all hover:bg-green-800 active:scale-[0.98]"
										>
											Create
										</button>
									</div>
								</div>
							{/if}

							{#if newlyCreatedKeyData && newlyCreatedKeyData.key}
								<div class="space-y-3 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
									<div class="flex items-center justify-between">
										<span
											class="flex items-center gap-2 text-xs font-bold tracking-wider text-green-500 uppercase"
										>
											<Key class="h-4 w-4" /> Generated Key
										</span>
										<button
											onclick={() => copyToClipboard(newlyCreatedKeyData.key, 'key')}
											class="flex items-center gap-2 text-xs font-bold text-green-500 transition-colors hover:text-green-400"
										>
											<Copy class="h-3 w-3" />
											{copiedKey ? 'Copied' : 'Copy'}
										</button>
									</div>
									<div class="space-y-1">
										<p class="text-xs font-medium text-zinc-500 uppercase">
											{newlyCreatedKeyData.name}
										</p>
										<div
											class="rounded-lg border border-green-500/10 bg-black/40 p-4 font-mono text-sm break-all text-green-200"
										>
											{newlyCreatedKeyData.key}
										</div>
									</div>
									<p class="text-xs leading-relaxed font-medium text-amber-500/90">
										<TriangleAlert class="inline h-3.5 w-3.5 align-middle" /> This key will only be shown
										once. Save it securely.
									</p>
								</div>
							{/if}

							{#if isLoadingKeys}
								<div class="space-y-2">
									{#each Array(2) as _}
										<div
											class="h-14 w-full animate-pulse rounded-xl border border-white/5 bg-white/2"
										></div>
									{/each}
								</div>
							{:else}
								<div class="space-y-2">
									{#each activeKeys as key}
										<div
											class="group flex flex-col gap-0 rounded-xl border border-white/5 bg-white/2 transition-colors hover:border-white/10"
										>
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<!-- svelte-ignore a11y_click_events_have_key_events -->
											<div
												onclick={() => (expandedKeyId = expandedKeyId === key.id ? null : key.id)}
												class="flex w-full items-center justify-between gap-4 p-4 text-left"
											>
												<div class="flex min-w-0 flex-col gap-1">
													<div class="flex items-center gap-2">
														<Key class="h-4 w-4 text-zinc-500" />
														<span class="truncate text-sm font-medium text-zinc-200"
															>{key.name || 'Untitled Key'}</span
														>
														<span
															class="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-500"
															>{key.keyPrefix}...</span
														>
													</div>
													<div class="flex items-center gap-3">
														<span class="text-xs text-zinc-500"
															>{formatRelativeTime(key.createdAt)}</span
														>
														{#if key.lastUsedAt}
															<span class="text-xs text-zinc-400"
																>• Last used {formatRelativeTime(key.lastUsedAt)}</span
															>
														{/if}
													</div>
												</div>
												<div class="flex items-center gap-2">
													<button
														onclick={(e) => {
															e.stopPropagation();
															keyToRevoke = key;
															revokePrompt = true;
														}}
														class="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-500"
														title="Revoke Key"
													>
														<Trash2 class="h-4 w-4" />
													</button>
													<ChevronDown
														class="h-5 w-5 text-zinc-600 transition-transform duration-300 {expandedKeyId ===
														key.id
															? 'rotate-180'
															: ''}"
													/>
												</div>
											</div>

											{#if expandedKeyId === key.id}
												<div class="border-t border-white/5 bg-black/20 p-4">
													<div class="grid grid-cols-3 gap-4 text-xs">
														<div class="flex flex-col gap-1">
															<span class="font-bold text-zinc-600 uppercase">Created</span>
															<span class="font-mono text-zinc-400"
																>{formatFullDate(key.createdAt).split(',')[0]}</span
															>
														</div>
														<div class="flex flex-col gap-1">
															<span class="font-bold text-zinc-600 uppercase">Last Used</span>
															<span class="font-mono text-zinc-400"
																>{key.lastUsedAt
																	? formatFullDate(key.lastUsedAt).split(',')[0]
																	: 'Never'}</span
															>
														</div>
														<div class="flex flex-col gap-1">
															<span class="font-bold text-zinc-600 uppercase">Expires</span>
															<span class="font-mono text-zinc-400"
																>{key.expiresAt
																	? formatFullDate(key.expiresAt).split(',')[0]
																	: 'Never'}</span
															>
														</div>
													</div>
												</div>
											{/if}
										</div>
									{:else}
										{#if !isCreatingKey && !newlyCreatedKeyData?.key}
											<p class="py-8 text-center text-sm text-zinc-600">
												No active API keys found.
											</p>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
