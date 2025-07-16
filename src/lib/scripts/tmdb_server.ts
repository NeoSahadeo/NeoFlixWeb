import { SECRET_TMDB_RKEY } from '$env/static/private';

const TMDB_API = 'https://api.themoviedb.org/3/';

const options = {
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${SECRET_TMDB_RKEY}`
	}
};

async function fetch_trending(selector: 'all' | 'movie' | 'tv', time_window: 'day' | 'week') {
	try {
		const response = await fetch(TMDB_API + 'trending/' + selector + '/' + time_window, {
			method: 'GET',
			...options
		});
		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		console.error(err);
	}
	return undefined;
}

export { fetch_trending };
