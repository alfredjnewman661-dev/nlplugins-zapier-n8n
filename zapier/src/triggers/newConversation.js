// Webhook-based trigger for new conversations

const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/webhooks`,
    method: 'POST',
    body: {
      url: bundle.targetUrl,
      subscriptions: ['conversation_created'],
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
  
  // Ensure we only process conversation_created events
  if (payload.event !== 'conversation_created') {
    return [];
  }

  const conversation = payload.conversation || payload;
  
  return [{
    id: conversation.id,
    display_id: conversation.display_id,
    status: conversation.status,
    inbox_id: conversation.inbox_id,
    inbox_name: conversation.meta?.inbox?.name,
    contact_id: conversation.meta?.sender?.id,
    contact_name: conversation.meta?.sender?.name,
    contact_email: conversation.meta?.sender?.email,
    contact_phone: conversation.meta?.sender?.phone_number,
    created_at: conversation.created_at,
    additional_attributes: conversation.additional_attributes,
    custom_attributes: conversation.custom_attributes,
    account_id: payload.account?.id,
  }];
};

const fallbackList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations`,
    method: 'GET',
    params: {
      status: 'all',
      page: 1,
    },
  });

  const conversations = response.data.data.payload || [];
  
  return conversations.slice(0, 3).map(conv => ({
    id: conv.id,
    display_id: conv.display_id,
    status: conv.status,
    inbox_id: conv.inbox_id,
    created_at: conv.created_at,
    contact_name: conv.meta?.sender?.name,
    contact_email: conv.meta?.sender?.email,
  }));
};

module.exports = {
  key: 'new_conversation',
  noun: 'Conversation',
  
  display: {
    label: 'New Conversation',
    description: 'Triggers when a new conversation is created in Chatwoot.',
    important: true,
  },

  operation: {
    type: 'hook',
    
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: parsePayload,
    performList: fallbackList,

    sample: {
      id: 1,
      display_id: 1,
      status: 'open',
      inbox_id: 1,
      inbox_name: 'Website',
      contact_id: 1,
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      contact_phone: '+1234567890',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Conversation ID', type: 'integer' },
      { key: 'display_id', label: 'Display ID', type: 'integer' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'inbox_id', label: 'Inbox ID', type: 'integer' },
      { key: 'inbox_name', label: 'Inbox Name', type: 'string' },
      { key: 'contact_id', label: 'Contact ID', type: 'integer' },
      { key: 'contact_name', label: 'Contact Name', type: 'string' },
      { key: 'contact_email', label: 'Contact Email', type: 'string' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
