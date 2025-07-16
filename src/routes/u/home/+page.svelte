<script lang="ts">
	import type { PageProps } from './$types';

	import Hero from '$lib/components/home/hero.svelte';
	import Heading from '$lib/components/home/heading.svelte';
	import { resolve_image } from '$lib/scripts/tmdb_client';

	let { data }: PageProps = $props();

	// data.data.events.on('hero_trailer', (trailer_id) => {
	// 	console.log(trailer_id);
	// });

	let hero_src = $state(resolve_image(data.data.trending.results[0].backdrop_path));
</script>

<Hero
	src={hero_src}
	desc={data.data.trending.results[0].overview}
	title={data.data.trending.results[0].title}
	play={undefined}
	watchlist={undefined}
	trending_type={data.data.trending_type}
	embed={undefined}
/>
<Heading text={'Currently Trending'} />
