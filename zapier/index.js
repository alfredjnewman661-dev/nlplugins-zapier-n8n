const authentication = require('./src/authentication/oauth2');

// Triggers
const newConversation = require('./src/triggers/newConversation');
const newMessage = require('./src/triggers/newMessage');
const conversationResolved = require('./src/triggers/conversationResolved');
const conversationAssigned = require('./src/triggers/conversationAssigned');
const conversationTagged = require('./src/triggers/conversationTagged');

// Creates (Actions)
const createConversation = require('./src/creates/createConversation');
const sendMessage = require('./src/creates/sendMessage');
const addPrivateNote = require('./src/creates/addPrivateNote');
const updateConversation = require('./src/creates/updateConversation');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [
    (request, z, bundle) => {
      // Add API key to all requests
      if (bundle.authData.api_access_token) {
        request.headers['api_access_token'] = bundle.authData.api_access_token;
      }
      return request;
    },
  ],

  afterResponse: [
    (response, z, bundle) => {
      if (response.status === 401) {
        throw new z.errors.RefreshAuthError('Session expired');
      }
      return response;
    },
  ],

  triggers: {
    [newConversation.key]: newConversation,
    [newMessage.key]: newMessage,
    [conversationResolved.key]: conversationResolved,
    [conversationAssigned.key]: conversationAssigned,
    [conversationTagged.key]: conversationTagged,
  },

  creates: {
    [createConversation.key]: createConversation,
    [sendMessage.key]: sendMessage,
    [addPrivateNote.key]: addPrivateNote,
    [updateConversation.key]: updateConversation,
  },
};
