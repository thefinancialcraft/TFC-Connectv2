# Custom Disposition Templates, Versioning, Campaign Configuration & Lead Routing

**Status:** Planning only. No application code, migrations, schema, or live configuration changes have been made by this document update.

## 1. Purpose and goals

Give each organization a configurable lead lifecycle and calling outcome system. Authorized users can maintain disposition templates, publish immutable versions, assign templates to campaigns, and configure sub-disposition transfer rules without changing application code for each business workflow.

The system must preserve call history, prevent cross-organization access, route leads safely, and make changes to existing leads explicit and auditable.

## 2. Core concepts and boundaries

Keep these concepts distinct in the data model, UI, APIs, and reporting:

| Concept | Meaning | Example |
| --- | --- | --- |
| Disposition | The caller's outcome for a call | Interested, Call Back, Wrong Number |
| Lead status / outcome | The lead's lifecycle state after the call | Active, Follow-up, Rejected, Closed |
| Connection status | Whether a call connected | Contactable, Uncontactable |
| Storage/routing destination | Where the lead is stored or which campaign/agent owns its next work | Customers, Rejected Leads, Closed Deals, Campaign A, Agent B |

Changing a connection status must not itself imply a lead lifecycle change. A storage destination must be derived from an explicit, validated lifecycle action; it must not be hidden inside a disposition label. Keep compatibility mappings for existing tables (`customers`, `rejected_leads`, `closed_deals`) explicit and centralized.

## 3. Disposition structure and configuration

Templates contain dispositions, optional sub-dispositions, and optional additional reason/detail fields. A third reason/detail level is optional per template. Stable IDs are required for dispositions and sub-dispositions; labels may be renamed without breaking history or mappings.

Each disposition configures:

- Display name, stable ID, sort order, enabled state, and optional help text.
- A lifecycle outcome: active, follow-up, rejected/inactive, or closed, subject to supported organization policy.
- A connection classification: contactable or uncontactable.
- Required fields and validation rules, including callback date/time for follow-up outcomes.

Each sub-disposition may configure one transfer action:

- No transfer.
- Transfer to a campaign.
- Transfer to an agent.
- Transfer to a campaign and agent.
- Caller selects from an administrator-approved set of campaigns/agents, where enabled.

Validate incompatible combinations at save/publish time and again when executing a call. Runtime caller choice must be constrained to the saved allow-list. A disabled or deleted target must fail safely and leave the lead unchanged.

## 4. Templates, immutable versions, and campaign behavior

### 4.1 Template lifecycle

Each organization may create templates and maintain a working draft. Publishing creates a new immutable version with a monotonically increasing version number, author, timestamp, optional changelog, and structured change summary. Rollback creates another new version by copying a prior snapshot; published history is never edited or deleted. Drafts are not visible to callers.

Call records retain template ID, immutable version ID/number, disposition and sub-disposition IDs, and a point-in-time snapshot of the relevant labels and routing configuration. Historical display and reporting use the saved snapshot even if labels, templates, or targets later change.

### 4.2 Campaign version policy: follow latest or pin

Every campaign explicitly selects one policy:

- **Follow latest:** resolve the template's current published version for each new call. Publishing changes future calls for these campaigns. Existing call snapshots remain unchanged.
- **Pinned version:** resolve a specific immutable version. Publishing a new template version does not change this campaign until an authorized user explicitly changes its pin.

The campaign configuration stores template ID, version policy, and pinned version ID when applicable. Existing campaigns are migrated to a documented policy during backfill (recommended default: follow latest on the organization default template), with a preview and an administrator-visible summary. Never infer version behavior from a nullable template ID.

## 5. Organization isolation, defaults, and permissions

- Every template, version, campaign assignment, draft, mapping, migration job, and transfer record is scoped to an organization.
- Enforce tenant ownership in database policies and server-side operations; never rely only on client filters. Validate that the caller, campaign, template, version, lead, and transfer target belong to the same authorized organization.
- Each organization has exactly one default template. Enforce this invariant transactionally (for example, with a partial unique index on organization ID) and in the default-change operation. Default removal or deletion must atomically select a replacement or be rejected.
- Organization admins may manage templates and campaign assignments according to role permissions. Only authorized roles may publish, rollback, migrate leads, or override routing. Agents may only submit outcomes and choose targets within permitted runtime options.
- Avoid exposing unpublished drafts to caller-facing APIs.

## 6. Draft concurrency and publish safety

Draft saves and publish operations use optimistic concurrency. Each draft has a revision/updated-at token; clients submit the revision they edited. A stale write returns a conflict and preserves the newer draft rather than silently overwriting it. The UI offers reload/compare/resolve actions.

Publishing is one transaction: verify organization access and expected draft revision, validate the complete configuration and all references, allocate the next version number under a lock/constraint, insert the immutable version, update the template's current published pointer and draft state, then commit. A failed publish changes none of these records. Idempotency keys prevent duplicate versions when a request is retried.

## 7. Lead routing and transfer execution

### 7.1 Atomic movement

Disposition submission, call history snapshot, lead lifecycle update, campaign/agent assignment, transfer audit event, and idempotency result must commit atomically. Use a transaction-safe server-side operation/RPC. If a lead moves between storage tables, insert/copy the destination record and preserve required identifiers and fields before deleting the source, all in the same transaction. On any error, roll back the entire operation so the lead is never duplicated or lost.

Use row locking or an equivalent concurrency guard for a lead being dispositioned. Accept a unique idempotency key per submission; replaying the same request returns the original result and does not create a second call event or transfer. Reject conflicting concurrent updates with a clear retryable conflict.

### 7.2 Strict transfer validation

Before mutation, validate the mapping against current state:

- Target campaign exists, is active, belongs to the same organization, and accepts this lead/workflow.
- Target agent is active, belongs to the same organization, and is eligible for the selected campaign and caller permissions.
- Campaign-plus-agent combinations are valid together; do not silently ignore one side of the mapping.
- Caller-picked values are members of the configured allow-list and pass the same validation.
- Required callback timestamp, timezone, and future/past policy are valid for follow-up outcomes.

If validation fails, return a specific error and do not change status, storage, assignment, call history, or transfer history. Never fall back to an arbitrary campaign, agent, or unassigned state unless that fallback is explicitly configured.

### 7.3 Loop protection and retries

Record transfer origin, destination, triggering disposition, and correlation/idempotency IDs. Prevent immediate self-transfer and repeated routing cycles using a bounded routing chain/hop count and cycle detection for a single routing operation. Define a maximum hop count and fail closed with an auditable reason when reached. Background retries use bounded attempts with backoff for transient failures; validation failures are not retried. Retry only idempotent operations and expose pending/failed outcomes for safe operator recovery.

### 7.4 Separate transfer audit history

Keep transfer history separate from call logs and current lead state. Each immutable event records organization, lead identity, source and destination storage/campaign/agent, actor, triggering call/disposition/version, timestamp, result, failure reason if any, idempotency/correlation key, and any operator correction. Do not overwrite history during reassignment. Any administrative reversal is a new compensating event linked to the original event, not deletion or mutation of the audit record.

## 8. Callbacks and lead lifecycle

Follow-up outcomes require a callback date and time, stored with an explicit timezone policy (organization timezone plus normalized UTC instant). Assignment prioritization should use lead lifecycle status and due callback time, not hardcoded disposition labels. Completing, rescheduling, or cancelling a callback must be an explicit lifecycle event. Keep callback scheduling and call connection classification independent.

## 9. Safe migration and backfill

Migration is a previewable, auditable operation; publishing a template never migrates leads automatically.

1. Inventory organizations, campaigns, existing disposition values, lead statuses, table locations, and invalid/orphan references.
2. Prepare a deterministic mapping from legacy values to stable disposition/outcome IDs and destination actions. Report unmapped, ambiguous, duplicate, and cross-tenant records.
3. Preview counts and representative records by organization/campaign/source table/status, plus expected destination and any data loss or conflict risks. Allow export of the preview and require an authorized confirmation against a preview fingerprint.
4. Seed one default template and initial immutable version per organization, then assign existing campaigns according to the declared follow-latest/pinned policy. Enforce one default per organization throughout.
5. Backfill lead mappings in bounded, resumable batches with per-batch checkpoints and idempotency. Do not move leads between tables as part of a template-only backfill.
6. For any explicitly requested lead migration, show exact source-to-target actions and counts, record a migration job and per-lead audit events, revalidate the preview fingerprint and permissions at execution, and use transaction-safe batches. Provide dry-run, pause/resume, failure report, and compensating-action guidance.
7. Reconcile source and destination counts, duplicate/missing IDs, campaign assignments, and audit totals. Keep the migration preview, decisions, execution summary, and errors for audit.

## 10. Proposed implementation phases

These are planning stages only; no phase is authorized or executed by this document.

### Phase 0 — Discovery and compatibility decisions

Inventory current schema, policies, RPCs, call history, campaign/agent membership, lead movement, and existing disposition usage. Decide stable IDs, lifecycle taxonomy, timezone behavior, storage mapping, campaign default version policy, permissions, and rollout/rollback strategy.

**Exit criteria:** reviewed data dictionary and mapping; unresolved ambiguities documented; no destructive assumptions.

### Phase 1 — Data model and tenant-safe server operations

Design template, immutable version, campaign configuration, transfer audit, migration job, and idempotency records. Add constraints, indexes, RLS/authorization checks, transaction-safe publish/transfer operations, and migration preview support.

**Exit criteria:** tenant-boundary checks cover every read/write path; one-default invariant is enforced; concurrent publish and transfer behavior is defined; no partial lead movement is possible.

### Phase 2 — Template editor and version lifecycle

Build disposition/sub-disposition editor, optional detail level, draft revision conflict UI, validation, diff preview, publish, version history, and rollback-as-new-version.

**Exit criteria:** drafts stay private; stale edits cannot overwrite newer drafts; publish creates one immutable version atomically; rollback adds a new version and retains prior history.

### Phase 3 — Campaign configuration and safe backfill

Add template selection, follow-latest/pinned policy, pin selection, version badge, permission checks, and migration preview/confirmation. Backfill defaults and campaigns with a resumable audit trail.

**Exit criteria:** behavior is deterministic for both policies; campaign/template tenant mismatch is rejected; preview totals reconcile with execution; reruns are idempotent.

### Phase 4 — Calling experience and atomic routing

Load only the campaign's effective published version. Add dynamic callback inputs and allowed transfer selection. Submit call outcome, immutable snapshot, lifecycle/storage action, assignment, and transfer event through the atomic operation.

**Exit criteria:** failed validation/mutation leaves all records unchanged; retries do not duplicate actions; every successful transfer has a separate audit event; routing loops are bounded.

### Phase 5 — History, reporting, and lead-management integration

Use call snapshots for historic rendering and reporting. Integrate dynamic outcomes with campaign filters, bulk actions, and customer management without reinterpreting old history from current template configuration.

**Exit criteria:** historic calls render their original labels/version; lifecycle and connection filters remain distinct; bulk operations validate each action and preserve audit history.

### Phase 6 — Verification and controlled rollout

Validate unit/integration behavior, tenant isolation, concurrency, retries, idempotency, migration reconciliation, and operational recovery in a non-production environment. Roll out by organization behind a controlled feature flag, monitor failures, and document rollback procedures.

**Exit criteria:** acceptance criteria below pass; migration is reconciled; operational dashboards and support procedure exist; rollout can be paused without losing leads or audit records.

## 11. Acceptance criteria

- An organization can create and edit a draft with stable disposition/sub-disposition IDs and optional reason/detail level.
- Drafts never appear on caller-facing screens; conflicting stale saves are detected and recoverable.
- Publish validates references and creates exactly one immutable, numbered version atomically; rollback creates a new version.
- A campaign follows the latest published version or remains pinned exactly as configured; a publish never silently changes a pinned campaign.
- A call log permanently retains its effective template/version and outcome snapshot.
- Disposition, lifecycle status, connection status, and storage/assignment routing are independently represented and reported.
- Exactly one default template exists per organization; cross-tenant template, campaign, lead, agent, and target references are rejected server-side.
- Invalid transfer mapping changes nothing. A valid transfer updates all relevant lead/call/assignment state atomically and emits a separate immutable audit record.
- Retrying the same request does not duplicate call logs, transfers, or lead moves. Repeated routing cycles terminate within the configured hop limit and are auditable.
- Callback outcomes require valid time data and are prioritized by lifecycle/callback rules rather than disposition labels.
- Migration preview shows deterministic counts and exceptions; execution requires authorized confirmation, is resumable/idempotent, and reconciles to an audit summary.
- Publishing or template backfill does not implicitly move existing leads. Explicit lead migration is separately previewed, confirmed, and audited.

## 12. Verification scenarios

1. **Version policy:** publish v2 while one campaign follows latest and another is pinned to v1; verify new calls resolve to v2 and v1 respectively, with earlier call snapshots unchanged.
2. **Draft conflict:** save from two stale editor sessions; ensure the second receives a conflict and cannot erase the first save.
3. **Transfer atomicity:** force an invalid target or downstream failure; verify lead, call log, assignment, and audit records have no partial mutation.
4. **Idempotency/concurrency:** submit the same request twice and two conflicting requests concurrently; verify one effect and a clear conflict outcome.
5. **Tenant isolation/default:** attempt cross-organization reads/writes and concurrent default changes; verify access is denied and exactly one default remains.
6. **Lifecycle separation:** exercise follow-up/contactable, active/uncontactable, rejected, and closed outcomes; verify each status, connection result, callback, and storage action independently.
7. **Loop protection/retries:** simulate a routing cycle and transient failure; verify bounded termination and no duplicate effects on retry.
8. **Migration:** preview legacy mappings with valid, ambiguous, and orphan rows; verify only confirmed valid actions execute and all counts/audit events reconcile.
9. **Historical snapshot:** rename a disposition and publish a new version; verify old call history still displays the saved original names and configuration.

## 13. Decisions required before implementation

- Confirm the allowed lifecycle outcome set and whether organizations can add statuses beyond the standard lifecycle values.
- Confirm storage-table ownership and whether a future unified leads table is in scope; this plan treats current table destinations as an explicit compatibility layer.
- Confirm campaign version policy defaults for existing and newly created campaigns.
- Confirm who can publish, rollback, transfer across campaigns, and execute lead migrations.
- Confirm callback timezone rules and whether past callback times are permitted.
- Confirm retention/access policy for call snapshots, transfer audit, and migration audit.
