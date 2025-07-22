<script lang="ts">
	import Poster from '$lib/components/view/poster.svelte';
	import SeasonPoster from '$lib/components/view/seasonPoster.svelte';
	import Request from '$lib/components/buttons/request.svelte';
	import type { PageProps } from './$types';
	import { fetch_series, fetch_tmdb_ref } from '$lib/scripts/sonarr_api';
	import { onMount } from 'svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { url_resolver } from '$lib/scripts/url_utils';

	let { data }: PageProps = $props();
	let storage_controller = new LocalStorageController();
	let tmdb_data = $state<any>();
	let show_type = $state<'series' | 'movie'>();

	onMount(async () => {
		// check if the show is already in the library
		// const series = await fetch_series(storage_controller.get('sonarr_api_key')!);
		// console.log(series);
		let response = (await fetch_tmdb_ref(
			(data.data as any).id,
			storage_controller.get('sonarr_api_key')!
		)) as any;
		if (!response) {
			// check radarr
			show_type = 'movie';
		} else {
			show_type = 'series';
			try {
				const r = await fetch(url_resolver('self') + 'api/tmdb/data?id=' + response.tmdbId);
				if (r.ok) {
					tmdb_data = await r.json();
				}
			} catch (err) {
				console.error(err);
			}
		}
	});

	$inspect(tmdb_data);
</script>

<main class="px-4 pt-20 pb-20">
	{#if tmdb_data}
		<div class="flex flex-row">
			<div>
				<Poster alt={tmdb_data.name} src={tmdb_data.poster_path} />
				<span class="text-xl font-bold text-white">
					{tmdb_data.name}
					<span class="italic">({tmdb_data.first_air_date})</span>
				</span>
			</div>
			<div class="px-3">
				<h1 class="text-lg font-bold">Overview:</h1>
				<p class="max-w-8/12 leading-7 text-neutral-50">
					{tmdb_data.overview}
				</p>
				<span class="mt-4 block">
					<Request id={tmdb_data.id} label={'Request All Seasons'} />
				</span>
			</div>
		</div>
		{#if show_type == 'series'}
			<div class="divider"></div>
			<div>
				<h1 class="mb-4 text-lg font-bold">Seasons</h1>
				<div class="flex flex-wrap gap-3">
					{#each tmdb_data.seasons as season}
						<div class="flex flex-col gap-2">
							<SeasonPoster src={season.poster_path} label={season.name} />
							<Request id={season.id} label={'Request S' + season.season_number} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</main>
