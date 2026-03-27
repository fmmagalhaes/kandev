"use client";

import { useState, useMemo } from "react";
import {
  IconGitPullRequest,
  IconTicket,
  IconMail,
  IconBrandSlack,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { Badge } from "@kandev/ui/badge";
import { Button } from "@kandev/ui/button";
import { Separator } from "@kandev/ui/separator";
import {
  DEMO_PENDING_PRS,
  DEMO_OUTLOOK_DIGEST,
  DEMO_SLACK_DIGEST,
  getDemoMeetings,
  type DemoJiraTicket,
} from "@/lib/demo/demo-data";
import { DigestDialog } from "./digest-dialog";
import { JiraTicketsDialog } from "./jira-tickets-dialog";
import { PRReviewDialog } from "./pr-review-dialog";
import { CalendarDialog } from "./calendar-dialog";
import type { TaskCreateDialogInitialValues } from "@/components/task-create-dialog-state";

type IntegrationBannerProps = {
  onCreateTaskFromTicket: (initialValues: TaskCreateDialogInitialValues) => void;
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 0) return "now";
  if (diffMin < 60) return `in ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `in ${diffH}h ${diffMin % 60}m`;
  return `in ${Math.floor(diffH / 24)}d`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function NextMeetingBadge({ onClick }: { onClick: () => void }) {
  const meetings = useMemo(() => getDemoMeetings(), []);
  const next = meetings.find((m) => m.time > new Date());
  if (!next) return null;

  return (
    <button
      className="flex items-center gap-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors text-xs"
      onClick={onClick}
    >
      <IconCalendar className="h-3.5 w-3.5" />
      <span className="font-medium text-foreground">{formatTime(next.time)}</span>
      <span className="truncate max-w-[140px]">{next.title}</span>
      <span className="flex items-center gap-0.5 text-[10px]">
        <IconClock className="h-2.5 w-2.5" />
        {formatRelativeTime(next.time)}
      </span>
    </button>
  );
}

export function IntegrationBanner({ onCreateTaskFromTicket }: IntegrationBannerProps) {
  const [outlookOpen, setOutlookOpen] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [jiraOpen, setJiraOpen] = useState(false);
  const [prOpen, setPrOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleCreateFromJira = (ticket: DemoJiraTicket) => {
    setJiraOpen(false);
    onCreateTaskFromTicket({
      title: `[${ticket.key}] ${ticket.title}`,
      description: ticket.description,
    });
  };

  const handleCreateFromDigest = (values: TaskCreateDialogInitialValues) => {
    onCreateTaskFromTicket(values);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-y border-primary/25 text-sm">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
            onClick={() => setPrOpen(true)}
          >
            <IconGitPullRequest className="h-3.5 w-3.5" />
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {DEMO_PENDING_PRS.length}
            </Badge>
            <span className="text-xs">PRs to review</span>
          </button>
          <button
            className="flex items-center gap-1.5 cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
            onClick={() => setJiraOpen(true)}
          >
            <IconTicket className="h-3.5 w-3.5" />
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              5
            </Badge>
            <span className="text-xs">Sprint tickets</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <NextMeetingBadge onClick={() => setCalendarOpen(true)} />
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs cursor-pointer gap-1"
            onClick={() => setOutlookOpen(true)}
          >
            <IconMail className="h-3.5 w-3.5" />
            Outlook Digest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs cursor-pointer gap-1"
            onClick={() => setSlackOpen(true)}
          >
            <IconBrandSlack className="h-3.5 w-3.5" />
            Slack Digest
          </Button>
        </div>
      </div>

      <CalendarDialog open={calendarOpen} onOpenChange={setCalendarOpen} />
      <PRReviewDialog
        open={prOpen}
        onOpenChange={setPrOpen}
        onCreateTask={handleCreateFromDigest}
      />
      <JiraTicketsDialog
        open={jiraOpen}
        onOpenChange={setJiraOpen}
        onCreateTask={handleCreateFromJira}
      />
      <DigestDialog
        open={outlookOpen}
        onOpenChange={setOutlookOpen}
        data={DEMO_OUTLOOK_DIGEST}
        onCreateTask={handleCreateFromDigest}
      />
      <DigestDialog
        open={slackOpen}
        onOpenChange={setSlackOpen}
        data={DEMO_SLACK_DIGEST}
        onCreateTask={handleCreateFromDigest}
      />
    </>
  );
}
