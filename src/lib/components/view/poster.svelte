<script lang="ts">
	import { resolve_image } from '$lib/scripts/tmdb_client';
	let { src, alt, size = 'small', src_override = false } = $props();
</script>

<img
	{alt}
	src={src_override ? src : resolve_image(src, size as any)}
	class="max-w-40 rounded sm:max-w-50 md:max-w-72 lg:max-w-80"
/>
