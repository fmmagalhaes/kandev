"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kandev/ui/dialog";
import { Button } from "@kandev/ui/button";
import { Spinner } from "@kandev/ui/spinner";
import { IconPlus } from "@tabler/icons-react";
import { SlackIcon, OutlookIcon } from "./brand-icons";
import type { DigestData } from "@/lib/demo/demo-data";
import type { TaskCreateDialogInitialValues } from "@/components/task-create-dialog-state";

type DigestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DigestData;
  onCreateTask: (values: TaskCreateDialogInitialValues) => void;
};

const LOADING_MESSAGES = [
  "Connecting to data sources...",
  "Reading messages and emails...",
  "Analyzing conversations...",
  "Generating summary...",
];

function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      ...LOADING_MESSAGES.map((_, i) => setTimeout(() => setStep(i), i * 700)),
      setTimeout(onComplete, 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Spinner className="h-6 w-6" />
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground animate-pulse">{LOADING_MESSAGES[step]}</p>
        <div className="flex gap-1 justify-center">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DigestContent({ data, onAction }: { data: DigestData; onAction: (text: string) => void }) {
  return (
    <div className="space-y-4 max-h-[60vh] overflow-auto">
      {data.sections.map((section) => (
        <div key={section.heading}>
          <h4 className="text-sm font-semibold mb-2">{section.heading}</h4>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-border group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex-1">{item.text}</span>
                  {item.actionLabel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px] cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onAction(item.text)}
                    >
                      <IconPlus className="h-3 w-3 mr-0.5" />
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Inner component that manages the loading → content transition.
 * Remounted via key when dialog opens to reset loading state.
 */
function DigestDialogInner({
  data,
  onAction,
}: {
  data: DigestData;
  onAction: (text: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return <LoadingAnimation onComplete={() => setLoaded(true)} />;
  }

  return <DigestContent data={data} onAction={onAction} />;
}

export function DigestDialog({ open, onOpenChange, data, onCreateTask }: DigestDialogProps) {
  // Track open count to force remount of inner component → reset loading
  const [openCount, setOpenCount] = useState(0);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setOpenCount((c) => c + 1);
    onOpenChange(nextOpen);
  };

  const handleAction = (text: string) => {
    onOpenChange(false);
    onCreateTask({ title: text.slice(0, 80), description: text });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {data.title.includes("Outlook") ? (
              <OutlookIcon className="h-5 w-5" />
            ) : (
              <SlackIcon className="h-5 w-5" />
            )}
            <span>{data.title}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{data.date}</p>
        </DialogHeader>
        <DigestDialogInner key={openCount} data={data} onAction={handleAction} />
      </DialogContent>
    </Dialog>
  );
}
