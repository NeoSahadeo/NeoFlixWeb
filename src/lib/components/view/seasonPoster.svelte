<script lang="ts">
	import { resolve_image } from '$lib/scripts/tmdb_client';
	let { src, label } = $props();
</script>

<img alt={label} src={resolve_image(src, 'small')} class="max-w-40 rounded" />
