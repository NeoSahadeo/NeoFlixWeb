import { refresh_metadata_handler } from '$lib/events/default';
import { url_resolver } from './url_utils';
import {
	DELETE_OPTIONS,
	GET_OPTIONS,
	PUT_OPTIONS,
	POST_OPTIONS,
	get_media_folder
} from './shared_api';

const ADD_OPTIONS = () => {
	return {
		searchForMissingEpisodes: true,
		searchForCutoffUnmetEpisodes: true
	};
};

function sonar_error(data: any) {
	console.error('[Sonarr] Error:', data);
}

async function fetch_sonarr_local(id: string, api_key: string): Promise<JSON | null> {
	try {
		const response = await fetch(
			url_resolver('sonarr') + 'series/lookup?term=tvdb:' + id,
			GET_OPTIONS(api_key)
		);
		if (response.ok) {
			const json = await response.json();
			if (json.length == 0) return null;
			return json[0];
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function fetch_tmdb_ref(id: string, api_key: string): Promise<JSON | null> {
	try {
		const response = await fetch(
			url_resolver('sonarr') + 'series/lookup?term=tmdb:' + id,
			GET_OPTIONS(api_key)
		);
		if (response.ok) {
			const json = await response.json();
			if (json.length > 0) {
				return json[0];
			} else {
				return null;
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function fetch_series(id: string, api_key: string) {
	try {
		const response = await fetch(
			url_resolver('sonarr') + 'series?tvdbId=' + id,
			GET_OPTIONS(api_key)
		);

		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function fetch_all_series(api_key: string) {
	try {
		const response = await fetch(url_resolver('sonarr') + 'series', GET_OPTIONS(api_key));

		if (response.ok) {
			return await response.json();
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function request_all_episodes(id: string, api_key: string) {
	try {
		let json = (await fetch_sonarr_local(id, api_key)) as any;
		const media_folder = await get_media_folder('sonarr', api_key);
		if (json && media_folder) {
			json['rootFolderPath'] = media_folder;
			json['addOptions'] = ADD_OPTIONS();
			json['qualityProfileId'] = 1;
			for (let x = 0; x < json['seasons'].length; x++) {
				json['seasons'][x]['monitored'] = true;
			}
			const r = await fetch(url_resolver('sonarr') + 'series', POST_OPTIONS(json, api_key));
			if (r.ok) {
				await start_search(json.id, api_key);
				refresh_metadata_handler.dispatch('refresh_tv_view');
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function request_missing_episodes(id: string, api_key: string) {
	try {
		let json = (await fetch_sonarr_local(id, api_key)) as any;
		if (json) {
			for (let x = 0; x < json['seasons'].length; x++) {
				json['seasons'][x]['monitored'] = true;
			}

			const r = await fetch(
				url_resolver('sonarr') + 'series/' + json.id,
				PUT_OPTIONS(json, api_key)
			);
			if (r.ok) {
				await start_search(json.id, api_key);
				refresh_metadata_handler.dispatch('refresh_tv_view');
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}
async function request_episode(id: string, season: number, api_key: string) { }

async function request_season(id: string, season: number, api_key: string) {
	try {
		let json = (await fetch_sonarr_local(id, api_key)) as any;
		if (!json) return null;

		const does_exist = ((await fetch_series(json.tvdbId, api_key)) as any).length > 0;
		if (does_exist) {
			json['seasons'][season]['monitored'] = true;
			const r = await fetch(
				url_resolver('sonarr') + 'series/' + json.id,
				PUT_OPTIONS(json, api_key)
			);
			if (r.ok) {
				refresh_metadata_handler.dispatch('refresh_tv_view');
			}
		} else {
			const media_folder = await get_media_folder('sonarr', api_key);
			if (media_folder) {
				json['rootFolderPath'] = media_folder;
				json['addOptions'] = ADD_OPTIONS();
				json['qualityProfileId'] = 1;
				for (let x = 0; x < json['seasons'].length; x++) {
					json['seasons'][x]['monitored'] = false;
				}
				json['seasons'][season]['monitored'] = true;
				const r = await fetch(url_resolver('sonarr') + 'series', POST_OPTIONS(json, api_key));
				if (r.ok) {
					await start_search(json.id, api_key);
					refresh_metadata_handler.dispatch('refresh_tv_view');
				}
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function delete_all_episodes(id: string, api_key: string) {
	try {
		let json = (await fetch_sonarr_local(id, api_key)) as any;
		if (json) {
			const r = await fetch(
				url_resolver('sonarr') +
				'series/' +
				json.id +
				'?deleteFiles=true&addImportListExclusion=false',
				DELETE_OPTIONS(api_key)
			);
			if (r.ok) {
				setTimeout(() => {
					refresh_metadata_handler.dispatch('refresh_tv_view');
				}, 1000);
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}
async function delete_episode(id: string, season: number, api_key: string) { }
async function delete_season(id: string, season: number, api_key: string) {
	try {
		let json = (await fetch_sonarr_local(id, api_key)) as any;
		if (json) {
			json['seasons'][season]['monitored'] = false;
			const r = await fetch(
				url_resolver('sonarr') + 'series/' + json.id,
				PUT_OPTIONS(json, api_key)
			);
			if (r.ok) {
				const current_data = await fetch_series(json.tvdbId, api_key);
				if (current_data.length > 0) {
					current_data[0].seasons.filter((e: any) => e.monitored).length == 0;
					await delete_all_episodes(id, api_key);
				}
				refresh_metadata_handler.dispatch('refresh_tv_view');
			}
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

async function start_search(id: number, api_key: string) {
	try {
		const response = await fetch(
			url_resolver('sonarr') + 'command/',
			POST_OPTIONS({ name: 'SeriesSearch', seriesId: id }, api_key)
		);
		if (response.ok) {
			// notify?
		}
	} catch (err) {
		sonar_error(err);
	}
	return null;
}

export {
	fetch_tmdb_ref, //
	fetch_all_series,
	fetch_series,
	request_all_episodes,
	request_missing_episodes,
	request_episode,
	request_season,
	delete_all_episodes,
	delete_episode,
	delete_season
};
