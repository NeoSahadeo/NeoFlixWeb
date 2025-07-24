<script lang="ts">
	import QueueItem from './queueItem.svelte';
	import { fetch_series_id } from '$lib/scripts/sonarr_api';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { onMount } from 'svelte';

	let { type, show_data, queue }: { type: 'tv' | 'movie'; show_data: any; queue: any } = $props();

	let matches = $state<any[]>([]);

	async function load() {
		matches = [];
		const storage_controller = new LocalStorageController();
		const response = await fetch_series_id(show_data.id, storage_controller.get('sonarr_api_key')!);
		if (response) {
			response.forEach((e: any) => {
				const match = queue.filter((q: any) => e.id === q.episodeId);
				if (match.length > 0) {
					e['size'] = match[0].size;
					e['sizeleft'] = match[0].sizeleft;
					e['status'] = match[0].status;
					e['timeleft'] = match[0].timeleft;
					matches.push(e);
				}
			});
		}
	}

	onMount(() => {
		load();
	});
</script>

<h1 class="text-xl font-bold">
	{show_data.title} Queue
</h1>
<ul class="mt-4 flex flex-col gap-3">
	{#each matches as item, index}
		<QueueItem {type} data={item} {index} />
	{/each}
</ul>
