import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/store/Providers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "3D Bharat | Deal Intelligence Platform",
  description:
    "A frontend-only investor & corporate dashboard for exploring, scoring, and tracking private market deals across Bharat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: "var(--font-sans)" }}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
