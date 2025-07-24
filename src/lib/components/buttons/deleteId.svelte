<script lang="ts">
	import IconTrashcan from '$lib/icons/iconTrashcan.svelte';
	import { delete_all_episodes, delete_season } from '$lib/scripts/sonarr_api';
	import { delete_movie } from '$lib/scripts/radarr_api';
	import { LocalStorageController } from '$lib/scripts/storage';

	let {
		id,
		type,
		season,
		label = 'Delete',
		_class = ''
	}: {
		type: 'tv' | 'movie';
		id: string;
		label?: string;
		_class?: string;
		season?: number | 'all';
	} = $props();

	async function handle_tv_request() {
		const storage_controller = new LocalStorageController();
		const api_key = storage_controller.get('sonarr_api_key')!;
		switch (season) {
			case 'all':
				await delete_all_episodes(id, api_key);
				break;
			default:
				await delete_season(id, season!, api_key);
				break;
		}
	}

	async function handle_movie_request() {
		const storage_controller = new LocalStorageController();
		const api_key = storage_controller.get('radarr_api_key')!;
		await delete_movie(id, api_key);
	}

	function handle_request() {
		if (type === 'tv') {
			handle_tv_request();
		} else if (type === 'movie') {
			handle_movie_request();
		}
	}
</script>

<button class={'btn btn-error ' + _class} onclick={handle_request}>
	<IconTrashcan size={20} />
	{label}</button
>
