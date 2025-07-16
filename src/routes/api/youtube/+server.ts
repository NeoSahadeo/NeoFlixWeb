import { json } from '@sveltejs/kit';
import { fetch_trailer } from '$lib/scripts/youtube_scraper';

export async function POST({ request, cookies }) {
	const { query } = await request.json();
	const response = await fetch_trailer(query);
	return json({ id: response }, { status: 200 });
}
