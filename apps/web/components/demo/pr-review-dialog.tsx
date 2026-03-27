"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@kandev/ui/dialog";
import { Badge } from "@kandev/ui/badge";
import { Button } from "@kandev/ui/button";
import { DEMO_PENDING_PRS, type DemoPR } from "@/lib/demo/demo-data";
import type { TaskCreateDialogInitialValues } from "@/components/task-create-dialog-state";

type PRReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (values: TaskCreateDialogInitialValues) => void;
};

function PRRow({ pr, onCreateTask }: { pr: DemoPR; onCreateTask: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">#{pr.number}</span>
          <span className="text-xs text-muted-foreground">{pr.repo}</span>
          <span className="text-xs text-muted-foreground">by {pr.author}</span>
        </div>
        <p className="text-sm font-medium leading-tight">{pr.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/20">
            +{pr.additions}
          </Badge>
          <Badge variant="outline" className="text-[10px] text-red-600 border-red-500/20">
            -{pr.deletions}
          </Badge>
          <span>{pr.filesChanged} files</span>
          <span>{pr.updatedAgo}</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer h-7 text-xs shrink-0"
        onClick={onCreateTask}
      >
        Review Task
      </Button>
    </div>
  );
}

export function PRReviewDialog({ open, onOpenChange, onCreateTask }: PRReviewDialogProps) {
  const handleCreateTask = (pr: DemoPR) => {
    onOpenChange(false);
    onCreateTask({
      title: `Review: ${pr.title}`,
      description: `Review PR #${pr.number} in ${pr.repo} by ${pr.author}.\n\n+${pr.additions} -${pr.deletions} across ${pr.filesChanged} files.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBrandGithub className="h-5 w-5" />
            <span>PRs to Review</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {DEMO_PENDING_PRS.length} pull requests waiting for your review
          </p>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {DEMO_PENDING_PRS.map((pr) => (
            <PRRow key={pr.id} pr={pr} onCreateTask={() => handleCreateTask(pr)} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
