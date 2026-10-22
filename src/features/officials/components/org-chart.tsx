import { useCallback, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import { AnimateIcon } from "@animate-ui/react/icons";
import { RotateCcw } from "@/components/animate-ui/icons/rotate-ccw";
import { orgNodes, type OrgNode } from "../data";
import { NODE_HEIGHT, NODE_WIDTH, OfficialNode, type OfficialFlowNode } from "./official-node";
import { OfficialDetails } from "./official-details";

const nodeTypes: NodeTypes = { official: OfficialNode };

const byId = new Map(orgNodes.map((n) => [n.id, n]));
const childrenOf = (id: string) => orgNodes.filter((n) => n.parentId === id);

function ancestorsOf(id: string | null) {
  const path = new Set<string>();
  for (let n = id ? byId.get(id) : undefined; n?.parentId; n = byId.get(n.parentId)) path.add(n.parentId);
  return path;
}

const SIBLING_GAP = 24;
const LEVEL_GAP = 96;
const TRUNK_GAP = 56; // space between a stacked group and its center line
const BRANCH_GAP = 120; // space between side-by-side branches that have their own members (Mayor | Vice Mayor)
const PANEL_WIDTH = 336; // details card (w-80) plus its margin, overlaid on the right of the chart

type Placement = { x: number; y: number; targetHandle: "top" | "left" | "right" };
type Box = { w: number; h: number };

// Top-down tree, kept in data order. Returns each node's top-left position and the side its edge enters.
// - Up to two children sit side by side (Municipality → Mayor, Vice Mayor).
// - Larger groups (council, barangays, a barangay's officials, SK officials) split evenly into two
//   columns around a center line. Each column cell holds that child's whole subtree, so opened
//   groups stay balanced at every level.
function layout(visible: OrgNode[]) {
  const kids = (id: string) => visible.filter((n) => n.parentId === id);
  const isStacked = (k: OrgNode[]) => k.length > 2;
  const pairs = <T,>(k: T[]) => Array.from({ length: Math.ceil(k.length / 2) }, (_, i) => k.slice(i * 2, i * 2 + 2));
  // After a row holding an opened group, leave a full level of space so the next card
  // doesn't read as part of that group.
  const gapBetween = (k: OrgNode[]) => (k.some((c) => kids(c.id).length > 0) ? BRANCH_GAP : SIBLING_GAP);
  const gapAfter = (row: OrgNode[]) => (row.some((c) => kids(c.id).length > 0) ? LEVEL_GAP : SIBLING_GAP);

  const boxes = new Map<string, Box>();
  const box = (n: OrgNode) => boxes.get(n.id)!;
  const measure = (n: OrgNode) => {
    const k = kids(n.id);
    k.forEach(measure);
    let w = NODE_WIDTH;
    let below = 0;
    if (isStacked(k)) {
      const colWidth = Math.max(...k.map((c) => box(c).w));
      w = Math.max(w, 2 * (colWidth + TRUNK_GAP));
      const rows = pairs(k);
      below = LEVEL_GAP + rows.reduce((sum, row, i) => {
        const h = Math.max(...row.map((c) => box(c).h));
        return sum + h + (i < rows.length - 1 ? gapAfter(row) : 0);
      }, 0);
    } else if (k.length > 0) {
      w = Math.max(w, k.reduce((sum, c) => sum + box(c).w, 0) + gapBetween(k) * (k.length - 1));
      below = LEVEL_GAP + Math.max(...k.map((c) => box(c).h));
    }
    boxes.set(n.id, { w, h: NODE_HEIGHT + below });
  };

  const placed = new Map<string, Placement>();
  const place = (n: OrgNode, left: number, top: number, targetHandle: Placement["targetHandle"]) => {
    const center = left + box(n).w / 2;
    placed.set(n.id, { x: center - NODE_WIDTH / 2, y: top, targetHandle });

    const k = kids(n.id);
    let childTop = top + NODE_HEIGHT + LEVEL_GAP;
    if (isStacked(k)) {
      for (const [l, r] of pairs(k)) {
        // Each side hugs the center line: left subtrees end at it, right subtrees start at it.
        place(l, center - TRUNK_GAP - box(l).w, childTop, "right");
        if (r) place(r, center + TRUNK_GAP, childTop, "left");
        childTop += Math.max(box(l).h, r ? box(r).h : 0) + gapAfter(r ? [l, r] : [l]);
      }
      return;
    }
    const rowWidth = k.reduce((sum, c) => sum + box(c).w, 0) + gapBetween(k) * Math.max(0, k.length - 1);
    let offset = center - rowWidth / 2;
    for (const c of k) {
      place(c, offset, childTop, "top");
      offset += box(c).w + gapBetween(k);
    }
  };

  for (const root of visible.filter((n) => !n.parentId)) {
    measure(root);
    place(root, 0, 0, "top");
  }
  return placed;
}

// Barangay councils (and their SK councils) start folded; everything above them starts open.
const initialCollapsed = () =>
  new Set(orgNodes.filter((n) => n.kind === "barangay" || n.kind === "sk-chair").map((n) => n.id));

export function OrgChart() {
  return (
    <ReactFlowProvider>
      <Chart />
    </ReactFlowProvider>
  );
}

function Chart() {
  const { fitView, getNode, getZoom, setCenter } = useReactFlow();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);

  // Select an official and pan so their card sits in the open area left of the details panel.
  const select = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      if (id) setShowHint(false);
      const node = id ? getNode(id) : undefined;
      if (!node) return;
      const zoom = Math.max(getZoom(), 0.85);
      setCenter(node.position.x + NODE_WIDTH / 2 + PANEL_WIDTH / 2 / zoom, node.position.y + NODE_HEIGHT / 2, {
        zoom,
        duration: 300,
      });
    },
    [getNode, getZoom, setCenter],
  );

  const toggle = useCallback(
    (id: string) => {
      const folding = !collapsed.has(id);
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      // Folding away the selected official clears the selection.
      if (folding && ancestorsOf(selectedId).has(id)) setSelectedId(null);
      // Once the new layout renders: zoom to an opened barangay, otherwise re-fit the whole chart.
      const focus = !folding && ["barangay", "sk-chair"].includes(byId.get(id)?.kind ?? "");
      setTimeout(() => {
        if (focus) fitView({ nodes: [id, ...childrenOf(id).map((c) => c.id)].map((n) => ({ id: n })), padding: 0.3, maxZoom: 1, duration: 300 });
        else fitView({ padding: 0.15, duration: 300 });
      }, 50);
    },
    [collapsed, selectedId, fitView],
  );

  // Fold everything back to the starting state, clear the selection and re-fit.
  const reset = () => {
    setCollapsed(initialCollapsed());
    setSelectedId(null);
    setTimeout(() => fitView({ padding: 0.12, duration: 300 }), 50);
  };

  const { nodes, edges } = useMemo(() => {
    const hidden = (n: OrgNode): boolean =>
      !!n.parentId && (collapsed.has(n.parentId) || hidden(byId.get(n.parentId)!));
    const visible = orgNodes.filter((n) => !hidden(n));
    const placed = layout(visible);
    const path = ancestorsOf(selectedId);

    const nodes: OfficialFlowNode[] = visible.map((n) => ({
      id: n.id,
      type: "official",
      position: { x: placed.get(n.id)!.x, y: placed.get(n.id)!.y },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      data: {
        official: n,
        childCount: childrenOf(n.id).length,
        collapsed: collapsed.has(n.id),
        selected: n.id === selectedId,
        onPath: path.has(n.id),
        onToggle: toggle,
      },
    }));

    // Edges on the selected official's chain up to the Municipality are highlighted.
    const edges: Edge[] = visible
      .filter((n) => n.parentId)
      .map((n) => {
        const active = n.id === selectedId || path.has(n.id);
        const color = active ? "var(--brand)" : "var(--border)";
        return {
          id: `${n.parentId}-${n.id}`,
          source: n.parentId!,
          target: n.id,
          sourceHandle: "bottom",
          targetHandle: placed.get(n.id)!.targetHandle,
          type: "smoothstep",
          animated: active,
          zIndex: active ? 1 : 0, // keep the highlighted chain above the shared center line
          style: { stroke: color, strokeWidth: active ? 2 : 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color },
        };
      });

    return { nodes, edges };
  }, [collapsed, selectedId, toggle]);

  const selected = selectedId ? byId.get(selectedId) : undefined;

  return (
    <div className="h-[78vh] min-h-[640px] overflow-hidden rounded-3xl border border-line bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => select(node.id === selectedId ? null : node.id)}
        onPaneClick={() => setSelectedId(null)}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.1} // the full chart, with several barangays open, is tall
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} color="var(--border)" />
        <Controls showInteractive={false} />

        <Panel position="bottom-right">
          <AnimateIcon animateOnHover asChild>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset chart"
              title="Reset chart"
              className="grid size-10 place-items-center rounded-full border border-line bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            >
              <RotateCcw size={18} />
            </button>
          </AnimateIcon>
        </Panel>

        {selected && (
          <Panel position="top-right" className="max-h-[calc(100%-2rem)] w-80 overflow-y-auto rounded-2xl shadow-lg">
            <OfficialDetails
              official={selected}
              parent={selected.parentId ? byId.get(selected.parentId) : undefined}
              members={childrenOf(selected.id)}
              onSelect={select}
              onClose={() => setSelectedId(null)}
            />
          </Panel>
        )}

        {/* First-visit hint; gone for good after the first official is clicked. */}
        {showHint && (
          <Panel
            position="top-left"
            className="max-w-sm rounded-2xl border border-line bg-background/90 px-4 py-3 text-sm text-muted-foreground backdrop-blur"
          >
            Click an official for details. “Show officials” on a barangay branches out its kagawads and SK Chairperson.
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
