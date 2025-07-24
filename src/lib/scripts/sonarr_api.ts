import { refresh_metadata_handler } from '$lib/events/default';
import { url_resolver } from './url_utils';
import {
	DELETE_OPTIONS,
	GET_OPTIONS,
	PUT_OPTIONS,
	POST_OPTIONS,
	get_media_folder,
	fetch_data_tvdb,
	fetch_show,
	error_handler
} from './shared_api';

const ADD_OPTIONS = () => {
	return {
		searchForMissingEpisodes: true,
		searchForCutoffUnmetEpisodes: true
	};
};

async function unsafe_request_all_episodes(id: string, api_key: string) {
	let json = (await fetch_data_tvdb(id, 'sonarr', api_key)) as any;
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
	return null;
}

async function unsafe_request_missing_episodes(id: string, api_key: string) {
	let json = (await fetch_data_tvdb(id, 'sonarr', api_key)) as any;
	if (json) {
		for (let x = 0; x < json['seasons'].length; x++) {
			json['seasons'][x]['monitored'] = true;
		}

		const r = await fetch(url_resolver('sonarr') + 'series/' + json.id, PUT_OPTIONS(json, api_key));
		if (r.ok) {
			await start_search(json.id, api_key);
			refresh_metadata_handler.dispatch('refresh_tv_view');
		}
	}
	return null;
}
async function request_episode(id: string, season: number, api_key: string) { }

async function unsafe_request_season(id: string, season: number, api_key: string) {
	let json = (await fetch_data_tvdb(id, 'sonarr', api_key)) as any;
	if (!json) return null;

	const does_exist = ((await fetch_show(json.tvdbId, 'sonarr', api_key)) as any).length > 0;
	if (does_exist) {
		json['seasons'][season]['monitored'] = true;
		const r = await fetch(url_resolver('sonarr') + 'series/' + json.id, PUT_OPTIONS(json, api_key));
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
	return null;
}

async function unsafe_delete_all_episodes(id: string, api_key: string) {
	let json = (await fetch_data_tvdb(id, 'sonarr', api_key)) as any;
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
	return null;
}
async function delete_episode(id: string, season: number, api_key: string) { }
async function unsafe_delete_season(id: string, season: number, api_key: string) {
	let json = (await fetch_data_tvdb(id, 'sonarr', api_key)) as any;
	if (json) {
		json['seasons'][season]['monitored'] = false;
		const r = await fetch(url_resolver('sonarr') + 'series/' + json.id, PUT_OPTIONS(json, api_key));
		if (r.ok) {
			const current_data = await fetch_show(json.tvdbId, 'sonarr', api_key);
			if (current_data.length > 0) {
				current_data[0].seasons.filter((e: any) => e.monitored).length == 0;
				await delete_all_episodes(id, api_key);
			}
			refresh_metadata_handler.dispatch('refresh_tv_view');
		}
	}
	return null;
}

async function unsafe_start_search(id: number, api_key: string) {
	const response = await fetch(
		url_resolver('sonarr') + 'command/',
		POST_OPTIONS({ name: 'SeriesSearch', seriesId: id }, api_key)
	);
	if (response.ok) {
		// notify?
	}
	return null;
}

const NAMESPACE = 'Sonarr API';
const request_all_episodes = error_handler({ NAMESPACE, fn: unsafe_request_all_episodes });
const request_missing_episodes = error_handler({ NAMESPACE, fn: unsafe_request_missing_episodes });
const request_season = error_handler({ NAMESPACE, fn: unsafe_request_season });
const delete_all_episodes = error_handler({ NAMESPACE, fn: unsafe_delete_all_episodes });
const delete_season = error_handler({ NAMESPACE, fn: unsafe_delete_season });
const start_search = error_handler({ NAMESPACE, fn: unsafe_start_search });

export {
	request_all_episodes,
	request_missing_episodes,
	request_episode,
	request_season,
	delete_all_episodes,
	delete_episode,
	delete_season
};
