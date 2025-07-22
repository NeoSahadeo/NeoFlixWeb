import { fetch_trending } from '$lib/scripts/tmdb_server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// const type = 'day';
	// const trending = await fetch_trending('tv', type);
	//
	// return {
	// 	data: {
	// 		trending_type: type, // load from user settings
	// 		trending: trending
	// 	}
	// };
};
