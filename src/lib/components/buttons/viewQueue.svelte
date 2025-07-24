<script lang="ts">
	import IconHeadline from '$lib/icons/iconHeadline.svelte';
	import { url_resolver } from '$lib/scripts/url_utils';

	let {
		id,
		global_id,
		type,
		_class = ''
	}: { id: any; global_id: any; type: 'tv' | 'movie'; _class?: string } = $props();

	function handle_click() {
		const handler = type === 'tv' ? 't/' : 'm/';
		window.location.assign(
			url_resolver('self') + 'u/view/' + handler + global_id + '/downloads/' + id
		);
	}
</script>

<button class="btn btn-accent w-fit px-3 py-2" onclick={handle_click}>
	<IconHeadline size={16} />View Queue
</button>
