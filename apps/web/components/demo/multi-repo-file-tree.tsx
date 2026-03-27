"use client";

import { useState, useMemo, useCallback, Fragment } from "react";
import { ScrollArea } from "@kandev/ui/scroll-area";
import { IconFolder, IconFolderOpen, IconFile, IconChevronRight } from "@tabler/icons-react";
import type { FileTreeNode } from "@/lib/types/backend";
import { buildMultiRepoFileTree } from "@/lib/demo/multi-repo-task";

type TreeNodeProps = {
  node: FileTreeNode;
  depth: number;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
};

function TreeNode({ node, depth, expandedPaths, onToggle }: TreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isDir = node.is_dir;
  const dirIcon = isExpanded ? IconFolderOpen : IconFolder;
  const Icon = isDir ? dirIcon : IconFile;

  return (
    <>
      <button
        className="flex items-center gap-1 w-full px-2 py-0.5 text-xs hover:bg-muted/50 cursor-pointer text-left"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => isDir && onToggle(node.path)}
      >
        {isDir && (
          <IconChevronRight
            className={`h-3 w-3 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        )}
        {!isDir && <span className="w-3" />}
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{node.name}</span>
        {!isDir && node.size != null && (
          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
            {node.size > 1000 ? `${(node.size / 1000).toFixed(1)}k` : `${node.size}`}
          </span>
        )}
      </button>
      {isDir &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            expandedPaths={expandedPaths}
            onToggle={onToggle}
          />
        ))}
    </>
  );
}

type MultiRepoFileTreeProps = {
  repos: string[];
};

export function MultiRepoFileTree({ repos }: MultiRepoFileTreeProps) {
  const tree = useMemo(() => buildMultiRepoFileTree(repos), [repos]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    () => new Set([tree.path, ...(tree.children?.map((c) => c.path) ?? [])]),
  );

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b text-xs text-muted-foreground">
        <span className="font-medium text-foreground">~/workspace</span>
        <span>·</span>
        <span>{repos.length} repos</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {tree.children?.map((child) => (
            <Fragment key={child.path}>
              <TreeNode
                node={child}
                depth={0}
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
              />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
