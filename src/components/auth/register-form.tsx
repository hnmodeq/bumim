"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { register as registerAction } from "@/lib/auth/actions";
import { registerSchema } from "@/lib/validators/auth";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/auth/password-input";
import { FieldError } from "@/components/auth/field-error";
import { Spinner } from "@/components/shared/spinner";
import { CheckEmailState } from "@/components/auth/check-email-state";

type FormValues = {
  displayName: string;
  username: string;
  email: string;
  password: string;
};

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const schema = useMemo(() => registerSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await registerAction({ ...values, locale });
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      if (result.requiresConfirmation) {
        setNeedsConfirmation(true);
      } else {
        // Auto-confirmed (e.g. dev) — the session is already active.
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  if (needsConfirmation) {
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
        <Label htmlFor="displayName">{t("displayName")}</Label>
        <Input
          id="displayName"
          autoComplete="name"
          placeholder={t("displayNamePlaceholder")}
          aria-invalid={errors.displayName ? true : undefined}
          aria-describedby={errors.displayName ? "displayName-error" : undefined}
          {...register("displayName")}
        />
        {errors.displayName && (
          <FieldError id="displayName-error">
            {errors.displayName.message}
          </FieldError>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">{t("username")}</Label>
        <Input
          id="username"
          autoComplete="username"
          placeholder={t("usernamePlaceholder")}
          dir="ltr"
          aria-invalid={errors.username ? true : undefined}
          aria-describedby={errors.username ? "username-error" : undefined}
          {...register("username")}
        />
        {errors.username && (
          <FieldError id="username-error">{errors.username.message}</FieldError>
        )}
      </div>

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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder")}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <FieldError id="password-error">{errors.password.message}</FieldError>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Spinner />}
        {t("submitRegister")}
      </Button>
    </form>
  );
}
