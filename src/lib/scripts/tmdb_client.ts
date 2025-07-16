const TMDB_PICTURE = 'https://image.tmdb.org/t/p/original/';

async function fetch_picture(url: string) {
	try {
		const response = await fetch(TMDB_PICTURE + url);
		if (response.ok) {
			return await response.blob();
		}
	} catch (err) {
		console.error(err);
	}
}

function resolve_image(url: string) {
	return TMDB_PICTURE + url;
}

export { fetch_picture, resolve_image };
