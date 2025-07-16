<script lang="ts">
	import IconUnmute from '$lib/icons/iconUnmute.svelte';
	import IconMute from '$lib/icons/iconMute.svelte';

	let { muted, toggle_mute } = $props();
</script>

<button class="btn px-4" aria-label="Toggle Mute" onclick={toggle_mute}>
	{#if muted}
		<IconMute />
	{:else}
		<IconUnmute />
	{/if}
</button>
