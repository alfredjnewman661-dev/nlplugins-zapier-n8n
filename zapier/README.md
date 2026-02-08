# Chatwoot Zapier Integration

A complete Zapier integration for [Chatwoot](https://www.chatwoot.com) - the open-source customer engagement platform.

## Features

### Triggers (Instant/Webhook-based)
- **New Conversation** - Triggers when a new conversation is created
- **New Message** - Triggers when a new message is received (filterable by type)
- **Conversation Resolved** - Triggers when a conversation is marked as resolved
- **Conversation Assigned** - Triggers when a conversation is assigned to an agent/team
- **Conversation Tagged** - Triggers when labels are added to a conversation

### Actions
- **Create Conversation** - Create a new conversation with a contact
- **Send Message** - Send a message to an existing conversation
- **Add Private Note** - Add an internal note (visible only to agents)
- **Update Conversation** - Update status, assignee, team, or labels

## Installation

### Prerequisites
- Node.js 18+
- Zapier CLI (`npm install -g zapier-platform-cli`)
- A Zapier account with CLI access

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd zapier
   npm install
   ```

2. **Login to Zapier CLI:**
   ```bash
   zapier login
   ```

3. **Register the integration:**
   ```bash
   zapier register "Chatwoot"
   ```

4. **Push to Zapier:**
   ```bash
   zapier push
   ```

## Configuration

When connecting to Chatwoot in Zapier, you'll need:

1. **Chatwoot URL** - Your Chatwoot instance URL
   - Cloud: `https://app.chatwoot.com`
   - Self-hosted: Your custom URL (e.g., `https://chatwoot.yourcompany.com`)

2. **API Access Token** - Generate from Chatwoot:
   - Go to Profile Settings → Access Token
   - Click "Create Access Token"
   - Copy the generated token

3. **Account ID** - Found in your Chatwoot URL when logged in:
   - Look at the URL: `https://app.chatwoot.com/app/accounts/[ACCOUNT_ID]/...`

## Testing

```bash
# Run tests
npm test

# Validate the integration
zapier validate

# Test authentication
zapier test
```

## Development

### Local Testing

```bash
# Test a specific trigger
zapier invoke trigger new_conversation

# Test with sample data
zapier invoke create send_message --inputData '{"conversation_id": 1, "message_content": "Test"}'
```

### Adding New Triggers/Actions

1. Create the module in `src/triggers/` or `src/creates/`
2. Register in `index.js`
3. Add tests in `test/`
4. Run `zapier validate` and `zapier push`

## Publishing

### Private (Team Only)
```bash
zapier push
zapier team:add user@example.com
```

### Public (Zapier App Directory)
1. Complete all required fields in Zapier Developer Platform
2. Add app branding (logo, description)
3. Submit for review via Zapier Developer Dashboard

## Webhook Events

This integration uses Chatwoot webhooks for instant triggers:

| Trigger | Webhook Event |
|---------|---------------|
| New Conversation | `conversation_created` |
| New Message | `message_created` |
| Conversation Resolved | `conversation_status_changed` |
| Conversation Assigned | `conversation_updated` |
| Conversation Tagged | `conversation_updated` |

## Troubleshooting

### Webhooks Not Firing
- Ensure webhooks are enabled in Chatwoot (Settings → Integrations → Webhooks)
- Check webhook URL is accessible from Chatwoot's servers
- Verify correct events are subscribed

### Authentication Errors
- Verify API token has not expired
- Check Account ID is correct
- Ensure Chatwoot URL has no trailing slash

### Rate Limiting
- Chatwoot has API rate limits
- Use exponential backoff for high-volume workflows
- Consider batching operations

## Support

- [Chatwoot API Documentation](https://www.chatwoot.com/developers/api)
- [Chatwoot Webhooks Guide](https://www.chatwoot.com/docs/product/features/webhooks)
- [Zapier CLI Documentation](https://platform.zapier.com/docs/cli)

## License

MIT
