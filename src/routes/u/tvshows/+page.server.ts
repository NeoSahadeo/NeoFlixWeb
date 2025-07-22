import { fetch_trending } from '$lib/scripts/tmdb_server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const time_window = url.searchParams.get('time_window') || ('day' as any);
	const trending = await fetch_trending('tv', time_window);
	return {
		trending: trending
	};
};
