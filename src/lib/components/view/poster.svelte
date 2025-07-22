<script lang="ts">
	import { resolve_image } from '$lib/scripts/tmdb_client';
	let { src, alt } = $props();
</script>

<img
	{alt}
	src={resolve_image(src, 'original')}
	class="max-w-40 rounded sm:max-w-50 md:max-w-72 lg:max-w-80"
/>
