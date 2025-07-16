import { url_resolver } from './url_utils';

class Youtube {
	MAX_RECURSION = 5;
	recurse_count = 0;
	constructor() { }
	async load_trailer(query: string) {
		this.recurse_count++;
		return new Promise(async (resolve: any, reject: any): Promise<any> => {
			if (this.recurse_count === this.MAX_RECURSION) reject(undefined);

			const response = await fetch(url_resolver('self') + 'api/youtube', {
				method: 'POST',
				body: JSON.stringify({
					query: query
				})
			});
			if (response.ok) {
				const json = await response.json();
				if (json.id) {
					resolve(json.id);
				} else {
					setTimeout(async () => {
						await this.load_trailer(query);
					}, 1000);
				}
			}
		});
	}
}

export { Youtube };
