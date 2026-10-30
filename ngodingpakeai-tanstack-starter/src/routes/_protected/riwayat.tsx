import { createFileRoute } from "@tanstack/react-router";
import RiwayatPage from "@/features/sunlit/pages/riwayat.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/riwayat")({
  head: () => ({ meta: [{ title: `Riwayat Transaksi | ${siteConfig.name}` }] }),
  component: RiwayatPage,
});
