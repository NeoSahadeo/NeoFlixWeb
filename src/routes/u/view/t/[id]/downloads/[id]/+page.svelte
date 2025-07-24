<script lang="ts">
	import IconMissing from '$lib/icons/iconMissing.svelte';
	import QueueList from '$lib/components/queueList/queueList.svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from '../$types';
	import { refresh_metadata_handler } from '$lib/events/default';
	import { fetch_series_queue_id } from '$lib/scripts/sonarr_api';
	import { fetch_show_id } from '$lib/scripts/shared_api';
	import { LocalStorageController } from '$lib/scripts/storage';
	import { url_resolver } from '$lib/scripts/url_utils';
	import IconBackArrow from '$lib/icons/iconBackArrow.svelte';

	let { data }: PageProps = $props();
	let storage_controller = new LocalStorageController();
	let show_data = $state();
	let queue = $state([]);
	let poll = $state<any>();

	async function boot_queue() {
		queue = [];
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

		clearInterval(poll);
		poll = setInterval(boot_queue, 5000);
	});

	$inspect(queue);
	$inspect(show_data);
</script>

<main class="px-3 pt-20 pb-20">
	{#if show_data}
		<button
			class="btn btn-link"
			onclick={() => {
				window.location.assign(url_resolver('self') + 'u/view/t/' + show_data.tmdbId);
			}}
		>
			<IconBackArrow size={16} />Go Back
		</button>
	{/if}
	{#if show_data && queue.length > 0}
		<QueueList type="tv" {show_data} {queue} />
	{:else if show_data}
		<div class="flex flex-row">
			<IconMissing />
			Queue is empty for {show_data.title}
		</div>
	{:else}
		<div class="mockup-code w-full">
			<pre data-prefix="1"><code>Woooah!</code></pre>
			<pre data-prefix="2"><code>Show ID is not related to anything!</code></pre>
		</div>
	{/if}
</main>
