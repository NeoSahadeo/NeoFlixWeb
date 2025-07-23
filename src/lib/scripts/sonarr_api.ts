import { url_resolver } from './url_utils';

function sonar_error(data: any) {
	console.error('[Sonarr] Error:', data);
}

async function fetch_tmdb_ref(id: string, api_key: string): Promise<JSON | null> {
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
	return null;
}

async function fetch_series(id: string, api_key: string) {
	try {
		const response = await fetch(url_resolver('sonarr') + 'series?tvdbId=' + id, {
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

async function fetch_all_series(api_key: string) {
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

async function request_all_episodes(id: string, api_key: string) { }
async function request_episode(id: string, season: number, api_key: string) { }

async function delete_all_episodes(id: string, api_key: string) { }
async function delete_episode(id: string, season: number, api_key: string) { }

export {
	fetch_tmdb_ref, //
	fetch_all_series,
	fetch_series
};
