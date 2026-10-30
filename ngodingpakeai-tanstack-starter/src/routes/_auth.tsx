import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/sunlit/auth-shell";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.session) throw redirect({ to: siteConfig.homePath });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
