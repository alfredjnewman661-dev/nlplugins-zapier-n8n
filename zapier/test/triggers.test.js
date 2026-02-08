const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../index');

const appTester = zapier.createAppTester(App);

describe('Chatwoot Triggers', () => {
  const bundle = {
    authData: {
      base_url: 'https://app.chatwoot.com',
      api_access_token: 'test_token',
      account_id: 1,
    },
  };

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('New Conversation', () => {
    it('should parse webhook payload correctly', async () => {
      const payload = {
        event: 'conversation_created',
        conversation: {
          id: 123,
          display_id: 45,
          status: 'open',
          inbox_id: 1,
          created_at: '2024-01-01T00:00:00.000Z',
          meta: {
            inbox: { name: 'Website' },
            sender: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
          },
        },
      };

      const results = await appTester(
        App.triggers.new_conversation.operation.perform,
        { ...bundle, cleanedRequest: payload }
      );

      expect(results.length).toBe(1);
      expect(results[0].id).toBe(123);
      expect(results[0].contact_name).toBe('John Doe');
    });

    it('should ignore non-conversation_created events', async () => {
      const payload = { event: 'message_created' };
      
      const results = await appTester(
        App.triggers.new_conversation.operation.perform,
        { ...bundle, cleanedRequest: payload }
      );

      expect(results.length).toBe(0);
    });
  });

  describe('New Message', () => {
    it('should parse message webhook correctly', async () => {
      const payload = {
        event: 'message_created',
        id: 456,
        content: 'Hello, I need help',
        message_type: 0,
        private: false,
        created_at: '2024-01-01T00:00:00.000Z',
        conversation: { id: 123, display_id: 45 },
        inbox: { id: 1, name: 'Website' },
        sender: { id: 1, name: 'John Doe', type: 'contact' },
      };

      const results = await appTester(
        App.triggers.new_message.operation.perform,
        { ...bundle, cleanedRequest: payload, inputData: {} }
      );

      expect(results.length).toBe(1);
      expect(results[0].id).toBe(456);
      expect(results[0].content).toBe('Hello, I need help');
      expect(results[0].message_type_label).toBe('incoming');
    });

    it('should filter by message type', async () => {
      const payload = {
        event: 'message_created',
        message_type: 0, // incoming
      };

      // Request outgoing messages only
      const results = await appTester(
        App.triggers.new_message.operation.perform,
        { ...bundle, cleanedRequest: payload, inputData: { message_type: '1' } }
      );

      expect(results.length).toBe(0);
    });
  });

  describe('Conversation Resolved', () => {
    it('should trigger only for resolved status', async () => {
      const payload = {
        event: 'conversation_status_changed',
        conversation: {
          id: 123,
          status: 'resolved',
          meta: { sender: { name: 'John Doe' } },
        },
        previous_status: 'open',
      };

      const results = await appTester(
        App.triggers.conversation_resolved.operation.perform,
        { ...bundle, cleanedRequest: payload }
      );

      expect(results.length).toBe(1);
      expect(results[0].status).toBe('resolved');
    });

    it('should ignore non-resolved status changes', async () => {
      const payload = {
        event: 'conversation_status_changed',
        conversation: { id: 123, status: 'open' },
      };

      const results = await appTester(
        App.triggers.conversation_resolved.operation.perform,
        { ...bundle, cleanedRequest: payload }
      );

      expect(results.length).toBe(0);
    });
  });
});
