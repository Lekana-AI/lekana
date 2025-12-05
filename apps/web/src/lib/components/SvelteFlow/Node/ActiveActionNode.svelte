<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { id, data }: NodeProps = $props();

	import {
		UploadCloud,
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

	type IconComponent = typeof UploadCloud;

	const iconMap: Record<string, IconComponent> = {
		// Input & Pre-Processing
		'Upload files': UploadCloud,
		'Classification': ListChecks,
		'Segmentation': Grid3x3,
		'OCR': ScanText,

		// Data Quality & Validation
		'Validation': ShieldCheck,
		'De-duplication': CopyCheck,

		// Human Review
		'Human Review OCR': UserCheck,
		'Human Review Classification': UserCheck,
		'Human Review Segments': UserCheck,

		// Storage & Integrations
		'Database': Database,
		'Export to ERP, CRM, DMS': Share2,
		'Webhook / API': Webhook,
		'Email Notification / API': Mail,
		'Google Sheets': FileSpreadsheet,

		// Understanding & Structuring
		'Summarization': FileText,
		'Generate Document': FileOutput,

		// Logic & Computation
		'Arithmetic Operations': Calculator
	};

	const Icon = iconMap[data.label] ?? UploadCloud;
</script>

<div
	class="border-white/50 inline-flex w-full items-center justify-start gap-4 rounded-lg border bg-white/5 px-3 py-2 backdrop-blur transition-colors duration-300 hover:border-white/70"
>
	<span
		class="flex items-center justify-center rounded-full bg-radial from-green-500 from-0% to-green-700 to-60% p-1.5"
	>
		<Icon class="h-3 w-3 text-white" />
	</span>

	<span class="truncate text-xs leading-5 font-semibold text-zinc-300">
		{data.label}
	</span>
</div>

<Handle type="target" position={Position.Top} />
<Handle type="source" position={Position.Bottom} />
