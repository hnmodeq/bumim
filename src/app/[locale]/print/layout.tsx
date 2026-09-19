/**
 * Chrome-free layout for printable documents: no header, no sidebar — only the
 * document plus a screen-only toolbar. Print styles live in globals.css.
 */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-muted/30">{children}</div>;
}
