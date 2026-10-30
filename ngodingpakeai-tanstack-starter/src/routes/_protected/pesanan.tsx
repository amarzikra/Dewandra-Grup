import { createFileRoute } from "@tanstack/react-router";
import PesananPage from "@/features/sunlit/pages/pesanan.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/pesanan")({
  head: () => ({ meta: [{ title: `Pesanan Online | ${siteConfig.name}` }] }),
  component: PesananPage,
});
