import type { FileTreeNode } from "@/lib/types/backend";
import type { WorkflowSnapshotData } from "@/lib/state/slices/kanban/types";
import { MULTI_REPO_WORKFLOW_NAME } from "./constants";

const DEMO_REPOS = ["bff", "enrichment-service", "atom"];

/**
 * Check if a task belongs to the Multi Repo workflow by looking it up
 * in all workflow snapshots and checking the workflow name.
 */
export function isMultiRepoTask(
  taskId: string | null,
  snapshots: Record<string, WorkflowSnapshotData>,
): boolean {
  if (!taskId) return false;
  for (const snapshot of Object.values(snapshots)) {
    if (snapshot.workflowName !== MULTI_REPO_WORKFLOW_NAME) continue;
    if (snapshot.tasks.some((t) => t.id === taskId)) return true;
  }
  return false;
}

/** Get demo repos for a multi-repo task. Returns null if not multi-repo. */
export function getMultiRepoRepos(
  taskId: string | null,
  snapshots: Record<string, WorkflowSnapshotData>,
): string[] | null {
  if (!isMultiRepoTask(taskId, snapshots)) return null;
  return DEMO_REPOS;
}

/** Build a static demo file tree simulating multiple repos in one workspace */
export function buildMultiRepoFileTree(repos: string[]): FileTreeNode {
  return {
    name: "workspace",
    path: "workspace",
    is_dir: true,
    children: repos.map((repo) => ({
      name: repo,
      path: `workspace/${repo}`,
      is_dir: true,
      children: buildRepoChildren(repo),
    })),
  };
}

function buildRepoChildren(repo: string): FileTreeNode[] {
  const base = `workspace/${repo}`;
  const common: FileTreeNode[] = [
    { name: ".git", path: `${base}/.git`, is_dir: true },
    { name: "README.md", path: `${base}/README.md`, is_dir: false, size: 2400 },
    { name: "package.json", path: `${base}/package.json`, is_dir: false, size: 1200 },
    { name: ".gitignore", path: `${base}/.gitignore`, is_dir: false, size: 180 },
  ];

  if (repo === "bff") {
    return [
      ...common,
      { name: "tsconfig.json", path: `${base}/tsconfig.json`, is_dir: false, size: 450 },
      {
        name: "src",
        path: `${base}/src`,
        is_dir: true,
        children: [
          { name: "index.ts", path: `${base}/src/index.ts`, is_dir: false, size: 320 },
          { name: "routes", path: `${base}/src/routes`, is_dir: true },
          { name: "middleware", path: `${base}/src/middleware`, is_dir: true },
          { name: "services", path: `${base}/src/services`, is_dir: true },
          { name: "config.ts", path: `${base}/src/config.ts`, is_dir: false, size: 580 },
        ],
      },
      { name: "tests", path: `${base}/tests`, is_dir: true },
      { name: "Dockerfile", path: `${base}/Dockerfile`, is_dir: false, size: 640 },
    ];
  }

  if (repo === "enrichment-service") {
    return [
      ...common.filter((f) => f.name !== "package.json"),
      { name: "go.mod", path: `${base}/go.mod`, is_dir: false, size: 380 },
      { name: "go.sum", path: `${base}/go.sum`, is_dir: false, size: 12400 },
      {
        name: "cmd",
        path: `${base}/cmd`,
        is_dir: true,
        children: [{ name: "main.go", path: `${base}/cmd/main.go`, is_dir: false, size: 420 }],
      },
      {
        name: "internal",
        path: `${base}/internal`,
        is_dir: true,
        children: [
          { name: "pipeline", path: `${base}/internal/pipeline`, is_dir: true },
          { name: "enricher", path: `${base}/internal/enricher`, is_dir: true },
          { name: "config", path: `${base}/internal/config`, is_dir: true },
        ],
      },
      { name: "Makefile", path: `${base}/Makefile`, is_dir: false, size: 890 },
      { name: "Dockerfile", path: `${base}/Dockerfile`, is_dir: false, size: 520 },
    ];
  }

  // atom (default TypeScript lib)
  return [
    ...common,
    { name: "tsconfig.json", path: `${base}/tsconfig.json`, is_dir: false, size: 380 },
    {
      name: "src",
      path: `${base}/src`,
      is_dir: true,
      children: [
        { name: "index.ts", path: `${base}/src/index.ts`, is_dir: false, size: 210 },
        { name: "config", path: `${base}/src/config`, is_dir: true },
        { name: "utils", path: `${base}/src/utils`, is_dir: true },
        { name: "types.ts", path: `${base}/src/types.ts`, is_dir: false, size: 860 },
      ],
    },
    { name: "tests", path: `${base}/tests`, is_dir: true },
  ];
}

/** Demo sub-tasks for multi-repo task sidebar display */
export type DemoSubTask = {
  id: string;
  title: string;
  repo: string;
  agent: string;
};

export function getMultiRepoSubTasks(repos: string[]): DemoSubTask[] {
  return repos.map((repo, i) => ({
    id: `subtask-${repo}-${i}`,
    title: `[${repo}] Implementation`,
    repo,
    agent: "Claude Code",
  }));
}
