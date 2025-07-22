import { url_resolver } from './url_utils';

function sonar_error(data: any) {
	console.error('[Sonarr] Error:', data);
}

async function fetch_tmdb_ref(id: string, api_key: string) {
	try {
		const response = await fetch(url_resolver('sonarr') + 'series/lookup?term=tmdb:' + id, {
			headers: {
				'X-Api-Key': api_key
			},
			method: 'GET'
		});

		if (response.ok) {
			return (await response.json())[0];
		}
	} catch (err) {
		sonar_error(err);
	}
}

async function fetch_series(api_key: string) {
	try {
		const response = await fetch(url_resolver('sonarr') + 'series', {
			headers: {
				'X-Api-Key': api_key
			},
			method: 'GET'
		});

		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		sonar_error(err);
	}
}

export {
	fetch_tmdb_ref, //
	fetch_series
};
