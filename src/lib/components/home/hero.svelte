<script lang="ts">
	import MuteButton from './muteButton.svelte';

	import { dev } from '$app/environment';
	import { Youtube } from '$lib/scripts/youtube_client_api';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { src, desc, title, play, watchlist, trending_type, query } = $props();

	let engage_text = $state();
	let video_id = $state(undefined);
	let muted = $state(true);
	let image_height = $state(0);
	let prev_height = 0;
	let height_poll: number;
	let player_poll: number;

	function toggle_mute() {
		if (player.isMuted()) {
			muted = false;
			player.unMute();
		} else {
			muted = true;
			player.mute();
		}
	}

	function handle_resize() {
		height_poll = setInterval(() => {
			if (image_height !== prev_height) {
				prev_height = image_height;
				if (player.g) player.g.style.height = `${image_height}px`;
			}
		}, 500);
	}

	let player: any;
	function onYouTubeIframeAPIReady() {
		player = new (window as any).YT.Player('player', {
			height: image_height,
			videoId: video_id,
			autoplay: true,
			playerVars: {
				autoplay: 1,
				controls: 0,
				muted: 1
			},
			events: {
				onReady: () => {
					player.mute();
					player.setVolume(10);

					player_poll = setInterval(() => {
						if (player.getPlayerState() == -1) {
							player.g.style.display = 'none';
						}

						if (player.getCurrentTime() > player.getDuration() - 1) {
							clearInterval(player_poll);
							clearInterval(height_poll);
							player.g.style.display = 'none';
						}
					}, 100);
				},
				onStateChange: undefined
			}
		});

		if (dev) window.player = player;
	}

	if (trending_type == 'day') {
		engage_text = '#1 Trending Today';
	} else {
		engage_text = '#1 Trending Weekly';
	}

	onMount(async () => {
		const youtube_client_api = new Youtube();
		video_id = (await youtube_client_api.load_trailer(query)) as any;
		if (video_id) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';

			document.body.prepend(tag);
			setTimeout(() => {
				onYouTubeIframeAPIReady();
				clearInterval(height_poll);
				handle_resize();
			}, 1000);
		}
	});

	if (trending_type == 'day') {
		engage_text = '#1 Trending Today';
	} else {
		engage_text = '#1 Trending Weekly';
	}
</script>

<div>
	<img transition:fade bind:clientHeight={image_height} {src} alt={title} class="-z-50" />
	<div class={`pointer-events-none absolute top-0 left-0 w-full`} id="player"></div>
	<div class="relative">
		<div class="absolute bottom-0 z-50 flex flex-col gap-3 pb-10 pl-10">
			<span class="-mb-3 font-black">{engage_text}</span>
			<h1 class="text-3xl font-bold">{title}</h1>
			<p class="max-w-10/12">{desc}</p>
			<div class="flex flex-row gap-3">
				<button class="btn btn-primary"> Play </button>
				<button class="btn btn-primary"> Wathlist </button>
				{#if video_id}
					<MuteButton {muted} {toggle_mute} />
				{/if}
			</div>
		</div>
		<div id="hero_darken" class="absolute -top-96 h-96 w-full"></div>
	</div>
</div>

<style>
	#hero_darken {
		background: #000000;
		background: linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.85) 14%,
			rgba(0, 0, 0, 0.87) 44%,
			rgba(0, 0, 0, 0.82) 67%,
			rgba(255, 255, 255, 0) 100%
		);
	}
</style>
