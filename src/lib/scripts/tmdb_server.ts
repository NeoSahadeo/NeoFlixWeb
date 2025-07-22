import { SECRET_TMDB_RKEY } from '$env/static/private';

const TMDB_API = 'https://api.themoviedb.org/3/';

const options = {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${SECRET_TMDB_RKEY}`
	}
};

function tmdb_error(err: any) {
	console.error('[TMDB] Error:', err);
}

async function fetch_trending(
	selector: 'all' | 'movie' | 'tv',
	time_window: 'day' | 'week',
	page: number = 1
) {
	try {
		const response = await fetch(
			TMDB_API + 'trending/' + selector + '/' + time_window + `?page=${page}`,
			{
				method: 'GET',
				...options
			}
		);
		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		tmdb_error(err);
	}
	return null;
}

async function fetch_data(id: any): Promise<JSON | null> {
	try {
		const response = await fetch(TMDB_API + 'tv/' + id, {
			method: 'GET',
			...options
		});
		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		tmdb_error(err);
	}
	return null;
}

export { fetch_trending, fetch_data };
