"use client";

import { useEffect, useState } from "react";
import { Button } from "@kandev/ui/button";
import { Input } from "@kandev/ui/input";
import { Textarea } from "@kandev/ui/textarea";
import { Checkbox } from "@kandev/ui/checkbox";
import { Switch } from "@kandev/ui/switch";
import { Label } from "@kandev/ui/label";
import { Badge } from "@kandev/ui/badge";
import { Separator } from "@kandev/ui/separator";
import { Spinner } from "@kandev/ui/spinner";
import { IconPlus } from "@tabler/icons-react";
import { DEMO_DISCOVERED_REPOS, type DemoDiscoveredRepo } from "@/lib/demo/demo-multi-repo";

// ── Step 1: Describe ─────────────────────────────────────────────────────────

type DescribeStepProps = {
  title: string;
  description: string;
  onDescriptionChange: (v: string) => void;
  onNext: () => void;
  onCancel: () => void;
};

export function DescribeStep({
  title,
  description,
  onDescriptionChange,
  onNext,
  onCancel,
}: DescribeStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mr-desc">Description</Label>
        <Textarea
          id="mr-desc"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the changes needed across repositories..."
          rows={6}
          autoFocus
        />
      </div>
      <Separator />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} className="cursor-pointer">
          Cancel
        </Button>
        <Button onClick={onNext} disabled={!title.trim()} className="cursor-pointer">
          Next
        </Button>
      </div>
    </div>
  );
}

// ── Step 2: Discovery ────────────────────────────────────────────────────────

type DiscoveryStepProps = {
  onComplete: () => void;
};

export function DiscoveryStep({ onComplete }: DiscoveryStepProps) {
  const [progress, setProgress] = useState(0);
  const stages = [
    "Connecting to central MCP registry...",
    "Querying repository dependency graph...",
    "Analyzing affected services...",
    "Resolving repository list...",
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setProgress(1), 600));
    timers.push(setTimeout(() => setProgress(2), 1400));
    timers.push(setTimeout(() => setProgress(3), 2200));
    timers.push(setTimeout(() => onComplete(), 3000));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Spinner className="h-8 w-8" />
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium">{stages[Math.min(progress, stages.length - 1)]}</p>
        <div className="flex gap-1 justify-center">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= progress ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Repo Selection + Launch ──────────────────────────────────────────

function RepoCheckboxItem({
  repo,
  checked,
  onToggle,
}: {
  repo: DemoDiscoveredRepo;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
      onClick={onToggle}
    >
      <Checkbox checked={checked} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{repo.name}</span>
          <Badge variant="outline" className="text-[10px]">
            {repo.language}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{repo.description}</p>
      </div>
    </div>
  );
}

function AddRepoInput({
  onAdd,
  onCancel,
}: {
  onAdd: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const handleAdd = () => name.trim() && onAdd(name.trim());
  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Repository name"
        className="flex-1"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <Button size="sm" onClick={handleAdd} className="cursor-pointer">
        Add
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} className="cursor-pointer">
        Cancel
      </Button>
    </div>
  );
}

type RepoSelectionStepProps = {
  selectedRepos: DemoDiscoveredRepo[];
  onSelectedReposChange: (repos: DemoDiscoveredRepo[]) => void;
  planMode: boolean;
  onPlanModeChange: (v: boolean) => void;
  onSubmit: (start: boolean) => void;
  onBack: () => void;
};

export function RepoSelectionStep({
  selectedRepos,
  onSelectedReposChange,
  planMode,
  onPlanModeChange,
  onSubmit,
  onBack,
}: RepoSelectionStepProps) {
  const [showAddInput, setShowAddInput] = useState(false);

  const toggleRepo = (repo: DemoDiscoveredRepo) => {
    const isSelected = selectedRepos.some((r) => r.id === repo.id);
    onSelectedReposChange(
      isSelected ? selectedRepos.filter((r) => r.id !== repo.id) : [...selectedRepos, repo],
    );
  };

  const handleAddRepo = (name: string) => {
    const newRepo: DemoDiscoveredRepo = {
      id: `custom-${name}`,
      name,
      description: "Custom repository",
      language: "Unknown",
    };
    onSelectedReposChange([...selectedRepos, newRepo]);
    setShowAddInput(false);
  };

  const customRepos = selectedRepos.filter(
    (r) => !DEMO_DISCOVERED_REPOS.some((d) => d.id === r.id),
  );

  return (
    <div className="space-y-4">
      <RepoList
        selectedRepos={selectedRepos}
        customRepos={customRepos}
        onToggle={toggleRepo}
        showAddInput={showAddInput}
        onShowAddInput={() => setShowAddInput(true)}
        onHideAddInput={() => setShowAddInput(false)}
        onAddRepo={handleAddRepo}
      />
      <Separator />
      <LaunchControls
        selectedRepos={selectedRepos}
        planMode={planMode}
        onPlanModeChange={onPlanModeChange}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </div>
  );
}

function RepoList({
  selectedRepos,
  customRepos,
  onToggle,
  showAddInput,
  onShowAddInput,
  onHideAddInput,
  onAddRepo,
}: {
  selectedRepos: DemoDiscoveredRepo[];
  customRepos: DemoDiscoveredRepo[];
  onToggle: (repo: DemoDiscoveredRepo) => void;
  showAddInput: boolean;
  onShowAddInput: () => void;
  onHideAddInput: () => void;
  onAddRepo: (name: string) => void;
}) {
  return (
    <>
      <div>
        <p className="text-sm font-medium">
          {DEMO_DISCOVERED_REPOS.length} repositories discovered
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Select the repositories to include in this multi-repo task.
        </p>
      </div>
      <div className="space-y-2">
        {DEMO_DISCOVERED_REPOS.map((repo) => (
          <RepoCheckboxItem
            key={repo.id}
            repo={repo}
            checked={selectedRepos.some((r) => r.id === repo.id)}
            onToggle={() => onToggle(repo)}
          />
        ))}
        {customRepos.map((repo) => (
          <RepoCheckboxItem key={repo.id} repo={repo} checked onToggle={() => onToggle(repo)} />
        ))}
      </div>
      {showAddInput ? (
        <AddRepoInput onAdd={onAddRepo} onCancel={onHideAddInput} />
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer gap-1"
          onClick={onShowAddInput}
        >
          <IconPlus className="h-3.5 w-3.5" />
          Add repository
        </Button>
      )}
    </>
  );
}

function LaunchControls({
  selectedRepos,
  planMode,
  onPlanModeChange,
  onSubmit,
  onBack,
}: {
  selectedRepos: DemoDiscoveredRepo[];
  planMode: boolean;
  onPlanModeChange: (v: boolean) => void;
  onSubmit: (start: boolean) => void;
  onBack: () => void;
}) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Agent</p>
            <p className="text-xs text-muted-foreground">Mock Agent (forced for multi-repo)</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Mock Agent
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Executor</p>
            <p className="text-xs text-muted-foreground">Local executor</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Local
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="plan-mode" className="cursor-pointer">
            Start in Plan Mode
          </Label>
          <Switch id="plan-mode" checked={planMode} onCheckedChange={onPlanModeChange} />
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="cursor-pointer">
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onSubmit(false)}
            disabled={selectedRepos.length === 0}
            className="cursor-pointer"
          >
            Create Task
          </Button>
          <Button
            onClick={() => onSubmit(true)}
            disabled={selectedRepos.length === 0}
            className="cursor-pointer"
          >
            Create & Start
          </Button>
        </div>
      </div>
    </>
  );
}
