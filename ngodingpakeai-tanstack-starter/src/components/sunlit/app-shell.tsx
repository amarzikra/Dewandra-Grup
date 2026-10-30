import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Link,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AppShellProps = {
  children: ReactNode;
  title: string;
  user: {
    name?: string | null;
    email?: string | null;
  };
};

const NAV_SECTIONS = [
  {
    label: "Utama",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        key: "kasir",
        label: "Kasir",
        to: "/kasir",
        icon: ShoppingCart,
      },
      {
        key: "pesanan",
        label: "Pesanan online",
        to: "/pesanan",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Operasional",
    items: [
      {
        key: "katalog",
        label: "Katalog",
        to: "/katalog-pemilik",
        icon: BookOpen,
      },
      {
        key: "riwayat",
        label: "Riwayat transaksi",
        to: "/riwayat",
        icon: History,
      },
      {
        key: "stok",
        label: "Stok & pembelian",
        to: "/stok",
        icon: Package,
      },
      {
        key: "pengguna",
        label: "Pengguna & akses",
        to: "/pengguna",
        icon: Users,
      },
    ],
  },
] as const;

function activeKeyFor(pathname: string) {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/katalog-pemilik") return "katalog";
  if (pathname === "/kasir") return "kasir";
  if (pathname === "/pesanan") return "pesanan";
  if (pathname === "/riwayat") return "riwayat";
  if (pathname === "/stok") return "stok";
  if (pathname === "/pengguna") return "pengguna";
  return "";
}

export function AppShell({ children, title, user }: AppShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigate = useNavigate();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const activeKey = activeKeyFor(pathname);
  const navRef = useRef<HTMLElement>(null);

  const displayName = user.name?.trim() || "Pemilik";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const active = navRef.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  async function signOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign out failed");
      await router.invalidate();
      await navigate({ to: "/sign-in", replace: true });
    } catch {
      setError("Gagal keluar. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="app-shell-root">
      <a className="app-shell-skip" href="#main-content">
        Lewati ke konten
      </a>

      <aside className="app-shell-rail">
        <Link className="app-shell-brand" to="/" aria-label="Dewandra Grup — Beranda">
          <span className="app-shell-brand-mark" aria-hidden="true">
            DG
          </span>
          <span className="app-shell-brand-copy">
            <span className="app-shell-brand-name">Dewandra Grup</span>
            <span className="app-shell-brand-sub">Ruang pemilik</span>
          </span>
        </Link>

        <nav
          className="app-shell-nav"
          aria-label="Navigasi utama"
          ref={navRef}
        >
          {NAV_SECTIONS.map((section) => (
            <div className="app-shell-nav-section" key={section.label}>
              <span className="app-shell-nav-label">{section.label}</span>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    className="app-shell-nav-link"
                    key={item.key}
                    to={item.to}
                    aria-current={
                      activeKey === item.key ? "page" : undefined
                    }
                  >
                    <Icon
                      className="app-shell-nav-icon"
                      size={18}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="app-shell-user">
          <span className="app-shell-user-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="app-shell-user-copy">
            <span className="app-shell-user-name">{displayName}</span>
            <span className="app-shell-user-sub">Ruang pemilik</span>
          </span>
          <button
            className="app-shell-logout"
            type="button"
            aria-label="Keluar"
            title="Keluar"
            disabled={pending}
            onClick={signOut}
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
        {error ? (
          <p className="app-shell-user-error" role="alert">
            {error}
          </p>
        ) : null}
      </aside>

      <div className="app-shell-main">
        <div className="app-shell-topbar">
          <div className="app-shell-topbar-inner">
            <div className="app-shell-breadcrumb">
              <span>Dewandra Grup</span>
              <span aria-hidden="true">/</span>
              <span className="app-shell-breadcrumb-current">{title}</span>
            </div>
          </div>
        </div>

        <main className="app-shell-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
