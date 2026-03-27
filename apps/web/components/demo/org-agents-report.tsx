"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@kandev/ui/card";
import { Badge } from "@kandev/ui/badge";
import { Separator } from "@kandev/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kandev/ui/table";

const SUMMARY_CARDS = [
  { label: "Total Tasks", value: "12,847", subtitle: "across 42 workspaces" },
  { label: "Active Agents", value: "5", subtitle: "of 8 available" },
  { label: "Avg Cost / Task", value: "$3.42", subtitle: "all agents" },
  { label: "Monthly Spend", value: "$203,280", subtitle: "March 2026" },
];

type AgentRow = {
  name: string;
  tasks: number;
  avgTurns: number;
  avgCost: number;
  successRate: number;
  totalSpend: number;
};

const AGENT_DATA: AgentRow[] = [
  {
    name: "Claude Code",
    tasks: 5240,
    avgTurns: 8.4,
    avgCost: 4.18,
    successRate: 94,
    totalSpend: 95368,
  },
  { name: "Augment", tasks: 3180, avgTurns: 7.8, avgCost: 3.8, successRate: 89, totalSpend: 40656 },
  { name: "Cursor", tasks: 2420, avgTurns: 6.5, avgCost: 3.2, successRate: 90, totalSpend: 32640 },
  { name: "Codex", tasks: 1280, avgTurns: 9.1, avgCost: 2.4, successRate: 87, totalSpend: 15872 },
  { name: "Copilot", tasks: 727, avgTurns: 5.2, avgCost: 1.25, successRate: 82, totalSpend: 5271 },
];

type ExecutorRow = { name: string; sessions: number; avgDuration: string; percentage: number };

const EXECUTOR_DATA: ExecutorRow[] = [
  { name: "Core Platform (K8s)", sessions: 8420, avgDuration: "12m 30s", percentage: 65 },
  { name: "Local", sessions: 2180, avgDuration: "8m 15s", percentage: 17 },
  { name: "Worktrees", sessions: 1540, avgDuration: "9m 45s", percentage: 12 },
  { name: "Docker", sessions: 780, avgDuration: "14m 20s", percentage: 6 },
];

const PR_MONTHLY_DATA = [
  { month: "Oct", prs: 320 },
  { month: "Nov", prs: 485 },
  { month: "Dec", prs: 410 },
  { month: "Jan", prs: 620 },
  { month: "Feb", prs: 780 },
  { month: "Mar", prs: 1140 },
];

type RepoCost = { name: string; cost: number };

const REPO_COST_DATA: RepoCost[] = [
  { name: "NBCUDTC/bff", cost: 42800 },
  { name: "NBCUDTC/enrichment-service", cost: 35200 },
  { name: "NBCUDTC/atom", cost: 28400 },
  { name: "NBCUDTC/global-commerce", cost: 24100 },
  { name: "NBCUDTC/mytv", cost: 21800 },
  { name: "NBCUDTC/ios", cost: 18600 },
  { name: "NBCUDTC/android", cost: 16200 },
  { name: "NBCUDTC/web", cost: 15380 },
];

function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SUMMARY_CARDS.map((card) => (
        <Card key={card.label} className="rounded-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CostBar({ agent }: { agent: AgentRow }) {
  const maxCost = 5;
  const width = Math.min((agent.avgCost / maxCost) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-28 shrink-0">{agent.name}</span>
      <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
        <div className="h-full bg-primary/60 rounded-sm" style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm font-mono tabular-nums w-14 text-right">
        ${agent.avgCost.toFixed(2)}
      </span>
    </div>
  );
}

const BAR_MAX_HEIGHT = 96; // px

function BarChart({
  data,
  valueKey,
  labelKey,
  formatValue,
}: {
  data: Array<Record<string, unknown>>;
  valueKey: string;
  labelKey: string;
  formatValue?: (v: number) => string;
}) {
  const values = data.map((d) => d[valueKey] as number);
  const maxVal = Math.max(...values);
  const fmt = formatValue ?? ((v: number) => String(v));
  return (
    <div className="flex items-end gap-3" style={{ height: `${BAR_MAX_HEIGHT + 40}px` }}>
      {data.map((d, i) => {
        const barHeight = Math.max((values[i] / maxVal) * BAR_MAX_HEIGHT, 4);
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
              {fmt(values[i])}
            </span>
            <div
              className="w-full bg-primary/40 rounded-t-sm"
              style={{ height: `${barHeight}px` }}
            />
            <span className="text-[10px] text-muted-foreground">{d[labelKey] as string}</span>
          </div>
        );
      })}
    </div>
  );
}

function RepoCostChart() {
  const maxCost = Math.max(...REPO_COST_DATA.map((d) => d.cost));
  return (
    <div className="space-y-2">
      {REPO_COST_DATA.map((repo) => (
        <div key={repo.name} className="flex items-center gap-3">
          <span className="text-xs w-44 shrink-0 truncate font-mono">{repo.name}</span>
          <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
            <div
              className="h-full bg-blue-500/50 rounded-sm"
              style={{ width: `${(repo.cost / maxCost) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono tabular-nums w-16 text-right">
            ${(repo.cost / 1000).toFixed(1)}k
          </span>
        </div>
      ))}
    </div>
  );
}

function ExecutorUsageSection() {
  return (
    <div className="space-y-3">
      {EXECUTOR_DATA.map((exec) => (
        <div key={exec.name} className="flex items-center gap-3">
          <span className="text-sm w-36 shrink-0">{exec.name}</span>
          <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
            <div
              className="h-full bg-emerald-500/50 rounded-sm"
              style={{ width: `${exec.percentage}%` }}
            />
          </div>
          <span className="text-sm font-mono tabular-nums w-20 text-right">
            {exec.sessions.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground w-16 text-right">{exec.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

function AgentTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead className="text-right">Tasks</TableHead>
          <TableHead className="text-right">Avg Turns</TableHead>
          <TableHead className="text-right">Avg Cost</TableHead>
          <TableHead className="text-right">Total Spend</TableHead>
          <TableHead className="text-right">Success Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {AGENT_DATA.map((agent) => (
          <TableRow key={agent.name}>
            <TableCell className="font-medium">{agent.name}</TableCell>
            <TableCell className="text-right tabular-nums">
              {agent.tasks.toLocaleString()}
            </TableCell>
            <TableCell className="text-right tabular-nums">{agent.avgTurns}</TableCell>
            <TableCell className="text-right tabular-nums">${agent.avgCost.toFixed(2)}</TableCell>
            <TableCell className="text-right tabular-nums">
              ${agent.totalSpend.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant="outline"
                className={
                  agent.successRate >= 90
                    ? "text-emerald-600 border-emerald-500/20"
                    : "text-yellow-600 border-yellow-500/20"
                }
              >
                {agent.successRate}%
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function OrgAgentsReport() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Agents Report</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Executive summary of agent usage and cost efficiency across all workspaces.
        </p>
      </div>
      <SummaryCards />
      <Separator />
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Agent Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AgentTable />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost per Task by Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AGENT_DATA.map((agent) => (
              <CostBar key={agent.name} agent={agent} />
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PRs Created Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={PR_MONTHLY_DATA} valueKey="prs" labelKey="month" />
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cost by Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RepoCostChart />
        </CardContent>
      </Card>
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Most Used Executors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExecutorUsageSection />
        </CardContent>
      </Card>
    </div>
  );
}
