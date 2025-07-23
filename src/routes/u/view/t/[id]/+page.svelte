<script lang="ts">
	import DeleteId from '$lib/components/buttons/deleteId.svelte';
	import Hero from '$lib/components/view/hero.svelte';
	import SeasonPoster from '$lib/components/view/seasonPoster.svelte';
	import Request from '$lib/components/buttons/request.svelte';
	import { fetch_series, fetch_tmdb_ref } from '$lib/scripts/sonarr_api';
	import { onMount } from 'svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { url_resolver } from '$lib/scripts/url_utils';
	import { refresh_metadata_handler } from '$lib/events/default';

	let { data }: any = $props();
	let storage_controller = new LocalStorageController();
	let tmdb_data = $state<any>();
	let sonarr_data = $state<any>();
	let sonarr_array = $state<any[]>([]);
	let full_data = $derived({
		type: 'tv',
		sonarr_data: sonarr_data,
		sonarr_array_length: sonarr_array.length,
		tmdb_data: tmdb_data
	});
	let error = $state(false);

	async function load() {
		const response = (await fetch_tmdb_ref(
			(data.data as any).id,
			storage_controller.get('sonarr_api_key')!
		)) as any;
		if (response) {
			try {
				sonarr_array = await fetch_series(
					response.tvdbId,
					storage_controller.get('sonarr_api_key')!
				);
				if (sonarr_array.length > 0) {
					sonarr_data = sonarr_array[0];
				} else {
					sonarr_data = response;
				}

				const r = await fetch(url_resolver('self') + 'api/tmdb/data?id=' + response.tmdbId);
				if (r.ok) {
					tmdb_data = await r.json();
				}
				return;
			} catch (err) {
				console.error(err);
			}
		}
		error = true;
	}

	onMount(() => {
		load();
		refresh_metadata_handler.on('refresh_tv_view', load);
	});

	$inspect(tmdb_data);
	$inspect(sonarr_data);
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
							{#if sonarr_data.seasons[index].monitored && sonarr_array.length > 0}
								<DeleteId
									type="tv"
									id={sonarr_data.tvdbId}
									season={index}
									label={'Delete S' + season.season_number}
								/>
							{:else}
								<Request
									id={sonarr_data.tvdbId}
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
