import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { getSessionFn } from "@/lib/session";
import globalsCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  // One session read per navigation, shared with every route as context.
  // Layouts decide what to do with it; API routes check on their own.
  beforeLoad: async () => ({ session: await getSessionFn() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${siteConfig.name} — ${siteConfig.tagline}` },
      { name: "description", content: siteConfig.description },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootDocument,
  component: Outlet,
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
        <script
          src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"
          defer
        ></script>
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-lg px-6 py-24"
      style={{ minHeight: "100vh" }}
    >
      <p className="mb-3 font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-serif text-3xl font-normal tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="my-4 text-muted-foreground">
        Tautan ini tidak tersedia di Dewandra Grup.
      </p>
      <Button asChild>
        <Link to="/">Kembali ke beranda</Link>
      </Button>
    </main>
  );
}

function ErrorPage() {
  const router = useRouter();
  return (
    <main
      id="main-content"
      className="mx-auto max-w-lg px-6 py-24"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="font-serif text-2xl font-normal">Terjadi kesalahan</h1>
      <p className="my-4 leading-7 text-muted-foreground">
        Coba muat halaman ini lagi. Jika masalah berlanjut, periksa terminal
        aplikasi untuk detailnya.
      </p>
      <Button onClick={() => router.invalidate()}>Coba lagi</Button>
    </main>
  );
}
