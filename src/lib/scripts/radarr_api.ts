import { refresh_metadata_handler } from '$lib/events/default';
import { url_resolver } from './url_utils';
import { DELETE_OPTIONS, GET_OPTIONS, PUT_OPTIONS, POST_OPTIONS } from './shared_api';

function radarr_error(data: any) {
	console.error('[Radarr] Error:', data);
}

async function get_media_folder(api_key: string) {
	try {
		const response = await fetch(url_resolver('radarr') + 'rootfolder', GET_OPTIONS(api_key));
		if (response.ok) {
			return (await response.json())[0].path;
		}
	} catch (err) {
		radarr_error(err);
	}
}
