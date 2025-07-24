<script lang="ts">
	import Hero from '$lib/components/view/hero.svelte';
	import { onMount } from 'svelte';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { refresh_metadata_handler } from '$lib/events/default';
	import { fetch_data_tmdb, fetch_show } from '$lib/scripts/shared_api';

	let { data }: any = $props();
	let storage_controller = new LocalStorageController();
	let tmdb_data = $state<any>();
	let radarr_local = $state<any>();
	let full_data = $derived({
		type: 'movie',
		tmdb_data: tmdb_data,
		radarr_local: radarr_local
	});
	let error = $state(false);

	async function load() {
		radarr_local = null;
		try {
			const response = (await fetch_data_tmdb(
				(data.data as any).id,
				'radarr',
				storage_controller.get('radarr_api_key')!
			)) as any;
			if (response) {
				const r = await fetch_show(
					response.tmdbId,
					'radarr',
					storage_controller.get('radarr_api_key')!
				);
				if (r.length > 0) {
					radarr_local = r[0];
				}
				tmdb_data = response;
				return;
			}
		} catch (err) {
			console.error(err);
		}
		error = true;
	}

	onMount(() => {
		load();
		refresh_metadata_handler.on('refresh_movie_view', load);
	});

	$inspect(tmdb_data);
</script>

<main class="px-4 pt-20 pb-20">
	{#if tmdb_data}
		<Hero data={full_data} />
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
