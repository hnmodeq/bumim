"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChipOption = {
  id: string;
  label: string;
  group?: string | null;
};

/**
 * Toggle-chip multi-select for curated lists (skills, software). Each chip
 * toggles its id in the selected set.
 */
export function MultiSelectChips({
  options,
  selectedIds,
  onToggle,
  emptyLabel,
}: {
  options: ChipOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyLabel: string;
}) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  // Group options when any carry a group label.
  const grouped = new Map<string, ChipOption[]>();
  let hasGroups = false;
  for (const o of options) {
    if (o.group) {
      hasGroups = true;
      const g = grouped.get(o.group) ?? [];
      g.push(o);
      grouped.set(o.group, g);
    }
  }

  const renderChip = (o: ChipOption) => {
    const active = selectedIds.includes(o.id);
    return (
      <button
        key={o.id}
        type="button"
        onClick={() => onToggle(o.id)}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:bg-accent",
        )}
      >
        {active && <CheckIcon className="size-3.5" aria-hidden />}
        {o.label}
      </button>
    );
  };

  if (!hasGroups) {
    return <div className="flex flex-wrap gap-2">{options.map(renderChip)}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {[...grouped.entries()].map(([group, items]) => (
        <div key={group} className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group}
          </h4>
          <div className="flex flex-wrap gap-2">{items.map(renderChip)}</div>
        </div>
      ))}
    </div>
  );
}
