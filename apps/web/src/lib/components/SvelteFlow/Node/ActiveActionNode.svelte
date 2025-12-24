<script lang="ts">
	import { Handle, NodeToolbar, Position, type NodeProps } from '@xyflow/svelte';
	import { toast } from '$lib/toast.svelte';

	import {
		CloudUpload,
		ListChecks,
		Grid3x3,
		ScanText,
		ShieldCheck,
		CopyCheck,
		UserCheck,
		Database,
		Share2,
		Webhook,
		Mail,
		FileSpreadsheet,
		FileText,
		FileOutput,
		Calculator,
		Trash2,
		Ellipsis,
		Settings2,
		CopyPlus,
		Trash,
		Edit,
		Copy,
		Settings
	} from 'lucide-svelte';

	let { id, data }: NodeProps = $props();

	type IconComponent = typeof CloudUpload;

	const iconMap: Record<string, IconComponent> = {
		'Upload Files': CloudUpload,
		Classification: ListChecks,
		Segmentation: Grid3x3,
		OCR: ScanText,
		Validation: ShieldCheck,
		'De-duplication': CopyCheck,
		'Human Review OCR': UserCheck,
		'Human Review Classification': UserCheck,
		'Human Review Segments': UserCheck,
		Database: Database,
		'Export to ERP, CRM, DMS': Share2,
		'Webhook / API': Webhook,
		'Email Notification / API': Mail,
		'Google Sheets': FileSpreadsheet,
		Summarization: FileText,
		'Generate Document': FileOutput,
		'Arithmetic Operations': Calculator
	};

	let menuOpen = $state(false);

	const Icon = iconMap[data.node.config.stepName] ?? CloudUpload;
</script>

<NodeToolbar align="end" offset="0">
	<div class="relative flex w-full justify-end">
		<button
			onclick={() => (menuOpen = !menuOpen)}
			class="rounded-lg p-2 text-white hover:bg-white/10"
		>
			<Ellipsis class="h-4 w-4" />
		</button>
		<!-- DROPDOWN MENU -->
		{#if menuOpen}
			<div
				class="absolute top-0 left-full z-30 min-w-full overflow-clip rounded-xl border border-white/10 bg-zinc-900 font-medium text-gray-200 shadow-xl"
			>
				<button
					type="button"
					class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
					onclick={() => data.onClick?.({ node: data.node, ...data })}
				>
					<Settings class="h-4 w-4" />

					Configure
				</button>

				<button
					class="flex w-full items-center gap-2 p-3 text-left text-xs hover:bg-white/10"
					onclick={() => console.log('Duplicate', id)}
				>
					<Copy class="h-4 w-4" />

					Copy
				</button>

				<button
					class="flex w-full items-center gap-2 p-3 text-left text-xs text-red-400 hover:bg-red-500/10"
					onclick={() => data.onDelete?.({ id, ...data })}
				>
					<Trash class="h-4 w-4" />

					Delete
				</button>
			</div>
		{/if}
	</div>
</NodeToolbar>

<button
	oncontextmenu={(e) => {
		e.preventDefault();
		menuOpen = true;
	}}
	onblur={() => (menuOpen = false)}
	ondblclick={() => data.onClick?.({ node: data.node, ...data })}
	class="inline-flex w-full items-center justify-start gap-4 rounded-lg border border-white/50 bg-white/5 px-3 py-2 backdrop-blur transition-colors duration-300 hover:bg-white/10"
>
	<span class="flex items-center justify-center rounded-full bg-green-700 p-1">
		<Icon class="h-2 w-2 text-white" />
	</span>

	<span class="truncate text-xs leading-5 font-semibold text-zinc-300">
		{data.node.config.stepName}
	</span>
</button>

<Handle type="target" class="" position={Position.Top} />
<Handle type="source" class="" position={Position.Bottom} />
