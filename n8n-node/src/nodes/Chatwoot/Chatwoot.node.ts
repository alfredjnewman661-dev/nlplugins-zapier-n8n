import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Chatwoot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Chatwoot',
		name: 'chatwoot',
		icon: 'file:chatwoot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Chatwoot API',
		defaults: {
			name: 'Chatwoot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'chatwootApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Conversation',
						value: 'conversation',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'conversation',
			},

			// Conversation operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['conversation'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new conversation',
						action: 'Create a conversation',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a conversation',
						action: 'Get a conversation',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many conversations',
						action: 'Get many conversations',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update conversation status, assignee, or labels',
						action: 'Update a conversation',
					},
				],
				default: 'get',
			},

			// Message operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message to a conversation',
						action: 'Send a message',
					},
					{
						name: 'Add Private Note',
						value: 'addNote',
						description: 'Add a private note to a conversation',
						action: 'Add a private note',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get messages from a conversation',
						action: 'Get many messages',
					},
				],
				default: 'send',
			},

			// Contact operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact',
						action: 'Get a contact',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search contacts',
						action: 'Search contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
				],
				default: 'get',
			},

			// Conversation ID field
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['conversation'],
						operation: ['get', 'update'],
					},
				},
				description: 'The ID of the conversation',
			},
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send', 'addNote', 'getMany'],
					},
				},
				description: 'The ID of the conversation',
			},

			// Message content
			{
				displayName: 'Message Content',
				name: 'messageContent',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send', 'addNote'],
					},
				},
				description: 'The message content to send',
			},

			// Message type
			{
				displayName: 'Message Type',
				name: 'messageType',
				type: 'options',
				options: [
					{
						name: 'Outgoing (From Agent)',
						value: 'outgoing',
					},
					{
						name: 'Incoming (From Customer)',
						value: 'incoming',
					},
				],
				default: 'outgoing',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
			},

			// Contact ID
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update'],
					},
				},
			},

			// Create contact fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
			},

			// Inbox ID for conversation creation
			{
				displayName: 'Inbox ID',
				name: 'inboxId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['conversation'],
						operation: ['create'],
					},
				},
				description: 'The ID of the inbox (must be an API-type inbox)',
			},

			// Source ID for conversation creation
			{
				displayName: 'Source ID',
				name: 'sourceId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['conversation'],
						operation: ['create'],
					},
				},
				description: 'The source ID of the contact',
			},

			// Search query
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['search'],
					},
				},
			},

			// Update conversation options
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['conversation'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Open', value: 'open' },
							{ name: 'Resolved', value: 'resolved' },
							{ name: 'Pending', value: 'pending' },
							{ name: 'Snoozed', value: 'snoozed' },
						],
						default: 'open',
					},
					{
						displayName: 'Assignee ID',
						name: 'assigneeId',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Team ID',
						name: 'teamId',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'Labels',
						name: 'labels',
						type: 'string',
						default: '',
						description: 'Comma-separated list of labels',
					},
				],
			},

			// Additional fields for contact
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Identifier',
						name: 'identifier',
						type: 'string',
						default: '',
						description: 'External identifier from your system',
					},
				],
			},

			// List options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 50,
						description: 'Max number of results to return',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Open', value: 'open' },
							{ name: 'Resolved', value: 'resolved' },
							{ name: 'Pending', value: 'pending' },
						],
						default: 'all',
						displayOptions: {
							show: {
								'/resource': ['conversation'],
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('chatwootApi');

		const baseUrl = credentials.baseUrl as string;
		const accountId = credentials.accountId as number;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'conversation') {
					if (operation === 'get') {
						const conversationId = this.getNodeParameter('conversationId', i) as number;
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}`,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					} else if (operation === 'getMany') {
						const options = this.getNodeParameter('options', i) as { limit?: number; status?: string };
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations`,
							qs: {
								status: options.status || 'all',
							},
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
						responseData = responseData.data?.payload || [];
						if (options.limit) {
							responseData = responseData.slice(0, options.limit);
						}
					} else if (operation === 'update') {
						const conversationId = this.getNodeParameter('conversationId', i) as number;
						const updateFields = this.getNodeParameter('updateFields', i) as {
							status?: string;
							assigneeId?: number;
							teamId?: number;
							labels?: string;
						};

						// Update status
						if (updateFields.status) {
							await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_status`,
								body: { status: updateFields.status },
								headers: {
									api_access_token: credentials.apiAccessToken as string,
								},
							});
						}

						// Update assignee
						if (updateFields.assigneeId) {
							await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`,
								body: { assignee_id: updateFields.assigneeId },
								headers: {
									api_access_token: credentials.apiAccessToken as string,
								},
							});
						}

						// Update team
						if (updateFields.teamId) {
							await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`,
								body: { team_id: updateFields.teamId },
								headers: {
									api_access_token: credentials.apiAccessToken as string,
								},
							});
						}

						// Update labels
						if (updateFields.labels) {
							const labels = updateFields.labels.split(',').map((l) => l.trim());
							await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`,
								body: { labels },
								headers: {
									api_access_token: credentials.apiAccessToken as string,
								},
							});
						}

						// Get updated conversation
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}`,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					}
				} else if (resource === 'message') {
					const conversationId = this.getNodeParameter('conversationId', i) as number;

					if (operation === 'send') {
						const messageContent = this.getNodeParameter('messageContent', i) as string;
						const messageType = this.getNodeParameter('messageType', i) as string;

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
							body: {
								content: messageContent,
								message_type: messageType,
								private: false,
							},
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					} else if (operation === 'addNote') {
						const messageContent = this.getNodeParameter('messageContent', i) as string;

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
							body: {
								content: messageContent,
								message_type: 'outgoing',
								private: true,
							},
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					} else if (operation === 'getMany') {
						const options = this.getNodeParameter('options', i) as { limit?: number };
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
						if (options.limit && Array.isArray(responseData)) {
							responseData = responseData.slice(0, options.limit);
						}
					}
				} else if (resource === 'contact') {
					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as number;
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${contactId}`,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							email?: string;
							phoneNumber?: string;
							identifier?: string;
						};

						const body: Record<string, unknown> = { name };
						if (additionalFields.email) body.email = additionalFields.email;
						if (additionalFields.phoneNumber) body.phone_number = additionalFields.phoneNumber;
						if (additionalFields.identifier) body.identifier = additionalFields.identifier;

						responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v1/accounts/${accountId}/contacts`,
							body,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					} else if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						responseData = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/search`,
							qs: { q: query },
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
						responseData = responseData.payload || [];
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							email?: string;
							phoneNumber?: string;
							identifier?: string;
						};

						const body: Record<string, unknown> = {};
						if (additionalFields.email) body.email = additionalFields.email;
						if (additionalFields.phoneNumber) body.phone_number = additionalFields.phoneNumber;
						if (additionalFields.identifier) body.identifier = additionalFields.identifier;

						responseData = await this.helpers.httpRequest({
							method: 'PUT',
							url: `${baseUrl}/api/v1/accounts/${accountId}/contacts/${contactId}`,
							body,
							headers: {
								api_access_token: credentials.apiAccessToken as string,
							},
						});
					}
				}

				const jsonData = Array.isArray(responseData) ? responseData : [responseData];
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(jsonData),
					{ itemData: { item: i } }
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
