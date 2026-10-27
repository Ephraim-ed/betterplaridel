import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { OrgNode } from "../official-data";

export type OfficialNodeData = {
  official: OrgNode;
  childCount: number;
  collapsed: boolean;
  selected: boolean;
  onPath: boolean; // an ancestor of the selected node
  onToggle: (id: string) => void;
};

export type OfficialFlowNode = Node<OfficialNodeData, "official">;

export const NODE_WIDTH = 340;
export const NODE_HEIGHT = 88;

export function initials(name: string) {
  const words = name.replace(/^Hon\.\s*/, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w));
  return (words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "");
}

// Edges leave from the bottom and enter from the top, or from the side for stacked groups.
const handles = [
  { type: "target", position: Position.Top, id: "top" },
  { type: "target", position: Position.Left, id: "left" },
  { type: "target", position: Position.Right, id: "right" },
  { type: "source", position: Position.Bottom, id: "bottom" },
] as const;

export function OfficialNode({ data }: NodeProps<OfficialFlowNode>) {
  const { official, childCount, collapsed, selected, onPath, onToggle } = data;
  const isLgu = official.kind === "lgu";
  const group = official.childrenLabel ?? "members";

  return (
    <div
      className={`relative flex h-full w-full cursor-pointer items-center gap-4 rounded-2xl border px-5 shadow-sm transition-shadow hover:shadow-md ${
        isLgu ? "bg-brand text-white" : "bg-background"
      } ${selected ? "border-brand ring-2 ring-brand/30" : onPath ? "border-brand/60" : "border-line"}`}
    >
      {handles.map((h) => (
        <Handle key={h.id} {...h} className="!opacity-0" isConnectable={false} />
      ))}

      <div
        aria-hidden
        className={`grid size-12 shrink-0 place-items-center rounded-full text-sm font-bold ${
          isLgu ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
        }`}
      >
        {isLgu ? "LGU" : initials(official.name)}
      </div>
      <div className="min-w-0">
        <p className={`truncate text-[11px] font-semibold tracking-wider uppercase ${isLgu ? "text-white/80" : "text-muted-foreground"}`}>
          {official.position}
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold">
          {official.name.replace(/^Hon\.\s*/, "")}
        </p>
        {childCount > 0 && (
          // Inside the card (not hanging off its edge) with a solid hover, so nothing shows through.
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(official.id);
            }}
            aria-expanded={!collapsed}
            className={`nodrag mt-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
              isLgu
                ? "border-white/40 bg-white text-brand hover:bg-surface"
                : "border-brand/30 bg-background text-brand hover:border-brand hover:bg-brand hover:text-white"
            }`}
          >
            {collapsed ? `Show ${childCount} ${group}` : `Hide ${group}`}
          </button>
        )}
      </div>
    </div>
  );
}
