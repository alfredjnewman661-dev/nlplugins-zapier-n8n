import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ChatwootApi implements ICredentialType {
	name = 'chatwootApi';
	displayName = 'Chatwoot API';
	documentationUrl = 'https://www.chatwoot.com/developers/api';
	
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.chatwoot.com',
			placeholder: 'https://app.chatwoot.com',
			description: 'Your Chatwoot instance URL (without trailing slash)',
			required: true,
		},
		{
			displayName: 'API Access Token',
			name: 'apiAccessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Get your API Access Token from Profile Settings → Access Token',
			required: true,
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'number',
			default: 1,
			description: 'Your Chatwoot Account ID (found in the URL when logged in)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				api_access_token: '={{$credentials.apiAccessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/profile',
			method: 'GET',
		},
	};
}
