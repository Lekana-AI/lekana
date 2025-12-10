<script>
	let { fieldData, onInput } = $props();
</script>

{#if fieldData.type === 'text'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="text-zinc-200">{fieldData.label}</label>
		<input
			id={fieldData.name}
			bind:value={fieldData.value}
			type="text"
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
			oninput={(e) => onInput?.(e, fieldData)}
		/>
	</div>
{:else if fieldData.type === 'number'}
	<div class="flex flex-col gap-2 text-sm">
		<label for={fieldData.name} class="text-zinc-200">{fieldData.label}</label>
		<input
			id={fieldData.name}
			bind:value={fieldData.value}
			type="number"
			class="w-full rounded-lg border border-zinc-700 bg-black/50 px-3.5 py-2.5 text-white"
			placeholder={fieldData.placeholder}
		/>
	</div>
{:else if fieldData.type === 'checkbox'}
	<label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
		<input type="checkbox" bind:checked={fieldData.value} class="accent-green-500" />
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
					checked={fieldData.value.includes(option.value)}
					onchange={() => {
						if (fieldData.value.includes(option.value)) {
							fieldData.value = fieldData.value.filter((v) => v !== option.value);
						} else {
							fieldData.value = [...fieldData.value, option.value];
						}
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
{/if}
