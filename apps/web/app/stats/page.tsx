import { fetchStats, type StatsRange } from "@/lib/api/domains/stats-api";
import { fetchUserSettings } from "@/lib/api/domains/settings-api";
import { listWorkspaces } from "@/lib/api";
import { StatsPageClient } from "./stats-page-client";
import { DEMO_STATS } from "@/lib/demo/demo-stats";

type StatsPageProps = {
  searchParams?: Promise<{
    range?: StatsRange;
  }>;
};

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const range = params?.range;

  // Always use demo stats for the executive demo
  let workspaceId = "demo-workspace";
  try {
    const [userSettingsResponse, workspacesResponse] = await Promise.all([
      fetchUserSettings({ cache: "no-store" }),
      listWorkspaces({ cache: "no-store" }),
    ]);
    const settingsWorkspaceId = userSettingsResponse?.settings?.workspace_id;
    const workspaces = workspacesResponse?.workspaces ?? [];
    workspaceId =
      workspaces.find((w) => w.id === settingsWorkspaceId)?.id ??
      workspaces[0]?.id ??
      "demo-workspace";
  } catch {
    // ignore — workspace ID is just for context
  }

  return (
    <StatsPageClient
      stats={DEMO_STATS}
      error={null}
      workspaceId={workspaceId}
      activeRange={range}
    />
  );
}
