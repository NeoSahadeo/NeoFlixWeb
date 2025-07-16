import UserAgent from 'user-agents';
import { parse } from 'node-html-parser';

const YOUTUBE_VIDEO = 'https://www.youtube.com/embed/';

function unescape(str: string) {
	return str
		.replace(/\\\\u([a-fA-F0-9]{4})/gm, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
		.replace(/\\x([a-fA-F0-9]{2})/gm, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
		.replace(/\\\\"/gm, "\'");
}

function search_object(query: string, json: JSON): any | null {
	for (const key in json) {
		if (query === key) return key;
	}
	return null;
}

function search_array(query: string, array: JSON[]): any | null {
	for (let x = 0; x < array.length; x++) {
		const result = search_object(query, array[x]);
		if (result) return x;
	}
}

async function fetch_trailer(query: string) {
	const user_agent = new UserAgent();

	const q = 'https://www.youtube.com/results?search_query=' + query.replaceAll(/ /gi, '+');
	console.log(q);
	try {
		const response = await fetch(q, {
			// @ts-ignore
			headers: {
				'Content-Type': 'text/html',
				'User-Agent': user_agent.toString()
			}
		});
		if (response.ok) {
			try {
				const text = await response.text();
				const match = text.match(/(?<=var ytInitialData =.*')((.|\n)*?)(?=';<\/script>)/g);
				if (!match) return;

				const json = JSON.parse(unescape(match[0]));

				const global_contents = search_object('contents', json);

				const section_list_renderer = global_contents
					? search_object('sectionListRenderer', json[global_contents])
					: null;

				const local_contents = global_contents
					? search_object('contents', json[global_contents][section_list_renderer])
					: null;

				const item_section_renderer_index = global_contents
					? search_array(
						'itemSectionRenderer',
						json[global_contents][section_list_renderer][local_contents]
					)
					: null;

				const video_with_context_renderer_index =
					item_section_renderer_index != null
						? search_array(
							'videoWithContextRenderer',
							json[global_contents][section_list_renderer][local_contents][
								item_section_renderer_index
							].itemSectionRenderer.contents
						)
						: null;

				return json[global_contents][section_list_renderer][local_contents][
					item_section_renderer_index
				].itemSectionRenderer.contents[video_with_context_renderer_index].videoWithContextRenderer
					.videoId;
			} catch (err) {
				console.log(err);
			}
		}
	} catch (err) {
		console.error(err);
	}
}

export { fetch_trailer };
