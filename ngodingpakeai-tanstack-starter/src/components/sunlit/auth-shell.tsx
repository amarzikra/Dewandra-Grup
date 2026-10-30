import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CircleCheck } from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="auth-shell-root">
      <a className="auth-shell-skip" href="#auth-main">
        Lewati ke konten
      </a>

      <header className="auth-shell-topbar">
        <div className="auth-shell-topbar-inner">
          <Link
            className="auth-shell-brand"
            to="/"
            aria-label="Dewandra Grup — Beranda"
          >
            <span className="auth-shell-brand-mark" aria-hidden="true">
              DG
            </span>
            <span className="auth-shell-brand-name">Dewandra Grup</span>
          </Link>
          <Link
            className="auth-shell-back"
            to="/"
            aria-label="Kembali ke beranda"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="auth-shell-back-label">Kembali ke beranda</span>
          </Link>
        </div>
      </header>

      <main className="auth-shell-main" id="auth-main">
        <div className="auth-shell-card">
          <aside className="auth-shell-aside">
            <p className="auth-shell-eyebrow">Ruang pemilik</p>
            <p className="auth-shell-thesis">Kelola lima toko dari satu tempat.</p>
            <p className="auth-shell-aside-body">
              Pantau penjualan, pembelian, stok, dan riwayat transaksi dalam
              satu ruang kerja yang tenang dan teratur.
            </p>
            <ul className="auth-shell-benefits">
              <li className="auth-shell-benefit">
                <CircleCheck
                  className="auth-shell-benefit-icon"
                  size={18}
                  aria-hidden="true"
                />
                Ringkasan seluruh toko dalam satu layar
              </li>
              <li className="auth-shell-benefit">
                <CircleCheck
                  className="auth-shell-benefit-icon"
                  size={18}
                  aria-hidden="true"
                />
                Stok dan pembelian yang saling terhubung
              </li>
              <li className="auth-shell-benefit">
                <CircleCheck
                  className="auth-shell-benefit-icon"
                  size={18}
                  aria-hidden="true"
                />
                Akses pemilik dan kasir yang terpisah
              </li>
            </ul>
            <p className="auth-shell-aside-note">Dewandra Grup · Ruang pemilik</p>
          </aside>

          <section className="auth-shell-form">{children}</section>
        </div>
      </main>
    </div>
  );
}
