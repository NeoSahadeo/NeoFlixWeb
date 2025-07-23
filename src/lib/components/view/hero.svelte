<script lang="ts">
	import DeleteId from '../buttons/deleteId.svelte';
	import Request from '../buttons/request.svelte';
	import Poster from './poster.svelte';

	let { data } = $props();

	let total_seasons = $derived(data.sonarr_database.seasons.length);
	let tracked_seasons = $derived(
		data.sonarr_local?.seasons.reduce(
			(accumulator: any, current_value: any) => accumulator + (current_value.monitored ? 1 : 0),
			0
		)
	);

	$inspect(data.sonarr_database.tvdbId);
	$inspect(tracked_seasons);
</script>

<div class="flex flex-row">
	<div>
		<Poster alt={data.tmdb_data.name} src={data.tmdb_data.poster_path} />
		<span class="text-xl font-bold text-white">
			{data.tmdb_data.name}
			<span class="italic">({data.tmdb_data.first_air_date})</span>
		</span>
	</div>
	<div class="px-3">
		<h1 class="text-lg font-bold">Overview:</h1>
		<p class="max-w-8/12 leading-7 text-neutral-50">
			{data.tmdb_data.overview}
		</p>
		<span class="mt-4 block">
			{#if data.type === 'tv'}
				<div class="flex max-w-fit flex-col gap-3">
					{#if tracked_seasons !== total_seasons}
						<Request
							type="tv"
							season={'all'}
							id={data.sonarr_database.tvdbId}
							label={`Request ${tracked_seasons === 0 || tracked_seasons === undefined ? 'All' : 'Missing'} Seasons`}
						/>
					{/if}
					{#if tracked_seasons > 0}
						<DeleteId
							type="tv"
							season={'all'}
							id={data.sonarr_database.tvdbId}
							label={'Delete All Downloaded Seasons'}
						/>
					{/if}
				</div>
			{:else}
				<div></div>
			{/if}
		</span>
	</div>
</div>
