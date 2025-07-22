<script lang="ts">
	import Poster from '$lib/components/view/poster.svelte';
	import Request from '$lib/components/buttons/request.svelte';
	import type { PageProps } from './$types';
	import { fetch_tmdb_ref } from '$lib/scripts/sonarr_api';
	import { onMount } from 'svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { url_resolver } from '$lib/scripts/url_utils';

	let { data }: PageProps = $props();
	let storage_controller = new LocalStorageController();
	let show_data = $state<any>();
	let tmdb_data = $state<any>();

	onMount(async () => {
		// check if the show is already in the library

		//
		let response = (await fetch_tmdb_ref(
			(data.data as any).id,
			storage_controller.get('sonarr_api_key')!
		)) as any;
		if (!response) {
			// check radarr
		} else {
			show_data = response;
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

<main class="px-4 pt-20">
	{#if tmdb_data}
		<div class="flex flex-row">
			<div>
				<Poster alt={tmdb_data.name} src={tmdb_data.poster_path} />
				<span class="text-xl font-bold text-white">
					{tmdb_data.name}
					<span class="italic">({tmdb_data.first_air_date})</span>
				</span>
			</div>
			<div>
				<h1 class="pl-3 text-lg font-bold">Overview:</h1>
				<p class="px-3 leading-7 text-neutral-50">
					{tmdb_data.overview}
				</p>
				<Request />
			</div>
		</div>
	{/if}
</main>
