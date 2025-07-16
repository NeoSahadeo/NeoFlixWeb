<script lang="ts">
	import IconLogo from '$lib/icons/iconLogo.svelte';
	import Link from './link.svelte';

	import { url_resolver } from '$lib/scripts/url_utils';

	const base_path = url_resolver('self');

	const links: Record<string, string> = {
		Home: base_path + 'u/home',
		'TV Shows': base_path + 'u/tvshows',
		Movies: 'u/movies',
		Watchlist: 'u/watchlist'
	};
</script>

<nav class="fixed flex min-h-10 w-full flex-row items-center gap-3 px-5 py-5">
	<span class="mr-9">
		<IconLogo />
	</span>
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
