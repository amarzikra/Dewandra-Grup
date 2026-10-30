import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/features/sunlit/pages/dashboard.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_protected/dashboard")({
  head: () => ({ meta: [{ title: `Dashboard Pemilik | ${siteConfig.name}` }] }),
  component: DashboardPage,
});
