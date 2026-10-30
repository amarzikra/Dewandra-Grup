import { createFileRoute } from "@tanstack/react-router";
import StokPage from "@/features/sunlit/pages/stok.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/stok")({
  head: () => ({ meta: [{ title: `Stok & Pembelian | ${siteConfig.name}` }] }),
  component: StokPage,
});
