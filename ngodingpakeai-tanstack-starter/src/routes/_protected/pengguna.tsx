import { createFileRoute } from "@tanstack/react-router";
import PenggunaPage from "@/features/sunlit/pages/pengguna.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/pengguna")({
  head: () => ({ meta: [{ title: `Pengguna & Akses | ${siteConfig.name}` }] }),
  component: PenggunaPage,
});
