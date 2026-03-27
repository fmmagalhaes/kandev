"use client";

import { useEffect, useRef } from "react";
import { createWorkflow, listWorkflows } from "@/lib/api/domains/kanban-api";
import { createWorkflowStep } from "@/lib/api/domains/workflow-api";
import { createExecutorProfile } from "@/lib/api/domains/settings-api";
import { useAppStore } from "@/components/state-provider";
import { MULTI_REPO_WORKFLOW_NAME } from "./constants";
import { MULTI_REPO_WORKFLOW_STEPS, SPEC_STEP_PROMPT } from "./demo-multi-repo";

const SEEDED_KEY = "kandev_demo_seeded_v1";

async function seedMultiRepoWorkflow(workspaceId: string): Promise<void> {
  // Check if Multi Repo workflow already exists
  const existing = await listWorkflows(workspaceId);
  if (existing.workflows?.some((w) => w.name === MULTI_REPO_WORKFLOW_NAME)) return;

  // Create workflow
  const workflow = await createWorkflow({
    workspace_id: workspaceId,
    name: MULTI_REPO_WORKFLOW_NAME,
    description: "Multi-repository coordinated changes with MCP registry discovery",
  });

  // Create steps — Backlog is the start step (no auto plan mode)
  for (const step of MULTI_REPO_WORKFLOW_STEPS) {
    await createWorkflowStep({
      workflow_id: workflow.id,
      name: step.title,
      position: step.position,
      color: step.color,
      prompt: step.id === "spec" ? SPEC_STEP_PROMPT : undefined,
      is_start_step: step.id === "backlog",
    });
  }
}

async function seedCorePlatformExecutor(
  executors: Array<{ id: string; type: string; profiles?: Array<{ name: string }> }>,
): Promise<void> {
  // Find the local executor to create a "Core Platform" profile on it
  // In a real scenario this would be a remote_k8s executor, but for demo we use local
  const localExecutor = executors.find((e) => e.type === "local");
  if (!localExecutor) return;

  // Check if profile already exists
  if (localExecutor.profiles?.some((p) => p.name === "Core Platform")) return;

  await createExecutorProfile(localExecutor.id, {
    name: "Core Platform",
  });
}

export function useDemoSeeder() {
  const seededRef = useRef(false);
  const workspaceId = useAppStore((s) => s.workspaces.activeId);
  const executors = useAppStore((s) => s.executors.items);

  useEffect(() => {
    if (seededRef.current || !workspaceId) return;

    // Check localStorage to avoid re-seeding across page reloads
    const seeded = typeof window !== "undefined" && localStorage.getItem(SEEDED_KEY);
    if (seeded) {
      seededRef.current = true;
      return;
    }

    seededRef.current = true;

    const run = async () => {
      try {
        await seedMultiRepoWorkflow(workspaceId);
        await seedCorePlatformExecutor(executors);
        localStorage.setItem(SEEDED_KEY, "true");
      } catch (e) {
        // Seeding is best-effort for demo
        console.warn("[demo] seeding failed:", e);
      }
    };

    void run();
  }, [workspaceId, executors]);
}
