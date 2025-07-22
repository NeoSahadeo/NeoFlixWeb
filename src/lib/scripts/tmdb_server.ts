import { SECRET_TMDB_RKEY } from '$env/static/private';

const TMDB_API = 'https://api.themoviedb.org/3/';

const options = {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${SECRET_TMDB_RKEY}`
	}
};

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
		console.error(err);
	}
	return null;
}

export { fetch_trending };
