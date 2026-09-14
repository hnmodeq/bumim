/**
 * Global 404 for requests that are not matched by the next-intl middleware
 * (i.e. no locale can be associated, e.g. /unknown.txt).
 *
 * Renders its own <html> because it must work outside the [locale] layout.
 * Bilingual (Persian-first) since no locale is available at this level.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>صفحه پیدا نشد</h1>
          <p style={{ color: "#666", marginBottom: 4 }}>
            صفحه‌ای که دنبال آن هستید وجود ندارد یا منتقل شده است.
          </p>
          <p style={{ color: "#999", marginBottom: 16, fontSize: 14 }}>
            Page not found
          </p>
          {/* Plain <a> is intentional: this file renders its own <html> outside
              the app router context, where next/link <Link> cannot hydrate. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#111" }}>
            بازگشت به خانه · Back home
          </a>
        </div>
      </body>
    </html>
  );
}
