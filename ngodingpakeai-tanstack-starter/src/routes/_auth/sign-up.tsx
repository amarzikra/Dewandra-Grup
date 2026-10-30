import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/features/sunlit/auth/sign-up-form";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_auth/sign-up")({
  head: () => ({ meta: [{ title: `Daftar | ${siteConfig.name}` }] }),
  component: SignUpForm,
});
