import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/features/sunlit/pages/home.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_public/")({
  head: () => ({ meta: [{ title: `Beranda | ${siteConfig.name}` }] }),
  component: HomePage,
});
