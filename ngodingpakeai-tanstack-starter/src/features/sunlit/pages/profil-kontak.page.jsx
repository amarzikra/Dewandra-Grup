import { useRef, useState } from "react";
import { companyProfile, storeLogos } from "@/config/dewandra";

const STORES = [
  { id: "pupuk", name: "Rezeki Tani", category: "Pupuk & pertanian", icon: "lucide:sprout" },
  { id: "bangunan", name: "Central Jaya Bangunan", category: "Material bangunan", icon: "lucide:hammer" },
  { id: "atk", name: "Dewi Foto Copy", category: "Alat tulis kantor", icon: "lucide:pencil" },
  { id: "listrik", name: "Gemilang Elektronik", category: "Peralatan listrik", icon: "lucide:plug" },
  { id: "furniture", name: "Kasandra Furniture", category: "Mebel & interior", icon: "lucide:sofa" },
];

const FACTS = [
  { value: "5", label: "Unit toko" },
  { value: "5", label: "Kategori layanan" },
  { value: "2025", label: "Tahun berdiri" },
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Page() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const formSectionRef = useRef(null);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  }

  function goToForm() {
    if (nameRef.current) {
      nameRef.current.focus({ preventScroll: true });
    }
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = "Nama wajib diisi.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!form.message.trim()) {
      nextErrors.message = "Pesan wajib diisi.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (nextErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (nextErrors.message && messageRef.current) {
        messageRef.current.focus();
      }
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  function resetForm() {
    setSubmitted(false);
    setErrors({});
    window.setTimeout(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }, 0);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="profile-root">
      <header className="profile-header">
        <div className="profile-header-copy">
          <p className="profile-kicker">Profil & kontak</p>
          <h1 className="profile-title">Kenal Dewandra Grup.</h1>
          <p className="profile-lede">
            {companyProfile.tagline}
          </p>
          <div className="profile-actions">
            <button type="button" className="profile-primary" onClick={goToForm}>
              Tulis pesan
              <iconify-icon icon="lucide:arrow-down" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
            </button>
            <a className="profile-secondary" href="/katalog">
              Lihat katalog
            </a>
          </div>
        </div>
        <span className="profile-hero-chip">
          <iconify-icon icon="lucide:store" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
          5 toko · 1 grup
        </span>
      </header>

      <section className="profile-section">
        <div className="profile-story-grid">
          <div className="profile-story-copy">
            <p className="profile-kicker">Tentang kami</p>
            <h2 className="profile-section-title">Satu pemilik, lima toko, satu standar layanan.</h2>
            <p className="profile-story-body">
              {companyProfile.description}
            </p>
            <p className="profile-story-body">
              Pelanggan dapat melihat layanan dan katalog; pemilik memantau penjualan,
              pembelian, dan stok dari satu dashboard.
            </p>
            <p className="profile-legal-note">
              Berdiri sejak {companyProfile.founded}.
            </p>
          </div>

          <div className="profile-facts" aria-label="Ringkasan Dewandra Grup">
            {FACTS.map((fact) => (
              <div className="profile-fact" key={fact.label}>
                <span className="profile-fact-value">{fact.value}</span>
                <span className="profile-fact-label">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <div>
            <p className="profile-kicker">Lima toko</p>
            <h2 className="profile-section-title">Lima toko, lima layanan.</h2>
          </div>
          <p className="profile-section-body">
            Setiap toko melayani kebutuhan yang berbeda. Lihat barang dan status stok di katalog.
          </p>
        </div>

        <div className="profile-stores-panel">
          {STORES.map((store) => (
            <div className="profile-store-row" key={store.id}>
              <span className="profile-store-icon" aria-hidden="true">
                <img
                  className="store-logo"
                  src={storeLogos[store.id]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
                <span className="profile-store-copy">
                  <span className="profile-store-name">{store.name}</span>
                  <span className="profile-store-category">
                    {store.category} · Buka {companyProfile.openingHours}
                  </span>
                </span>
              <a className="profile-store-link" href="/katalog">
                Lihat katalog
                <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <div>
            <p className="profile-kicker">Kunjungi</p>
            <h2 className="profile-section-title">Lokasi & jam buka.</h2>
          </div>
          <p className="profile-section-body">
            Lokasi Dewi Foto Copy sudah tersedia di Google Maps. Semua toko buka{" "}
            {companyProfile.openingHours}.
          </p>
        </div>

        <div className="profile-location-panel">
          <div className="profile-location-copy">
            <h3 className="profile-location-title">
              <iconify-icon icon="lucide:map-pin" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              Lima toko Dewandra Grup
            </h3>
            <p className="profile-location-body">
              Buka lokasi Dewi Foto Copy lewat Google Maps. Untuk toko lain, hubungi admin
              lewat WhatsApp atau formulir kontak.
            </p>
            <a
              className="profile-secondary"
              href={companyProfile.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Buka Google Maps
              <iconify-icon icon="lucide:map-pin" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
            </a>
          </div>
          <ul className="profile-location-list">
            {STORES.map((store) => (
              <li className="profile-location-chip" key={store.id}>
                <iconify-icon icon={store.icon} aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                {store.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="profile-section" ref={formSectionRef}>
        <div className="profile-section-head">
          <div>
            <p className="profile-kicker">Kontak</p>
            <h2 className="profile-section-title">Kirim pesan.</h2>
          </div>
          <p className="profile-section-body">
            Sertakan nama barang dan toko jika menanyakan ketersediaan. Admin akan membantu
            pertanyaan umum dan informasi toko.
          </p>
        </div>

        <div className="profile-contact-grid">
          <div className="profile-form-panel">
            <h3 className="profile-panel-title">Formulir kontak</h3>
            <p className="profile-panel-body">
              Lengkapi nama, email, dan pesan. Kolom telepon bersifat opsional.
            </p>

            {submitted ? (
              <div className="profile-success" role="status">
                <iconify-icon
                  icon="lucide:circle-check"
                  aria-hidden="true"
                  style={{ flex: "0 0 auto", fontSize: "24px", color: "var(--color-positive)" }}
                ></iconify-icon>
                <div className="profile-success-copy">
                  <h4 className="profile-success-title">Pesan siap dikirim</h4>
                  <p className="profile-success-body">
                    Prototype: pesan belum dikirim ke server. Hubungi admin via WhatsApp untuk
                    respons nyata.
                  </p>
                  <button type="button" className="profile-success-reset" onClick={resetForm}>
                    Tulis pesan lain
                  </button>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit} noValidate>
                <div className="profile-field">
                  <label className="profile-label" htmlFor="contact-name">
                    Nama
                  </label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    className="profile-input"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  {errors.name ? (
                    <p className="profile-error" id="contact-name-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="profile-field">
                  <label className="profile-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="contact-email"
                    className="profile-input"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                  {errors.email ? (
                    <p className="profile-error" id="contact-email-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="profile-field">
                  <label className="profile-label" htmlFor="contact-phone">
                    Telepon <span style={{ fontWeight: "var(--weight-regular)" }}>(opsional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    className="profile-input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label" htmlFor="contact-message">
                    Pesan
                  </label>
                  <textarea
                    ref={messageRef}
                    id="contact-message"
                    className="profile-textarea"
                    value={form.message}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    onChange={(event) => updateField("message", event.target.value)}
                  ></textarea>
                  {errors.message ? (
                    <p className="profile-error" id="contact-message-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <p className="profile-form-status" role="status" aria-live="polite">
                  {errorCount > 0
                    ? "Periksa " + errorCount + " kolom yang perlu diperbaiki."
                    : ""}
                </p>

                <button type="submit" className="profile-submit">
                  Kirim pesan
                  <iconify-icon icon="lucide:send" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
                </button>
                <p className="profile-form-note">
                  Prototype: pesan tidak dikirim ke server dan tidak disimpan.
                </p>
              </form>
            )}
          </div>

          <aside className="profile-direct-panel">
            <h3 className="profile-panel-title">Hubungi langsung</h3>
            <p className="profile-panel-body">
              Tanya stok, harga, atau lokasi toko. Admin akan membantu pertanyaan Anda.
            </p>
            <a
              className="profile-whatsapp"
              href={companyProfile.whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <iconify-icon icon="lucide:message-circle" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              Chat via WhatsApp
            </a>
            <p className="profile-whatsapp-note">
              {companyProfile.phoneDisplay} · Buka {companyProfile.openingHours}
            </p>

            <div className="profile-direct-divider">
              <p className="profile-panel-title">Yang bisa ditanyakan</p>
              <ul className="profile-direct-list">
                <li className="profile-direct-item">
                  <iconify-icon icon="lucide:package" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                  Ketersediaan barang dan status stok
                </li>
                <li className="profile-direct-item">
                  <iconify-icon icon="lucide:tag" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                  Harga dan satuan barang
                </li>
                <li className="profile-direct-item">
                  <iconify-icon icon="lucide:map-pin" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                  Lokasi dan jam buka toko
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <p className="profile-sample-note">
        <iconify-icon icon="lucide:info" aria-hidden="true" style={{ flex: "0 0 auto", fontSize: "14px" }}></iconify-icon>
        Halaman profil dan kontak sudah memakai data perusahaan. Formulir kontak belum
        terhubung ke database, dan data produk, transaksi, serta pengguna masih contoh.
      </p>
    </div>
  );
}
