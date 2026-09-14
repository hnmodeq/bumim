import { cn } from "@/lib/utils";

/**
 * Accessible field-level validation error.
 *
 * Renders the message with `role="alert"` (so it is announced to assistive
 * tech the moment it appears) and an `id` that inputs reference via
 * `aria-describedby`, forming the standard error-association pattern.
 */
export function FieldError({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} role="alert" className={cn("text-sm text-destructive", className)}>
      {children}
    </p>
  );
}
