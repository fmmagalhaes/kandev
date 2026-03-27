import type { StatsResponse } from "@/lib/types/http";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Deterministic pseudo-random to avoid SSR/client hydration mismatches
function seededValues(count: number, min: number, max: number, seed: number): number[] {
  const values: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    values.push(min + (s % (max - min + 1)));
  }
  return values;
}

function generateDailyActivity(): StatsResponse["daily_activity"] {
  const turns = seededValues(30, 5, 35, 42);
  const days: StatsResponse["daily_activity"] = [];
  for (let i = 29; i >= 0; i--) {
    const dayOfWeek = new Date(daysAgo(i)).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const turnCount = isWeekend ? Math.floor(turns[29 - i] / 4) : 15 + turns[29 - i];
    days.push({
      date: daysAgo(i),
      turn_count: turnCount,
      message_count: turnCount * 3,
      task_count: Math.max(1, Math.floor(turnCount / 4)),
    });
  }
  return days;
}

function generateCompletedActivity(): StatsResponse["completed_activity"] {
  const vals = seededValues(30, 1, 7, 99);
  const days: StatsResponse["completed_activity"] = [];
  for (let i = 29; i >= 0; i--) {
    const dayOfWeek = new Date(daysAgo(i)).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    days.push({
      date: daysAgo(i),
      completed_tasks: isWeekend ? Math.floor(vals[29 - i] / 4) : 2 + vals[29 - i],
    });
  }
  return days;
}

const TASK_TITLES = [
  "Implement rate limiting for BFF gateway",
  "Add retry logic to enrichment pipeline",
  "Migrate atom config to new schema",
  "Fix timeout in batch processing endpoint",
  "Add OpenTelemetry tracing to core services",
  "Refactor auth middleware for multi-tenant",
  "Update CI pipeline for monorepo support",
  "Add health check endpoints to all services",
  "Implement graceful shutdown for workers",
  "Fix memory leak in enrichment cache",
  "Add pagination to admin API endpoints",
  "Update gRPC protobuf definitions",
  "Implement webhook delivery retry queue",
  "Add request validation middleware",
  "Fix N+1 query in user dashboard",
  "Migrate to structured logging format",
  "Add circuit breaker to external API calls",
  "Implement feature flag integration",
  "Fix race condition in session store",
  "Add Prometheus metrics to gateway",
  "Implement API versioning strategy",
  "Fix certificate rotation in mTLS setup",
  "Add rate limit headers to responses",
  "Implement batch upload endpoint",
  "Fix timezone handling in scheduler",
  "Add canary deployment support",
  "Implement dead letter queue processing",
  "Fix connection pool exhaustion under load",
  "Add GraphQL schema federation",
  "Implement data export API",
  "Add content personalization engine",
  "Fix video player buffer management",
  "Implement A/B testing framework",
  "Add push notification service",
  "Fix payment gateway timeout handling",
  "Implement user segmentation API",
  "Add analytics event pipeline",
  "Fix image CDN cache invalidation",
  "Implement multi-region failover",
  "Add accessibility audit automation",
  "Fix SSO token refresh flow",
  "Implement content scheduling system",
  "Add real-time collaboration sync",
  "Fix streaming quality adaptation",
  "Implement recommendation engine API",
  "Add automated compliance checks",
  "Fix deep link routing on mobile",
  "Implement content rights management",
  "Add user preference sync service",
  "Fix ad insertion timing logic",
];

function generateTaskStats(): StatsResponse["task_stats"] {
  const states = [
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
    "in_progress",
    "in_progress",
    "created",
  ];
  const durations = seededValues(TASK_TITLES.length, 5, 60, 77);
  const turns = seededValues(TASK_TITLES.length, 4, 18, 33);
  return TASK_TITLES.map((title, i) => ({
    task_id: `demo-task-${i + 1}`,
    task_title: title,
    workspace_id: "demo-workspace",
    workflow_id: "demo-workflow",
    state: states[i % states.length],
    session_count: 1 + (turns[i] % 4),
    turn_count: turns[i],
    message_count: turns[i] * 4,
    user_message_count: 2 + (turns[i] % 6),
    tool_call_count: turns[i] * 2,
    total_duration_ms: durations[i] * 60 * 1000,
    created_at: daysAgo(30 - Math.floor(i / 5)),
    completed_at:
      states[i % states.length] === "completed" ? daysAgo(29 - Math.floor(i / 5)) : undefined,
  }));
}

const REPOS = [
  {
    id: "bff",
    name: "NBCUDTC/bff",
    tasks: 18,
    completed: 15,
    inProgress: 2,
    sessions: 52,
    turns: 380,
    msgs: 1140,
    userMsgs: 160,
    tools: 760,
    hours: 22,
    commits: 42,
    files: 128,
    ins: 4200,
    del: 1580,
  },
  {
    id: "enrichment",
    name: "NBCUDTC/enrichment-service",
    tasks: 14,
    completed: 11,
    inProgress: 2,
    sessions: 40,
    turns: 290,
    msgs: 870,
    userMsgs: 125,
    tools: 580,
    hours: 17,
    commits: 34,
    files: 98,
    ins: 3200,
    del: 1210,
  },
  {
    id: "atom",
    name: "NBCUDTC/atom",
    tasks: 12,
    completed: 10,
    inProgress: 1,
    sessions: 34,
    turns: 250,
    msgs: 750,
    userMsgs: 108,
    tools: 500,
    hours: 14,
    commits: 28,
    files: 82,
    ins: 2600,
    del: 980,
  },
  {
    id: "commerce",
    name: "NBCUDTC/global-commerce",
    tasks: 10,
    completed: 8,
    inProgress: 1,
    sessions: 28,
    turns: 210,
    msgs: 630,
    userMsgs: 92,
    tools: 420,
    hours: 12,
    commits: 24,
    files: 70,
    ins: 2100,
    del: 790,
  },
  {
    id: "mytv",
    name: "NBCUDTC/mytv",
    tasks: 9,
    completed: 7,
    inProgress: 1,
    sessions: 26,
    turns: 190,
    msgs: 570,
    userMsgs: 82,
    tools: 380,
    hours: 11,
    commits: 21,
    files: 62,
    ins: 1850,
    del: 695,
  },
  {
    id: "ios",
    name: "NBCUDTC/ios",
    tasks: 8,
    completed: 6,
    inProgress: 1,
    sessions: 22,
    turns: 165,
    msgs: 495,
    userMsgs: 72,
    tools: 330,
    hours: 9,
    commits: 18,
    files: 54,
    ins: 1620,
    del: 610,
  },
  {
    id: "android",
    name: "NBCUDTC/android",
    tasks: 7,
    completed: 5,
    inProgress: 1,
    sessions: 20,
    turns: 148,
    msgs: 444,
    userMsgs: 64,
    tools: 296,
    hours: 8,
    commits: 16,
    files: 48,
    ins: 1440,
    del: 540,
  },
  {
    id: "web",
    name: "NBCUDTC/web",
    tasks: 6,
    completed: 5,
    inProgress: 0,
    sessions: 18,
    turns: 130,
    msgs: 390,
    userMsgs: 56,
    tools: 260,
    hours: 7,
    commits: 14,
    files: 42,
    ins: 1260,
    del: 475,
  },
];

export const DEMO_STATS: StatsResponse = {
  global: {
    total_tasks: 148,
    completed_tasks: 112,
    in_progress_tasks: 22,
    total_sessions: 412,
    total_turns: 3240,
    total_messages: 9720,
    total_user_messages: 1380,
    total_tool_calls: 6480,
    total_duration_ms: 168 * 60 * 60 * 1000,
    avg_turns_per_task: 21.9,
    avg_messages_per_task: 65.7,
    avg_duration_ms_per_task: 68 * 60 * 1000,
  },
  task_stats: generateTaskStats(),
  daily_activity: generateDailyActivity(),
  completed_activity: generateCompletedActivity(),
  agent_usage: [
    {
      agent_profile_id: "demo-claude",
      agent_profile_name: "Claude Code",
      agent_model: "claude-sonnet-4-6",
      session_count: 228,
      turn_count: 1820,
      total_duration_ms: 98 * 60 * 60 * 1000,
    },
    {
      agent_profile_id: "demo-auggie",
      agent_profile_name: "Auggie",
      agent_model: "claude-sonnet-4-6",
      session_count: 98,
      turn_count: 720,
      total_duration_ms: 38 * 60 * 60 * 1000,
    },
    {
      agent_profile_id: "demo-augment",
      agent_profile_name: "Augment",
      agent_model: "augment-v2",
      session_count: 52,
      turn_count: 420,
      total_duration_ms: 20 * 60 * 60 * 1000,
    },
    {
      agent_profile_id: "demo-codex",
      agent_profile_name: "Codex",
      agent_model: "o3-mini",
      session_count: 34,
      turn_count: 280,
      total_duration_ms: 12 * 60 * 60 * 1000,
    },
  ],
  repository_stats: REPOS.map((r) => ({
    repository_id: `demo-repo-${r.id}`,
    repository_name: r.name,
    total_tasks: r.tasks,
    completed_tasks: r.completed,
    in_progress_tasks: r.inProgress,
    session_count: r.sessions,
    turn_count: r.turns,
    message_count: r.msgs,
    user_message_count: r.userMsgs,
    tool_call_count: r.tools,
    total_duration_ms: r.hours * 60 * 60 * 1000,
    total_commits: r.commits,
    total_files_changed: r.files,
    total_insertions: r.ins,
    total_deletions: r.del,
  })),
  git_stats: {
    total_commits: 197,
    total_files_changed: 584,
    total_insertions: 18270,
    total_deletions: 6880,
  },
};
