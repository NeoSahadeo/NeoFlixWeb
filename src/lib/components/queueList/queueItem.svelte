<script lang="ts">
	import IconTrashcan from '$lib/icons/iconTrashcan.svelte';
	let {
		data,
		type,
		index
	}: {
		data: any;
		index: number;
		type: 'tv' | 'movie';
	} = $props();

	// $inspect(data);
</script>

<li class={`rounded px-3 py-2 ${index % 2 ? 'bg-base-100' : 'bg-base-200'}`}>
	<div class="flex flex-row items-center">
		<div class="flex flex-col items-start gap-2">
			<div class="text-md font-bold">{data.title}</div>
			<div class="text-xs font-semibold uppercase">Time Left: {data.timeleft}</div>
		</div>
		<button class="btn btn-error ml-auto border-0 hover:cursor-pointer"
			><span class="pointer-events-none"><IconTrashcan size={24} /></span></button
		>
	</div>
</li>
