import { companyProfile, storeLogos } from "@/config/dewandra";

const STORES = [
  {
    id: "pupuk",
    name: "Rezeki Tani",
    category: "Pupuk & pertanian",
    icon: "lucide:sprout",
    description: "Pupuk dan kebutuhan pertanian untuk musim tanam.",
    items: "Urea · NPK · Kapur pertanian",
  },
  {
    id: "bangunan",
    name: "Central Jaya Bangunan",
    category: "Material bangunan",
    icon: "lucide:hammer",
    description: "Material bangunan untuk renovasi dan proyek.",
    items: "Semen · Pasir · Cat",
  },
  {
    id: "atk",
    name: "Dewi Foto Copy",
    category: "Alat tulis kantor",
    icon: "lucide:pencil",
    description: "Alat tulis dan perlengkapan kantor harian.",
    items: "Kertas · Pulpen · Map",
  },
  {
    id: "listrik",
    name: "Gemilang Elektronik",
    category: "Peralatan listrik",
    icon: "lucide:plug",
    description: "Peralatan listrik dan kebutuhan instalasi.",
    items: "Lampu · Kabel · Sakelar",
  },
  {
    id: "furniture",
    name: "Kasandra Furniture",
    category: "Mebel & interior",
    icon: "lucide:sofa",
    description: "Mebel dan interior untuk rumah dan usaha.",
    items: "Kursi · Meja · Lemari",
  },
];

const PROFILE_POINTS = [
  {
    icon: "lucide:store",
    title: "Etalase lengkap",
    description: "Layanan, katalog, dan profil perusahaan dalam satu tempat.",
  },
  {
    icon: "lucide:message-circle",
    title: "Kontak langsung",
    description: "Hubungi admin lewat formulir kontak atau WhatsApp.",
  },
  {
    icon: "lucide:layout-dashboard",
    title: "Operasional terpusat",
    description: "Pemilik memantau penjualan, pembelian, dan stok lima toko.",
  },
];

export default function Page() {
  return (
    <div className="home-root">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">
            <span className="home-eyebrow-dot" aria-hidden="true"></span>
            Dewandra Grup · Lima unit toko
          </p>
          <h1 className="home-title">{companyProfile.tagline}</h1>
          <p className="home-lede">
            Pupuk, bangunan, ATK, listrik, dan furniture dalam satu etalase. Temukan kebutuhan
            toko Anda, lalu hubungi admin lewat satu pintu.
          </p>
          <div className="home-actions">
            <a className="home-primary" href="/katalog">
              Jelajahi katalog
              <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
            </a>
            <a
              className="home-secondary"
              href={companyProfile.whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Hubungi admin
            </a>
          </div>
          <p className="home-note">Katalog publik · Profil perusahaan · Kontak langsung</p>
        </div>

        <div className="home-proof">
          <div className="home-proof-head">
            <p className="home-proof-label">Lima layanan</p>
            <span className="home-proof-chip">Satu grup</span>
          </div>

          {STORES.map((store, index) => (
            <div className="home-proof-row" key={store.id}>
              <span className="home-proof-number">0{index + 1}</span>
              <span className="home-proof-icon" aria-hidden="true">
                <img
                  className="store-logo"
                  src={storeLogos[store.id]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="home-proof-copy">
                <span className="home-proof-name">{store.name}</span>
                <span className="home-proof-category">{store.category}</span>
              </span>
              <a
                className="home-proof-link"
                href="/katalog"
                aria-label={"Lihat katalog " + store.name}
              >
                <span aria-hidden="true" style={{ fontSize: "15px", lineHeight: 1 }}>↗</span>
              </a>
            </div>
          ))}

          <div className="home-proof-foot">
            <span>Lima toko, satu admin</span>
            <a className="home-proof-foot-link" href="/profil-kontak">
              Lihat kontak
              <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            </a>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <div>
            <p className="home-kicker">Layanan</p>
            <h2 className="home-section-title">Kebutuhan harian, dari lima toko.</h2>
          </div>
          <p className="home-section-body">
            Setiap toko punya fokusnya sendiri. Pilih kategori yang Anda butuhkan, lalu lihat
            barangnya di katalog.
          </p>
        </div>

        <div className="home-service-panel">
          {STORES.map((store, index) => (
            <div className="home-service-row" key={store.id}>
              <span className="home-service-number">0{index + 1}</span>
              <span className="home-service-icon" aria-hidden="true">
                <img
                  className="store-logo"
                  src={storeLogos[store.id]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <div className="home-service-copy">
                <span className="home-service-name">{store.name}</span>
                <p className="home-service-description">{store.description}</p>
                <p className="home-service-items">{store.items}</p>
              </div>
              <a className="home-service-link" href="/katalog">
                Lihat katalog
                <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-profile">
          <div className="home-profile-copy">
            <p className="home-kicker">Profil singkat</p>
            <h2 className="home-profile-title">Satu pemilik, lima toko, satu standar layanan.</h2>
            <p className="home-profile-body">
              {companyProfile.description}
            </p>
            <p className="home-profile-body">
              Berdiri sejak {companyProfile.founded}. Pelanggan dapat melihat layanan dan
              katalog, sementara pemilik memantau penjualan, pembelian, dan stok dari satu
              dashboard.
            </p>
            <a className="home-profile-link" href="/profil-kontak">
              Kenali Dewandra Grup
              <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            </a>
          </div>

          <ul className="home-points">
            {PROFILE_POINTS.map((point) => (
              <li className="home-point" key={point.title}>
                <span className="home-point-icon" aria-hidden="true">
                  <iconify-icon icon={point.icon} style={{ fontSize: "18px" }}></iconify-icon>
                </span>
                <span className="home-point-copy">
                  <span className="home-point-title">{point.title}</span>
                  <span className="home-point-description">{point.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="home-cta">
          <div className="home-cta-copy">
            <h2 className="home-cta-title">Butuh bantuan memilih barang?</h2>
            <p className="home-cta-body">
              Hubungi admin Dewandra Grup untuk ketersediaan barang, harga, dan informasi toko.
              Klik tombol WhatsApp untuk langsung terhubung, atau buka halaman Profil & kontak.
            </p>
            <p className="home-cta-note">
              <iconify-icon icon="lucide:clock" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
              Buka {companyProfile.openingHours} · {companyProfile.phoneDisplay}
            </p>
          </div>
          <div className="home-cta-actions">
            <a
              className="home-primary"
              href={companyProfile.whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Hubungi admin
              <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
            </a>
            <a className="home-secondary" href="/katalog">
              Lihat katalog
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
