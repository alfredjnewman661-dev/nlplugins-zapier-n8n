# n8n-nodes-chatwoot

This is an n8n community node for [Chatwoot](https://www.chatwoot.com) - the open-source customer engagement platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

### Trigger Node (ChatwootTrigger)

Automatically starts workflows when Chatwoot events occur:

- **Conversation Created** - New conversation started
- **Conversation Resolved** - Conversation marked as resolved
- **Conversation Assigned** - Conversation assigned to agent/team
- **Conversation Status Changed** - Any status change
- **Conversation Updated** - Conversation updated (labels, etc.)
- **Message Created** - New message received (with filtering options)
- **Message Updated** - Message updated

### Action Node (Chatwoot)

Perform actions in Chatwoot:

**Conversations:**
- Get a conversation
- Get many conversations
- Update conversation (status, assignee, labels)

**Messages:**
- Send a message
- Add private note
- Get messages from conversation

**Contacts:**
- Create contact
- Get contact
- Search contacts
- Update contact

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-chatwoot`
4. Accept the risks and click **Install**

### Manual Installation

```bash
# Navigate to n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-chatwoot
```

Then restart n8n.

## Credentials

To connect to Chatwoot, you need:

1. **Base URL** - Your Chatwoot instance URL
   - Cloud: `https://app.chatwoot.com`
   - Self-hosted: Your custom URL

2. **API Access Token** - Generate from:
   - Profile Settings → Access Token → Create Access Token

3. **Account ID** - Found in your URL when logged in:
   - `https://app.chatwoot.com/app/accounts/[ACCOUNT_ID]/...`

## Usage Examples

### Example 1: Auto-Reply to New Messages

1. Add **Chatwoot Trigger** node
   - Event: `Message Created`
   - Filter: Incoming messages only
   - Exclude private: Yes

2. Add **IF** node to check conditions

3. Add **Chatwoot** node
   - Resource: Message
   - Operation: Send
   - Content: Your auto-reply

### Example 2: Notify on High-Priority Conversations

1. Add **Chatwoot Trigger** node
   - Event: `Conversation Updated`

2. Add **IF** node
   - Check if labels include "urgent"

3. Add **Slack** node
   - Send alert to support channel

### Example 3: Sync Contacts with CRM

1. Add **Chatwoot Trigger** node
   - Event: `Conversation Created`

2. Add **Chatwoot** node
   - Resource: Contact
   - Operation: Get

3. Add **Salesforce** / **HubSpot** node
   - Create or update contact

## Development

### Building

```bash
npm install
npm run build
```

### Local Development

```bash
# Link to local n8n
npm link

# In n8n installation
npm link n8n-nodes-chatwoot

# Watch for changes
npm run dev
```

### Testing Locally

1. Build the node: `npm run build`
2. Copy to n8n custom nodes directory
3. Restart n8n
4. The node should appear in the nodes panel

## Publishing to npm

1. Update version in `package.json`
2. Build: `npm run build`
3. Publish: `npm publish`

### First-time Publishing

```bash
npm login
npm publish --access public
```

## Compatibility

- n8n version: 1.0.0+
- Node.js: 18+

## Resources

- [Chatwoot API Documentation](https://www.chatwoot.com/developers/api)
- [Chatwoot Webhooks](https://www.chatwoot.com/docs/product/features/webhooks)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Creating n8n Nodes](https://docs.n8n.io/integrations/creating-nodes/)

## License

[MIT](LICENSE)
