// Webhook-based trigger for tagged conversations

const subscribeHook = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/webhooks`,
    method: 'POST',
    body: {
      url: bundle.targetUrl,
      subscriptions: ['conversation_updated'],
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
  
  if (payload.event !== 'conversation_updated') {
    return [];
  }

  const conversation = payload.conversation || payload;
  const labels = conversation.labels || [];
  
  // Only trigger if there are labels
  if (labels.length === 0) {
    return [];
  }

  // Filter by specific label if provided
  if (bundle.inputData.label_name) {
    if (!labels.includes(bundle.inputData.label_name)) {
      return [];
    }
  }

  return [{
    id: conversation.id,
    display_id: conversation.display_id,
    status: conversation.status,
    inbox_id: conversation.inbox_id,
    inbox_name: conversation.meta?.inbox?.name,
    contact_id: conversation.meta?.sender?.id,
    contact_name: conversation.meta?.sender?.name,
    contact_email: conversation.meta?.sender?.email,
    labels: labels,
    labels_string: labels.join(', '),
    tagged_at: new Date().toISOString(),
    created_at: conversation.created_at,
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
  
  // Filter to conversations with labels
  const tagged = conversations.filter(conv => conv.labels && conv.labels.length > 0);
  
  return tagged.slice(0, 3).map(conv => ({
    id: conv.id,
    display_id: conv.display_id,
    status: conv.status,
    inbox_id: conv.inbox_id,
    contact_name: conv.meta?.sender?.name,
    labels: conv.labels,
    labels_string: conv.labels.join(', '),
    created_at: conv.created_at,
  }));
};

// Dynamic dropdown for labels
const getLabels = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/labels`,
    method: 'GET',
  });

  const labels = response.data.payload || [];
  return labels.map(label => ({
    id: label.title,
    label: label.title,
  }));
};

module.exports = {
  key: 'conversation_tagged',
  noun: 'Tagged Conversation',
  
  display: {
    label: 'Conversation Tagged',
    description: 'Triggers when a label is added to a conversation.',
  },

  operation: {
    type: 'hook',
    
    inputFields: [
      {
        key: 'label_name',
        label: 'Label',
        type: 'string',
        dynamic: 'get_labels.id.label',
        helpText: 'Only trigger for this specific label. Leave empty for any label.',
        required: false,
      },
    ],
    
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
      labels: ['urgent', 'billing'],
      labels_string: 'urgent, billing',
      tagged_at: '2024-01-01T00:00:00.000Z',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Conversation ID', type: 'integer' },
      { key: 'display_id', label: 'Display ID', type: 'integer' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'inbox_name', label: 'Inbox Name', type: 'string' },
      { key: 'contact_name', label: 'Contact Name', type: 'string' },
      { key: 'labels', label: 'Labels', type: 'string' },
      { key: 'labels_string', label: 'Labels (comma-separated)', type: 'string' },
      { key: 'tagged_at', label: 'Tagged At', type: 'datetime' },
    ],
  },
};
