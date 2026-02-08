const zapier = require('zapier-platform-core');
const nock = require('nock');
const App = require('../index');

const appTester = zapier.createAppTester(App);

describe('Chatwoot Creates', () => {
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

  describe('Send Message', () => {
    it('should send a message to a conversation', async () => {
      nock('https://app.chatwoot.com')
        .post('/api/v1/accounts/1/conversations/123/messages')
        .reply(200, {
          id: 456,
          content: 'Thank you for contacting us!',
          message_type: 'outgoing',
          created_at: '2024-01-01T00:00:00.000Z',
          sender: { id: 1, name: 'Agent Smith' },
        });

      const results = await appTester(App.creates.send_message.operation.perform, {
        ...bundle,
        inputData: {
          conversation_id: 123,
          message_content: 'Thank you for contacting us!',
          message_type: 'outgoing',
        },
      });

      expect(results.id).toBe(456);
      expect(results.content).toBe('Thank you for contacting us!');
    });
  });

  describe('Add Private Note', () => {
    it('should add a private note', async () => {
      nock('https://app.chatwoot.com')
        .post('/api/v1/accounts/1/conversations/123/messages')
        .reply(200, {
          id: 789,
          content: 'VIP customer - priority support',
          private: true,
          created_at: '2024-01-01T00:00:00.000Z',
          sender: { id: 1, name: 'Agent Smith' },
        });

      const results = await appTester(App.creates.add_private_note.operation.perform, {
        ...bundle,
        inputData: {
          conversation_id: 123,
          note_content: 'VIP customer - priority support',
        },
      });

      expect(results.id).toBe(789);
      expect(results.private).toBe(true);
    });
  });

  describe('Update Conversation', () => {
    it('should update conversation status', async () => {
      nock('https://app.chatwoot.com')
        .post('/api/v1/accounts/1/conversations/123/toggle_status')
        .reply(200, { id: 123, status: 'resolved' });

      nock('https://app.chatwoot.com')
        .get('/api/v1/accounts/1/conversations/123')
        .reply(200, {
          id: 123,
          status: 'resolved',
          labels: [],
          meta: {},
        });

      const results = await appTester(App.creates.update_conversation.operation.perform, {
        ...bundle,
        inputData: {
          conversation_id: 123,
          status: 'resolved',
        },
      });

      expect(results.id).toBe(123);
      expect(results.status).toBe('resolved');
    });
  });
});
