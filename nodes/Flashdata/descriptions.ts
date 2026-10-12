import type { INodeProperties } from 'n8n-workflow';

export const googleResources = [
	{
		name: 'Google Search',
		value: 'googleSearch',
		source: 'google_search',
		detail: 'Google web search and SERP results',
	},
	{
		name: 'Google Images',
		value: 'googleImages',
		source: 'google_images',
		detail: 'Google Images and image search with source URLs',
	},
	{
		name: 'Google News',
		value: 'googleNews',
		source: 'google_news',
		detail: 'Google News and news search results',
	},
	{
		name: 'Google Places',
		value: 'googlePlaces',
		source: 'google_places',
		detail: 'Google Places and local business search',
	},
	{
		name: 'Google Shopping',
		value: 'googleShopping',
		source: 'google_shopping',
		detail: 'Google Shopping and product search results',
	},
	{
		name: 'Google Videos',
		value: 'googleVideos',
		source: 'google_videos',
		detail: 'Google video search and video SERP across websites',
	},
];

export const operationSources: Record<string, string> = {
	search: 'youtube_search',
	searchExtended: 'youtube_search_extended',
	getMetadata: 'youtube_metadata',
	getTranscript: 'youtube_transcript',
	getCaptions: 'youtube_captions',
	getChannel: 'youtube_channel',
	getLicense: 'youtube_trainability',
	getSuggestions: 'youtube_suggestions',
	download: 'youtube_download',
};

export const resourceOptions = [
	{
		name: 'Download Job',
		value: 'downloadJob',
	},
	{
		name: 'Google Images',
		value: 'googleImages',
	},
	{
		name: 'Google News',
		value: 'googleNews',
	},
	{
		name: 'Google Places',
		value: 'googlePlaces',
	},
	{
		name: 'Google Search',
		value: 'googleSearch',
	},
	{
		name: 'Google Shopping',
		value: 'googleShopping',
	},
	{
		name: 'Google Videos',
		value: 'googleVideos',
	},
	{
		name: 'YouTube',
		value: 'youtube',
	},
];

export function sourceLink(source: string): string {
	return `https://flashdata.dev/docs/sources/${source}?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=${source}-node`;
}

const googleFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search google search',
				description: 'Google web search and SERP results',
			},
		],
		default: 'search',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. battery recycling research',
		description: 'Search query, up to 2,000 characters',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Autocorrect',
				name: 'autocorrect',
				type: 'boolean',
				default: true,
				description: 'Whether to apply spelling corrections',
			},
			{
				displayName: 'Country',
				name: 'gl',
				type: 'string',
				default: 'us',
				description: 'Two-letter country code, such as us or de',
			},
			{
				displayName: 'Language',
				name: 'hl',
				type: 'string',
				default: 'en',
				description: 'Interface language code, such as en',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				placeholder: 'e.g. New York, United States',
				description: 'Geographic search location',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
					numberPrecision: 0,
				},
				description: 'Page to request. Each page is a separate billable query.',
			},
			{
				displayName: 'Result Count',
				name: 'num',
				type: 'number',
				default: 10,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
					numberPrecision: 0,
				},
				description: 'Requested number of results. The actual count depends on the query.',
			},
			{
				displayName: 'Time Filter',
				name: 'tbs',
				type: 'string',
				default: '',
				placeholder: 'e.g. qdr:d',
				description: 'Google time filter, such as qdr:d for the past day',
			},
		],
	},
];

export const descriptions: INodeProperties[] = [
	...googleResources.flatMap((resource) => [
		...googleFields.map((property) => ({
			...property,
			displayOptions: { show: { resource: [resource.value] } },
			...(property.name === 'operation'
				? {
						options: [
							{
								name: 'Search',
								value: 'search',
								action: `Search ${resource.name.toLowerCase()}`,
								description: resource.detail,
							},
						],
					}
				: {}),
		})),
		{
			displayName: `Read the <a href="${sourceLink(resource.source)}" target="_blank">${resource.name} API guide</a> for inputs, outputs, and pricing. Each page is a separate query.`,
			name: `${resource.value}Guide`,
			type: 'notice' as const,
			default: '',
			displayOptions: { show: { resource: [resource.value] } },
		},
	]),
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['youtube'],
			},
		},
		options: [
			{
				name: 'Download Video or Audio',
				value: 'download',
				action: 'Download you tube to cloud storage',
				description:
					'Submit an asynchronous YouTube download to S3 or other customer cloud storage',
			},
			{
				name: 'Get Captions',
				value: 'getCaptions',
				action: 'Get you tube uploader captions',
				description:
					'YouTube manual captions or subtitles in a chosen language; no automatic fallback',
			},
			{
				name: 'Get Channel',
				value: 'getChannel',
				action: 'Get you tube channel data',
				description: 'YouTube channel data and recent channel videos by handle',
			},
			{
				name: 'Get License Label (Trainability)',
				value: 'getLicense',
				action: 'Inspect you tube creative commons license metadata',
				description:
					'YouTube trainability: Creative Commons license metadata only, not training permission',
			},
			{
				name: 'Get Metadata',
				value: 'getMetadata',
				action: 'Get you tube video metadata',
				description: 'Retrieve video details, chapters, and available formats',
			},
			{
				name: 'Get Search Suggestions',
				value: 'getSuggestions',
				action: 'Get you tube autocomplete suggestions',
				description: 'YouTube autocomplete and search suggestions; phrases, not search volume',
			},
			{
				name: 'Get Transcript',
				value: 'getTranscript',
				action: 'Get a you tube transcript',
				description: 'Retrieve timestamped video captions in the requested language',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search you tube',
				description: 'Discover up to 20 videos for a query',
			},
			{
				name: 'Search Extended',
				value: 'searchExtended',
				action: 'Run extended you tube search',
				description:
					'YouTube extended search, up to 700 requested results; separate source and price',
			},
		],
		default: 'search',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. battery recycling explained',
		description: 'Search query, up to 2,000 characters',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['search', 'searchExtended'],
			},
		},
	},
	{
		displayName: 'Maximum Results',
		name: 'maxResults',
		type: 'number',
		default: 10,
		typeOptions: {
			minValue: 1,
			maxValue: 20,
			numberPrecision: 0,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Video URL or ID',
		name: 'videoId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		description: 'YouTube watch, short, embed, live, or youtu.be URL, or an 11-character video ID',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getMetadata', 'getTranscript', 'getCaptions', 'getLicense', 'download'],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		required: true,
		default: 'en',
		description:
			'Caption language code, such as en. The video must have captions in this language.',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getTranscript', 'getCaptions'],
			},
		},
	},
	{
		displayName: 'Automatically Generated',
		name: 'auto',
		type: 'boolean',
		default: true,
		description:
			'Whether to select automatically generated captions. Disable to select manual captions. There is no fallback between caption types.',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getTranscript'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getMetadata'],
			},
		},
		options: [
			{
				displayName: 'Include Chapters',
				name: 'includeChapters',
				type: 'boolean',
				default: true,
				description: 'Whether to include video chapters',
			},
			{
				displayName: 'Include Formats',
				name: 'includeFormats',
				type: 'boolean',
				default: true,
				description: 'Whether to include available video and audio formats',
			},
		],
	},
	{
		displayName: 'Maximum Results',
		name: 'maxResults',
		type: 'number',
		default: 20,
		typeOptions: {
			minValue: 1,
			maxValue: 700,
			numberPrecision: 0,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['searchExtended'],
			},
		},
	},
	{
		displayName: 'Automatically Generated',
		name: 'auto',
		type: 'boolean',
		default: false,
		description:
			'Whether to select automatic captions instead of uploader captions. No fallback or translation.',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getCaptions'],
			},
		},
	},
	{
		displayName: 'Channel Handle',
		name: 'handle',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. @GoogleDevelopers',
		description: 'YouTube channel handle with or without @',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getChannel'],
			},
		},
	},
	{
		displayName: 'Video Limit',
		name: 'videoLimit',
		type: 'number',
		default: 20,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberPrecision: 0,
		},
		description: 'Max number of recent channel videos to return',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getChannel'],
			},
		},
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. how to build',
		description: 'Prefix for YouTube autocomplete suggestions',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getSuggestions'],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'en',
		description: 'Language code for autocomplete suggestions',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getSuggestions'],
			},
		},
	},
	{
		displayName: 'Region',
		name: 'region',
		type: 'string',
		default: 'US',
		description: 'Two-letter country code for autocomplete suggestions',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getSuggestions'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		default: {},
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['search', 'searchExtended'],
			},
		},
		options: [
			{
				displayName: '360',
				name: '360',
				type: 'boolean',
				default: false,
				description: 'Whether to require the 360 feature',
			},
			{
				displayName: '3D',
				name: '3d',
				type: 'boolean',
				default: false,
				description: 'Whether to require the 3d feature',
			},
			{
				displayName: '4K',
				name: '4k',
				type: 'boolean',
				default: false,
				description: 'Whether to require the 4k feature',
			},
			{
				displayName: 'CREATIVE COMMONS',
				name: 'creative_commons',
				type: 'boolean',
				default: false,
				description: 'Whether to require the creative commons feature',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				default: '<4',
				options: [
					{
						name: '<4',
						value: '<4',
					},
					{
						name: '>20',
						value: '>20',
					},
					{
						name: '4-20',
						value: '4-20',
					},
				],
			},
			{
				displayName: 'HD',
				name: 'hd',
				type: 'boolean',
				default: false,
				description: 'Whether to require the hd feature',
			},
			{
				displayName: 'HDR',
				name: 'hdr',
				type: 'boolean',
				default: false,
				description: 'Whether to require the hdr feature',
			},
			{
				displayName: 'LIVE',
				name: 'live',
				type: 'boolean',
				default: false,
				description: 'Whether to require the live feature',
			},
			{
				displayName: 'LOCATION',
				name: 'location',
				type: 'boolean',
				default: false,
				description: 'Whether to require the location feature',
			},
			{
				displayName: 'PURCHASED',
				name: 'purchased',
				type: 'boolean',
				default: false,
				description: 'Whether to require the purchased feature',
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				default: 'rating',
				options: [
					{
						name: 'Rating',
						value: 'rating',
					},
					{
						name: 'Relevance',
						value: 'relevance',
					},
					{
						name: 'Upload Date',
						value: 'upload_date',
					},
					{
						name: 'View Count',
						value: 'view_count',
					},
				],
			},
			{
				displayName: 'SUBTITLES',
				name: 'subtitles',
				type: 'boolean',
				default: false,
				description: 'Whether to require the subtitles feature',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'video',
				options: [
					{
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Movie',
						value: 'movie',
					},
					{
						name: 'Playlist',
						value: 'playlist',
					},
					{
						name: 'Video',
						value: 'video',
					},
				],
			},
			{
				displayName: 'Upload Date',
				name: 'upload_date',
				type: 'options',
				default: 'today',
				options: [
					{
						name: 'Last Hour',
						value: 'last_hour',
					},
					{
						name: 'This Month',
						value: 'this_month',
					},
					{
						name: 'This Week',
						value: 'this_week',
					},
					{
						name: 'This Year',
						value: 'this_year',
					},
					{
						name: 'Today',
						value: 'today',
					},
				],
			},
			{
				displayName: 'VR180',
				name: 'vr180',
				type: 'boolean',
				default: false,
				description: 'Whether to require the vr180 feature',
			},
		],
	},
	{
		displayName: 'Download Type',
		name: 'downloadType',
		type: 'options',
		default: 'audio_video',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['download'],
			},
		},
		options: [
			{
				name: 'Audio Only',
				value: 'audio',
			},
			{
				name: 'Video and Audio',
				value: 'audio_video',
			},
			{
				name: 'Video Only',
				value: 'video',
			},
		],
	},
	{
		displayName: 'Download Options',
		name: 'downloadOptions',
		type: 'collection',
		default: {},
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['download'],
			},
		},
		options: [
			{
				displayName: 'Audio Language',
				name: 'audio_language',
				type: 'options',
				default: 'default',
				options: [
					{
						name: 'Default',
						value: 'default',
					},
					{
						name: 'Original',
						value: 'original',
					},
				],
				description: 'Applies to downloads containing audio',
			},
			{
				displayName: 'Audio Quality',
				name: 'audio_quality',
				type: 'options',
				default: 'best',
				options: [
					{
						name: '128',
						value: '128',
					},
					{
						name: '192',
						value: '192',
					},
					{
						name: '256',
						value: '256',
					},
					{
						name: '320',
						value: '320',
					},
					{
						name: 'Best',
						value: 'best',
					},
				],
				description: 'Audio-only quality; numeric values are in kbps',
			},
			{
				displayName: 'End At',
				name: 'end_at',
				type: 'string',
				default: '',
				placeholder: 'e.g. 00:00:30',
				description: 'Clip end in HH:MM:SS, later than Start At, at most 12:00:00',
			},
			{
				displayName: 'FPS',
				name: 'fps',
				type: 'string',
				default: '<=30',
				description: 'Constraint such as &lt;=30, &gt;=60, or ==30; 1–240',
			},
			{
				displayName: 'Output Format',
				name: 'output_format',
				type: 'options',
				default: 'mp4',
				options: [
					{
						name: 'M4A',
						value: 'm4a',
					},
					{
						name: 'MKV',
						value: 'mkv',
					},
					{
						name: 'MP3',
						value: 'mp3',
					},
					{
						name: 'MP4',
						value: 'mp4',
					},
					{
						name: 'OPUS',
						value: 'opus',
					},
					{
						name: 'WEBM',
						value: 'webm',
					},
				],
				description:
					'Video uses mp4/webm/mkv; audio-only uses m4a/mp3/opus. Omit to use the source default.',
			},
			{
				displayName: 'Start At',
				name: 'start_at',
				type: 'string',
				default: '00:00:00',
				description: 'Clip start in HH:MM:SS, at most 12:00:00',
			},
			{
				displayName: 'Upload Metadata',
				name: 'upload_metadata',
				type: 'boolean',
				default: false,
				description: 'Whether to upload metadata alongside the media',
			},
			{
				displayName: 'Video Quality',
				name: 'video_quality',
				type: 'string',
				default: '<=720',
				description: 'Best, worst, or &lt;=, ==, &gt;= plus 144/360/480/720/1080/1440/2160/4320',
			},
			{
				displayName: 'YT-DLP Format',
				name: 'yt_dlp_format',
				type: 'string',
				default: '',
				description: 'Advanced format selector; overrides video quality, FPS, and audio language',
			},
		],
	},
	{
		displayName:
			'Set Download Storage JSON in your FlashData credential. Submission returns a job ID, not a media file. Use Download Job to check completion and read the delivery manifest. Downloads consume credits based on delivered bytes.',
		name: 'downloadNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['download'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search-node" target="_blank">youtube search API guide</a> for inputs, outputs, and pricing.',
		name: 'searchGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['search'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-node" target="_blank">youtube search extended API guide</a> for inputs, outputs, and pricing.',
		name: 'searchExtendedGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['searchExtended'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_metadata?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-node" target="_blank">youtube metadata API guide</a> for inputs, outputs, and pricing.',
		name: 'getMetadataGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getMetadata'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_transcript?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_transcript-node" target="_blank">youtube transcript API guide</a> for inputs, outputs, and pricing.',
		name: 'getTranscriptGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getTranscript'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_captions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-node" target="_blank">youtube captions API guide</a> for inputs, outputs, and pricing.',
		name: 'getCaptionsGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getCaptions'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_channel?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-node" target="_blank">youtube channel API guide</a> for inputs, outputs, and pricing.',
		name: 'getChannelGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getChannel'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_trainability?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-node" target="_blank">youtube trainability API guide</a> for inputs, outputs, and pricing.',
		name: 'getLicenseGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getLicense'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-node" target="_blank">youtube suggestions API guide</a> for inputs, outputs, and pricing.',
		name: 'getSuggestionsGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['getSuggestions'],
			},
		},
	},
	{
		displayName:
			'Read the <a href="https://flashdata.dev/docs/sources/youtube_download?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-node" target="_blank">youtube download API guide</a> for inputs, outputs, and pricing.',
		name: 'downloadGuide',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['youtube'],
				operation: ['download'],
			},
		},
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		displayOptions: {
			show: {
				resource: ['downloadJob'],
			},
		},
		options: [
			{
				name: 'Get Status and Manifest',
				value: 'get',
				action: 'Get download job status and manifest',
				description: 'Read download job status and, when completed, delivered file metadata',
			},
		],
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID returned by Download Video or Audio; polling does not consume query credits',
		displayOptions: {
			show: {
				resource: ['downloadJob'],
			},
		},
	},
];
