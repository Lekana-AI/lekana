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
		Upload,
		Check,
		CircleX
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast } from '$lib/toast.svelte';

	let { data } = $props();

	let workflow = $state(data?.workflow);
	const user: User = data?.user;

	// State for Run Request
	let files = $state<File[]>([]);
	let apiKey = $state('');

	let loading = $state(false);
	let success = $state(false);
	let showError = $state(false);
	let error = $state<string | null>(null);
	let feedbackProgress = $state(100);

	// Supported file types for Google Document AI
	const SUPPORTED_MIME_TYPES = new Set([
		'application/pdf',
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/tiff',
		'image/bmp',
		'image/webp'
	]);

	const SUPPORTED_EXTENSIONS = new Set([
		'pdf',
		'jpg',
		'jpeg',
		'png',
		'gif',
		'tif',
		'tiff',
		'bmp',
		'webp'
	]);

	function isFileSupported(file: File): boolean {
		// Check MIME type first
		if (SUPPORTED_MIME_TYPES.has(file.type)) return true;

		// Fallback to extension check (in case MIME type is missing)
		const ext = file.name.split('.').pop()?.toLowerCase();
		return ext ? SUPPORTED_EXTENSIONS.has(ext) : false;
	}

	// File Handling
	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			const newFiles = Array.from(target.files);
			const validFiles: File[] = [];
			const invalidFiles: string[] = [];

			for (const file of newFiles) {
				if (isFileSupported(file)) {
					validFiles.push(file);
				} else {
					invalidFiles.push(file.name);
				}
			}

			if (invalidFiles.length > 0) {
				const unsupportedNames = invalidFiles.join(', ');
				toast.error(
					`Unsupported file type: ${unsupportedNames}. Supported types: PDF, JPEG, PNG, GIF, TIFF, BMP, WebP`
				);
			}

			files = [...files, ...validFiles];
			target.value = '';
		}
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	async function runWorkflow() {
		if (loading) return;
		loading = true;
		success = false;
		showError = false;
		error = null;

		try {
			const headers: Record<string, string> = {
				'X-API-Key': apiKey
			};

			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});

			const response = await fetch(`/rime/workflows/${workflow.id}/run-with-files`, {
				method: 'POST',
				headers: headers,
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to run workflow');
			}

			// Clear fields on success
			files = [];
			success = true;
		} catch (e: any) {
			error = e.message || 'Something went wrong';
			showError = true;

			// Reset error state after a delay with progress
			let duration = 5000;
			let elapsed = 0;
			let interval = setInterval(() => {
				elapsed += 100;
				feedbackProgress = 100 - (elapsed / duration) * 100;
				if (elapsed >= duration) {
					clearInterval(interval);
					showError = false;
					error = null;
					feedbackProgress = 100;
				}
			}, 100);
		} finally {
			loading = false;
			if (success) {
				let duration = 3000;
				let elapsed = 0;
				let interval = setInterval(() => {
					elapsed += 100;
					feedbackProgress = 100 - (elapsed / duration) * 100;
					if (elapsed >= duration) {
						clearInterval(interval);
						success = false;
						feedbackProgress = 100;
					}
				}, 100);
			}
		}
	}
</script>

<svelte:head>
	<title>Run Workflow - {workflow.name}</title>
</svelte:head>

<main
	class="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-950 px-4 text-white"
>
	<!-- HEADER -->
	<header
		class="fixed top-0 z-50 flex w-full max-w-3xl items-center justify-between border-b border-zinc-900/50 bg-zinc-950/50 px-4 py-4 backdrop-blur-md md:px-0"
	>
		<a href="/dashboard" class="flex items-center gap-2.5">
			<img src="/logo.svg" alt="Lekana Logo" class="h-6 w-6" />
			<span class="text-lg font-bold tracking-tight text-white/90">Lekana</span>
		</a>
		<SignedIn>
			<UserButton />
		</SignedIn>
	</header>

	<div class="w-full max-w-3xl pt-20 pb-10">
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
			<p class="text-zinc-500">Run this workflow by uploading your documents.</p>
		</div>

		<div class="flex w-full flex-col gap-6">
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
					<h2 class="text-lg font-semibold text-zinc-200">Upload Files</h2>
					<span class="text-xs text-zinc-500"
						>{files.length} file{files.length === 1 ? '' : 's'} added</span
					>
				</div>

				<div class="grid w-full gap-8 md:grid-cols-2" in:fade>
					<div
						class="relative flex flex-col {files.length > 0
							? ''
							: 'md:col-span-2'} min-h-72 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-10 transition-colors hover:border-green-500/50 hover:bg-zinc-900/80"
					>
						<input
							type="file"
							multiple
							accept=".pdf,.zip,image/*"
							class="absolute inset-0 cursor-pointer opacity-0"
							onchange={handleFileSelect}
						/>
						<CloudUpload class="mb-4 h-10 w-10 text-zinc-600" />
						<p class="text-zinc-400">Click or drag documents to upload</p>
						<p class="mt-1 text-xs text-zinc-600">PDF, Images, ZIP</p>
					</div>

					{#if files.length > 0}
						<div class="mt-4 max-h-72 space-y-2 overflow-y-auto pr-2">
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
			</section>

			<!-- Inputs Section Removed (Message) -->

			<div class="flex items-center justify-end gap-4 md:col-span-2">
				{#if showError && error}
					<div
						class="flex items-center gap-2 text-sm font-medium text-red-500"
						in:fly={{ x: 10, duration: 300 }}
						out:fade
					>
						<CircleAlert class="h-4 w-4" />
						<span>{error}</span>
					</div>
				{/if}

				<button
					onclick={runWorkflow}
					disabled={loading || files.length === 0 || apiKey.trim() === ''}
					class="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3 font-semibold text-white shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 {success
						? 'bg-green-600'
						: showError
							? 'bg-red-600'
							: 'bg-green-600 shadow-green-950/20 hover:bg-green-500'}"
				>
					{#if loading}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Uploading...</span>
					{:else if success}
						<div class="flex items-center gap-2" in:fade>
							<Check class="h-4 w-4" />
							<span>Success</span>
						</div>
					{:else if showError}
						<div class="flex items-center gap-2" in:fade>
							<CircleX class="h-4 w-4" />
							<span>Failed</span>
						</div>
					{:else}
						<Upload class="h-4 w-4 transition-transform group-hover:scale-110" />
						<span>Upload</span>
					{/if}

					{#if success || showError}
						<div
							class="absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-100"
							style="width: {feedbackProgress}%"
						></div>
					{/if}
				</button>
			</div>
		</div>
	</div>
</main>

<style>
	:global(body) {
		background-color: #09090b;
	}
</style>
