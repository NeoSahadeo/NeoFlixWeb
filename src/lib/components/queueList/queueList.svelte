<script lang="ts">
	import QueueItem from './queueItem.svelte';
	let { type, show_data, queue }: { type: 'tv' | 'movie'; show_data: any; queue: any } = $props();
</script>

<main class="px-3 pt-20 pb-20">
	<h1 class="text-xl font-bold">
		{show_data.title} Queue
	</h1>
	{#each queue as item, index}
		<QueueItem
			{type}
			id={item.episodeId}
			quality={item.quality.quality.name}
			timeleft={0}
			title={''}
		/>
	{/each}
</main>
