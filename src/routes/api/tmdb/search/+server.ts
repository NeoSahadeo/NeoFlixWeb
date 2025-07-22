import { json } from '@sveltejs/kit';
import { search } from '$lib/scripts/tmdb_server';

export async function POST({ request, cookies }) {
	const { query } = await request.json();
	const response = await search(query);
	return json({ data: response }, { status: 200 });
}
