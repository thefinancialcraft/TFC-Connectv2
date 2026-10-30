# Rynxly CRM OpenClaw WhatsApp Integration Plan

## Objective

Give every organization its own shared WhatsApp number connected through an isolated OpenClaw Gateway. The organization owner can see and manage every conversation. Agents can see and reply only to conversations assigned to them. Agent replies are sent from the organization's shared WhatsApp number.

The inbox is part of the existing CRM pages; there will be no separate WhatsApp page.

## Agreed UI behavior

- Add a WhatsApp toggle to the existing right-side toolbox area, following its hide/show behavior.
- When the right panel is open, show the conversation list and the selected customer's live chat in that panel.
- When the right panel is closed, show the selected customer's live chat in a Facebook-style mini chat window at the bottom of the page.
- The panel and mini window represent the same selected conversation and share state; they must not create separate chats or duplicate messages.
- Owners/admins can see all conversations for their organization and assign or reassign customers.
- Agents can see only conversations for customers assigned to them.
- A new or unassigned customer's incoming message appears in the owner/admin unassigned inbox.

## Repository context

The CRM repository is a Next.js 16, React 19, TypeScript, and Supabase application. Existing integration points include:

- `components/AppLayout.tsx` for the authenticated portal shell.
- `components/UtilitySidebar.tsx` for the existing right-side toolbox behavior.
- `lib/supabase.ts` for browser and server Supabase clients.
- `lib/dashboardUtils.ts` for existing user role levels.
- `pages/api/` for server-side API routes.
- `supabase/migrations/` for imperative database migrations.

There is no existing WhatsApp inbox or OpenClaw integration in the repository. The connected Supabase schema already has `customers.organization_id`, `customers.assigned_to`, and organization/role fields in `user_profiles`. Confirm the current meaning and assignment lifecycle of `customers.assigned_to` before using it as the canonical WhatsApp access rule; avoid maintaining conflicting assignment values.

## Important setup decision: verify the Supabase target

The repository's `supabase/config.toml` has project ID `TFC-Connectv2-5`, while the connected Supabase plugin listed `TFC-NexusV2` with ref `qcglmkmhqvmkugaqvqih`. Confirm which project is the intended CRM database before applying any schema changes or migrations.

The connected Supabase project also reported RLS disabled on `organizations`, `campaigns`, `rejected_leads`, and `closed_deals`. Do not enable RLS on those existing tables without reviewing and preparing policies, because that could break existing application access. Track this separately while ensuring all new WhatsApp tables have suitable RLS and access grants.

## Target architecture

```text
Organization owner pairs organization WhatsApp number by QR
                         |
          Organization's isolated OpenClaw Gateway
                         |
            Rynxly server-side WhatsApp adapter
                         |
     Supabase conversations, messages, and assignments
                         |
         CRM right panel or bottom mini chat window
```

OpenClaw's WhatsApp integration uses a linked WhatsApp Web session owned by the Gateway. The user's requirement is one isolated Gateway per organization. Each instance must have its own configuration, state/auth directory, workspace, and port. See [OpenClaw WhatsApp setup](https://docs.openclaw.ai/providers/whatsapp) and [Gateway configuration and multi-instance isolation](https://docs.openclaw.ai/gateway/config-gateway).

The CRM's ordinary customer messaging path must not depend on AI/model authentication or successful model inference. During implementation, verify the supported OpenClaw integration surface for inbound events and outbound sends. Do not assume the normal AI reply lifecycle alone is sufficient: OpenClaw documents `message_received` as an accepted inbound dispatch hook. If that hook cannot reliably deliver all CRM messages independently of AI processing, use a Gateway-side integration/plugin at the channel transport boundary. See [OpenClaw message and delivery hooks](https://docs.openclaw.ai/plugins/hooks/messages).

## Work plan

### Phase 1: Confirm schema, identity, and Gateway contract

1. Confirm the correct Supabase project before changing the database.
2. Inspect existing customer lookup, assignment, organization membership, auth, and right-side toolbox code paths.
3. Confirm whether `customers.assigned_to` is the canonical agent assignment for chat visibility and whether unassigned or non-CRM WhatsApp numbers need a separate customer-creation flow.
4. Verify the OpenClaw version and its supported inbound event, outbound send, status, QR pairing, and disconnect/reconnect interfaces.
5. Define the Gateway provisioning and secrets-storage approach. Keep Gateway credentials and WhatsApp session material out of browser code, public tables, and logs.

### Phase 2: Organization Gateway setup

1. Provision one isolated Gateway for each organization.
2. Store only the organization's Gateway reference, linked number, connection state, and safe operational metadata in CRM-accessible records.
3. Store Gateway tokens and WhatsApp session secrets in server-side secret storage.
4. Add owner/admin setup UI to start pairing, display the QR code temporarily, refresh pairing state, and show connected/disconnected/error status.
5. Ensure one Gateway state directory is never shared by multiple organizations.

OpenClaw's WhatsApp channel is delivered through WhatsApp Web/Baileys rather than a separate Twilio WhatsApp channel. Gateway setup therefore includes QR-linked session management and must account for session health and re-linking. Evaluate applicable WhatsApp policies and reliability during the pilot.

### Phase 3: Database model and tenant access

Add an imperative Supabase migration for the minimum required tables:

- `whatsapp_accounts`: one account per organization initially; Gateway reference, phone number, connection status, and timestamps. No plaintext Gateway secret.
- `whatsapp_conversations`: organization, CRM customer reference where matched, normalized customer phone, assigned agent reference if needed, status, last-message metadata, and timestamps.
- `whatsapp_messages`: conversation, provider message/event ID, direction, sender, content/media metadata, delivery state, and timestamp.
- `whatsapp_webhook_events` (or equivalent idempotency record): organization/account, provider event ID, processing result, and timestamps.

Schema rules:

- Add foreign keys and uniqueness constraints for organization-scoped account identity, conversation identity, and provider event IDs.
- Add indexes for organization, assignment, conversation, and chronological message lookup patterns.
- Enable RLS on every new exposed table, with policies matching owner/admin and assigned-agent access.
- Restrict grants to the minimum roles required. The service role must only be used server-side.
- If Realtime is used, authorize subscriptions with the same tenant and assignment rules; a subscription is not a replacement for API authorization.

For conversation identity, use the organization and normalized customer number, while linking to an existing CRM customer when unambiguous. Do not silently merge customers across organizations. If the number does not match a CRM customer, route it to unassigned owner/admin review before creating or linking CRM data.

### Phase 4: Server-side message processing

Create authenticated server API routes and a Gateway adapter for:

- Listing conversations with owner/admin or assigned-agent visibility.
- Loading a conversation's message history.
- Assigning and reassigning a customer, with owner/admin authorization.
- Sending a text reply through the correct organization's Gateway.
- Returning safe Gateway connection and delivery status.
- Receiving authenticated Gateway events.

Inbound processing:

1. Authenticate the Gateway event and resolve its organization/account.
2. Validate and normalize the customer number and provider event ID.
3. Ignore already processed event IDs to make webhook retries safe.
4. Find or create the organization-scoped conversation and link a CRM customer only when the match is safe.
5. Save the inbound message and update the conversation preview/unread state.
6. Route it to the assigned agent; otherwise keep it in the owner/admin unassigned inbox.

Outbound processing:

1. Authenticate the CRM user and load their trusted profile from the database.
2. Verify organization membership and owner/admin or assigned-agent permission for the conversation.
3. Send through the Gateway registered for that organization only.
4. Store the outgoing message and provider result, including failure state.
5. Retry only through an idempotent operation so retries cannot send duplicate customer messages.

Do not trust organization IDs, role values, assignment IDs, or Gateway identifiers supplied by the browser without verifying them server-side. Avoid logging message contents, QR values, or secrets.

### Phase 5: CRM interface

1. Add a WhatsApp launcher/toggle to the existing right-side toolbox.
2. Build a conversation list with search, unread state, last-message preview, and owner/admin assignment controls.
3. Embed the selected customer's message timeline and reply composer in the open right panel.
4. When the panel is closed, render that same selected conversation in a bottom Facebook-style mini chat window.
5. Keep selected conversation, draft text, loading, unread, and delivery state coherent when switching between panel and mini window.
6. Handle small screens using the existing responsive conventions; avoid obscuring call controls or other portal tools.

The relevant repository areas are `components/AppLayout.tsx`, `components/UtilitySidebar.tsx`, and the authenticated portal components. Keep the WhatsApp inbox components separate from unrelated toolbox functionality so existing tools remain intact.

### Phase 6: Pilot and rollout

Pilot one organization first:

1. Create/verify its isolated Gateway and complete QR pairing.
2. Receive a customer message and confirm it is persisted once.
3. Confirm an assigned agent sees and can reply to only that customer's conversation.
4. Confirm owner/admin sees all organization conversations and can assign/reassign.
5. Confirm customer replies return to the same CRM conversation.
6. Confirm the right panel and bottom mini window switch presentation without duplicating state or messages.
7. Simulate Gateway disconnect/reconnect, duplicate inbound delivery, invalid webhook authentication, unauthorized agent access, and outbound send failure.
8. Review Supabase security/performance advisories and application logs before broader rollout.

After the pilot, automate Gateway provisioning and organization onboarding, then roll out in controlled batches.

## Acceptance criteria

- Every organization routes WhatsApp traffic through only its own Gateway and master number.
- Agents cannot list, read, assign, or send on conversations outside their assignment and organization.
- Owner/admin can see all conversations for their organization and manage assignment.
- Unassigned and unmatched numbers remain visible to owner/admin for review.
- Customer inbound and agent outbound messages persist with idempotent provider IDs and delivery state.
- Replies are sent from the organization's linked WhatsApp account.
- CRM messaging continues to work when AI/model authentication or inference is unavailable.
- The chat appears inside the open right panel and moves to the bottom mini window when that panel is closed.
- Gateway credentials and WhatsApp session secrets are never exposed in browser responses or client-side storage.

## Scope boundaries and dependencies

- The CRM codebase currently has no OpenClaw or WhatsApp inbox integration.
- Gateway hosting, orchestration, secret storage, public callback routing, and monitoring must be selected/configured before automated per-organization provisioning can go live.
- The exact Gateway event/send adapter must be verified against the deployed OpenClaw version before implementation.
- Confirm the Supabase project target before creating or applying any migration.
- Message media support can follow the text-message pilot once safe media storage, access control, and retention are designed.
