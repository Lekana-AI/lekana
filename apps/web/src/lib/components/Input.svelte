<script>
	import {
		Minus,
		Plus,
		Info,
		Eye,
		EyeOff,
		Loader2,
		CircleCheck,
		CircleX,
		Lock,
		LockOpen
	} from 'lucide-svelte';
	import { toast } from '$lib/toast.svelte';

	let showPassword = $state(false);
	let connectionTesting = $state(false);
	let connectionResult = $state(null);
	let {
		fieldData = $bindable(),
		onInput,
		extractedFields,
		upstreamOutputVariables = []
	} = $props();

	// Test database connection
	async function testConnection() {
		if (!fieldData.value) return;

		connectionTesting = true;
		connectionResult = null;

		try {
			// Call workflow-builder's test-connection endpoint
			const res = await fetch('/api/utils/test-connection', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ databaseUrl: fieldData.value })
			});

			const data = await res.json();
			connectionResult = data;

			if (data.success) {
				fieldData.testConnectionStatus = true;
			}
		} catch (error) {
			console.error('Connection test error:', error);
			toast.error('Failed to test connection. Please try again in a moment.');
			connectionResult = {
				success: false,
				message: error.message || 'Connection test failed'
			};
		} finally {
			connectionTesting = false;
			showPassword = false;
		}
	}

	$effect(() => {
		if (fieldData.type === 'keyValue' && fieldData.useExtractedFields && extractedFields) {
			const currentMapping = fieldData.value || [];
			// Create a set of existing keys for easier lookup, normalizing to lowercase/trimmed
			const currentKeys = new Set(
				currentMapping.map((m) => (m.key ? m.key.toString().trim().toLowerCase() : ''))
			);

			let updated = false;
			const newMapping = [...currentMapping];

			extractedFields.forEach((field) => {
				const normalizedField = field ? field.toString().trim().toLowerCase() : '';
				if (normalizedField && !currentKeys.has(normalizedField)) {
					newMapping.push({ key: field, value: '' });
					updated = true;
					// Add to currentKeys to prevent duplicates within the extractedFields list itself if any
					currentKeys.add(normalizedField);
				}
			});

			if (updated) {
				fieldData.value = newMapping;
				onInput?.({ target: { value: fieldData.value } }, fieldData);
			}
		}
	});
</script>

{#snippet infoTooltip()}
	{#if fieldData.required}
		<span class="text-green-500">*</span>
	{/if}
	{#if fieldData.info}
		<div class="group relative inline-block">
			<Info
				size="14"
				class="inline-block cursor-pointer text-zinc-500 transition-colors hover:text-zinc-300"
			/>
			<div
				class="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-md bg-zinc-800 p-2 text-xs text-zinc-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
			>
				{fieldData.info}
				<div
					class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"
				></div>
			</div>
		</div>
	{/if}
{/snippet}

{#if fieldData.type === 'text'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<input
			id={fieldData.name}
			bind:value={fieldData.value}
			type="text"
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		/>
	</div>
{:else if fieldData.type === 'number'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<input
			id={fieldData.name}
			bind:value={fieldData.value}
			type="number"
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		/>
	</div>
{:else if fieldData.type === 'checkbox'}
	<label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
		<input
			type="checkbox"
			bind:checked={fieldData.value}
			class="accent-green-500"
			oninput={(e) => onInput?.(e, fieldData)}
		/>
		{fieldData.label}
		{@render infoTooltip()}
	</label>
{:else if fieldData.type === 'checkbox-group'}
	<div class="flex flex-col gap-2 text-sm">
		<p class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</p>

		{#each fieldData.options as option}
			<label class="flex cursor-pointer items-center gap-2 text-zinc-300">
				<input
					type="checkbox"
					class="accent-green-500"
					checked={fieldData.value?.includes(option.value)}
					onchange={() => {
						if (fieldData.value?.includes(option.value)) {
							fieldData.value = fieldData.value.filter((v) => v !== option.value);
						} else {
							fieldData.value = [...(fieldData.value ?? []), option.value];
						}
						onInput?.({ target: { value: fieldData.value } }, fieldData);
					}}
				/>

				{option.label}

				{#if option.trigger === 'link'}
					<a
						class="text-green-600 transition-colors duration-300 hover:text-green-500"
						href={option.href}
						target="_blank"
					>
						({option.triggerText ?? 'View'})
					</a>
				{/if}

				{#if option.trigger === 'button'}
					<button
						type="button"
						class="text-green-600 transition-colors duration-300 hover:text-green-500"
						onclick={() => option.onClick?.()}
					>
						({option.triggerText ?? 'Action'})
					</button>
				{/if}
			</label>
		{/each}
	</div>
{:else if fieldData.type === 'select'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>

		<select
			id={fieldData.name}
			bind:value={fieldData.value}
			class="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-white"
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		>
			{#each fieldData.options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
{:else if fieldData.type === 'password'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<div class="relative">
			<input
				id={fieldData.name}
				bind:value={fieldData.value}
				type={showPassword ? 'text' : 'password'}
				class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 pr-10 text-white"
				placeholder={fieldData.placeholder}
				required={fieldData.required}
				oninput={(e) => {
					onInput?.(e, fieldData);
				}}
			/>
			<button
				type="button"
				class="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
				onclick={() => (showPassword = !showPassword)}
			>
				{#if showPassword}
					<EyeOff size="18" />
				{:else}
					<Eye size="18" />
				{/if}
			</button>
		</div>
	</div>
{:else if fieldData.type === 'dbUrl'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<div class="relative">
			<input
				id={fieldData.name}
				bind:value={fieldData.value}
				type={showPassword ? 'text' : 'password'}
				class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 pr-10 text-white disabled:opacity-70"
				placeholder={fieldData.placeholder}
				required={fieldData.required}
				disabled={fieldData.testConnectionStatus}
				oninput={(e) => {
					connectionResult = null;
					fieldData.testConnectionStatus = false;
					onInput?.(e, fieldData);
				}}
			/>
			<button
				type="button"
				class="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
				onclick={() => {
					if (fieldData.testConnectionStatus) {
						connectionResult = null;
						fieldData.testConnectionStatus = false;
					} else {
						showPassword = !showPassword;
					}
				}}
			>
				{#if fieldData.testConnectionStatus}
					<Lock size="18" class="text-green-500" />
				{:else if showPassword}
					<EyeOff size="18" />
				{:else}
					<Eye size="18" />
				{/if}
			</button>
		</div>
		{#if fieldData.testConnection}
			<div class="flex w-fit flex-col gap-2">
				<div class="flex items-center gap-3">
					<button
						type="button"
						disabled={!fieldData.value || connectionTesting || fieldData.testConnectionStatus}
						onclick={testConnection}
						class="flex w-fit items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-50"
					>
						{#if connectionTesting}
							<Loader2 size="14" class="animate-spin" />
							Testing...
						{:else}
							Test Connection
						{/if}
					</button>
					{#if !fieldData.testConnectionStatus && !connectionTesting}
						<span class="text-[10px] text-zinc-500 italic"
							>Please verify the link before proceeding</span
						>
					{/if}
				</div>

				{#if connectionResult}
					{#if connectionResult.success}
						<span class="flex items-center gap-1 text-xs text-green-400">
							<CircleCheck size="14" />
							Connected: {connectionResult.details?.database}
						</span>
					{:else}
						<span class="flex items-center gap-1 text-xs text-red-400">
							<CircleX size="14" />
							Connection Failed: {connectionResult.message}
						</span>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
{:else if fieldData.type === 'array'}
	<!-- Field Data Value for Array: ['item1', 'item2'] -->
	<div class="flex flex-col gap-2 text-sm">
		<div class="flex items-stretch justify-between">
			<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
				{fieldData.label}
				{@render infoTooltip()}
			</label>
			<button
				type="button"
				class="flex items-center self-stretch rounded-md bg-zinc-800/70 px-4 text-[11px] text-zinc-200 transition-colors hover:bg-zinc-800 disabled:bg-zinc-800/50 disabled:opacity-50"
				onclick={() => {
					if (!fieldData.value) fieldData.value = [];
					fieldData.value.push('');
					onInput?.({ target: { value: fieldData.value } }, fieldData);
				}}
			>
				Add Item
			</button>
		</div>

		{#each fieldData.value ?? [] as item, index}
			<div
				class="flex w-full items-stretch overflow-clip rounded-lg border border-zinc-700 bg-black/50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
			>
				<input
					type="text"
					bind:value={fieldData.value[index]}
					class="w-full px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
					placeholder="Enter value..."
					oninput={() => onInput?.({ target: { value: fieldData.value } }, fieldData)}
				/>

				<button
					type="button"
					onclick={() => {
						fieldData.value = fieldData.value.filter((_, i) => i !== index);
						onInput?.({ target: { value: fieldData.value } }, fieldData);
					}}
					class="flex items-center self-stretch px-4 text-white transition-colors hover:text-white/70 disabled:text-white/30"
				>
					<Minus size="16" />
				</button>
			</div>
		{/each}
	</div>
{:else if fieldData.type === 'keyValue'}
	<!-- Field Data Value for KeyValue: [{ key: 'k', value: 'v' }] -->
	<div class="flex flex-col gap-2 text-sm">
		<div class="flex items-stretch justify-between">
			<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
				{fieldData.label}
				{@render infoTooltip()}
			</label>
			<button
				type="button"
				class="flex items-center self-stretch rounded-md bg-zinc-800/70 px-4 text-[11px] text-zinc-200 transition-colors hover:bg-zinc-800 disabled:bg-zinc-800/50 disabled:opacity-50"
				onclick={() => {
					if (!fieldData.value) fieldData.value = [];
					fieldData.value.push({ key: '', value: '' });
					onInput?.({ target: { value: fieldData.value } }, fieldData);
				}}
			>
				{#if fieldData.useExtractedFields}
					<Plus size="12" class="mr-1" /> Add Custom
				{:else}
					Add Pair
				{/if}
			</button>
		</div>

		{#each fieldData.value ?? [] as item, index (item)}
			<div class="flex w-full items-center gap-2">
				<div
					class="flex w-full items-stretch overflow-clip rounded-lg border border-zinc-700 bg-black/50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
				>
					<input
						type="text"
						bind:value={fieldData.value[index].key}
						class="w-1/3 border-r border-zinc-700 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
						placeholder={fieldData.keyLabel}
						readonly={fieldData.useExtractedFields && extractedFields?.includes(item.key)}
						oninput={() => onInput?.({ target: { value: fieldData.value } }, fieldData)}
					/>
					<input
						type="text"
						bind:value={fieldData.value[index].value}
						class="w-2/3 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
						placeholder={fieldData.valueLabel}
						oninput={() => onInput?.({ target: { value: fieldData.value } }, fieldData)}
					/>
				</div>

				<button
					type="button"
					onclick={() => {
						fieldData.value = fieldData.value.filter((_, i) => i !== index);
						onInput?.({ target: { value: fieldData.value } }, fieldData);
					}}
					class="rounded-lg border border-zinc-700 p-2 text-white transition-colors hover:bg-zinc-800 hover:text-white/70"
				>
					<Minus size="16" />
				</button>
			</div>
		{/each}
	</div>
{:else if fieldData.type === 'textarea'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<textarea
			id={fieldData.name}
			bind:value={fieldData.value}
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
			rows="4"
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		></textarea>
	</div>
{:else if fieldData.type === 'dynamicSelect'}
	<!-- Dropdown populated from upstream's outputVariables -->
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		<select
			id={fieldData.name}
			bind:value={fieldData.value}
			class="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-white"
			oninput={(e) => onInput?.(e, fieldData)}
		>
			<option value="">Select field...</option>
			{#each upstreamOutputVariables as variable}
				<option value={variable}>{variable}</option>
			{/each}
		</select>
		{#if fieldData.description}
			<p class="text-xs text-zinc-500">{fieldData.description}</p>
		{/if}
	</div>
{:else if fieldData.type === 'dynamicSelectValues'}
	<!-- Dropdown + text input for values from upstream -->
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="flex items-center gap-1.5 text-zinc-200">
			{fieldData.label}
			{@render infoTooltip()}
		</label>
		{#if extractedFields && extractedFields.length > 0}
			<select
				bind:value={fieldData.value}
				class="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-white"
				oninput={(e) => onInput?.(e, fieldData)}
			>
				<option value="">Select value...</option>
				{#each extractedFields as field}
					<option value={field}>{field}</option>
				{/each}
			</select>
		{/if}
		{#if fieldData.allowCustom || !extractedFields || extractedFields.length === 0}
			<input
				type="text"
				bind:value={fieldData.value}
				placeholder={extractedFields?.length > 0 ? 'Or type custom value...' : 'Enter value...'}
				class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
				oninput={(e) => onInput?.(e, fieldData)}
			/>
		{/if}
		{#if fieldData.description}
			<p class="text-xs text-zinc-500">{fieldData.description}</p>
		{/if}
	</div>
{/if}
