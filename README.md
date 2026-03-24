> **💰 [$19 — Buy Now](https://nlplugins.lemonsqueezy.com/checkout/buy/b1800f27-e5ff-4df2-a401-8159ac0177a9)** | **[Learn More](https://nlplugins.com/plugins/zapier-n8n-integration.html)** | **[All NL Plugins](https://nlplugins.com)**
> 
> One-time purchase · Source code included · 14-day money-back guarantee · [Terms](https://nlplugins.com/terms.html)

---

# Chatwoot Integrations: Zapier & n8n

This repository contains automation integrations for [Chatwoot](https://www.chatwoot.com), enabling seamless workflow automation with two popular platforms:

- **Zapier** - For no-code automation with 6000+ apps
- **n8n** - For self-hosted, code-optional workflow automation

## 📁 Project Structure

```
chatwoot-integrations/
├── zapier/                    # Zapier CLI integration
│   ├── src/
│   │   ├── authentication/    # API authentication
│   │   ├── triggers/          # Webhook-based triggers
│   │   └── creates/           # Action handlers
│   ├── test/                  # Jest tests
│   ├── index.js               # Main entry point
│   └── README.md              # Zapier-specific docs
│
├── n8n-node/                  # n8n community node
│   ├── src/
│   │   ├── credentials/       # Chatwoot API credentials
│   │   └── nodes/Chatwoot/    # Node implementations
│   ├── package.json
│   └── README.md              # n8n-specific docs
│
└── README.md                  # This file
```

## ✨ Features

Both integrations support:

### Triggers
| Feature | Zapier | n8n |
|---------|--------|-----|
| New Conversation | ✅ | ✅ |
| New Message | ✅ | ✅ |
| Conversation Resolved | ✅ | ✅ |
| Conversation Assigned | ✅ | ✅ |
| Conversation Tagged/Updated | ✅ | ✅ |

### Actions
| Feature | Zapier | n8n |
|---------|--------|-----|
| Create Conversation | ✅ | ✅ |
| Send Message | ✅ | ✅ |
| Add Private Note | ✅ | ✅ |
| Update Conversation | ✅ | ✅ |
| Contact Management | - | ✅ |

## 🚀 Quick Start

### Zapier Integration

```bash
cd zapier
npm install
zapier login
zapier register "Chatwoot"
zapier push
```

See [zapier/README.md](./zapier/README.md) for detailed instructions.

### n8n Community Node

```bash
cd n8n-node
npm install
npm run build
npm publish
```

Or install directly in n8n:
1. Go to **Settings > Community Nodes**
2. Install `n8n-nodes-chatwoot`

See [n8n-node/README.md](./n8n-node/README.md) for detailed instructions.

## 🔑 Authentication

Both integrations use Chatwoot's API Access Token authentication:

1. Log into your Chatwoot instance
2. Go to **Profile Settings → Access Token**
3. Create a new access token
4. Note your **Account ID** from the URL

Required credentials:
- **Base URL**: `https://app.chatwoot.com` or your self-hosted URL
- **API Access Token**: From step 3 above
- **Account ID**: From the URL (e.g., `/accounts/123/...`)

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Zapier CLI (for Zapier development)
- TypeScript (for n8n node development)

### Testing

**Zapier:**
```bash
cd zapier
npm test
zapier validate
```

**n8n:**
```bash
cd n8n-node
npm run build
# Copy to ~/.n8n/custom for local testing
```

## 📖 Use Cases

### Auto-assign conversations
Trigger: New Conversation → Action: Update Conversation (assign to team)

### Send to CRM
Trigger: Conversation Resolved → Action: Create/Update CRM contact

### Slack notifications
Trigger: New Message (incoming) → Action: Send Slack message

### Auto-responses
Trigger: New Message → Condition: Off-hours → Action: Send auto-reply

### Tag-based routing
Trigger: Conversation Tagged → Condition: Label = "billing" → Action: Assign to billing team

## 📚 Resources

- [Chatwoot API Documentation](https://www.chatwoot.com/developers/api)
- [Chatwoot Webhooks](https://www.chatwoot.com/docs/product/features/webhooks)
- [Zapier Platform CLI](https://platform.zapier.com/docs/cli)
- [n8n Creating Nodes](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see individual README files for details.
