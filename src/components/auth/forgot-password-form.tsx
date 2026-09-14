"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { forgotPassword } from "@/lib/auth/actions";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/shared/spinner";
import { FieldError } from "@/components/ui/field-error";
import { CheckEmailState } from "@/components/auth/check-email-state";

type FormValues = { email: string };

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [sent, setSent] = useState(false);

  const schema = useMemo(() => forgotPasswordSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await forgotPassword({ ...values, locale });
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return <CheckEmailState />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${serverError}`)}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <FieldError id="email-error">{errors.email.message}</FieldError>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Spinner />}
        {t("submitForgot")}
      </Button>
    </form>
  );
}
