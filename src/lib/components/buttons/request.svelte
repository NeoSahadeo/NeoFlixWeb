<script lang="ts">
	import IconPlus from '$lib/icons/iconPlus.svelte';
	let { id, label = 'Request' } = $props();
</script>

<button class="btn btn-success">
	<IconPlus size={20} />
	{label}</button
>
