"use client";

import { ArrowRightIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

/** Screen-only controls around a printable document. */
export function PrintToolbar({
  printLabel,
  backLabel,
  backHref,
}: {
  printLabel: string;
  backLabel: string;
  backHref: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link href={backHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden />
        {backLabel}
      </Link>
      <Button onClick={() => window.print()} size="sm">
        <PrinterIcon className="size-4" aria-hidden />
        {printLabel}
      </Button>
    </div>
  );
}
