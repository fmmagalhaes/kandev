"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kandev/ui/dialog";
import { JiraIcon } from "./brand-icons";
import { Badge } from "@kandev/ui/badge";
import { Button } from "@kandev/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@kandev/ui/select";
import {
  DEMO_JIRA_TICKETS,
  JIRA_STATUSES,
  type DemoJiraTicket,
  type JiraStatus,
} from "@/lib/demo/demo-data";

const PRIORITY_COLORS: Record<DemoJiraTicket["priority"], string> = {
  Critical: "bg-red-500/10 text-red-600 border-red-500/20",
  High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

type JiraTicketsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (ticket: DemoJiraTicket) => void;
};

function TicketRow({
  ticket,
  status,
  onStatusChange,
  onCreateTask,
}: {
  ticket: DemoJiraTicket;
  status: JiraStatus;
  onStatusChange: (s: JiraStatus) => void;
  onCreateTask: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{ticket.key}</span>
          <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLORS[ticket.priority]}`}>
            {ticket.priority}
          </Badge>
          <span className="text-xs text-muted-foreground">{ticket.storyPoints} pts</span>
        </div>
        <p className="text-sm font-medium leading-tight">{ticket.title}</p>
      </div>
      <Select value={status} onValueChange={(v) => onStatusChange(v as JiraStatus)}>
        <SelectTrigger className="w-[130px] h-7 text-xs cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {JIRA_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="text-xs cursor-pointer">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer h-7 text-xs shrink-0"
        onClick={onCreateTask}
      >
        Create Task
      </Button>
    </div>
  );
}

export function JiraTicketsDialog({ open, onOpenChange, onCreateTask }: JiraTicketsDialogProps) {
  const [statuses, setStatuses] = useState<Record<string, JiraStatus>>(() =>
    Object.fromEntries(DEMO_JIRA_TICKETS.map((t) => [t.key, t.status])),
  );

  const updateStatus = (key: string, status: JiraStatus) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <JiraIcon className="h-5 w-5" />
            <span>Sprint Tickets</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {DEMO_JIRA_TICKETS.length} tickets assigned for {DEMO_JIRA_TICKETS[0].sprint}
          </p>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {DEMO_JIRA_TICKETS.map((ticket) => (
            <TicketRow
              key={ticket.key}
              ticket={ticket}
              status={statuses[ticket.key]}
              onStatusChange={(s) => updateStatus(ticket.key, s)}
              onCreateTask={() => onCreateTask(ticket)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
