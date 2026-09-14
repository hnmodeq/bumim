import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small inline spinner, used for buttons and inline loading indicators. */
export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2Icon className={cn("size-4 animate-spin", className)} aria-hidden />
  );
}
