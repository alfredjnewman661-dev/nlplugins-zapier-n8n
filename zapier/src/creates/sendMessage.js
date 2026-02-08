// Send a message to an existing conversation

const perform = async (z, bundle) => {
  const { conversation_id, message_content, message_type, content_type } = bundle.inputData;

  const body = {
    content: message_content,
    message_type: message_type || 'outgoing',
    private: false,
  };

  if (content_type) {
    body.content_type = content_type;
  }

  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/accounts/${bundle.authData.account_id}/conversations/${conversation_id}/messages`,
    method: 'POST',
    body,
  });

  const message = response.data;

  return {
    id: message.id,
    content: message.content,
    message_type: message.message_type,
    conversation_id: parseInt(conversation_id),
    sender_id: message.sender?.id,
    sender_name: message.sender?.name,
    created_at: message.created_at,
  };
};

module.exports = {
  key: 'send_message',
  noun: 'Message',
  
  display: {
    label: 'Send Message',
    description: 'Sends a message to an existing conversation.',
    important: true,
  },

  operation: {
    inputFields: [
      {
        key: 'conversation_id',
        label: 'Conversation ID',
        type: 'integer',
        required: true,
        helpText: 'The ID of the conversation to send the message to',
      },
      {
        key: 'message_content',
        label: 'Message Content',
        type: 'text',
        required: true,
        helpText: 'The message text to send',
      },
      {
        key: 'message_type',
        label: 'Message Type',
        type: 'string',
        choices: [
          { value: 'outgoing', label: 'Outgoing (from agent)' },
          { value: 'incoming', label: 'Incoming (from customer)' },
        ],
        default: 'outgoing',
        required: false,
        helpText: 'Type of message. Default is outgoing (agent message).',
      },
      {
        key: 'content_type',
        label: 'Content Type',
        type: 'string',
        choices: [
          { value: 'text', label: 'Plain Text' },
          { value: 'input_select', label: 'Input Select (buttons)' },
          { value: 'cards', label: 'Cards' },
          { value: 'form', label: 'Form' },
        ],
        default: 'text',
        required: false,
        helpText: 'Content type for interactive messages',
      },
    ],

    perform,

    sample: {
      id: 1,
      content: 'Thank you for contacting us!',
      message_type: 'outgoing',
      conversation_id: 1,
      sender_id: 1,
      sender_name: 'Agent Smith',
      created_at: '2024-01-01T00:00:00.000Z',
    },

    outputFields: [
      { key: 'id', label: 'Message ID', type: 'integer' },
      { key: 'content', label: 'Content', type: 'text' },
      { key: 'message_type', label: 'Message Type', type: 'string' },
      { key: 'conversation_id', label: 'Conversation ID', type: 'integer' },
      { key: 'sender_name', label: 'Sender Name', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
