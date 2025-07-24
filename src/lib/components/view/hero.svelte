<script lang="ts">
	import DeleteId from '../buttons/deleteId.svelte';
	import Request from '../buttons/request.svelte';
	import Poster from './poster.svelte';
	import ViewQueue from '$lib/components/buttons/viewQueue.svelte';

	let { data } = $props();

	let total_seasons = $derived(data.sonarr_database?.seasons.length);
	let tracked_seasons = $derived(
		data.sonarr_local?.seasons.reduce(
			(accumulator: any, current_value: any) => accumulator + (current_value.monitored ? 1 : 0),
			0
		)
	);
	if (data.type === 'tv') {
		$inspect(data.sonarr_database?.tvdbId);
		$inspect(tracked_seasons);
	}
	if (data.type === 'movie') {
		$inspect(data.radarr_local);
	}
</script>

<div class="flex flex-row">
	<div>
		<Poster
			alt={data.tmdb_data.name}
			src={data.type === 'tv' ? data.tmdb_data.poster_path : data.tmdb_data.remotePoster}
			src_override={data.type === 'tv' ? false : true}
		/>
		<span class="text-xl font-bold text-white">
			{data.type === 'tv' ? data.tmdb_data.name : data.tmdb_data.title}
			<span class="italic"
				>({data.type === 'tv' ? data.tmdb_data.first_air_date : data.tmdb_data.year})</span
			>
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
							season={tracked_seasons === 0 || tracked_seasons === undefined ? 'all' : 'missing'}
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
					<!--Add check if the files are downloading or not-->
					<ViewQueue id={data.sonarr_database.id} global_id={data.tmdb_data.id} type="tv" />
				</div>
			{:else}
				<div>
					{#if data.radarr_local}
						<DeleteId type="movie" id={data.tmdb_data.tmdbId} />
					{:else}
						<Request type="movie" id={data.tmdb_data.tmdbId} />
					{/if}
				</div>
			{/if}
		</span>
	</div>
</div>
