<script lang="ts">
	import Poster from '$lib/components/poster/poster.svelte';
	import { url_resolver } from '$lib/scripts/url_utils';
	import { onMount } from 'svelte';

	let tvshows = $state<any[]>([]);
	let movies = $state<any[]>([]);

	const pop_sort = (x: any, y: any) => {
		if (x.popularity > y.popularity) {
			return -1;
		} else if (x.popularity < y.popularity) {
			return 1;
		}
		return 0;
	};

	onMount(async () => {
		const match = window.location.search.match(/(?<=[?&]q=)([^&]+)/gm);
		if (match) {
			const query = decodeURI(match[0]);
			const response = await fetch(url_resolver('self') + 'api/tmdb/search', {
				method: 'POST',
				body: JSON.stringify({
					query: query
				})
			});
			if (response.ok) {
				const json = await response.json();
				console.log(json.data);
				tvshows = json.data.tv.results;
				movies = json.data.movie.results;
				tvshows.sort(pop_sort);
				movies.sort(pop_sort);
			}
		}
	});
</script>

<main class="flex flex-col gap-3 px-4 pt-16 pb-10">
	{#if tvshows.length > 0}
		<h1 class="text-lg font-bold">TV Shows</h1>
	{/if}
	<div class="flex flex-wrap gap-3">
		{#each tvshows as result}
			{#if result.poster_path}
				<Poster alt={result.name} src={result.poster_path} id={result.id} />
			{/if}
		{/each}
	</div>
	{#if movies.length > 0}
		<div class="divider"></div>
		<h1 class="text-lg font-bold">Movies</h1>
	{/if}
	<div class="flex flex-wrap gap-3">
		{#each movies as result}
			{#if result.poster_path}
				<Poster alt={result.name} src={result.poster_path} id={result.id} />
			{/if}
		{/each}
	</div>
</main>
