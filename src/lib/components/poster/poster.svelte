<script lang="ts">
	import { url_resolver } from '$lib/scripts/url_utils';
	import { resolve_image } from '$lib/scripts/tmdb_client';

	let { alt, src, id } = $props();

	function open_link() {
		window.location.assign(url_resolver('self') + 'u/view/' + id);
	}
</script>

<button
	class="hover:outline-primary rounded hover:cursor-pointer hover:outline-2"
	onclick={open_link}
>
	<img {alt} src={resolve_image(src, 'small')} class="max-w-32 rounded sm:max-w-50" />
</button>
