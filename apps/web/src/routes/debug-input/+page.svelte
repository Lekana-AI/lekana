<script>
	import Input from '$lib/components/Input.svelte';

	let fieldData = $state({
		name: 'headers',
		label: 'Headers (KeyValue)',
		type: 'keyValue',
		keyLabel: 'Key',
		valueLabel: 'Value',
		value: [{ key: '', value: '' }]
	});

	let arrayData = $state({
		name: 'tags',
		label: 'Tags (Array)',
		type: 'array',
		value: ['initial']
	});
</script>

<div class="flex min-h-screen gap-10 bg-zinc-900 p-10 text-white">
	<div class="flex-1">
		<h1 class="mb-4 text-2xl">Input Debugger</h1>

		<div class="mb-8 rounded-lg border border-zinc-700 p-4">
			<h2 class="mb-2 font-bold">KeyValue State:</h2>
			<pre class="rounded bg-black p-2 text-xs">{JSON.stringify(fieldData, null, 2)}</pre>
		</div>

		<Input {fieldData} />
	</div>

	<div class="flex-1">
		<h1 class="mb-4 text-2xl">&nbsp;</h1>

		<div class="mb-8 rounded-lg border border-zinc-700 p-4">
			<h2 class="mb-2 font-bold">Array State:</h2>
			<pre class="rounded bg-black p-2 text-xs">{JSON.stringify(arrayData, null, 2)}</pre>
		</div>

		<Input fieldData={arrayData} />
	</div>
</div>
