"use client";

import { useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArchiveIcon, ArchiveRestoreIcon, CopyIcon, PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { duplicateQuote, setQuoteStatus } from "@/lib/quote/actions";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";

type State = { error: string } | null;

/**
 * Row controls for the quotes list. Client component so a failed action can
 * surface an inline message instead of silently doing nothing; `duplicate`
 * navigates straight into the fresh copy.
 */
export function QuoteRowActions({
  quoteId,
  status,
  locale,
}: {
  quoteId: string;
  status: "draft" | "archived";
  locale: "fa" | "en";
}) {
  const t = useTranslations("dashboard.quotesPage");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const op = String(formData.get("op"));
      if (op === "duplicate") {
        const result = await duplicateQuote(quoteId);
        if (!result.ok) return { error: t(`errors.${result.error}`) };
        router.push(locale === "fa" ? `/dashboard/quotes/${result.id}` : `/en/dashboard/quotes/${result.id}`);
        router.refresh();
        return null;
      }
      if (op === "archive" || op === "restore") {
        const result = await setQuoteStatus(quoteId, op === "archive" ? "archived" : "draft");
        if (!result.ok) return { error: t(`errors.${result.error}`) };
        router.refresh();
        return null;
      }
      return null;
    },
    null,
  );

  return (
    <div className="flex flex-wrap items-center gap-1">
      <form ref={formRef} action={formAction} className="contents">
        <Button type="submit" name="op" value="duplicate" variant="ghost" size="xs" disabled={isPending}>
          <CopyIcon className="size-3.5" aria-hidden />
          {t("actions.duplicate")}
        </Button>
        {status === "draft" ? (
          <Button type="submit" name="op" value="archive" variant="ghost" size="xs" disabled={isPending}>
            <ArchiveIcon className="size-3.5" aria-hidden />
            {t("actions.archive")}
          </Button>
        ) : (
          <Button type="submit" name="op" value="restore" variant="ghost" size="xs" disabled={isPending}>
            <ArchiveRestoreIcon className="size-3.5" aria-hidden />
            {t("actions.restore")}
          </Button>
        )}
      </form>
      <Link
        href={`/dashboard/quotes/${quoteId}`}
        className={buttonVariants({ variant: "ghost", size: "xs" })}
      >
        {t("actions.edit")}
      </Link>
      <Link
        href={`/print/quote/${quoteId}`}
        className={buttonVariants({ variant: "ghost", size: "xs" })}
      >
        <PrinterIcon className="size-3.5" aria-hidden />
        {t("actions.print")}
      </Link>
      {state?.error && (
        <span role="alert" className="text-xs text-destructive">
          {state.error}
        </span>
      )}
    </div>
  );
}
