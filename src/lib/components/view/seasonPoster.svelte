<script lang="ts">
	import { resolve_image } from '$lib/scripts/tmdb_client';
	let { src, label } = $props();
</script>

<img
	alt={label}
	src={resolve_image(src, 'small')}
	class={`max-h-60 min-h-60 max-w-40 min-w-40 rounded`}
/>
