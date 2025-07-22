<script lang="ts">
	import type { PageProps } from './$types';

	import Hero from '$lib/components/home/hero.svelte';
	import Heading from '$lib/components/home/heading.svelte';
	import { resolve_image } from '$lib/scripts/tmdb_client';

	let { data }: PageProps = $props();
</script>

<!-- <Hero -->
<!-- 	src={resolve_image(data.data.trending.results[0].backdrop_path)} -->
<!-- 	desc={data.data.trending.results[0].overview} -->
<!-- 	title={data.data.trending.results[0].title} -->
<!-- 	play={undefined} -->
<!-- 	watchlist={undefined} -->
<!-- 	trending_type={data.data.trending_type} -->
<!-- 	query={`${data.data.trending.results[0].title}+${data.data.trending.results[0].release_date}+trailer`} -->
<!-- /> -->
<!-- <Heading text={'Currently Trending'} /> -->
