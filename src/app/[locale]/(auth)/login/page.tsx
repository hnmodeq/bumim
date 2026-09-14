import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/session";
import type { AuthErrorKey } from "@/lib/auth/errors";
import type { AppLocale } from "@/i18n/routing";

const KNOWN_ERRORS: AuthErrorKey[] = ["verificationExpired", "sessionExpired"];

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  // Already signed in → straight to the dashboard.
  const user = await getCurrentUser();
  if (user) {
    redirect({ href: "/dashboard", locale: locale as AppLocale });
  }

  const { error } = await searchParams;
  const initialError = KNOWN_ERRORS.includes(error as AuthErrorKey)
    ? (error as AuthErrorKey)
    : undefined;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm initialError={initialError} />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1">
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          {t("forgotPassword")}
        </Link>
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t("register")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
