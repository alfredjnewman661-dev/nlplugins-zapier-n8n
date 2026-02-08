// Chatwoot uses API access tokens for authentication
// Users can generate these from Profile Settings > Access Token

const testAuth = async (z, bundle) => {
  const response = await z.request({
    url: `${bundle.authData.base_url}/api/v1/profile`,
    method: 'GET',
  });

  if (response.status !== 200) {
    throw new z.errors.Error('Invalid API credentials', 'AuthenticationError', response.status);
  }

  return response.data;
};

module.exports = {
  type: 'custom',
  
  fields: [
    {
      key: 'base_url',
      label: 'Chatwoot URL',
      type: 'string',
      required: true,
      helpText: 'Your Chatwoot instance URL (e.g., https://app.chatwoot.com or your self-hosted URL)',
      default: 'https://app.chatwoot.com',
    },
    {
      key: 'api_access_token',
      label: 'API Access Token',
      type: 'password',
      required: true,
      helpText: 'Get your API Access Token from Profile Settings > Access Token in Chatwoot',
    },
    {
      key: 'account_id',
      label: 'Account ID',
      type: 'integer',
      required: true,
      helpText: 'Your Chatwoot Account ID (found in the URL when logged in)',
    },
  ],

  test: testAuth,

  connectionLabel: (z, bundle) => {
    return `Chatwoot: ${bundle.inputData.email || bundle.authData.base_url}`;
  },
};
