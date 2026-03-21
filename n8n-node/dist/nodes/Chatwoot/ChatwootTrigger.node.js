"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatwootTrigger = void 0;
class ChatwootTrigger {
    constructor() {
        this.description = {
            displayName: 'Chatwoot Trigger',
            name: 'chatwootTrigger',
            icon: 'file:chatwoot.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["event"]}}',
            description: 'Starts the workflow when Chatwoot events occur',
            defaults: {
                name: 'Chatwoot Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'chatwootApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Conversation Created',
                            value: 'conversation_created',
                            description: 'Triggers when a new conversation is created',
                        },
                        {
                            name: 'Conversation Resolved',
                            value: 'conversation_resolved',
                            description: 'Triggers when a conversation is resolved',
                        },
                        {
                            name: 'Conversation Assigned',
                            value: 'conversation_assigned',
                            description: 'Triggers when a conversation is assigned',
                        },
                        {
                            name: 'Conversation Status Changed',
                            value: 'conversation_status_changed',
                            description: 'Triggers when conversation status changes',
                        },
                        {
                            name: 'Conversation Updated',
                            value: 'conversation_updated',
                            description: 'Triggers when a conversation is updated',
                        },
                        {
                            name: 'Message Created',
                            value: 'message_created',
                            description: 'Triggers when a new message is received',
                        },
                        {
                            name: 'Message Updated',
                            value: 'message_updated',
                            description: 'Triggers when a message is updated',
                        },
                        {
                            name: 'Webwidget Triggered',
                            value: 'webwidget_triggered',
                            description: 'Triggers for webwidget events',
                        },
                    ],
                    default: 'message_created',
                    required: true,
                },
                {
                    displayName: 'Filter by Message Type',
                    name: 'filterMessageType',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            event: ['message_created'],
                        },
                    },
                    description: 'Whether to filter messages by type',
                },
                {
                    displayName: 'Message Type',
                    name: 'messageType',
                    type: 'options',
                    options: [
                        {
                            name: 'Incoming (From Customer)',
                            value: 0,
                        },
                        {
                            name: 'Outgoing (From Agent)',
                            value: 1,
                        },
                        {
                            name: 'Activity',
                            value: 2,
                        },
                    ],
                    default: 0,
                    displayOptions: {
                        show: {
                            event: ['message_created'],
                            filterMessageType: [true],
                        },
                    },
                },
                {
                    displayName: 'Exclude Private Messages',
                    name: 'excludePrivate',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            event: ['message_created'],
                        },
                    },
                    description: 'Whether to exclude private notes from the trigger',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const credentials = await this.getCredentials('chatwootApi');
                    const baseUrl = credentials.baseUrl;
                    const accountId = credentials.accountId;
                    try {
                        const response = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/api/v1/accounts/${accountId}/webhooks`,
                            headers: {
                                api_access_token: credentials.apiAccessToken,
                            },
                        });
                        const webhooks = response.payload || response || [];
                        for (const webhook of webhooks) {
                            if (webhook.url === webhookUrl) {
                                const webhookData = this.getWorkflowStaticData('node');
                                webhookData.webhookId = webhook.id;
                                return true;
                            }
                        }
                    }
                    catch (error) {
                        return false;
                    }
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const credentials = await this.getCredentials('chatwootApi');
                    const baseUrl = credentials.baseUrl;
                    const accountId = credentials.accountId;
                    const event = this.getNodeParameter('event');
                    // Map events to Chatwoot webhook subscriptions
                    const subscriptions = [event];
                    // For resolved status, we actually subscribe to status_changed
                    if (event === 'conversation_resolved') {
                        subscriptions[0] = 'conversation_status_changed';
                    }
                    // For assigned, we subscribe to conversation_updated
                    if (event === 'conversation_assigned') {
                        subscriptions[0] = 'conversation_updated';
                    }
                    try {
                        const response = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/api/v1/accounts/${accountId}/webhooks`,
                            body: {
                                url: webhookUrl,
                                subscriptions,
                            },
                            headers: {
                                api_access_token: credentials.apiAccessToken,
                            },
                        });
                        const webhookData = this.getWorkflowStaticData('node');
                        webhookData.webhookId = response.id || response.payload?.id;
                        return true;
                    }
                    catch (error) {
                        return false;
                    }
                },
                async delete() {
                    const credentials = await this.getCredentials('chatwootApi');
                    const baseUrl = credentials.baseUrl;
                    const accountId = credentials.accountId;
                    const webhookData = this.getWorkflowStaticData('node');
                    const webhookId = webhookData.webhookId;
                    if (webhookId) {
                        try {
                            await this.helpers.httpRequest({
                                method: 'DELETE',
                                url: `${baseUrl}/api/v1/accounts/${accountId}/webhooks/${webhookId}`,
                                headers: {
                                    api_access_token: credentials.apiAccessToken,
                                },
                            });
                        }
                        catch (error) {
                            return false;
                        }
                    }
                    delete webhookData.webhookId;
                    return true;
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        const event = this.getNodeParameter('event');
        // Check if the event matches
        const receivedEvent = bodyData.event;
        // Handle conversation_resolved special case
        if (event === 'conversation_resolved') {
            if (receivedEvent !== 'conversation_status_changed') {
                return { workflowData: [] };
            }
            if (bodyData.conversation?.status !== 'resolved') {
                return { workflowData: [] };
            }
        }
        // Handle conversation_assigned special case
        else if (event === 'conversation_assigned') {
            if (receivedEvent !== 'conversation_updated') {
                return { workflowData: [] };
            }
            if (!bodyData.conversation?.meta?.assignee) {
                return { workflowData: [] };
            }
        }
        // Standard event matching
        else if (receivedEvent !== event) {
            return { workflowData: [] };
        }
        // Filter by message type if enabled
        if (event === 'message_created') {
            const filterMessageType = this.getNodeParameter('filterMessageType', false);
            if (filterMessageType) {
                const messageType = this.getNodeParameter('messageType');
                if (bodyData.message_type !== messageType) {
                    return { workflowData: [] };
                }
            }
            // Exclude private messages if enabled
            const excludePrivate = this.getNodeParameter('excludePrivate', false);
            if (excludePrivate && bodyData.private) {
                return { workflowData: [] };
            }
        }
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.ChatwootTrigger = ChatwootTrigger;
//# sourceMappingURL=ChatwootTrigger.node.js.map