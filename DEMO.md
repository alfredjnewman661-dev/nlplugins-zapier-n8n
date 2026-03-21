# Zapier & n8n Integration — Demo Walkthrough

## What It Does
Provides comprehensive workflow automation for Chatwoot through both Zapier (6000+ apps) and n8n (self-hosted) platforms, enabling automated responses, CRM synchronization, team notifications, and custom business logic triggers. The dual integration supports webhook-based triggers for all major Chatwoot events and provides actions for conversation management, messaging, and contact handling.

## Key Features
• Webhook triggers for new conversations, messages, assignments, and resolution events
• Actions for sending messages, creating conversations, adding private notes, and updating statuses
• Dual platform support: Zapier CLI integration and n8n community node
• Full contact management capabilities with CRM synchronization
• Authentication via Chatwoot API access tokens with account ID support
• Auto-assignment workflows, tag-based routing, and off-hours auto-responses
• Slack/Teams notifications, ticket escalation, and customer data enrichment

## How It Works
1. Admin installs the integration through Zapier App Directory or n8n Community Nodes
2. User configures Chatwoot credentials (base URL, API token, account ID)
3. Workflow builder allows selection of Chatwoot triggers (new conversation, message, etc.)
4. System registers webhooks with Chatwoot to receive real-time event notifications
5. When events occur, webhook payload is processed and transformed for automation
6. Conditional logic applies business rules (time of day, labels, team availability)
7. Actions execute automatically (assign to team, send to CRM, notify Slack, auto-respond)
8. Real-time monitoring shows successful automations and error handling
9. Advanced workflows chain multiple actions with data transformation and routing logic

## Technical Details
- Platform: Chatwoot (webhook integration) + Zapier/n8n platforms
- Language: Node.js with TypeScript (n8n) and JavaScript (Zapier)
- Deployment: Docker (docker-compose up)
- Configuration: Environment variables (.env)

## Screenshots / Demo Flow
**Zapier App Directory**: Chatwoot integration listing in Zapier app directory showing triggers, actions, and user ratings with installation button.

**n8n Community Nodes**: n8n settings panel showing Chatwoot community node installation with version information and node documentation access.

**Credential Configuration**: Authentication setup screen showing fields for Chatwoot base URL, API access token, and account ID with test connection button.

**Trigger Setup**: Workflow builder interface showing available Chatwoot triggers (New Conversation, New Message, Conversation Resolved) with webhook configuration preview.

**Action Configuration**: Action selection screen displaying Chatwoot capabilities: Send Message, Create Conversation, Add Private Note, Update Conversation with field mapping.

**Live Workflow**: Active automation workflow showing real-time trigger from new Chatwoot conversation flowing through conditional logic to multiple actions (Slack notification + CRM update).

**Conditional Logic**: Advanced workflow builder showing if/then conditions based on conversation labels, business hours, team capacity, and customer tier.

**CRM Integration**: Data mapping interface showing Chatwoot contact fields being mapped to Salesforce/HubSpot fields with transformation options.

**Auto-Response Setup**: Out-of-office automation showing time-based triggers that send automatic responses during non-business hours with custom message templates.

**Analytics Dashboard**: Workflow execution monitoring showing successful runs, error rates, trigger volume, and performance metrics for optimization insights.