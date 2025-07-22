<script lang="ts">
	import type { PageProps } from './$types';
	import Poster from '$lib/components/poster/poster.svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	const storage_controller = new LocalStorageController();
	onMount(() => {
		// storage_controller.get('tv_time_window') || 'day';
	});
	$inspect((data as any).trending.results);
</script>

<main class="flex flex-wrap gap-3 px-4 pt-16 pb-10">
	{#each (data as any).trending.results as result}
		<Poster alt={result.name} src={result.poster_path} id={result.id} />
	{/each}
</main>
