<script lang="ts">
	import { setContext } from 'svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import { Events } from '$lib/scripts/misc';

	let { children } = $props();

	const user_events = new Events();
	setContext('user_events', user_events);
</script>

<main class="">
	<Navbar />
	{@render children()}
</main>
