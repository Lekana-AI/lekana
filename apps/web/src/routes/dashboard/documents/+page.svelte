<script lang="ts">
	import { onMount } from 'svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import { FileText, Download, ExternalLink, HardDrive, Zap } from 'lucide-svelte';

	interface Document {
		id: string;
		filename: string;
		size: number;
		sizeFormatted: string;
		mimeType: string;
		uploadedAt: string;
		workflowExecution?: {
			id: string;
			workflowName: string;
			status: string;
		};
	}

	interface UsageData {
		storage: {
			used: number;
			limit: number;
			usedFormatted: string;
			limitFormatted: string;
			percentage: number;
		};
		tokens: {
			used: number;
			limit: number | null;
		};
	}

	let documents = $state<Document[]>([]);
	let usage = $state<UsageData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let { data }: { data: any } = $props();
	const user = data?.user;

	onMount(async () => {
		await Promise.all([loadDocuments(), loadUsage()]);
		loading = false;
	});

	async function loadDocuments() {
		try {
			const res = await fetch('/api/runtime/documents');
			if (!res.ok) throw new Error('Failed to load documents');
			const data = await res.json();
			documents = data.documents || [];
		} catch (e: any) {
			console.error('Error loading documents:', e);
			error = e.message;
		}
	}

	async function loadUsage() {
		try {
			const res = await fetch('/api/usage');
			if (!res.ok) throw new Error('Failed to load usage');
			usage = await res.json();
		} catch (e: any) {
			console.error('Error loading usage:', e);
		}
	}

	async function openDocument(doc: Document) {
		try {
			const res = await fetch(`/api/runtime/documents/${doc.id}/url`);
			if (!res.ok) throw new Error('Failed to get document URL');
			const data = await res.json();
			window.open(data.url, '_blank');
		} catch (e: any) {
			console.error('Error opening document:', e);
			alert('Failed to open document: ' + e.message);
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getFileIcon(mimeType: string): string {
		if (mimeType.includes('pdf')) return '📄';
		if (mimeType.includes('image')) return '🖼️';
		if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
		if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
		return '📁';
	}
</script>

<svelte:head>
	<title>Documents - Lekana</title>
</svelte:head>

<main class="flex h-screen w-screen overflow-hidden bg-zinc-900">
	<SidePanel userName={user?.firstName} />

	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Header -->
		<header class="border-b border-zinc-800 bg-zinc-900 px-8 py-6">
			<h1 class="text-2xl font-bold text-white">Documents</h1>
			<p class="mt-1 text-sm text-zinc-400">View and manage your uploaded documents</p>
		</header>

		<div class="flex-1 overflow-y-auto p-8">
			<!-- Usage Cards -->
			{#if usage}
				<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Storage Usage -->
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
						<div class="mb-4 flex items-center gap-3">
							<div class="rounded-lg bg-blue-500/20 p-2">
								<HardDrive class="h-5 w-5 text-blue-400" />
							</div>
							<div>
								<h3 class="font-semibold text-white">Storage</h3>
								<p class="text-sm text-zinc-400">
									{usage.storage.usedFormatted} of {usage.storage.limitFormatted}
								</p>
							</div>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
							<div
								class="h-full rounded-full transition-all duration-500"
								class:bg-blue-500={usage.storage.percentage < 80}
								class:bg-yellow-500={usage.storage.percentage >= 80 && usage.storage.percentage < 95}
								class:bg-red-500={usage.storage.percentage >= 95}
								style="width: {Math.min(usage.storage.percentage, 100)}%"
							></div>
						</div>
						<p class="mt-2 text-right text-xs text-zinc-500">{usage.storage.percentage}% used</p>
					</div>

					<!-- Token Usage -->
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
						<div class="mb-4 flex items-center gap-3">
							<div class="rounded-lg bg-green-500/20 p-2">
								<Zap class="h-5 w-5 text-green-400" />
							</div>
							<div>
								<h3 class="font-semibold text-white">AI Tokens</h3>
								<p class="text-sm text-zinc-400">
									{usage.tokens.used.toLocaleString()} used
									{#if usage.tokens.limit}
										of {usage.tokens.limit.toLocaleString()}
									{/if}
								</p>
							</div>
						</div>
						{#if usage.tokens.limit}
							{@const tokenPercentage = Math.round((usage.tokens.used / usage.tokens.limit) * 100)}
							<div class="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
								<div
									class="h-full rounded-full bg-green-500 transition-all duration-500"
									style="width: {Math.min(tokenPercentage, 100)}%"
								></div>
							</div>
							<p class="mt-2 text-right text-xs text-zinc-500">{tokenPercentage}% used</p>
						{:else}
							<p class="text-xs text-zinc-500">No limit set</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Documents List -->
			<div class="rounded-xl border border-zinc-800 bg-zinc-900/50">
				<div class="border-b border-zinc-800 px-6 py-4">
					<h2 class="text-lg font-semibold text-white">Uploaded Files</h2>
				</div>

				{#if loading}
					<div class="flex items-center justify-center py-12">
						<div class="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
					</div>
				{:else if error}
					<div class="px-6 py-12 text-center text-red-400">{error}</div>
				{:else if documents.length === 0}
					<div class="px-6 py-12 text-center">
						<FileText class="mx-auto h-12 w-12 text-zinc-600" />
						<p class="mt-4 text-zinc-400">No documents uploaded yet</p>
						<p class="text-sm text-zinc-500">
							Documents will appear here when you run workflows with file uploads
						</p>
					</div>
				{:else}
					<div class="divide-y divide-zinc-800">
						{#each documents as doc}
							<div
								class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-800/50"
							>
								<div class="flex items-center gap-4">
									<span class="text-2xl">{getFileIcon(doc.mimeType)}</span>
									<div>
										<p class="font-medium text-white">{doc.filename}</p>
										<div class="flex items-center gap-2 text-xs text-zinc-500">
											<span>{doc.sizeFormatted}</span>
											<span>•</span>
											<span>{formatDate(doc.uploadedAt)}</span>
											{#if doc.workflowExecution}
												<span>•</span>
												<span class="text-zinc-400">{doc.workflowExecution.workflowName}</span>
											{/if}
										</div>
									</div>
								</div>
								<button
									onclick={() => openDocument(doc)}
									class="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
								>
									<ExternalLink class="h-4 w-4" />
									Open
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
