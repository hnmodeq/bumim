import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable empty state: an icon, a title, a description, and an optional
 * action. Used across dashboard, admin, and listing pages.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
