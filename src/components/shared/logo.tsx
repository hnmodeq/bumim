import { cn } from "@/lib/utils";

/**
 * Bumim brand mark — a minimal wordmark with a "record" dot in the brand
 * accent color, nodding to video production.
 */
export function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <span className="size-2 rounded-full bg-current" />
      </span>
      {!markOnly && <span>بومیم</span>}
    </span>
  );
}
