// Webhook-based trigger for assigned conversations

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
  const assignee = conversation.meta?.assignee;
  
  // Only trigger if there's an assignee
  if (!assignee || !assignee.id) {
    return [];
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
    assignee_id: assignee.id,
    assignee_name: assignee.name,
    assignee_email: assignee.email,
    team_id: conversation.meta?.team?.id,
    team_name: conversation.meta?.team?.name,
    assigned_at: new Date().toISOString(),
    created_at: conversation.created_at,
  }];
};

const fallbackList = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations`,
    method: 'GET',
    params: {
      status: 'all',
      assignee_type: 'assigned',
      page: 1,
    },
  });

  const conversations = response.data.data.payload || [];
  
  return conversations.slice(0, 3).map(conv => ({
    id: conv.id,
    display_id: conv.display_id,
    status: conv.status,
    inbox_id: conv.inbox_id,
    contact_name: conv.meta?.sender?.name,
    assignee_id: conv.meta?.assignee?.id,
    assignee_name: conv.meta?.assignee?.name,
    created_at: conv.created_at,
  }));
};

module.exports = {
  key: 'conversation_assigned',
  noun: 'Assigned Conversation',
  
  display: {
    label: 'Conversation Assigned',
    description: 'Triggers when a conversation is assigned to an agent or team.',
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
      assignee_id: 1,
      assignee_name: 'Agent Smith',
      assignee_email: 'agent@example.com',
      team_id: 1,
      team_name: 'Support Team',
      assigned_at: '2024-01-01T00:00:00.000Z',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Conversation ID', type: 'integer' },
      { key: 'display_id', label: 'Display ID', type: 'integer' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'inbox_name', label: 'Inbox Name', type: 'string' },
      { key: 'contact_name', label: 'Contact Name', type: 'string' },
      { key: 'assignee_id', label: 'Assignee ID', type: 'integer' },
      { key: 'assignee_name', label: 'Assignee Name', type: 'string' },
      { key: 'assignee_email', label: 'Assignee Email', type: 'string' },
      { key: 'team_name', label: 'Team Name', type: 'string' },
      { key: 'assigned_at', label: 'Assigned At', type: 'datetime' },
    ],
  },
};
