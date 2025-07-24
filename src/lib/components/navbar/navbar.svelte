<script lang="ts">
	import IconLogo from '$lib/icons/iconLogo.svelte';
	import Link from './link.svelte';
	import Search from '../search/search.svelte';

	import { url_resolver } from '$lib/scripts/url_utils';

	const base_path = url_resolver('self');

	const links: Record<string, string> = {
		Dashboard: base_path + 'u/dashboard',
		// Home: base_path + 'u/home',
		'TV Shows': base_path + 'u/tvshows',
		Movies: base_path + 'u/movies',
		// Watchlist: 'u/watchlist',
		Downloaded: base_path + 'u/downloaded'
	};
</script>

<nav class="fixed flex min-h-10 w-full flex-row items-center gap-3 px-5 py-5">
	<Search />
	<ul class="flex flex-row items-center gap-7">
		{#each Object.keys(links) as link}
			<Link label={link} href={links[link]} />
		{/each}
	</ul>
</nav>

<style>
	nav {
		z-index: 999;
		background: #000000;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 1) 6%,
			rgba(0, 0, 0, 0.79) 49%,
			rgba(237, 221, 83, 0) 100%
		);
	}
</style>
