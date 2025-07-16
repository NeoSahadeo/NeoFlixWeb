import { fetch_trending } from '$lib/scripts/tmdb_server';
import type { PageServerLoad } from './$types';
import { fetch_trailer } from '$lib/scripts/youtube_scraper';
import { Events } from '$lib/scripts/misc';

const MAX_TRAILER_SCAN_RETRIES = 5;

export const load: PageServerLoad = async ({ params }) => {
	const events = new Events();

	const type = 'day';
	const trending = await fetch_trending('all', type);

	// let trailer_attemps = 1;
	// const trailer_poll = setInterval(async () => {
	// 	const trailer_id = await fetch_trailer(
	// 		`${trending.results[0].title}+${trending.results[0].release_date} trailer`
	// 	);
	// 	if (trailer_id) {
	// 		console.log(trailer_id);
	// 		events.dispatch('hero_trailer', trailer_id);
	// 		clearInterval(trailer_poll);
	// 	}
	// 	trailer_attemps++;
	// }, 5000);
	return {
		data: {
			trending_type: type, // load from user settings
			trending: trending
		}
	};
};
