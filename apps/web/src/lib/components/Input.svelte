<script>
	import { JSONEditor } from 'svelte-jsoneditor';
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
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			required={fieldData.required}
			oninput={(e) => onInput?.(e, fieldData)}
		>
			{#each fieldData.options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
{:else if fieldData.type === 'json'}
	<div class="flex flex-col gap-2 text-sm max-h-20 h-full">
		<label for="JSON Input" class="text-zinc-200">{fieldData.label}</label>

		<JSONEditor
			mode={"text"}
			mainMenuBar={false}
			navigationBar={false}
			statusBar={false}
			content={{ text: fieldData.value ?? '{}' }}
			onChange={({ detail }) => {
				fieldData.value = detail.text;
				onInput?.({ target: { value: detail.text } }, fieldData);
			}}
		/>
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
