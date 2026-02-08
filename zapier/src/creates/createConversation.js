// Create a new conversation via API channel

const getInboxes = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/inboxes`,
    method: 'GET',
  });

  const inboxes = response.data.payload || [];
  // Filter to API inboxes only as they support programmatic conversation creation
  return inboxes
    .filter(inbox => inbox.channel_type === 'Channel::Api')
    .map(inbox => ({
      id: inbox.id.toString(),
      label: inbox.name,
    }));
};

const perform = async (z, bundle) => {
  const { inbox_id, source_id, contact_name, contact_email, contact_phone, contact_identifier, initial_message, custom_attributes } = bundle.inputData;

  // First, create or find the contact
  let contactPayload = {
    inbox_id: parseInt(inbox_id),
    name: contact_name,
  };

  if (contact_email) contactPayload.email = contact_email;
  if (contact_phone) contactPayload.phone_number = contact_phone;
  if (contact_identifier) contactPayload.identifier = contact_identifier;
  if (custom_attributes) {
    try {
      contactPayload.custom_attributes = JSON.parse(custom_attributes);
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  // Get inbox to find channel details
  const inboxResponse = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/inboxes/${inbox_id}`,
    method: 'GET',
  });

  const inbox = inboxResponse.data;

  // Create contact via API inbox endpoint
  const contactResponse = await z.request({
    url: `${bundle.authData.base_url}/public/api/v1/inboxes/${inbox.inbox_identifier}/contacts`,
    method: 'POST',
    body: contactPayload,
  });

  const contact = contactResponse.data;
  const sourceId = source_id || contact.source_id;

  // Create conversation
  const conversationResponse = await z.request({
    url: `${bundle.authData.base_url}/public/api/v1/inboxes/${inbox.inbox_identifier}/contacts/${sourceId}/conversations`,
    method: 'POST',
    body: {},
  });

  const conversation = conversationResponse.data;

  // Send initial message if provided
  if (initial_message) {
    await z.request({
      url: `${bundle.authData.base_url}/public/api/v1/inboxes/${inbox.inbox_identifier}/contacts/${sourceId}/conversations/${conversation.id}/messages`,
      method: 'POST',
      body: {
        content: initial_message,
      },
    });
  }

  return {
    id: conversation.id,
    inbox_id: parseInt(inbox_id),
    contact_id: contact.id,
    source_id: sourceId,
    status: 'open',
    created_at: new Date().toISOString(),
  };
};

module.exports = {
  key: 'create_conversation',
  noun: 'Conversation',
  
  display: {
    label: 'Create Conversation',
    description: 'Creates a new conversation with a contact in Chatwoot.',
  },

  operation: {
    inputFields: [
      {
        key: 'inbox_id',
        label: 'Inbox',
        type: 'string',
        required: true,
        dynamic: 'get_inboxes.id.label',
        helpText: 'Select an API inbox. Only API-type inboxes support programmatic conversation creation.',
      },
      {
        key: 'contact_name',
        label: 'Contact Name',
        type: 'string',
        required: true,
        helpText: 'Name of the contact',
      },
      {
        key: 'contact_email',
        label: 'Contact Email',
        type: 'string',
        required: false,
        helpText: 'Email address of the contact',
      },
      {
        key: 'contact_phone',
        label: 'Contact Phone',
        type: 'string',
        required: false,
        helpText: 'Phone number of the contact',
      },
      {
        key: 'contact_identifier',
        label: 'External Identifier',
        type: 'string',
        required: false,
        helpText: 'Unique identifier from your system (e.g., customer ID)',
      },
      {
        key: 'initial_message',
        label: 'Initial Message',
        type: 'text',
        required: false,
        helpText: 'Optional first message to add to the conversation',
      },
      {
        key: 'custom_attributes',
        label: 'Custom Attributes (JSON)',
        type: 'text',
        required: false,
        helpText: 'Custom attributes as JSON object, e.g., {"plan": "premium", "signup_date": "2024-01-01"}',
      },
    ],

    perform,

    sample: {
      id: 1,
      inbox_id: 1,
      contact_id: 1,
      source_id: 'abc123',
      status: 'open',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Conversation ID', type: 'integer' },
      { key: 'inbox_id', label: 'Inbox ID', type: 'integer' },
      { key: 'contact_id', label: 'Contact ID', type: 'integer' },
      { key: 'source_id', label: 'Source ID', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
