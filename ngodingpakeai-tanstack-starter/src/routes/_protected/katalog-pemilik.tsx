import { createFileRoute } from "@tanstack/react-router";
import KatalogPage from "@/features/sunlit/pages/katalog.page.jsx";
import { siteConfig } from "@/config/site";
import { getCatalogFn } from "@/lib/dewandra";
import { CartProvider } from "@/features/sunlit/cart";

export const Route = createFileRoute("/_protected/katalog-pemilik")({
  loader: () => getCatalogFn(),
  head: () => ({ meta: [{ title: `Katalog | ${siteConfig.name}` }] }),
  component: KatalogPemilikPage,
});

function KatalogPemilikPage() {
  const catalog = Route.useLoaderData();
  return (
    <CartProvider>
      <KatalogPage mode="owner" catalog={catalog} />
    </CartProvider>
  );
}
