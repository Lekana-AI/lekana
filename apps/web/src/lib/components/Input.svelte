<script>
	import { Minus } from 'lucide-svelte';
	let { fieldData, onInput } = $props();
</script>

{#if fieldData.type === 'text'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="text-zinc-200">
			{fieldData.label}
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
		<label for={fieldData.name} class="text-zinc-200">
			{fieldData.label}
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
	</label>
{:else if fieldData.type === 'checkbox-group'}
	<div class="flex flex-col gap-2 text-sm">
		<p class="text-zinc-200">{fieldData.label}</p>

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
	<!-- for "method" in your backend (GET/POST/PUT/DELETE) -->
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="text-zinc-200">
			{fieldData.label}
		</label>
		<select
			id={fieldData.name}
			bind:value={fieldData.value}
			class="w-full rounded-lg border border-zinc-700 bg-black px-3.5 py-2.5 text-white"
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
		<label for={fieldData.name} class="text-zinc-200">
			{fieldData.label}
		</label>
		<input
			id={fieldData.name}
			bind:value={fieldData.value}
			type="password"
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		/>
	</div>
{:else if fieldData.type === 'array'}
	<!-- Field Data Value for Array: ['item1', 'item2'] -->
	<div class="flex flex-col gap-2 text-sm">
		<div class="flex items-stretch justify-between">
			<label for={fieldData.name} class="text-zinc-200">
				{fieldData.label}
			</label>
			<button
				type="button"
				class="flex items-center self-stretch rounded-md bg-zinc-800/70 px-4 text-[11px] text-zinc-200 transition-colors hover:bg-zinc-800 disabled:bg-zinc-800/50 disabled:opacity-50"
				onclick={() => {
					fieldData.value = [...(fieldData.value ?? []), ''];
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
			<label for={fieldData.name} class="text-zinc-200">
				{fieldData.label}
			</label>
			<button
				type="button"
				class="flex items-center self-stretch rounded-md bg-zinc-800/70 px-4 text-[11px] text-zinc-200 transition-colors hover:bg-zinc-800 disabled:bg-zinc-800/50 disabled:opacity-50"
				onclick={() => {
					fieldData.value = [...(fieldData.value ?? []), { key: '', value: '' }];
					onInput?.({ target: { value: fieldData.value } }, fieldData);
				}}
			>
				Add Pair
			</button>
		</div>

		{#each fieldData.value ?? [] as item, index}
			<div class="flex w-full items-center gap-2">
				<div
					class="flex w-full items-stretch overflow-clip rounded-lg border border-zinc-700 bg-black/50 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
				>
					<input
						type="text"
						bind:value={fieldData.value[index].key}
						class="w-1/3 border-r border-zinc-700 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
						placeholder="Key"
						oninput={() => onInput?.({ target: { value: fieldData.value } }, fieldData)}
					/>
					<input
						type="text"
						bind:value={fieldData.value[index].value}
						class="w-2/3 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-zinc-500"
						placeholder="Value"
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
		<label for={fieldData.name} class="text-zinc-200">
			{fieldData.label}
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
{/if}