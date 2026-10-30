import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/features/sunlit/auth/sign-in-form";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_auth/sign-in")({
  head: () => ({ meta: [{ title: `Masuk | ${siteConfig.name}` }] }),
  component: SignInForm,
});
