<script lang="ts">
	import { LocalStorageController } from '$lib/scripts/storage';
	import { onMount } from 'svelte';

	const storage_controller = new LocalStorageController();
	onMount(() => {
		// need to send post request
		storage_controller.get('tv_time_window') || 'day';
	});
</script>
