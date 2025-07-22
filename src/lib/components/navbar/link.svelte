<script lang="ts">
	let { label, href } = $props();
</script>

<li>
	<a {href} class="link link-primary text-sm font-bold whitespace-nowrap no-underline">{label}</a>
</li>
