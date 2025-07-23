<script lang="ts">
	import IconTrashcan from '$lib/icons/iconTrashcan.svelte';
	let {
		id,
		type,
		season,
		label = 'Delete',
		_class = ''
	}: {
		type: 'tv' | 'movie';
		id: string;
		label?: string;
		_class?: string;
		season: number | 'all';
	} = $props();
</script>

<button class={'btn btn-error ' + _class}>
	<IconTrashcan size={20} />
	{label}</button
>
