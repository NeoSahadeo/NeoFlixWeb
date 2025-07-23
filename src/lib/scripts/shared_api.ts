import { url_resolver } from './url_utils';

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

async function get_media_folder(url_key: string, api_key: string) {
	try {
		const response = await fetch(url_resolver(url_key as any) + 'rootfolder', GET_OPTIONS(api_key));
		if (response.ok) {
			return (await response.json())[0].path;
		}
	} catch (err) {
		return err;
	}
}

export {
	DELETE_OPTIONS, //
	POST_OPTIONS,
	GET_OPTIONS,
	PUT_OPTIONS,
	get_media_folder
};
