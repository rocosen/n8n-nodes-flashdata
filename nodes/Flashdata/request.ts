import type { IDataObject } from 'n8n-workflow';

export function normalizeVideoId(input: string): string {
	const value = input.trim();
	if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
	let id: string | null = null;
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
		if (url.hostname === 'youtu.be') {
			id = url.pathname.split('/')[1];
		} else if (
			['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(
				url.hostname,
			)
		) {
			const parts = url.pathname.split('/');
			id =
				url.pathname === '/watch'
					? url.searchParams.get('v')
					: ['shorts', 'embed', 'live'].includes(parts[1])
						? parts[2]
						: null;
		}
	} catch {
		/* Report one actionable validation error below. */
	}
	if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
		throw new Error('Enter a valid YouTube video URL or 11-character video ID.');
	}
	return id;
}

export function validateBody(body: IDataObject): void {
	if (!body.params || typeof body.params !== 'object' || Array.isArray(body.params))
		throw new Error('Query options must be an object.');
	const params = body.params as IDataObject;
	if ('query' in body) {
		const query = typeof body.query === 'string' ? body.query.trim() : '';
		if (!query || query.length > 2000)
			throw new Error('Query must contain between 1 and 2,000 characters.');
		body.query = query;
	}
	if ('video_id' in body) body.video_id = normalizeVideoId(String(body.video_id ?? ''));
	for (const [field, maximum] of [
		['num', 100],
		['page', 100],
		['max_results', body.source === 'youtube_search_extended' ? 700 : 20],
		['video_limit', 100],
	] as const) {
		if (
			params[field] !== undefined &&
			(!Number.isInteger(params[field]) ||
				Number(params[field]) < 1 ||
				Number(params[field]) > maximum)
		) {
			throw new Error(`${field} must be an integer between 1 and ${maximum}.`);
		}
	}
	if (params.gl !== undefined && !/^[A-Za-z]{2}$/.test(String(params.gl)))
		throw new Error('Country must be a two-letter country code.');
	if (params.region !== undefined && !/^[A-Za-z]{2}$/.test(String(params.region)))
		throw new Error('Region must be a two-letter country code.');
	if ('handle' in body) {
		const handle = typeof body.handle === 'string' ? body.handle.trim() : '';
		if (!handle || handle.length > 100)
			throw new Error('Channel handle must contain 1–100 characters.');
		body.handle = handle;
	}
	for (const field of ['auto', 'autocorrect', 'include_chapters', 'include_formats']) {
		if (params[field] !== undefined && typeof params[field] !== 'boolean')
			throw new Error(`${field} must be a boolean.`);
	}
	if (params.filters !== undefined) validateFilters(params.filters);
	for (const field of ['hl', 'language']) {
		if (params[field] !== undefined && !/^[A-Za-z0-9-]{1,35}$/.test(String(params[field])))
			throw new Error('Enter a valid language code.');
	}
	for (const field of ['location', 'tbs']) {
		if (
			params[field] !== undefined &&
			(typeof params[field] !== 'string' || String(params[field]).length > 200)
		)
			throw new Error(`${field} must be at most 200 characters.`);
	}
}

export function validateFilters(filters: unknown): void {
	if (!filters || typeof filters !== 'object' || Array.isArray(filters))
		throw new Error('Search filters must be an object.');
	const enums: Record<string, string[]> = {
		duration: ['<4', '4-20', '>20'],
		sort_by: ['rating', 'relevance', 'view_count', 'upload_date'],
		type: ['video', 'channel', 'playlist', 'movie'],
		upload_date: ['today', 'last_hour', 'this_week', 'this_month', 'this_year'],
	};
	const features = [
		'360',
		'3d',
		'4k',
		'creative_commons',
		'hd',
		'hdr',
		'live',
		'location',
		'purchased',
		'subtitles',
		'vr180',
	];
	for (const [field, value] of Object.entries(filters)) {
		if (
			Object.prototype.hasOwnProperty.call(enums, field)
				? !enums[field].includes(value)
				: !features.includes(field) || typeof value !== 'boolean'
		)
			throw new Error('Unsupported search filter or invalid filter value.');
	}
}
