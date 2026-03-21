"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatwootApi = void 0;
class ChatwootApi {
    constructor() {
        this.name = 'chatwootApi';
        this.displayName = 'Chatwoot API';
        this.documentationUrl = 'https://www.chatwoot.com/developers/api';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    api_access_token: '={{$credentials.apiAccessToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/v1/profile',
                method: 'GET',
            },
        };
    }
}
exports.ChatwootApi = ChatwootApi;
//# sourceMappingURL=ChatwootApi.credentials.js.map