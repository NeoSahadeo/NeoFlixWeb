import { dev } from '$app/environment';

enum API_URI {
	SELF_DEV = 'http://localhost:5173/',
	SELF_PROD = '',
	SONARR_DEV = 'http://localhost:8989/api/v3/',
	SONARR_PROD = '',
	RADARR_DEV = '',
	RADARR_PROD = '',
	PROWLARR_DEV = '',
	PROWLARR_PROD = '',
	QBITORRENT_DEV = '',
	QBITORRENT_PROD = ''
}

function url_resolver(type: 'self' | 'sonarr' | 'radarr' | 'prowlarr' | 'qbitorrent'): string {
	if (dev) {
		switch (type) {
			case 'self':
				return API_URI.SELF_DEV;
			case 'sonarr':
				return API_URI.SONARR_DEV;
			case 'radarr':
				return API_URI.RADARR_DEV;
			case 'prowlarr':
				return API_URI.PROWLARR_DEV;
			case 'qbitorrent':
				return API_URI.QBITORRENT_DEV;
		}
	} else {
		switch (type) {
			case 'self':
				return API_URI.SELF_PROD;
			case 'sonarr':
				return API_URI.SONARR_PROD;
			case 'radarr':
				return API_URI.RADARR_PROD;
			case 'prowlarr':
				return API_URI.PROWLARR_PROD;
			case 'qbitorrent':
				return API_URI.PROWLARR_DEV;
		}
	}
}

export { url_resolver };
