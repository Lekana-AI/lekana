<script lang="ts">
	import type { User } from 'svelte-clerk/server';
	import { SignedIn, UserButton } from 'svelte-clerk';
	import {
		CloudUpload,
		FileText,
		X,
		Play,
		Loader2,
		CircleCheck,
		CircleAlert,
		Plus,
		Minus,
		Upload
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from '$lib/toast.svelte';

	let { data } = $props();

	let workflow = $state(data?.workflow);
	const user: User = data?.user;

	// State for Run Request
	let inputType = $state<'url' | 'file'>('url');
	let message = $state('');
	let documentUrl = $state('');
	let documentName = $state('');
	let files = $state<File[]>([]);

	let apiKey = $state('');
	let loading = $state(false);
	let result = $state<any>(null);
	let error = $state<string | null>(null);

	// File Handling
	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			files = [...files, ...Array.from(target.files)];
		}
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	async function runWorkflow() {
		loading = true;
		result = null;
		error = null;

		try {
			let response;
			const headers: Record<string, string> = {
				'X-API-Key': apiKey
			};

			if (inputType === 'url') {
				response = await fetch(`/rime/workflows/${workflow.id}/run`, {
					method: 'POST',
					headers: {
						...headers,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						input: { message },
						documents: [{ url: documentUrl, filename: documentName, mimeType: 'application/pdf' }]
					})
				});
			} else {
				const formData = new FormData();
				formData.append('message', message);
				files.forEach((file) => {
					formData.append('files', file);
				});

				response = await fetch(`/rime/workflows/${workflow.id}/run-with-files`, {
					method: 'POST',
					headers: headers,
					body: formData
				});
			}

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to run workflow');
			}

			result = await response.json();
		} catch (e: any) {
			error = e.message || 'Something went wrong';
			toast.error(`Failed to run workflow: ${error}. Please try again in a moment.`);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Run Workflow - {workflow.name}</title>
</svelte:head>

<main class="min-h-screen bg-zinc-950 text-white">
	<!-- HEADER: Strictly following request for only SignedIn/UserButton -->
	<header class="fixed top-0 z-50 flex w-full justify-end px-8 py-4">
		<SignedIn>
			<UserButton />
		</SignedIn>
	</header>

	<div class="mx-auto max-w-3xl px-6 pt-24 pb-10">
		<div class="mb-12 flex flex-col gap-2">
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500"
				>
					<Play class="h-4 w-4" />
				</div>
				<h1 class="text-3xl font-bold tracking-tight text-zinc-100">
					{workflow.name}
				</h1>
			</div>
			<p class="text-zinc-500">Run this workflow by providing a document URL or uploading files.</p>
		</div>

		<div class="grid gap-8">
			<!-- Input Type Toggle -->
			<div class="flex rounded-xl bg-zinc-900 p-1">
				<button
					onclick={() => (inputType = 'url')}
					class="flex-1 rounded-lg py-2 text-sm font-medium transition-all {inputType === 'url'
						? 'bg-zinc-800 text-white shadow-sm'
						: 'text-zinc-500 hover:text-zinc-300'}"
				>
					Document URL
				</button>
				<button
					onclick={() => (inputType = 'file')}
					class="flex-1 rounded-lg py-2 text-sm font-medium transition-all {inputType === 'file'
						? 'bg-zinc-800 text-white shadow-sm'
						: 'text-zinc-500 hover:text-zinc-300'}"
				>
					Upload File
				</button>
			</div>
			<!-- Authentication Section -->
			<section class="space-y-4">
				<h2 class="text-lg font-semibold text-zinc-200">Authentication</h2>
				<input
					type="password"
					placeholder="Enter API Key"
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm transition-all outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50"
					bind:value={apiKey}
				/>
			</section>
			<!-- Documents Section -->
			<section class="space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-zinc-200">
						{inputType === 'url' ? 'Document URL' : 'Upload Files'}
					</h2>
					{#if inputType === 'file'}
						<span class="text-xs text-zinc-500"
							>{files.length} file{files.length === 1 ? '' : 's'} added</span
						>
					{/if}
				</div>

				{#if inputType === 'url'}
					<div class="space-y-4" in:fade>
						<input
							type="url"
							placeholder="https://example.com/document.pdf"
							class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm transition-all outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50"
							bind:value={documentUrl}
						/>
						<input
							type="text"
							placeholder="Document Name"
							class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm transition-all outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50"
							bind:value={documentName}
						/>
					</div>
				{:else}
					<div in:fade>
						<div
							class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-10 transition-colors hover:border-green-500/50 hover:bg-zinc-900/80"
						>
							<input
								type="file"
								multiple
								class="absolute inset-0 cursor-pointer opacity-0"
								onchange={handleFileSelect}
							/>
							<CloudUpload class="mb-4 h-10 w-10 text-zinc-600" />
							<p class="text-zinc-400">Click or drag documents to upload</p>
							<p class="mt-1 text-xs text-zinc-600">PDF, images, etc.</p>
						</div>

						{#if files.length > 0}
							<div class="mt-4 space-y-2">
								{#each files as file, i}
									<div
										class="flex items-center justify-between rounded-xl bg-zinc-900 p-4 transition-all hover:bg-zinc-800/80"
									>
										<div class="flex items-center gap-3">
											<FileText class="h-5 w-5 text-green-500/60" />
											<div>
												<p class="text-sm font-medium text-zinc-200">{file.name}</p>
												<p class="text-xs text-zinc-500">
													{(file.size / 1024).toFixed(1)} KB
												</p>
											</div>
										</div>
										<button
											onclick={() => removeFile(i)}
											class="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
										>
											<X class="h-4 w-4" />
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</section>

			<!-- Inputs Section -->
			<section class="space-y-4">
				<h2 class="text-lg font-semibold text-zinc-200">Message</h2>
				<textarea
					bind:value={message}
					placeholder="Enter your message here..."
					rows="4"
					class="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm transition-all outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50"
				></textarea>
			</section>

			<!-- Action Button -->
			<button
				onclick={runWorkflow}
				disabled={loading || (inputType === 'file' ? files.length === 0 : !documentUrl)}
				class="group relative mt-4 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-green-600 py-4 font-bold text-white shadow-xl shadow-green-950/20 transition-all hover:bg-green-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
			>
				{#if loading}
					<Loader2 class="h-5 w-5 animate-spin" />
					<span>Uploading...</span>
				{:else}
					<Upload class="h-5 w-5 transition-transform group-hover:scale-110" />
					<span>Upload</span>
				{/if}
			</button>

			<!-- Result/Error feedback -->
			{#if result}
				<div
					in:fly={{ y: 20, duration: 400 }}
					class="mt-6 flex flex-col gap-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-6"
				>
					<div class="flex items-center gap-3 text-green-400">
						<CircleCheck class="h-6 w-6" />
						<h3 class="text-lg font-semibold">Uploaded Successfully</h3>
					</div>
				</div>
			{/if}

			{#if error}
				<div
					in:fly={{ y: 20, duration: 400 }}
					class="mt-6 flex flex-col gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-6"
				>
					<div class="flex items-center gap-3 text-red-400">
						<CircleAlert class="h-6 w-6" />
						<h3 class="text-lg font-semibold">Upload Failed</h3>
					</div>
					<p class="text-sm text-zinc-400">{error}</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(body) {
		background-color: #09090b;
	}
</style>
