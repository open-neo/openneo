import type {
  Agent,
  Policy,
  Credential,
  AccessRequest,
  AuditLogEntry,
  Job,
  NetworkDomain,
} from './mockData'

// ─── Agents ───

export const DEMO_AGENTS: Agent[] = [
  {
    id: 'demo-agent-1',
    name: 'Aria',
    status: 'running',
    okr: 'Summarize daily Slack messages and draft responses',
    cpuPercent: 18.3,
    ramMB: 420,
    network: 'approved',
    lastAction: 'Fetched Slack channel history',
    skills: ['slack-reader', 'text-summarizer', 'email-draft'],
    permissions: ['network:api.slack.com', 'credential:slack-token'],
    recentActions: [
      { time: '2026-03-02T09:12:00Z', action: 'Fetched #general channel messages' },
      { time: '2026-03-02T09:10:00Z', action: 'Authenticated with Slack API' },
      { time: '2026-03-02T09:05:00Z', action: 'Started daily summary task' },
    ],
    openAtLogin: true,
  },
  {
    id: 'demo-agent-2',
    name: 'Bolt',
    status: 'running',
    okr: 'Monitor GitHub PRs and run code review',
    cpuPercent: 24.7,
    ramMB: 680,
    network: 'approved',
    lastAction: 'Reviewing PR #142 diff',
    skills: ['github-api', 'code-review', 'diff-analysis'],
    permissions: ['network:api.github.com', 'credential:github-token', 'file:read'],
    recentActions: [
      { time: '2026-03-02T09:15:00Z', action: 'Posted review comment on PR #142' },
      { time: '2026-03-02T09:08:00Z', action: 'Fetched PR #142 diff from GitHub' },
      { time: '2026-03-02T09:01:00Z', action: 'Polled repository for new PRs' },
    ],
    openAtLogin: true,
  },
  {
    id: 'demo-agent-3',
    name: 'Cipher',
    status: 'idle',
    okr: 'Encrypt and backup local documents weekly',
    cpuPercent: 0,
    ramMB: 64,
    network: 'local',
    lastAction: 'Completed weekly backup',
    skills: ['file-encrypt', 'backup-scheduler'],
    permissions: ['file:read', 'file:write'],
    recentActions: [
      { time: '2026-03-01T03:00:00Z', action: 'Completed weekly backup to /Backups' },
      { time: '2026-03-01T02:45:00Z', action: 'Encrypted 12 documents' },
      { time: '2026-03-01T02:30:00Z', action: 'Started scheduled backup job' },
    ],
    openAtLogin: false,
  },
  {
    id: 'demo-agent-4',
    name: 'Drift',
    status: 'blocked',
    okr: 'Sync CRM data with local database',
    cpuPercent: 0,
    ramMB: 128,
    network: 'blocked',
    lastAction: 'Blocked: network access to crm.example.com denied',
    skills: ['crm-sync', 'data-transform'],
    permissions: ['network:crm.example.com'],
    recentActions: [
      { time: '2026-03-02T08:30:00Z', action: 'Network request to crm.example.com blocked by policy' },
      { time: '2026-03-02T08:30:00Z', action: 'Attempted CRM data sync' },
      { time: '2026-03-01T20:00:00Z', action: 'Last successful sync completed' },
    ],
    openAtLogin: false,
  },
]

// ─── Policies ───

export const DEMO_POLICIES: Policy[] = [
  {
    id: 'demo-policy-1',
    name: 'Global Security Policy',
    scope: 'global',
    enabled: true,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T14:30:00Z',
    rules: [
      {
        id: 'rule-file-1',
        mode: 'denylist',
        allowedPaths: [],
        deniedPaths: ['/etc', '/var', '/System'],
        recursive: true,
        read: true,
        write: false,
        delete: false,
      },
    ],
    credentialRules: [
      {
        id: 'rule-cred-1',
        mode: 'onlyRegistered',
        allowedCredentialIds: ['demo-cred-1', 'demo-cred-2', 'demo-cred-3'],
        requireApprovalForUse: true,
      },
    ],
    networkRules: [
      {
        id: 'rule-net-1',
        mode: 'allowlist',
        domains: ['api.slack.com', 'api.github.com', 'api.openai.com'],
        requireApproval: false,
      },
    ],
  },
  {
    id: 'demo-policy-2',
    name: 'Aria - Slack Access',
    scope: 'agent',
    agentId: 'demo-agent-1',
    enabled: true,
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
    rules: [
      {
        id: 'rule-file-2',
        mode: 'allowlist',
        allowedPaths: ['/Users/akira/Documents/SlackExports'],
        deniedPaths: [],
        recursive: true,
        read: true,
        write: true,
        delete: false,
      },
    ],
    credentialRules: [
      {
        id: 'rule-cred-2',
        mode: 'onlyRegistered',
        allowedCredentialIds: ['demo-cred-3'],
        requireApprovalForUse: false,
      },
    ],
    networkRules: [
      {
        id: 'rule-net-2',
        mode: 'allowlist',
        domains: ['api.slack.com'],
        requireApproval: false,
      },
    ],
  },
  {
    id: 'demo-policy-3',
    name: 'CRM Sync (Disabled)',
    scope: 'agent',
    agentId: 'demo-agent-4',
    enabled: false,
    createdAt: '2026-02-25T16:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    rules: [],
    credentialRules: [],
    networkRules: [
      {
        id: 'rule-net-3',
        mode: 'allowlist',
        domains: ['crm.example.com'],
        requireApproval: true,
      },
    ],
  },
]

// ─── Credentials ───

export const DEMO_CREDENTIALS: Credential[] = [
  {
    id: 'demo-cred-1',
    label: 'OpenAI API Key',
    username: 'org-openneo',
    secretMasked: '••••••••sk-proj-abc',
    createdAt: '2026-02-10T08:00:00Z',
    lastUsedAt: '2026-03-02T09:00:00Z',
    tags: ['ai', 'api', 'cloud'],
  },
  {
    id: 'demo-cred-2',
    label: 'GitHub Personal Token',
    username: 'openneo-bot',
    secretMasked: '••••••••ghp_x9Kz',
    createdAt: '2026-02-12T14:00:00Z',
    lastUsedAt: '2026-03-02T09:15:00Z',
    tags: ['github', 'ci'],
  },
  {
    id: 'demo-cred-3',
    label: 'Slack Bot Token',
    username: 'aria-bot',
    secretMasked: '••••••••xoxb-Wm7q',
    createdAt: '2026-02-18T11:00:00Z',
    lastUsedAt: '2026-03-02T09:12:00Z',
    tags: ['slack', 'messaging'],
  },
]

// ─── Access Requests ───

export const DEMO_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'demo-req-1',
    type: 'network',
    agentId: 'demo-agent-4',
    resource: 'crm.example.com',
    action: 'connect',
    status: 'pending',
    requestedAt: '2026-03-02T08:30:00Z',
  },
  {
    id: 'demo-req-2',
    type: 'credential',
    agentId: 'demo-agent-2',
    resource: 'OpenAI API Key',
    action: 'use',
    status: 'pending',
    requestedAt: '2026-03-02T09:20:00Z',
  },
  {
    id: 'demo-req-3',
    type: 'file',
    agentId: 'demo-agent-1',
    resource: '/Users/akira/Documents/SlackExports/archive.zip',
    action: 'write',
    status: 'approved',
    requestedAt: '2026-03-01T14:00:00Z',
    decisionAt: '2026-03-01T14:02:00Z',
  },
  {
    id: 'demo-req-4',
    type: 'network',
    agentId: 'demo-agent-3',
    resource: 'storage.googleapis.com',
    action: 'connect',
    status: 'denied',
    requestedAt: '2026-03-01T03:05:00Z',
    decisionAt: '2026-03-01T03:05:30Z',
  },
]

// ─── Audit Logs ───

export const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'demo-log-6',
    timestamp: '2026-03-02T09:20:00Z',
    eventType: 'credential.request',
    actor: 'Bolt',
    target: 'OpenAI API Key',
    details: 'Agent requested access to credential',
    hashChainIndicator: 'sha256:e7a1f3b29c...',
  },
  {
    id: 'demo-log-5',
    timestamp: '2026-03-02T09:15:00Z',
    eventType: 'agent.action',
    actor: 'Bolt',
    target: 'PR #142',
    details: 'Posted code review comment via GitHub API',
    hashChainIndicator: 'sha256:d4c8e2a91b...',
  },
  {
    id: 'demo-log-4',
    timestamp: '2026-03-02T08:30:00Z',
    eventType: 'network.blocked',
    actor: 'Drift',
    target: 'crm.example.com',
    details: 'Network request blocked by policy — domain not in allowlist',
    hashChainIndicator: 'sha256:b3f7d1c84a...',
  },
  {
    id: 'demo-log-3',
    timestamp: '2026-03-01T14:02:00Z',
    eventType: 'request.approved',
    actor: 'System',
    target: 'Aria → /Users/akira/Documents/SlackExports/archive.zip',
    details: 'File write request approved by user',
    hashChainIndicator: 'sha256:a2e6c0b73f...',
  },
  {
    id: 'demo-log-2',
    timestamp: '2026-03-01T03:05:30Z',
    eventType: 'request.denied',
    actor: 'System',
    target: 'Cipher → storage.googleapis.com',
    details: 'Network request denied — local-only agent',
    hashChainIndicator: 'sha256:98d5b9a62e...',
  },
  {
    id: 'demo-log-1',
    timestamp: '2026-02-28T11:00:00Z',
    eventType: 'policy.updated',
    actor: 'Admin',
    target: 'Aria - Slack Access',
    details: 'Updated network rule: added api.slack.com to allowlist',
    hashChainIndicator: 'sha256:genesis...',
  },
]

// ─── Jobs ───

export const DEMO_JOBS: Job[] = [
  {
    id: 'demo-job-1',
    agentId: 'demo-agent-2',
    agentName: 'Bolt',
    title: 'Review PR #142 — feat: add auth middleware',
    status: 'running',
    progress: 65,
    createdAt: '2026-03-02T09:08:00Z',
  },
  {
    id: 'demo-job-2',
    agentId: 'demo-agent-1',
    agentName: 'Aria',
    title: 'Daily Slack digest — #general, #engineering',
    status: 'queued',
    progress: 0,
    createdAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'demo-job-3',
    agentId: 'demo-agent-3',
    agentName: 'Cipher',
    title: 'Weekly backup — /Users/akira/Documents',
    status: 'completed',
    progress: 100,
    createdAt: '2026-03-01T02:30:00Z',
  },
  {
    id: 'demo-job-4',
    agentId: 'demo-agent-4',
    agentName: 'Drift',
    title: 'CRM data sync — contacts & deals',
    status: 'failed',
    progress: 12,
    createdAt: '2026-03-02T08:30:00Z',
  },
]

// ─── Network Domains ───

export const DEMO_NETWORK_DOMAINS: NetworkDomain[] = [
  {
    id: 'demo-domain-1',
    domain: 'api.slack.com',
    approved: true,
    addedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'demo-domain-2',
    domain: 'api.github.com',
    approved: true,
    addedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'demo-domain-3',
    domain: 'api.openai.com',
    approved: true,
    addedAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'demo-domain-4',
    domain: 'crm.example.com',
    approved: false,
    addedAt: '2026-03-02T08:30:00Z',
  },
]
