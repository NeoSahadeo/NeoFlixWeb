import { refresh_metadata_handler } from '$lib/events/default';
import { url_resolver } from './url_utils';
import {
	DELETE_OPTIONS,
	GET_OPTIONS,
	PUT_OPTIONS,
	POST_OPTIONS,
	fetch_data_tmdb,
	get_media_folder,
	error_handler,
	fetch_show
} from './shared_api';

async function unsafe_request_movie(id: string, api_key: string) {
	let json = (await fetch_data_tmdb(id, 'radarr', api_key)) as any;
	const media_folder = await get_media_folder('radarr', api_key);
	if (json && media_folder) {
		json['rootFolderPath'] = media_folder;
		json['qualityProfileId'] = 1;
		const r = await fetch(url_resolver('radarr') + 'movie', POST_OPTIONS(json, api_key));
		if (r.ok) {
			// await start_search(json.id, api_key); // replace with interactive maybe?
			refresh_metadata_handler.dispatch('refresh_movie_view');
		}
	}
	return null;
}

async function unsafe_delete_movie(id: string, api_key: string) {
	let json = (await fetch_show(id, 'radarr', api_key)) as any;
	if (json.length == 0) return null;
	json = json[0];
	const r = await fetch(
		url_resolver('radarr') + 'movie/' + json.id + '?deleteFiles=true&addImportListExclusion=false',
		DELETE_OPTIONS(api_key)
	);
	if (r.ok) {
		refresh_metadata_handler.dispatch('refresh_movie_view');
	}
	return null;
}

const NAMESPACE = 'Radarr API';
const request_movie = error_handler({ NAMESPACE, fn: unsafe_request_movie });
const delete_movie = error_handler({ NAMESPACE, fn: unsafe_delete_movie });

export {
	request_movie, //
	delete_movie
};
