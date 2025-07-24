<script lang="ts">
	import DeleteId from '$lib/components/buttons/deleteId.svelte';
	import Hero from '$lib/components/view/hero.svelte';
	import SeasonPoster from '$lib/components/view/seasonPoster.svelte';
	import Request from '$lib/components/buttons/request.svelte';
	import { fetch_data_tmdb, fetch_show } from '$lib/scripts/shared_api';
	import { onMount } from 'svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { url_resolver } from '$lib/scripts/url_utils';
	import { refresh_metadata_handler } from '$lib/events/default';

	let { data }: any = $props();
	let storage_controller = new LocalStorageController();
	let tmdb_data = $state<any>();
	let sonarr_database = $state<any>();
	let sonarr_local = $state<any>();
	let full_data = $derived({
		type: 'tv',
		sonarr_database: sonarr_database, // default sonarr stats from tvdb etc
		sonarr_local: sonarr_local, // actual data for the show on sonarr server
		tmdb_data: tmdb_data
	});
	let error = $state(false);

	async function load() {
		sonarr_local = null;
		try {
			const response = (await fetch_data_tmdb(
				(data.data as any).id,
				'sonarr',
				storage_controller.get('sonarr_api_key')!
			)) as any;
			if (response) {
				const sonarr_array = await fetch_show(
					response.tvdbId,
					'sonarr',
					storage_controller.get('sonarr_api_key')!
				);
				if (sonarr_array.length > 0) {
					sonarr_database = sonarr_array[0];
					sonarr_local = sonarr_array[0];
				} else {
					sonarr_database = response;
				}

				const r = await fetch(url_resolver('self') + 'api/tmdb/data?id=' + response.tmdbId);
				if (r.ok) {
					tmdb_data = await r.json();
				}
				return;
			}
		} catch (err) {
			console.error(err);
		}
		error = true;
	}

	onMount(() => {
		load();
		refresh_metadata_handler.on('refresh_tv_view', load);
	});

	$inspect(tmdb_data);
	$inspect(sonarr_database);
	$inspect(sonarr_local);
</script>

<main class="px-4 pt-20 pb-20">
	{#if tmdb_data}
		<Hero data={full_data} />
		<div class="divider"></div>
		<div>
			<h1 class="mb-4 text-lg font-bold">Seasons</h1>
			<div class="flex flex-wrap gap-3">
				{#each tmdb_data.seasons as season, index}
					<div class="flex flex-col gap-2">
						<span class="flex flex-col gap-2 rounded px-1 py-1 outline-1 outline-neutral-800">
							<SeasonPoster src={season.poster_path} label={season.name} />
							{#if sonarr_local?.seasons[index].monitored}
								<DeleteId
									type="tv"
									id={sonarr_database.tvdbId}
									season={index}
									label={'Delete S' + season.season_number}
								/>
							{:else}
								<Request
									id={sonarr_database.tvdbId}
									type="tv"
									season={index}
									label={'Request S' + season.season_number}
									_class={'w-full'}
								/>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	{#if error}
		<div>
			<div class="mockup-code w-full">
				<pre data-prefix="1"><code>An Internal Error Occured Looking Up Your Series</code></pre>
				<pre data-prefix="2"><code class="bg-red-700 text-red-200">{JSON.stringify(data)}</code
					></pre>
				<pre data-prefix="3"></pre>
				<pre data-prefix="4"><code>Please email the text in red to neosahadeo@protonmail.com</code
					></pre>
			</div>
		</div>
	{/if}
</main>
