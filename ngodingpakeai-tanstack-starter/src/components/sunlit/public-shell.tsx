import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, UserRound } from "lucide-react";
import { companyProfile } from "@/config/dewandra";
import { useCart } from "@/features/sunlit/cart";

type PublicShellProps = {
  children: ReactNode;
  signedIn: boolean;
};

const PUBLIC_LINKS = [
  { key: "home", label: "Beranda", to: "/" },
  { key: "katalog", label: "Katalog", to: "/katalog" },
  { key: "profil", label: "Profil & kontak", to: "/profil-kontak" },
] as const;

const SERVICES = [
  "Rezeki Tani",
  "Central Jaya Bangunan",
  "Dewi Foto Copy",
  "Gemilang Elektronik",
  "Kasandra Furniture",
];

function activeKeyFor(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/katalog") return "katalog";
  if (pathname === "/profil-kontak") return "profil";
  return "";
}

export function PublicShell({ children, signedIn }: PublicShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const activeKey = activeKeyFor(pathname);
  const { count } = useCart();
  const accountHref = signedIn ? "/dashboard" : "/sign-in";
  const accountLabel = signedIn ? "Dashboard" : "Masuk";

  return (
    <div className="public-shell-root">
      <a className="public-shell-skip" href="#public-main">
        Lewati ke konten
      </a>

      <header className="public-shell-header">
        <div className="public-shell-header-inner">
          <Link className="public-shell-brand" to="/" aria-label="Dewandra Grup — Beranda">
            <span className="public-shell-brand-mark" aria-hidden="true">
              DG
            </span>
            <span className="public-shell-brand-copy">
              <span className="public-shell-brand-name">Dewandra Grup</span>
              <span className="public-shell-brand-sub">Lima toko, satu tempat</span>
            </span>
          </Link>

          <nav className="public-shell-nav" aria-label="Navigasi publik">
            {PUBLIC_LINKS.map((item) => (
              <Link
                className="public-shell-nav-link"
                key={item.key}
                to={item.to}
                aria-current={activeKey === item.key ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="public-shell-actions">
            <Link className="public-shell-cart" to="/checkout">
              <ShoppingBag size={16} aria-hidden="true" />
              Keranjang
              {count > 0 ? (
                <span className="public-shell-cart-count">{count}</span>
              ) : null}
            </Link>
            <Link className="public-shell-login" to={accountHref}>
              <UserRound size={16} aria-hidden="true" />
              {accountLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="public-shell-main" id="public-main">
        {children}
      </main>

      <footer className="public-shell-footer">
        <div className="public-shell-footer-inner">
          <div className="public-shell-footer-grid">
            <div>
              <Link className="public-shell-brand" to="/">
                <span className="public-shell-brand-mark" aria-hidden="true">
                  DG
                </span>
                <span className="public-shell-brand-copy">
                  <span className="public-shell-brand-name">Dewandra Grup</span>
                  <span className="public-shell-brand-sub">Lima toko, satu tempat</span>
                </span>
              </Link>
              <p className="public-shell-footer-desc">
                {companyProfile.description}
              </p>
            </div>

            <div>
              <p className="public-shell-footer-title">Layanan</p>
              <ul className="public-shell-footer-list">
                {SERVICES.map((service) => (
                  <li key={service}>
                    <Link className="public-shell-footer-link" to="/katalog">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="public-shell-footer-title">Jelajahi</p>
              <ul className="public-shell-footer-list">
                {PUBLIC_LINKS.map((item) => (
                  <li key={item.key}>
                    <Link className="public-shell-footer-link" to={item.to}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className="public-shell-footer-link" to="/lacak-pesanan">
                    Lacak pesanan
                  </Link>
                </li>
                <li>
                  <Link className="public-shell-footer-link" to={accountHref}>
                    {accountLabel}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="public-shell-footer-title">Kontak</p>
              <ul className="public-shell-footer-list">
                <li>
                  <Link className="public-shell-footer-link" to="/profil-kontak">
                    Hubungi admin
                  </Link>
                </li>
                <li>
                  <a
                    className="public-shell-footer-link"
                    href={companyProfile.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    className="public-shell-footer-link"
                    href={companyProfile.phoneHref}
                  >
                    {companyProfile.phoneDisplay}
                  </a>
                </li>
                <li>
                  <Link className="public-shell-footer-link" to="/profil-kontak">
                    Lokasi & jam buka
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="public-shell-footer-bottom">
            <span>© 2026 Dewandra Grup</span>
            <span>Buka {companyProfile.openingHours}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
