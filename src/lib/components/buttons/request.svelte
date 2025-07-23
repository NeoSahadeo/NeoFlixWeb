<script lang="ts">
	import IconPlus from '$lib/icons/iconPlus.svelte';
	import {
		request_all_episodes,
		request_missing_episodes,
		request_season
	} from '$lib/scripts/sonarr_api';
	import { LocalStorageController } from '$lib/scripts/storage';

	let {
		id,
		type,
		season,
		label = 'Request',
		_class = ''
	}: {
		type: 'tv' | 'movie';
		id: string;
		label?: string;
		_class?: string;
		season: number | 'all' | 'missing';
	} = $props();

	async function handle_tv_request() {
		const storage_controller = new LocalStorageController();
		const api_key = storage_controller.get('sonarr_api_key')!;
		switch (season) {
			case 'all':
				await request_all_episodes(id, api_key);
				break;
			case 'missing':
				await request_missing_episodes(id, api_key);
				break;
			default:
				await request_season(id, season, api_key);
				break;
		}
	}

	async function handle_movie_request() {}

	function handle_request() {
		if (type === 'tv') {
			handle_tv_request();
		} else if (type === 'movie') {
			handle_movie_request();
		}
	}
</script>

<button class={'btn btn-primary ' + _class} onclick={handle_request}>
	<IconPlus size={20} />
	{label}</button
>
