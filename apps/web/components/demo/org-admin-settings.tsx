"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@kandev/ui/card";
import { Switch } from "@kandev/ui/switch";
import { Separator } from "@kandev/ui/separator";
import { Badge } from "@kandev/ui/badge";
import { IconRobot, IconCpu } from "@tabler/icons-react";
import { WorkflowSyncCard } from "./workflow-sync-card";

type ToggleItem = { id: string; name: string; description: string; defaultEnabled: boolean };

const AGENTS: ToggleItem[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Anthropic's AI coding assistant",
    defaultEnabled: true,
  },
  {
    id: "auggie",
    name: "Auggie",
    description: "Full-stack development agent",
    defaultEnabled: true,
  },
  { id: "augment", name: "Augment", description: "AI pair programmer", defaultEnabled: true },
  { id: "codex", name: "Codex", description: "OpenAI code generation", defaultEnabled: true },
  { id: "copilot", name: "Copilot", description: "GitHub AI assistant", defaultEnabled: false },
  { id: "amp", name: "Amp", description: "Sourcegraph coding agent", defaultEnabled: false },
];

const EXECUTORS: ToggleItem[] = [
  {
    id: "core-platform",
    name: "Core Platform (K8s)",
    description: "Internal Kubernetes cluster",
    defaultEnabled: true,
  },
  {
    id: "local",
    name: "Local",
    description: "Run directly on developer machine",
    defaultEnabled: true,
  },
  { id: "worktree", name: "Worktree", description: "Git worktree isolation", defaultEnabled: true },
  { id: "docker", name: "Docker", description: "Local Docker containers", defaultEnabled: true },
  {
    id: "sprites",
    name: "Sprites.dev",
    description: "Cloud sandbox environment",
    defaultEnabled: false,
  },
];

function ToggleRow({
  item,
  enabled,
  onToggle,
}: {
  item: ToggleItem;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.name}</span>
          <Badge variant={enabled ? "default" : "outline"} className="text-[10px]">
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}

function ToggleSection({
  title,
  description,
  icon: Icon,
  items,
}: {
  title: string;
  description: string;
  icon: typeof IconRobot;
  items: ToggleItem[];
}) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.id, item.defaultEnabled])),
  );
  const enabledCount = Object.values(state).filter(Boolean).length;

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto text-xs">
            {enabledCount}/{items.length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {items.map((item) => (
            <ToggleRow
              key={item.id}
              item={item}
              enabled={state[item.id]}
              onToggle={() => setState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrgAdminSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Organization Admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enable or disable agents and executors across the entire organization.
        </p>
      </div>
      <Separator />
      <ToggleSection
        title="Agents"
        description="Control which AI agents are available to all users in the organization."
        icon={IconRobot}
        items={AGENTS}
      />
      <ToggleSection
        title="Executors"
        description="Control which execution environments are available for running agent tasks."
        icon={IconCpu}
        items={EXECUTORS}
      />
      <Separator />
      <WorkflowSyncCard
        scopeKey="org"
        title="Organization Workflow Sync"
        description="Sync organization-wide workflows from a central GitHub repository. These workflows are available to all workspaces and can be overridden at the workspace level."
        syncedCount={6}
      />
    </div>
  );
}
