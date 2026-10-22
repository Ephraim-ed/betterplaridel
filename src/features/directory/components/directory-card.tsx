import { HotlineCard } from "@/features/hotlines/components/hotline-card";
import { TRUNKLINE, type DirectoryEntry } from "../data";

// Same card as every other hotline; the call dials the trunkline, pauses (","), then the local.
export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <HotlineCard
      hotline={{
        name: entry.name,
        number: {
          number: `Local ${entry.local}`,
          label: `via ${TRUNKLINE.display}`,
          dial: `${TRUNKLINE.dial},${entry.local}`,
        },
      }}
    />
  );
}
