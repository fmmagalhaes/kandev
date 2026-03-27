"use client";

import { useState, useEffect, useCallback } from "react";
import { IconBrandGithub, IconRefresh, IconCheck, IconLayoutColumns } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@kandev/ui/card";
import { Input } from "@kandev/ui/input";
import { Button } from "@kandev/ui/button";
import { Badge } from "@kandev/ui/badge";
import { Label } from "@kandev/ui/label";
import { Spinner } from "@kandev/ui/spinner";

const STORAGE_PREFIX = "kandev_demo_workflow_sync_";

function getStoredRepo(scopeKey: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`${STORAGE_PREFIX}${scopeKey}`) ?? "";
}

function setStoredRepo(scopeKey: string, repo: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}${scopeKey}`, repo);
}

type WorkflowSyncCardProps = {
  /** Unique key for localStorage — use workspaceId or "org" */
  scopeKey: string;
  title?: string;
  description?: string;
  /** Number of workflows to show as "synced" */
  syncedCount?: number;
};

export function WorkflowSyncCard({
  scopeKey,
  title = "Workflow Sync",
  description = "Sync workflows from a GitHub repository so they are shared across your team.",
  syncedCount = 4,
}: WorkflowSyncCardProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredRepo(scopeKey);
    if (stored) {
      setRepoUrl(stored);
      setSaved(true);
      setLastSynced("2 hours ago");
    }
  }, [scopeKey]);

  const handleSave = useCallback(() => {
    if (!repoUrl.trim()) return;
    setStoredRepo(scopeKey, repoUrl.trim());
    setSaved(true);
    // Auto-sync on save
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSynced("just now");
    }, 2000);
  }, [repoUrl, scopeKey]);

  const handleSync = useCallback(() => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSynced("just now");
    }, 2000);
  }, []);

  const handleClear = useCallback(() => {
    localStorage.removeItem(`${STORAGE_PREFIX}${scopeKey}`);
    setRepoUrl("");
    setSaved(false);
    setLastSynced(null);
  }, [scopeKey]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconBrandGithub className="h-5 w-5" />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {saved && (
            <Badge variant="outline" className="gap-1 text-xs">
              <IconLayoutColumns className="h-3 w-3" />
              {syncedCount} workflows synced
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`sync-repo-${scopeKey}`}>GitHub Repository</Label>
          <div className="flex gap-2">
            <Input
              id={`sync-repo-${scopeKey}`}
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                if (saved) setSaved(false);
              }}
              placeholder="https://github.com/org/repo"
              className="flex-1 font-mono text-sm"
            />
            {!saved ? (
              <Button
                onClick={handleSave}
                disabled={!repoUrl.trim()}
                className="cursor-pointer gap-1"
              >
                <IconCheck className="h-4 w-4" />
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={syncing}
                className="cursor-pointer gap-1"
              >
                {syncing ? <Spinner className="h-4 w-4" /> : <IconRefresh className="h-4 w-4" />}
                Sync
              </Button>
            )}
          </div>
        </div>
        {saved && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {lastSynced && (
                <>
                  Last synced: <span className="font-medium text-foreground">{lastSynced}</span>
                </>
              )}
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
