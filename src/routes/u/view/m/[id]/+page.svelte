<script lang="ts">
	import DeleteId from '$lib/components/buttons/deleteId.svelte';
	import Hero from '$lib/components/view/hero.svelte';
	import Request from '$lib/components/buttons/request.svelte';
	import { fetch_series, fetch_tmdb_ref } from '$lib/scripts/sonarr_api';
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
		radarr_database: sonarr_database, // default radarr stats from tvdb etc
		radarr_local: sonarr_local, // actual data for the show on radarr server
		tmdb_data: tmdb_data
	});
	let error = $state(false);

	async function load() {
		try {
		} catch (err) {
			console.error(err);
		}
		error = true;
	}

	onMount(() => {
		load();
		refresh_metadata_handler.on('refresh_movie_view', load);
	});
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
