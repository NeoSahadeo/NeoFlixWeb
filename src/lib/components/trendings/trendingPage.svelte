<script lang="ts">
	import Poster from '$lib/components/poster/poster.svelte';
	let { data, type }: { data: any; type: 'tv' | 'movie' } = $props();
</script>

<main class="flex flex-wrap gap-3 px-4 pt-20 pb-10">
	{#each (data as any).trending.results as result}
		<Poster {type} alt={result.name} src={result.poster_path} id={result.id} />
	{/each}
</main>
