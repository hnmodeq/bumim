"use client";

import { useActionState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { setSubmissionStatus } from "@/lib/rate/actions";

type State = { error: string } | null;

/**
 * Approve/reject controls for one pending submission.
 *
 * Client component because the moderator needs feedback: `setSubmissionStatus`
 * returns a result object rather than throwing, so a plain `<form action>` would
 * swallow a failure and leave the row sitting in the queue with no explanation.
 * `useActionState` surfaces the error inline and disables the buttons while the
 * request is in flight (which also stops double-submitting a decision).
 *
 * On success the action revalidates the layout, so the server component re-renders
 * and the row moves from the queue into the reviewed list.
 */
export function ModerateActions({ submissionId }: { submissionId: string }) {
  const t = useTranslations("admin.ratesPage");

  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const status = formData.get("status") === "rejected" ? "rejected" : "approved";
      const result = await setSubmissionStatus(submissionId, status);
      if (result.ok) return null;
      const key =
        result.error === "forbidden"
          ? "errorForbidden"
          : result.error === "notPending"
            ? "errorNotPending"
            : "errorUpdateFailed";
      return { error: t(key) };
    },
    null,
  );

  return (
    <div className="mt-4">
      <form action={formAction} className="flex flex-wrap gap-2">
        <Button type="submit" name="status" value="approved" size="sm" disabled={isPending}>
          <CheckIcon className="size-4" aria-hidden />
          {t("approve")}
        </Button>
        <Button
          type="submit"
          name="status"
          value="rejected"
          size="sm"
          variant="outline"
          disabled={isPending}
        >
          <XIcon className="size-4" aria-hidden />
          {t("reject")}
        </Button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {state.error}
        </p>
      )}
    </div>
  );
}
