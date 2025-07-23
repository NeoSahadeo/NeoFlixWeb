<script lang="ts">
	import IconPlus from '$lib/icons/iconPlus.svelte';
	import { request_all_episodes } from '$lib/scripts/sonarr_api';
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
		season: number | 'all';
	} = $props();

	async function handle_request() {
		const storage_controller = new LocalStorageController();
		if (type === 'tv' && season === 'all') {
			await request_all_episodes(id, storage_controller.get('sonarr_api_key')!);
		}
	}
</script>

<button class={'btn btn-primary ' + _class} onclick={handle_request}>
	<IconPlus size={20} />
	{label}</button
>
