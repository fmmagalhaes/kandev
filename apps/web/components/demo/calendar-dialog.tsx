"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kandev/ui/dialog";
import { Badge } from "@kandev/ui/badge";
import { Separator } from "@kandev/ui/separator";
import { getDemoMeetings, type DemoMeeting } from "@/lib/demo/demo-data";

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function groupByDate(meetings: DemoMeeting[]): Map<string, DemoMeeting[]> {
  const groups = new Map<string, DemoMeeting[]>();
  for (const m of meetings) {
    const key = m.time.toDateString();
    const list = groups.get(key) ?? [];
    list.push(m);
    groups.set(key, list);
  }
  return groups;
}

function MeetingRow({ meeting }: { meeting: DemoMeeting }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="text-center w-14 shrink-0">
        <p className="text-sm font-mono font-medium">{formatTime(meeting.time)}</p>
        <p className="text-[10px] text-muted-foreground">{meeting.duration}m</p>
      </div>
      <Separator orientation="vertical" className="h-8" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{meeting.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {meeting.attendees.map((a) => (
            <Badge key={a} variant="outline" className="text-[10px]">
              {a}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

type CalendarDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CalendarDialog({ open, onOpenChange }: CalendarDialogProps) {
  const meetings = useMemo(() => getDemoMeetings(), []);
  const upcoming = meetings.filter((m) => m.time > new Date());
  const grouped = groupByDate(upcoming);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upcoming Meetings</DialogTitle>
          <p className="text-xs text-muted-foreground">Next 3 days</p>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-auto">
          {[...grouped.entries()].map(([dateStr, dayMeetings]) => (
            <div key={dateStr}>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {formatDate(dayMeetings[0].time)}
              </p>
              <div className="space-y-2">
                {dayMeetings.map((m) => (
                  <MeetingRow key={m.id} meeting={m} />
                ))}
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming meetings</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
