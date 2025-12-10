<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

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
		Calculator
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

	const Icon = iconMap[data.label] ?? CloudUpload;
</script>

<button
	ondblclick={() => data.onClick?.({ id, ...data })}
	class="inline-flex w-full items-center justify-start gap-4 rounded-lg border border-white/50 bg-white/5 px-3 py-2 backdrop-blur transition-colors duration-300 hover:bg-white/10"
>
	<span
		class="flex items-center justify-center rounded-full bg-green-700 p-1"
	>
		<Icon class="h-2 w-2 text-white" />
	</span>

	<span class="truncate text-xs leading-5 font-semibold text-zinc-300">
		{data.label}
	</span>
</button>

<Handle type="target" position={Position.Top} />
<Handle type="source" position={Position.Bottom} />
