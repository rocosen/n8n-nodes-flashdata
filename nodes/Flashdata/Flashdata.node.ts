import { execute } from './execute';
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { descriptions, resourceOptions } from './descriptions';

export class Flashdata implements INodeType {
	execute = execute;
	description: INodeTypeDescription = {
		displayName: 'FlashData',
		name: 'flashdata',
		icon: { light: 'file:flashdata.svg', dark: 'file:flashdata.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Google Search, News, Images, Shopping, Videos, Places; YouTube search, transcripts, captions, metadata, channels, autocomplete and downloads',
		defaults: { name: 'FlashData' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'flashdataApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: resourceOptions,
				default: 'googleSearch',
			},
			...descriptions,
		],
	};
}
