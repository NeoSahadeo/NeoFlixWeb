import { base } from '$app/paths';

// LOCAL -- dev environment
const API_DEV = '';
const SELF_DEV = 'http://localhost:5173/';

// PROD -- production environment
const API_PROD = '';
const SELF_PROD = 'https://neosahadeo.github.io/Helios3/';

function url_resolver(type: 'api' | 'self'): string {
	if (base === '') {
		return type === 'api' ? API_DEV : SELF_DEV;
	}
	return type === 'api' ? API_PROD : SELF_PROD;
}

export { url_resolver };
