<script lang="ts">
	import { url_resolver } from '$lib/scripts/url_utils';
	import { onMount } from 'svelte';

	let search = $state<string>();

	function redirect() {
		window.location.assign(url_resolver('self') + 'u/search?q=' + search);
	}
	onMount(() => {
		if (window.location.origin + window.location.pathname === url_resolver('self') + 'u/search') {
			const match = window.location.search.match(/(?<=[?&]q=)([^&]+)/gm);
			if (match) {
				search = decodeURI(match[0]);
			}
		}
	});
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		redirect();
	}}
>
	<input
		type="text"
		bind:value={search}
		placeholder="Search"
		class="input input-primary md:w-auto"
	/>
</form>
