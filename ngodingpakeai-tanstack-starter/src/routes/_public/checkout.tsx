import { createFileRoute } from "@tanstack/react-router";
import CheckoutPage from "@/features/sunlit/pages/checkout.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_public/checkout")({
  head: () => ({ meta: [{ title: `Checkout | ${siteConfig.name}` }] }),
  component: CheckoutPage,
});
