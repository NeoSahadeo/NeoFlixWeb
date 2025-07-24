<script lang="ts">
	import QueueList from '$lib/components/queueList/queueList.svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from '../$types';
	import { refresh_metadata_handler } from '$lib/events/default';
	import { fetch_series_queue_id } from '$lib/scripts/sonarr_api';
	import { fetch_show_id } from '$lib/scripts/shared_api';
	import { LocalStorageController } from '$lib/scripts/storage';

	let { data }: PageProps = $props();
	let storage_controller = new LocalStorageController();
	let show_data = $state();
	let queue = $state([]);

	async function boot_queue() {
		const api_key = storage_controller.get('sonarr_api_key')!;
		queue = await fetch_series_queue_id((data.data as any).id, api_key);
	}

	async function load() {
		const api_key = storage_controller.get('sonarr_api_key')!;
		show_data = await fetch_show_id((data.data as any).id, 'sonarr', api_key);
	}

	onMount(() => {
		load();
		boot_queue();
		refresh_metadata_handler.on('refresh_tv_queue', boot_queue);
	});

	$inspect(queue);
	$inspect(show_data);
</script>

{#if show_data && queue}
	<QueueList type="tv" {show_data} {queue} />
{/if}
