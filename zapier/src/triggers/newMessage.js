// Webhook-based trigger for new messages

const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/webhooks`,
    method: 'POST',
    body: {
      url: bundle.targetUrl,
      subscriptions: ['message_created'],
    },
  });

  return response.data;
};

const unsubscribeHook = async (z, bundle) => {
  const webhookId = bundle.subscribeData.id;
  
  await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/webhooks/${webhookId}`,
    method: 'DELETE',
  });

  return {};
};

const parsePayload = (z, bundle) => {
  const payload = bundle.cleanedRequest;
  
  if (payload.event !== 'message_created') {
    return [];
  }

  // Filter by message type if specified
  if (bundle.inputData.message_type && payload.message_type !== parseInt(bundle.inputData.message_type)) {
    return [];
  }

  const message = payload;
  
  return [{
    id: message.id,
    content: message.content,
    message_type: message.message_type,
    message_type_label: getMessageTypeLabel(message.message_type),
    private: message.private,
    conversation_id: message.conversation?.id,
    conversation_display_id: message.conversation?.display_id,
    inbox_id: message.inbox?.id,
    inbox_name: message.inbox?.name,
    sender_id: message.sender?.id,
    sender_name: message.sender?.name,
    sender_email: message.sender?.email,
    sender_type: message.sender?.type,
    created_at: message.created_at,
    attachments: message.attachments,
  }];
};

const getMessageTypeLabel = (type) => {
  const types = {
    0: 'incoming',
    1: 'outgoing',
    2: 'activity',
    3: 'template',
  };
  return types[type] || 'unknown';
};

const fallbackList = async (z, bundle) => {
  // First get conversations
  const convResponse = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations`,
    method: 'GET',
    params: { status: 'all', page: 1 },
  });

  const conversations = convResponse.data.data.payload || [];
  if (conversations.length === 0) return [];

  // Get messages from the first conversation
  const msgResponse = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversations[0].id}/messages`,
    method: 'GET',
  });

  const messages = msgResponse.data || [];
  
  return messages.slice(0, 3).map(msg => ({
    id: msg.id,
    content: msg.content,
    message_type: msg.message_type,
    message_type_label: getMessageTypeLabel(msg.message_type),
    private: msg.private,
    conversation_id: conversations[0].id,
    created_at: msg.created_at,
  }));
};

module.exports = {
  key: 'new_message',
  noun: 'Message',
  
  display: {
    label: 'New Message',
    description: 'Triggers when a new message is received in a conversation.',
    important: true,
  },

  operation: {
    type: 'hook',
    
    inputFields: [
      {
        key: 'message_type',
        label: 'Message Type',
        type: 'string',
        choices: [
          { value: '0', label: 'Incoming (from customer)' },
          { value: '1', label: 'Outgoing (from agent)' },
          { value: '2', label: 'Activity' },
        ],
        helpText: 'Filter by message type. Leave empty for all messages.',
        required: false,
      },
    ],
    
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: parsePayload,
    performList: fallbackList,

    sample: {
      id: 1,
      content: 'Hello, I need help with my order',
      message_type: 0,
      message_type_label: 'incoming',
      private: false,
      conversation_id: 1,
      conversation_display_id: 1,
      inbox_id: 1,
      inbox_name: 'Website',
      sender_id: 1,
      sender_name: 'John Doe',
      sender_email: 'john@example.com',
      sender_type: 'contact',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Message ID', type: 'integer' },
      { key: 'content', label: 'Content', type: 'text' },
      { key: 'message_type', label: 'Message Type', type: 'integer' },
      { key: 'message_type_label', label: 'Message Type Label', type: 'string' },
      { key: 'private', label: 'Is Private', type: 'boolean' },
      { key: 'conversation_id', label: 'Conversation ID', type: 'integer' },
      { key: 'sender_name', label: 'Sender Name', type: 'string' },
      { key: 'sender_email', label: 'Sender Email', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
