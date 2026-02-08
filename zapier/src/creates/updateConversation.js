// Update a conversation (status, assignee, labels)

const getAgents = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/agents`,
    method: 'GET',
  });

  const agents = response.data || [];
  return agents.map(agent => ({
    id: agent.id.toString(),
    label: `${agent.name} (${agent.email})`,
  }));
};

const getTeams = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/teams`,
    method: 'GET',
  });

  const teams = response.data || [];
  return teams.map(team => ({
    id: team.id.toString(),
    label: team.name,
  }));
};

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

const perform = async (z, bundle) => {
  const { conversation_id, status, assignee_id, team_id, labels } = bundle.inputData;

  let updatedConversation;

  // Update status if provided
  if (status) {
    const statusResponse = await z.request({
      url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/toggle_status`,
      method: 'POST',
      body: { status },
    });
    updatedConversation = statusResponse.data;
  }

  // Update assignee if provided
  if (assignee_id) {
    const assignResponse = await z.request({
      url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/assignments`,
      method: 'POST',
      body: { assignee_id: parseInt(assignee_id) },
    });
    updatedConversation = assignResponse.data;
  }

  // Update team if provided
  if (team_id) {
    await z.request({
      url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/assignments`,
      method: 'POST',
      body: { team_id: parseInt(team_id) },
    });
  }

  // Update labels if provided
  if (labels && labels.length > 0) {
    const labelArray = Array.isArray(labels) ? labels : labels.split(',').map(l => l.trim());
    const labelResponse = await z.request({
      url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/labels`,
      method: 'POST',
      body: { labels: labelArray },
    });
    updatedConversation = labelResponse.data;
  }

  // Get final conversation state
  const finalResponse = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}`,
    method: 'GET',
  });

  const conversation = finalResponse.data;

  return {
    id: conversation.id,
    status: conversation.status,
    assignee_id: conversation.meta?.assignee?.id,
    assignee_name: conversation.meta?.assignee?.name,
    team_id: conversation.meta?.team?.id,
    team_name: conversation.meta?.team?.name,
    labels: conversation.labels || [],
    updated_at: new Date().toISOString(),
  };
};

module.exports = {
  key: 'update_conversation',
  noun: 'Conversation',
  
  display: {
    label: 'Update Conversation',
    description: 'Updates a conversation status, assignee, team, or labels.',
  },

  operation: {
    inputFields: [
      {
        key: 'conversation_id',
        label: 'Conversation ID',
        type: 'integer',
        required: true,
        helpText: 'The ID of the conversation to update',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'string',
        choices: [
          { value: 'open', label: 'Open' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'pending', label: 'Pending' },
          { value: 'snoozed', label: 'Snoozed' },
        ],
        required: false,
        helpText: 'New status for the conversation',
      },
      {
        key: 'assignee_id',
        label: 'Assignee',
        type: 'string',
        dynamic: 'get_agents.id.label',
        required: false,
        helpText: 'Agent to assign the conversation to',
      },
      {
        key: 'team_id',
        label: 'Team',
        type: 'string',
        dynamic: 'get_teams.id.label',
        required: false,
        helpText: 'Team to assign the conversation to',
      },
      {
        key: 'labels',
        label: 'Labels',
        type: 'string',
        required: false,
        helpText: 'Comma-separated list of labels to apply to the conversation',
      },
    ],

    perform,

    sample: {
      id: 1,
      status: 'resolved',
      assignee_id: 1,
      assignee_name: 'Agent Smith',
      team_id: 1,
      team_name: 'Support Team',
      labels: ['urgent', 'billing'],
      updated_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Conversation ID', type: 'integer' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'assignee_id', label: 'Assignee ID', type: 'integer' },
      { key: 'assignee_name', label: 'Assignee Name', type: 'string' },
      { key: 'team_id', label: 'Team ID', type: 'integer' },
      { key: 'team_name', label: 'Team Name', type: 'string' },
      { key: 'labels', label: 'Labels', type: 'string' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
    ],
  },
};
