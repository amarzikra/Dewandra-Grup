import { useEffect, useRef, useState } from "react";
import { storeLogos } from "@/config/dewandra";

const STORES = [
  { id: "pupuk", name: "Rezeki Tani" },
  { id: "bangunan", name: "Central Jaya Bangunan" },
  { id: "atk", name: "Dewi Foto Copy" },
  { id: "listrik", name: "Gemilang Elektronik" },
  { id: "furniture", name: "Kasandra Furniture" },
];

const USERS = [
  {
    id: "user-owner",
    name: "Pemilik",
    email: "pemilik@dewandragrup.test",
    role: "owner",
    storeId: null,
    store: "Semua toko",
    active: true,
    lastLogin: "26 Okt 2026 · 08.15",
  },
  {
    id: "user-rina",
    name: "Rina",
    email: "rina@dewandragrup.test",
    role: "cashier",
    storeId: "pupuk",
    store: "Rezeki Tani",
    active: true,
    lastLogin: "26 Okt 2026 · 07.58",
  },
  {
    id: "user-agus",
    name: "Agus",
    email: "agus@dewandragrup.test",
    role: "cashier",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    active: true,
    lastLogin: "25 Okt 2026 · 16.40",
  },
  {
    id: "user-sari",
    name: "Sari",
    email: "sari@dewandragrup.test",
    role: "cashier",
    storeId: "atk",
    store: "Dewi Foto Copy",
    active: true,
    lastLogin: "26 Okt 2026 · 09.12",
  },
  {
    id: "user-dedi",
    name: "Dedi",
    email: "dedi@dewandragrup.test",
    role: "cashier",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    active: false,
    lastLogin: "12 Okt 2026 · 14.05",
  },
  {
    id: "user-maya",
    name: "Maya",
    email: "maya@dewandragrup.test",
    role: "cashier",
    storeId: "furniture",
    store: "Kasandra Furniture",
    active: true,
    lastLogin: "25 Okt 2026 · 11.20",
  },
];

const ACTIVITIES = [
  {
    id: "act-1",
    icon: "lucide:log-in",
    tone: "neutral",
    text: "Rina masuk ke ruang kasir",
    time: "26 Okt 2026 · 07.58",
  },
  {
    id: "act-2",
    icon: "lucide:shopping-cart",
    tone: "positive",
    text: "Penjualan INV-2026-0042 disimpan",
    time: "26 Okt 2026 · 10.42",
  },
  {
    id: "act-3",
    icon: "lucide:package",
    tone: "positive",
    text: "Pembelian PO-2026-0319 diterima",
    time: "25 Okt 2026 · 11.20",
  },
  {
    id: "act-4",
    icon: "lucide:user-x",
    tone: "warning",
    text: "Akun Dedi dinonaktifkan",
    time: "12 Okt 2026 · 14.10",
  },
  {
    id: "act-5",
    icon: "lucide:sliders-horizontal",
    tone: "neutral",
    text: "Stok Kertas A4 disesuaikan",
    time: "22 Okt 2026 · 09.05",
  },
];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function nowLabel() {
  const now = new Date();
  const date = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return date + " · " + time;
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Page() {
  const [users, setUsers] = useState(USERS);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "cashier",
    storeId: "pupuk",
  });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [userSeq, setUserSeq] = useState(7);
  const addRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const storeRef = useRef(null);

  useEffect(() => {
    if (addOpen && addRef.current && !addRef.current.open) {
      addRef.current.showModal();
    }
  }, [addOpen]);

  useEffect(() => {
    if (!addOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [addOpen]);

  const ownerCount = users.filter((user) => user.role === "owner").length;
  const cashierCount = users.filter((user) => user.role === "cashier").length;
  const inactiveCount = users.filter((user) => !user.active).length;

  function openAdd() {
    setForm({ name: "", email: "", role: "cashier", storeId: "pupuk" });
    setErrors({});
    setAddOpen(true);
  }

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

  function handleRoleChange(role) {
    setForm((previous) => ({
      ...previous,
      role,
      storeId:
        role === "cashier" && !previous.storeId ? "pupuk" : previous.storeId,
    }));
    if (errors.store) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next.store;
        return next;
      });
    }
  }

  function addUser(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = "Nama wajib diisi.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    } else if (
      users.some(
        (user) => user.email.toLowerCase() === form.email.trim().toLowerCase()
      )
    ) {
      nextErrors.email = "Email sudah digunakan.";
    }
    if (form.role === "cashier" && !form.storeId) {
      nextErrors.store = "Pilih toko untuk kasir.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (nextErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (nextErrors.store && storeRef.current) {
        storeRef.current.focus();
      }
      return;
    }

    const store = STORES.find((candidate) => candidate.id === form.storeId);
    const newUser = {
      id: "user-" + userSeq,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      storeId: form.role === "owner" ? null : store ? store.id : null,
      store: form.role === "owner" ? "Semua toko" : store ? store.name : "Semua toko",
      active: true,
      lastLogin: "Belum masuk",
    };
    setUsers((previous) => [newUser, ...previous]);
    setActivities((previous) => [
      {
        id: "activity-" + Date.now(),
        icon: "lucide:user-plus",
        tone: "positive",
        text: "Pengguna baru " + newUser.name + " ditambahkan",
        time: nowLabel(),
      },
      ...previous,
    ]);
    setUserSeq((previous) => previous + 1);
    setNotice("Pengguna " + newUser.name + " ditambahkan.");
    addRef.current?.close();
  }

  function toggleUser(user) {
    if (user.role === "owner") return;
    const nextActive = !user.active;
    setUsers((previous) =>
      previous.map((candidate) =>
        candidate.id === user.id ? { ...candidate, active: nextActive } : candidate
      )
    );
    setActivities((previous) => [
      {
        id: "activity-" + Date.now(),
        icon: nextActive ? "lucide:user-check" : "lucide:user-x",
        tone: nextActive ? "positive" : "warning",
        text: "Akun " + user.name + (nextActive ? " diaktifkan" : " dinonaktifkan"),
        time: nowLabel(),
      },
      ...previous,
    ]);
    setNotice("Akun " + user.name + (nextActive ? " diaktifkan." : " dinonaktifkan."));
  }

  return (
    <div className="pengguna-root">
      <header className="pengguna-header">
        <div className="pengguna-header-copy">
          <p className="pengguna-kicker">Akun & hak akses</p>
          <h1 className="pengguna-title">Pengguna & akses.</h1>
          <p className="pengguna-lede">
            Atur akun kasir, peran, dan akses toko dari satu tempat.
          </p>
        </div>
        <div className="pengguna-header-actions">
          <span className="pengguna-chip">
            <iconify-icon icon="lucide:info" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            Data contoh
          </span>
          <button type="button" className="pengguna-primary" onClick={openAdd}>
            <iconify-icon icon="lucide:user-plus" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
            Tambah pengguna
          </button>
        </div>
      </header>

      <section className="pengguna-summary" aria-label="Ringkasan pengguna">
        <div className="pengguna-summary-grid">
          <div>
            <p className="pengguna-metric-label">Total pengguna</p>
            <p className="pengguna-metric-value">{users.length}</p>
            <p className="pengguna-metric-sub">Pemilik dan kasir</p>
          </div>
          <div>
            <p className="pengguna-metric-label">Pemilik</p>
            <p className="pengguna-metric-value">{ownerCount}</p>
            <p className="pengguna-metric-sub">Akses semua toko</p>
          </div>
          <div>
            <p className="pengguna-metric-label">Kasir</p>
            <p className="pengguna-metric-value">{cashierCount}</p>
            <p className="pengguna-metric-sub">Satu toko per akun</p>
          </div>
          <div>
            <p className="pengguna-metric-label">Nonaktif</p>
            <p className="pengguna-metric-value">{inactiveCount}</p>
            <p className="pengguna-metric-sub">Tidak dapat masuk</p>
          </div>
        </div>
      </section>

      <div className="pengguna-grid">
        <section className="pengguna-card">
          <div className="pengguna-panel-head">
            <div>
              <h2 className="pengguna-panel-title">Daftar pengguna</h2>
              <p className="pengguna-panel-sub">
                Peran pemilik dan kasir dengan akses toko masing-masing.
              </p>
            </div>
            <span className="pengguna-count">{users.length} akun</span>
          </div>

          <div className="pengguna-table-scroll">
            <table className="pengguna-table">
              <caption className="pengguna-sr-only">Daftar akun pengguna</caption>
              <thead>
                <tr>
                  <th scope="col">Nama</th>
                  <th scope="col">Peran</th>
                  <th scope="col">Toko</th>
                  <th scope="col">Status</th>
                  <th scope="col">Terakhir masuk</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="pengguna-user-cell">
                        <span className="pengguna-avatar" aria-hidden="true">
                          {initials(user.name)}
                        </span>
                        <span className="pengguna-user-copy">
                          <span className="pengguna-user-name">{user.name}</span>
                          <span className="pengguna-user-email">{user.email}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="pengguna-role">
                        {user.role === "owner" ? "Pemilik" : "Kasir"}
                      </span>
                    </td>
                    <td>
                      <span className="store-cell">
                        {user.storeId ? (
                          <img
                            className="store-cell-logo"
                            src={storeLogos[user.storeId]}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                        {user.store}
                      </span>
                    </td>
                    <td>
                      <span className="pengguna-status">
                        <iconify-icon
                          className="pengguna-status-icon"
                          data-tone={user.active ? "positive" : "danger"}
                          icon={user.active ? "lucide:circle-check" : "lucide:x-circle"}
                          aria-hidden="true"
                          style={{ fontSize: "14px" }}
                        ></iconify-icon>
                        {user.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="pengguna-last-login">{user.lastLogin}</td>
                    <td>
                      {user.role === "owner" ? (
                        <span className="pengguna-owner-note">Akses penuh</span>
                      ) : (
                        <button
                          type="button"
                          className={
                            user.active
                              ? "pengguna-action pengguna-action-danger"
                              : "pengguna-action"
                          }
                          aria-label={
                            (user.active ? "Nonaktifkan akun " : "Aktifkan akun ") + user.name
                          }
                          onClick={() => toggleUser(user)}
                        >
                          {user.active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pengguna-table-hint">Geser tabel untuk melihat semua kolom.</p>
          <p className="pengguna-table-note">
            Pemilik melihat semua toko; kasir hanya melihat toko yang ditugaskan.
          </p>
        </section>

        <aside className="pengguna-card">
          <div className="pengguna-panel-head">
            <div>
              <h2 className="pengguna-panel-title">Aktivitas penting</h2>
              <p className="pengguna-panel-sub">Jejak perubahan akun dan operasional.</p>
            </div>
          </div>

          <ul className="pengguna-activity-list">
            {activities.map((activity) => (
              <li className="pengguna-activity-item" key={activity.id}>
                <span className="pengguna-activity-icon" data-tone={activity.tone}>
                  <iconify-icon
                    icon={activity.icon}
                    aria-hidden="true"
                    style={{ fontSize: "15px" }}
                  ></iconify-icon>
                </span>
                <span className="pengguna-activity-copy">
                  <span className="pengguna-activity-text">{activity.text}</span>
                  <span className="pengguna-activity-time">{activity.time}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="pengguna-activity-note">
            Aktivitas dari prototype ini muncul di bagian atas daftar.
          </p>
        </aside>
      </div>

      <p className="pengguna-sample-note">
        <iconify-icon icon="lucide:info" aria-hidden="true" style={{ flex: "0 0 auto", fontSize: "14px" }}></iconify-icon>
        Data pengguna dan aktivitas adalah contoh. Perubahan hanya tersimpan selama prototype
        dibuka dan tidak mengubah autentikasi nyata.
      </p>

      <div className="pengguna-toast-region" role="status" aria-live="polite" aria-atomic="true">
        {notice ? (
          <div className="pengguna-toast">
            <iconify-icon
              icon="lucide:info"
              aria-hidden="true"
              style={{ flex: "0 0 auto", fontSize: "18px", color: "var(--color-accent-text)" }}
            ></iconify-icon>
            <div className="pengguna-toast-copy">
              <span className="pengguna-toast-title">Pemberitahuan</span>
              <span className="pengguna-toast-text">{notice}</span>
            </div>
            <button
              type="button"
              className="pengguna-toast-close"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "16px" }}></iconify-icon>
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        ref={addRef}
        className="pengguna-dialog"
        aria-labelledby="pengguna-dialog-title"
        onClose={() => setAddOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {addOpen ? (
          <div className="pengguna-dialog-inner">
            <div className="pengguna-dialog-top">
              <div>
                <h2 className="pengguna-dialog-title" id="pengguna-dialog-title">
                  Tambah pengguna
                </h2>
                <p className="pengguna-dialog-sub">
                  Buat akun kasir atau pemilik baru.
                </p>
              </div>
              <button
                type="button"
                className="pengguna-dialog-close"
                aria-label="Tutup form pengguna"
                onClick={() => addRef.current?.close()}
              >
                <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            <form className="pengguna-form" onSubmit={addUser} noValidate>
              <div className="pengguna-form-row">
                <div className="pengguna-form-field">
                  <label className="pengguna-form-label" htmlFor="pengguna-name">
                    Nama
                  </label>
                  <input
                    ref={nameRef}
                    id="pengguna-name"
                    className="pengguna-form-input"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "pengguna-name-error" : undefined}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  {errors.name ? (
                    <p className="pengguna-form-error" id="pengguna-name-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="pengguna-form-field">
                  <label className="pengguna-form-label" htmlFor="pengguna-email">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="pengguna-email"
                    className="pengguna-form-input"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "pengguna-email-error" : undefined}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                  {errors.email ? (
                    <p className="pengguna-form-error" id="pengguna-email-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="pengguna-form-row">
                <div className="pengguna-form-field">
                  <label className="pengguna-form-label" htmlFor="pengguna-role">
                    Peran
                  </label>
                  <select
                    id="pengguna-role"
                    className="pengguna-form-select"
                    value={form.role}
                    onChange={(event) => handleRoleChange(event.target.value)}
                  >
                    <option value="cashier">Kasir</option>
                    <option value="owner">Pemilik</option>
                  </select>
                </div>

                <div className="pengguna-form-field">
                  <label className="pengguna-form-label" htmlFor="pengguna-store">
                    Toko
                  </label>
                  <select
                    ref={storeRef}
                    id="pengguna-store"
                    className="pengguna-form-select"
                    value={form.storeId}
                    disabled={form.role === "owner"}
                    aria-invalid={errors.store ? "true" : "false"}
                    aria-describedby={errors.store ? "pengguna-store-error" : undefined}
                    onChange={(event) => updateField("storeId", event.target.value)}
                  >
                    {STORES.map((store) => (
                      <option value={store.id} key={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                  {errors.store ? (
                    <p className="pengguna-form-error" id="pengguna-store-error">
                      <iconify-icon icon="lucide:triangle-alert" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
                      {errors.store}
                    </p>
                  ) : null}
                </div>
              </div>

              {form.role === "owner" ? (
                <p className="pengguna-form-note">
                  Pemilik memiliki akses ke semua toko. Pilihan toko dinonaktifkan.
                </p>
              ) : null}

              <p className="pengguna-form-status" role="status" aria-live="polite">
                {Object.keys(errors).length > 0
                  ? "Periksa " + Object.keys(errors).length + " kolom yang perlu diperbaiki."
                  : ""}
              </p>

              <div className="pengguna-dialog-actions">
                <button type="submit" className="pengguna-dialog-primary">
                  Simpan pengguna
                </button>
                <button
                  type="button"
                  className="pengguna-dialog-secondary"
                  onClick={() => addRef.current?.close()}
                >
                  Batal
                </button>
              </div>
              <p className="pengguna-dialog-note">
                Prototype: akun baru hanya tersimpan selama halaman ini dibuka.
              </p>
            </form>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
