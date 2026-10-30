import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicShell } from "@/components/sunlit/public-shell";
import { CartProvider } from "@/features/sunlit/cart";

export const Route = createFileRoute("/_public")({
  beforeLoad: ({ context }) => ({ session: context.session }),
  component: PublicLayout,
});

function PublicLayout() {
  const { session } = Route.useRouteContext();
  return (
    <CartProvider>
      <PublicShell signedIn={Boolean(session)}>
        <Outlet />
      </PublicShell>
    </CartProvider>
  );
}
