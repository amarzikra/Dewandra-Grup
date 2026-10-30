import { createFileRoute } from "@tanstack/react-router";
import ProfilKontakPage from "@/features/sunlit/pages/profil-kontak.page.jsx";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_public/profil-kontak")({
  head: () => ({ meta: [{ title: `Profil & Kontak | ${siteConfig.name}` }] }),
  component: ProfilKontakPage,
});
