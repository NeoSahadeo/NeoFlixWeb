import { SvelteURLSearchParams } from 'svelte/reactivity';
import { url_resolver } from './url_utils';

function shared_error(NAMESPACE: string, err: any) {
	console.error(`[${NAMESPACE}] Error:`, err);
}

function get_search_base(type: 'sonarr' | 'radarr') {
	return type === 'sonarr' ? 'series' : 'movie';
}

const GET_OPTIONS = (api_key: string) => {
	return {
		headers: {
			'X-Api-Key': api_key
		},
		method: 'GET'
	};
};

const PUT_OPTIONS = (json: any, api_key: string) => {
	return {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
			'X-Api-Key': api_key
		},
		body: JSON.stringify(json)
	};
};

const POST_OPTIONS = (json: any, api_key: string) => {
	return {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
			'X-Api-Key': api_key
		},
		body: JSON.stringify(json)
	};
};

const DELETE_OPTIONS = (api_key: string) => {
	return {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
			'X-Api-Key': api_key
		}
	};
};

function error_handler<T extends (...args: any[]) => Promise<any>>({
	NAMESPACE = 'Shared API',
	fn
}: {
	NAMESPACE?: string;
	fn: T;
}): (...func_args: Parameters<T>) => Promise<ReturnType<T> | null> {
	return async function(...args: Parameters<T>): Promise<ReturnType<T> | null> {
		try {
			return await fn(...args);
		} catch (err) {
			shared_error(NAMESPACE, err);
			return null;
		}
	};
}

async function unsafe_get_media_folder(url_key: string, api_key: string) {
	const response = await fetch(url_resolver(url_key as any) + 'rootfolder', GET_OPTIONS(api_key));
	if (response.ok) {
		return (await response.json())[0].path;
	}
}

async function unsafe_fetch_data_tvdb(
	id: string,
	type: 'sonarr' | 'radarr',
	api_key: string
): Promise<JSON | null> {
	const response = await fetch(
		url_resolver(type) + get_search_base(type) + '/lookup?term=tvdb:' + id,
		GET_OPTIONS(api_key)
	);
	if (response.ok) {
		const json = await response.json();
		if (json.length == 0) return null;
		return json[0];
	}
	return null;
}

async function unsafe_fetch_data_tmdb(
	id: string,
	type: 'sonarr' | 'radarr',
	api_key: string
): Promise<JSON | null> {
	const response = await fetch(
		url_resolver(type) + get_search_base(type) + '/lookup?term=tmdb:' + id,
		GET_OPTIONS(api_key)
	);
	if (response.ok) {
		const json = await response.json();
		if (json.length == 0) return null;
		return json[0];
	}
	return null;
}

async function unsafe_fetch_show(id: string, type: 'sonarr' | 'radarr', api_key: string) {
	const response = await fetch(
		url_resolver(type) + get_search_base(type) + '?tvdbId=' + id,
		GET_OPTIONS(api_key)
	);

	if (response.ok) {
		return await response.json();
	}
	return null;
}

const get_media_folder = error_handler({ fn: unsafe_get_media_folder });
const fetch_data_tvdb = error_handler({ fn: unsafe_fetch_data_tvdb });
const fetch_data_tmdb = error_handler({ fn: unsafe_fetch_data_tmdb });
const fetch_show = error_handler({ fn: unsafe_fetch_show });

export {
	DELETE_OPTIONS, //
	POST_OPTIONS,
	GET_OPTIONS,
	PUT_OPTIONS,
	get_media_folder,
	fetch_data_tvdb,
	fetch_data_tmdb,
	fetch_show,
	error_handler
};
