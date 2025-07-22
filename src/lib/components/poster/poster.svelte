<script lang="ts">
	let { alt, src } = $props();
</script>

<button class="hover:outline-primary rounded hover:cursor-pointer hover:outline-2">
	<img
		{alt}
		src={'https://image.tmdb.org/t/p/original/' + src}
		class="max-w-32 rounded sm:max-w-50"
	/>
</button>
