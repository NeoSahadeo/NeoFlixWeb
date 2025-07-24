<script lang="ts">
	import TrendingPage from '$lib/components/trendings/trendingPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<TrendingPage {data} type="movie" />
