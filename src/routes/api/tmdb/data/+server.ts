import { json } from '@sveltejs/kit';
import { fetch_data } from '$lib/scripts/tmdb_server';

export async function GET({ url }) {
	const id = url.searchParams.get('id');
	const response = await fetch_data(id);
	if (!response) {
		return json({ message: 'Missing id or invalid id, id=xxxxxx' }, { status: 400 });
	}
	return json(response, { status: 200 });
}
