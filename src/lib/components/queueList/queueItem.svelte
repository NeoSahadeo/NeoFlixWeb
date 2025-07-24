<script lang="ts">
	let {
		id,
		type,
		title,
		series,
		quality,
		timeleft
	}: {
		type: 'tv' | 'movie';
		title: string;
		id: any;
		quality: any;
		timeleft: any;
		series?: string;
	} = $props();
</script>
