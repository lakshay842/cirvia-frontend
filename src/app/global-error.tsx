"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <div style={{ padding: "1rem", textAlign: "center", maxWidth: 420 }} role="alert">
          <AlertTriangle
            style={{ width: 48, height: 48, color: "#ef4444", margin: "0 auto" }}
            aria-hidden
          />
          <h1 style={{ marginTop: 16, fontSize: "1.5rem", fontWeight: 700 }}>Critical error</h1>
          <p style={{ marginTop: 8, color: "#94a3b8", lineHeight: 1.5 }}>
            The application encountered a critical error. Please try again or return home.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
              Ref: {error.digest}
            </p>
          )}
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 18,
                border: "none",
                background: "linear-gradient(135deg, #5b5bd6, #8b5cf6)",
                color: "#fff",
                padding: "12px 24px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} aria-hidden />
              Try again
            </button>
            <Link
              href={ROUTES.home}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.3)",
                color: "#f8fafc",
                padding: "12px 24px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
