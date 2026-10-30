import { createFileRoute } from "@tanstack/react-router";
import KasirPage from "@/features/sunlit/pages/kasir.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/kasir")({
  head: () => ({ meta: [{ title: `Kasir | ${siteConfig.name}` }] }),
  component: KasirPage,
});
