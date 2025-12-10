<script>
	import { ArrowRight, CloudUpload, CornerRightUp, X } from 'lucide-svelte';
	import Input from './Input.svelte';

	let { visible, onClose } = $props();

	const fields = [
		{
			name: 'step_name',
			label: 'Step Name',
			type: 'text',
			placeholder: 'Ex: Upload Documents',
			value: ''
		},
		{
			name: 'bulk_upload',
			label: 'Bulk Upload (zip, rar)',
			type: 'checkbox',
			value: false
		},
		{
			name: 'allowed_files',
			label: 'Allowed File Types',
			type: 'checkbox-group',
			value: ['pdf', 'images'],
			options: [
				{ label: 'PDF Files (pdf)', value: 'pdf' },
				{ label: 'Images (jpg, png, webp)', value: 'images' },
				{ label: 'Document (docx)', value: 'docx' }
			]
		},
		{
			name: 'allowed_inputs',
			label: 'Allowed Inputs',
			type: 'checkbox-group',
			value: ['form', 'api'],
			options: [
				{
					label: 'Form Input',
					value: true,
					trigger: 'button',
					triggerText: 'Edit Form Input',
					onClick: () => (editInputForm = true)
				},
				{
					label: 'API Request',
					value: false,
					trigger: 'link',
					triggerText: 'See API Docs',
					href: '/apidoc'
				}
			]
		}
	];

	function formSubmit() {
		const result = fields.reduce((acc, field) => {
			acc[field.name] = field.value;
			return acc;
		}, {});

		console.log(result	);

	}

	let editInputForm = false;
</script>

{#if visible}
	<main
		class="absolute inset-0 z-40 flex min-h-screen w-screen items-center justify-center overflow-clip bg-black/40 px-4 py-10 backdrop-blur-xs"
	>
		<div class="z-10 flex flex-col gap-8">
			<div class="h-full max-h-10/12 w-xl rounded-2xl bg-zinc-900 p-6 shadow-2xl">
				<!-- Header -->
				<div class="flex w-full justify-end">
					<button
						onclick={() => onClose?.(false)}
						class="p-2 text-white/60 transition-colors duration-300 hover:text-white/80"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
				<div class="flex w-full flex-col gap-2 pb-4">
					<p class="text-xs font-semibold tracking-widest text-green-400 uppercase">properties</p>
					<span class="flex items-center gap-2">
						<CloudUpload class="aspect-square h-full text-white" />
						<h1 class="text-2xl font-semibold text-white md:text-3xl">Upload File</h1>
					</span>
					<p class="mt-2 w-full text-sm text-zinc-300">
						Users upload files. Files are virus scanned and normalized for processing.
					</p>
				</div>
				<div class="space-y-6 py-2">
					{#each fields as fieldData}
						<Input onInput {fieldData} />
					{/each}
				</div>

				<div class="mt-7 flex items-center justify-end">
					<button
						type="button"
						onclick={() => {
							formSubmit();
						}}
						class="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-green-800 disabled:opacity-50"
					>
						Add Action to Workflow
						<CornerRightUp class="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	</main>
{/if}
