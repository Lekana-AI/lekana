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

<div class="flex flex-col items-center gap-2">
	<button
		oncontextmenu={(e) => {
			e.preventDefault();
			menuOpen = true;
		}}
		onblur={() => (menuOpen = false)}
		ondblclick={() => data.onClick?.({ node: data.node, ...data })}
		class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10"
	>
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/20 text-green-400">
			<Icon class="h-5 w-5" />
		</div>
		
		<Handle type="target" class="" position={Position.Left}   />
		<Handle type="source" class="" position={Position.Right}   />
	</button>

	<span class="max-w-[120px] text-center text-[8px] font-medium tracking-tight text-white/70">
		{data.node.config.stepName}
	</span>
</div>
