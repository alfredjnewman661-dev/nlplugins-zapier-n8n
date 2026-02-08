// Add a private note to a conversation (only visible to agents)

const perform = async (z, bundle) => {
  const { conversation_id, note_content } = bundle.inputData;

  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/messages`,
    method: 'POST',
    body: {
      content: note_content,
      message_type: 'outgoing',
      private: true,
    },
  });

  const message = response.data;

  return {
    id: message.id,
    content: message.content,
    private: true,
    conversation_id: parseInt(conversation_id),
    sender_id: message.sender?.id,
    sender_name: message.sender?.name,
    created_at: message.created_at,
  };
};

module.exports = {
  key: 'add_private_note',
  noun: 'Private Note',
  
  display: {
    label: 'Add Private Note',
    description: 'Adds a private note to a conversation (only visible to agents).',
  },

  operation: {
    inputFields: [
      {
        key: 'conversation_id',
        label: 'Conversation ID',
        type: 'integer',
        required: true,
        helpText: 'The ID of the conversation to add the note to',
      },
      {
        key: 'note_content',
        label: 'Note Content',
        type: 'text',
        required: true,
        helpText: 'The private note text. This will only be visible to agents, not customers.',
      },
    ],

    perform,

    sample: {
      id: 1,
      content: 'Customer is a VIP - handle with priority',
      private: true,
      conversation_id: 1,
      sender_id: 1,
      sender_name: 'Agent Smith',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Note ID', type: 'integer' },
      { key: 'content', label: 'Content', type: 'text' },
      { key: 'private', label: 'Is Private', type: 'boolean' },
      { key: 'conversation_id', label: 'Conversation ID', type: 'integer' },
      { key: 'sender_name', label: 'Sender Name', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
