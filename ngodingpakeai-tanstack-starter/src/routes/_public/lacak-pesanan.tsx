import { createFileRoute } from "@tanstack/react-router";
import LacakPesananPage from "@/features/sunlit/pages/lacak-pesanan.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_public/lacak-pesanan")({
  validateSearch: (search: Record<string, unknown>): { kode?: string } => ({
    kode: typeof search.kode === "string" ? search.kode : undefined,
  }),
  head: () => ({ meta: [{ title: `Lacak Pesanan | ${siteConfig.name}` }] }),
  component: LacakPesananRoute,
});

function LacakPesananRoute() {
  const { kode } = Route.useSearch();
  return <LacakPesananPage initialCode={kode} />;
}
