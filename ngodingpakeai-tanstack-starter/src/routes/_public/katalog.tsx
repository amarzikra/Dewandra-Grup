import { createFileRoute } from "@tanstack/react-router";
import KatalogPage from "@/features/sunlit/pages/katalog.page.jsx";
import { siteConfig } from "@/config/site";
import { getCatalogFn } from "@/lib/dewandra";

export const Route = createFileRoute("/_public/katalog")({
  loader: () => getCatalogFn(),
  head: () => ({ meta: [{ title: `Katalog | ${siteConfig.name}` }] }),
  component: KatalogRoute,
});

function KatalogRoute() {
  const catalog = Route.useLoaderData();
  return <KatalogPage catalog={catalog} />;
}
