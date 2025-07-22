<script lang="ts">
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import { fetch_series, fetch_tmdb_ref } from '$lib/scripts/sonarr_api';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { onMount } from 'svelte';

	const storage_controller = new LocalStorageController();
	let storage_name = $state<string>('');
	let storage_in = $state<string>('');

	let tmdb_sonarr = $state<string>('');
	let sonarr_json = $state<any>();

	let image_src = $state<HTMLImageElement>();
</script>

<Navbar />

<main class="flex w-fit flex-col gap-3 pt-20">
	<img alt="Placeholder" class="absolute top-30 right-10 max-w-20" bind:this={image_src} />
	<div class="divider-secondary w-full"></div>
	<input type="text" bind:value={storage_name} class="input input-accent" />
	<input type="text" bind:value={storage_in} class="input input-accent" />
	<button class="btn btn-primary" onclick={() => storage_controller.set(storage_name, storage_in)}>
		Save to Storage
	</button>
	<div class="divider w-full"></div>
	<input type="text" bind:value={tmdb_sonarr} class="input input-accent" />
	<button
		class="btn btn-primary"
		onclick={async () => {
			const x = await fetch_tmdb_ref(tmdb_sonarr, storage_controller.get('sonarr_api_key')!);
			console.log(x);
			sonarr_json = x;
			image_src!.src = x!.remotePoster;
		}}>Search TMDB Sonarr</button
	>
	<div class="divider w-full"></div>
	<input type="text" bind:value={tmdb_sonarr} class="input input-accent" />
	<button class="btn btn-primary">Search TMDB Radarr</button>
	<div class="divider w-full"></div>
	<button
		class="btn btn-primary"
		onclick={async () => {
			console.log(await fetch_series(storage_controller.get('sonarr_api_key')!));
		}}>Fetch Series</button
	>
	<div class="divider w-full"></div>
	<button
		class="btn btn-primary"
		onclick={() => {
			fetch_series(storage_controller.get('radarr_api_key')!);
		}}>Fetch Movies</button
	>
</main>
