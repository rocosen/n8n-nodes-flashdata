import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class FlashdataApi implements ICredentialType {
	name = 'flashdataApi';
	displayName = 'FlashData API';
	icon: Icon = {
		light: 'file:../nodes/Flashdata/flashdata.svg',
		dark: 'file:../nodes/Flashdata/flashdata.svg',
	};
	documentationUrl = 'https://github.com/rocosen/n8n-nodes-flashdata#credentials-and-costs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Download Storage JSON',
			name: 'downloadStorageSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Optional for research queries. For downloads, enter the customer storage object from the FlashData download guide (provider, bucket and scoped write credentials). Stored encrypted in this credential; never put secrets in workflow fields.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: { headers: { 'X-API-Key': '={{$credentials.apiKey}}' } },
	};
	test: ICredentialTestRequest = {
		request: { baseURL: 'https://api.flashdata.dev', url: '/v2/api-access', method: 'GET' },
	};
}
