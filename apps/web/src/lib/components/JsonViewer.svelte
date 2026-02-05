<script lang="ts">
	import { ChevronRight, ChevronDown } from 'lucide-svelte';

	interface Props {
		data: any;
		depth?: number;
		label?: string; // Key name if part of an object/array
		isRoot?: boolean;
	}

	let { data, depth = 0, label = '', isRoot = false }: Props = $props();

	let expanded = $state(true);
	let hovered = $state(false);

	function toggle() {
		expanded = !expanded;
	}

	function getType(value: any) {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	}

	const type = $derived(getType(data));
	const isExpandable = $derived(type === 'object' || type === 'array');
	const isEmpty = $derived(
		(type === 'object' && Object.keys(data).length === 0) || (type === 'array' && data.length === 0)
	);

	const itemCount = $derived(
		type === 'array' ? data.length : type === 'object' ? Object.keys(data).length : 0
	);

	const shouldUnwrap = $derived(isRoot && isExpandable);

	const isUrl = $derived(typeof data === 'string' && data.startsWith('https://'));
	let urlExpanded = $state(false);

	import JsonViewer from './JsonViewer.svelte';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if shouldUnwrap}
	{#if type === 'array'}
		{#each data as item}
			<JsonViewer data={item} depth={0} />
		{/each}
	{:else}
		{#each Object.entries(data) as [key, value]}
			<JsonViewer data={value} depth={0} label={key} />
		{/each}
	{/if}
{:else}
	<div
		class=" text-xs leading-relaxed"
		style="margin-left: {depth > 0 ? 12 : 0}px"
		onmouseenter={() => (hovered = true)}
		onmouseleave={() => (hovered = false)}
	>
		<div class="flex items-start">
			{#if isExpandable && !isEmpty}
				<button
					type="button"
					onclick={toggle}
					class="mt-0.5 mr-1 text-zinc-500 transition-colors hover:text-zinc-300"
					aria-label={expanded ? 'Collapse' : 'Expand'}
				>
					{#if expanded}
						<ChevronDown class="h-3 w-3" />
					{:else}
						<ChevronRight class="h-3 w-3" />
					{/if}
				</button>
			{:else}
				<!-- Spacer for alignment if not expandable -->
				<span class="inline-block w-4"></span>
			{/if}

			<div class="min-w-0 flex-1">
				{#if label}
					<span class="mr-2 font-medium text-green-500 select-none">{label}:</span>
				{/if}

				{#if !isExpandable}
					<!-- Primitive values -->
					{#if type === 'string'}
						{#if isUrl}
							<button
								type="button"
								class="text-left break-all whitespace-pre-wrap {urlExpanded ? 'text-zinc-400' : 'text-blue-400'} hover:bg-white/10 rounded-md "
								onclick={() => (urlExpanded = !urlExpanded)}
							>
								{urlExpanded ? data : data.slice(0, 45) + '...'}
							</button>
						{:else}
							<span class="break-all whitespace-pre-wrap text-zinc-400">{data}</span>
						{/if}
					{:else if type === 'number'}
						<span class="text-blue-300">{data}</span>
					{:else if type === 'boolean'}
						<span class="text-orange-400">{data}</span>
					{:else if type === 'null'}
						<span class="text-red-400">null</span>
					{:else}
						<span class="text-zinc-400">{data}</span>
					{/if}
				{:else}
					<!-- Expandable Object/Array Summary -->
					{#if !expanded}
						<button
							type="button"
							onclick={toggle}
							class="text-xs text-zinc-500 hover:text-zinc-300"
						>
							<span class="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
								{itemCount}
								{itemCount === 1 ? 'item' : 'items'}
							</span>
						</button>
					{:else}
						<!-- Expanded Content -->
						{#if type === 'array'}
							<div class="my-0.5 border-l border-white/10 pl-2">
								{#each data as item, index}
									<JsonViewer data={item} depth={depth + 1} />
								{/each}
							</div>
						{:else}
							<div class="my-0.5 border-l border-white/10 pl-2">
								{#each Object.entries(data) as [key, value]}
									<JsonViewer data={value} depth={depth + 1} label={key} />
								{/each}
							</div>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}
