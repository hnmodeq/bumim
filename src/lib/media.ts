/**
 * Media helpers for portfolio items.
 *
 * The platform does NOT host video — external video URLs/embeds only. This
 * module normalizes well-known watch URLs into embeddable iframe URLs (for
 * YouTube and Vimeo) and formats project dates per locale.
 */

/** Normalize a YouTube watch/short URL into a privacy-enhanced embed URL. */
function youtubeEmbed(url: URL): string | null {
  let id: string | null = null;
  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0] || null;
  } else if (
    url.hostname.endsWith("youtube.com") &&
    url.pathname === "/watch" &&
    url.searchParams.has("v")
  ) {
    id = url.searchParams.get("v");
  }
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Normalize a Vimeo URL into a player embed URL. */
function vimeoEmbed(url: URL): string | null {
  if (!url.hostname.endsWith("vimeo.com")) return null;
  const id = url.pathname.split("/").filter(Boolean).pop();
  if (!id || !/^\d+$/.test(id)) return null;
  return `https://player.vimeo.com/video/${id}`;
}

/** Parse a string as an http(s) URL, or null. */
function parseHttpUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  return url.protocol === "https:" || url.protocol === "http:" ? url : null;
}

/**
 * Sanitize a user-supplied URL for rendering into an `href`.
 *
 * Returns the URL only when it is a parseable http(s) URL; everything else
 * (`javascript:`, `data:`, `vbscript:`, malformed input) becomes `null` so the
 * caller renders no link at all. Form validation already rejects these, but the
 * render layer must not trust the database — a row could arrive via an admin
 * import, a seed, or a future bug.
 */
export function safeExternalUrl(raw: string | null | undefined): string | null {
  return parseHttpUrl(raw)?.toString() ?? null;
}

/**
 * Return an iframe-safe embed URL for a stored external video URL, or `null`
 * when the URL cannot be safely embedded (unknown host, e.g. Aparat — in that
 * case the caller should render an outbound link instead).
 */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  const url = parseHttpUrl(raw);
  if (!url) return null;
  return youtubeEmbed(url) ?? vimeoEmbed(url) ?? null;
}

/**
 * Format an ISO date (`YYYY-MM-DD`) for display. `fa` renders in the Persian
 * (Jalali) calendar via Intl; `en` renders Gregorian.
 */
export function formatProjectDate(
  iso: string | null | undefined,
  locale: "fa" | "en",
): string | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return iso;
  }
}
