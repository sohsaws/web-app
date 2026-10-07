"use client";

import { type CSSProperties, type ReactElement, useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

const COLOR_BACKGROUND = "#0a0a0a";
const COLOR_FOREGROUND = "#d4d4d4";
const COLOR_MUTED = "#a3a3a3";
const COLOR_FAINT = "#525252";
const COLOR_ACCENT = "#c87a6d";
const COLOR_BUTTON = "#ece8e1";
const COLOR_BORDER = "rgb(255 255 255 / 0.1)";

const SANS_FONT = "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";

const styles = {
  body: {
    margin: 0,
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 1rem",
    boxSizing: "border-box",
    background: `radial-gradient(ellipse at top, #1a1a1a, ${COLOR_BACKGROUND} 70%)`,
    color: COLOR_FOREGROUND,
    fontFamily: SANS_FONT,
    textAlign: "center",
    WebkitFontSmoothing: "antialiased",
  },
  main: {
    maxWidth: "32rem",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    margin: 0,
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: COLOR_MUTED,
  },
  eyebrowLine: {
    display: "inline-block",
    width: "1.5rem",
    height: "1px",
    background: COLOR_ACCENT,
  },
  title: {
    margin: "1.5rem 0 0",
    fontFamily: SERIF_FONT,
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },
  titleMuted: {
    display: "block",
    color: COLOR_MUTED,
  },
  text: {
    margin: "1.5rem auto 0",
    fontSize: "1rem",
    lineHeight: 1.6,
    fontWeight: 300,
    color: COLOR_FOREGROUND,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.75rem",
    marginTop: "2.5rem",
  },
  primaryButton: {
    minHeight: "3rem",
    padding: "0 1.75rem",
    border: "none",
    borderRadius: "9999px",
    background: COLOR_BUTTON,
    color: "#000000",
    fontFamily: SANS_FONT,
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "3rem",
    padding: "0 1.75rem",
    boxSizing: "border-box",
    border: `1px solid ${COLOR_BORDER}`,
    borderRadius: "9999px",
    color: COLOR_FOREGROUND,
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecoration: "none",
  },
  reference: {
    marginTop: "2rem",
    fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: "0.75rem",
    color: COLOR_FAINT,
  },
} satisfies Record<string, CSSProperties>;

export default function GlobalError({
  error,
  retry,
}: GlobalErrorProps): ReactElement {
  useEffect(() => {
    // No error reporting service yet, so the browser console is the only log.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={styles.body}>
        <title>Something went wrong · Swiipy</title>
        <main style={styles.main}>
          <p style={styles.eyebrow}>
            <span aria-hidden="true" style={styles.eyebrowLine} />
            Something went wrong
          </p>

          <h1 style={styles.title}>
            Swiipy hit a snag.
            <span style={styles.titleMuted}>We&apos;re on it.</span>
          </h1>

          <p style={styles.text}>
            The app could not load. Try again, or reload the page in a moment.
          </p>

          <div style={styles.actions}>
            <button type="button" onClick={retry} style={styles.primaryButton}>
              Try again
            </button>
            {/* A plain link on purpose: a full page load rebuilds the broken
                root layout instead of reusing it. */}
            <a href="/" style={styles.secondaryButton}>
              Back to home
            </a>
          </div>

          {error.digest ? (
            <p style={styles.reference}>Reference: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
