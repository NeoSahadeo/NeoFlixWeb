import { json } from '@sveltejs/kit';
import { fetch_trending } from '$lib/scripts/tmdb_server';

export async function GET({ url }) {
	const type = url.searchParams.get('type');
	const time_window = url.searchParams.get('time_window');
	if (!time_window) {
		return json({ message: 'Missing time_window: time_window=[week,day]' }, { status: 400 });
	}
	if (!type) {
		return json({ message: 'Missing type: type=[all,tv,movie]' }, { status: 400 });
	}
	const response = await fetch_trending(type, time_window);
	if (response) {
		return json(response, { status: 200 });
	} else {
		return json(null, { status: 200 });
	}
}
