import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { AppShell } from "@/components/sunlit/app-shell";
import { authBypassEnabled, demoSession } from "@/lib/dev-session";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Pemilik",
  "/katalog-pemilik": "Katalog",
  "/kasir": "Kasir Transaksi",
  "/pesanan": "Pesanan Online",
  "/riwayat": "Riwayat Transaksi",
  "/stok": "Stok & Pembelian",
  "/pengguna": "Pengguna & Akses",
  "/admin": "Admin",
};

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    const session = context.session ?? (authBypassEnabled ? demoSession : null);
    if (!session) throw redirect({ to: "/sign-in" });
    return { session };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { session } = Route.useRouteContext();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const title = PAGE_TITLES[pathname] ?? "Ruang pemilik";

  return (
    <AppShell title={title} user={session.user}>
      <Outlet />
    </AppShell>
  );
}
