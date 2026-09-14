import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * Structural placeholder page: a page header + a "coming soon" empty state.
 * Routes use this until real business logic is implemented.
 */
export function PlaceholderPage({
  icon,
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription?: string;
}) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </div>
  );
}
