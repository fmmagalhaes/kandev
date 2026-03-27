export type DemoDiscoveredRepo = {
  id: string;
  name: string;
  description: string;
  language: string;
};

export const DEMO_DISCOVERED_REPOS: DemoDiscoveredRepo[] = [
  {
    id: "demo-repo-bff",
    name: "bff",
    description: "BFF Gateway — API aggregation layer (Node.js)",
    language: "TypeScript",
  },
  {
    id: "demo-repo-enrichment",
    name: "enrichment-service",
    description: "Enrichment Pipeline — data transformation service (Go)",
    language: "Go",
  },
  {
    id: "demo-repo-atom",
    name: "atom",
    description: "Atom Core Library — shared utilities and config (TypeScript)",
    language: "TypeScript",
  },
];

export const MULTI_REPO_WORKFLOW_STEPS = [
  { id: "backlog", title: "Backlog", position: 0, color: "#94a3b8" },
  { id: "spec", title: "Spec", position: 1, color: "#818cf8" },
  { id: "work", title: "Work", position: 2, color: "#3b82f6" },
  { id: "ai-review", title: "AI Review", position: 3, color: "#f59e0b" },
  { id: "prs", title: "PRs", position: 4, color: "#10b981" },
  { id: "prs-fixup", title: "PRs Fixup", position: 5, color: "#f97316" },
  { id: "done", title: "Done", position: 6, color: "#22c55e" },
];

export const SPEC_STEP_PROMPT = `You are a coordinator agent for a multi-repository change. Your task is to:

1. Analyze the requirements across all repositories in this workspace
2. For each repository, spawn a sub-agent to analyze the codebase and propose changes
3. Collect all sub-agent analyses and create a unified implementation plan
4. Identify cross-repo dependencies and ordering constraints

Repositories in scope: {{repositories}}
Task description: {{description}}

Begin by spawning analysis agents for each repository. Each sub-agent should:
- Read the repository structure and identify affected files
- Propose specific changes with code snippets
- Flag any breaking changes or API contract modifications
- Estimate complexity (S/M/L)

After collecting all analyses, produce a consolidated plan with:
- Execution order (respecting dependencies)
- API contract changes that need coordination
- Test strategy across repositories
- Rollback plan if any repo change fails`;
