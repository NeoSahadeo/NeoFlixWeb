<script lang="ts">
	let { label, href } = $props();
</script>

<li>
	<a {href} class="link link-primary text-sm font-bold no-underline">{label}</a>
</li>
