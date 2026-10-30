# Dewandra Grup — Aplikasi Web Lima Toko

Aplikasi web terpusat untuk **Dewandra Grup**: etalase lima unit toko (pupuk, bangunan, ATK, listrik, furniture), katalog produk, checkout pesanan, kasir digital, dashboard pemilik, serta pengelolaan stok dan pengguna.

Aplikasi ini dibangun di atas starter **TanStack Start + PostgreSQL (NgodingPakeAI)** dengan stack yang sudah ditentukan: TanStack Start, Drizzle ORM, PostgreSQL, Better Auth, Tailwind CSS v4, shadcn/ui, dan Motion.

> Kebutuhan produk lengkap: [`../dewandra-grup-PRD.md`](../dewandra-grup-PRD.md).

## Daftar isi

- [Unit toko](#unit-toko)
- [Fitur](#fitur)
- [Status implementasi](#status-implementasi)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Menjalankan proyek](#menjalankan-proyek)
- [Environment](#environment)
- [Perintah npm](#perintah-npm)
- [Database](#database)
- [Struktur proyek](#struktur-proyek)
- [Rute aplikasi](#rute-aplikasi)
- [Peran dan akses](#peran-dan-akses)
- [Pengujian dan kualitas](#pengujian-dan-kualitas)
- [Deployment](#deployment)
- [Dokumentasi tambahan](#dokumentasi-tambahan)

## Unit toko

| Toko | Kategori | Slug |
| ---- | -------- | ---- |
| Rezeki Tani | Pupuk & pertanian | `pupuk` |
| Central Jaya Bangunan | Material bangunan | `bangunan` |
| Dewi Foto Copy | Alat tulis kantor | `atk` |
| Gemilang Elektronik | Peralatan listrik | `listrik` |
| Kasandra Furniture | Mebel & interior | `furniture` |

Identitas perusahaan (nama, telepon, WhatsApp, jam buka, rekening, logo toko) dipusatkan di `src/config/dewandra.ts`. Data contoh toko, produk, pemasok, dan transaksi ada di `scripts/seed.mjs`.

## Fitur

**Halaman publik**

- **Beranda** — hero, lima layanan toko, sorotan profil, dan tombol WhatsApp.
- **Katalog** — pencarian nama/kode barang, filter per toko, detail produk, status stok (`Tersedia`, `Stok menipis`, `Habis`), dan tambah ke keranjang.
- **Checkout** — data pembeli, ambil di toko atau kirim, pembayaran tunai/transfer/QRIS, unggah bukti bayar (maks. 2 MB), dan nomor pesanan.
- **Lacak pesanan** — cek status dengan kode pesanan + nomor WhatsApp.
- **Profil & kontak** — cerita perusahaan, galeri, alamat/jam buka, formulir kontak, dan WhatsApp.

**Halaman internal (login)**

- **Dashboard pemilik** — ringkasan penjualan, pembelian, nilai persediaan, grafik tren enam bulan, filter toko/periode, dan peringatan stok menipis.
- **Kasir** — pilih toko, pindai barcode/SKU atau cari manual, keranjang, pembayaran tunai/transfer, struk, dan pembatalan transaksi tanpa mengubah stok.
- **Katalog pemilik** — daftar produk internal per toko.
- **Pesanan** — daftar pesanan masuk, cari/filter status, verifikasi bukti bayar, dan ubah status pesanan.
- **Stok & pembelian** — catat pembelian dari pemasok, penyesuaian stok, dan peringatan stok minimum.
- **Riwayat** — penjualan/pembelian per toko, filter tanggal/toko, detail transaksi, dan jejak perubahan stok.
- **Pengguna** — kelola akun kasir/pemilik dan catatan aktivitas.
- **Akun** — sign-up, sign-in, sign-out dengan sesi server-side; role `admin` untuk pemilik dan role default `user` untuk kasir.

## Status implementasi

Terhubung penuh ke PostgreSQL dan API server:

- Autentikasi dan sesi (Better Auth), migrasi, seed, dan role.
- Katalog publik (`getCatalogFn` → `dewandra.service.server.ts`).
- Checkout, lacak pesanan, unggah/hapus bukti bayar, serta pengelolaan pesanan (`src/services/orders.service.server.ts`, `src/routes/api/orders/**`).

Halaman berikut masih memakai **data contoh di sisi klien** dan perlu disambungkan ke service/database pada pengembangan berikutnya:

- Dashboard pemilik (`dashboard.page.jsx`) — service agregasi `getDashboardData()` sudah tersedia, tinggal dipakai sebagai loader.
- Kasir (`kasir.page.jsx`), stok (`stok.page.jsx`), riwayat (`riwayat.page.jsx`), dan pengguna (`pengguna.page.jsx`).
- Formulir kontak (`profil-kontak.page.jsx`) — service `createContactMessage()` dan schema Zod sudah tersedia, tetapi belum ada route API yang memanggilnya.
- Data contoh pada halaman-halaman tersebut bukan transaksi nyata; jangan dipakai untuk laporan produksi sampai terhubung ke database.

## Teknologi

| Lapisan | Teknologi |
| ------- | --------- |
| Framework | TanStack Start 1.168, TanStack Router 1.170, React 19, Vite 8, Nitro |
| Bahasa | TypeScript 5.9 (strict), JavaScript untuk halaman prototipe |
| UI | Tailwind CSS v4, shadcn/ui + Radix, Lucide, Motion |
| Data | PostgreSQL 17, Drizzle ORM 0.45, drizzle-kit, node-postgres |
| Auth | Better Auth 1.7 (email/password, sesi database, admin plugin) |
| Validasi | Zod 4 |
| Kualitas | ESLint 9, Prettier, Node test runner, Playwright, GitHub Actions |
| Operasional | Docker Compose (database lokal), Dockerfile multi-stage |

## Prasyarat

- **Node.js 22.12+** (lihat `.nvmrc`)
- **Docker Desktop** untuk database lokal (opsional jika memakai PostgreSQL eksternal)
- npm (repo memakai `package-lock.json`)

## Menjalankan proyek

```sh
cd ngodingpakeai-tanstack-starter
npm run setup
npm run db:seed
npm run dev
```

`npm run setup` akan:

1. Memasang dependency sesuai lockfile.
2. Membuat `.env.local` berisi `BETTER_AUTH_SECRET`, kredensial database, dan port acak.
3. Menjalankan PostgreSQL 17 lewat `compose.dev.yaml` dan menunggu sehat.
4. Menerapkan migrasi Drizzle dan memeriksa koneksi.

Buka <http://localhost:3000>. Buat akun melalui halaman sign-up, lalu jadikan pemilik:

```sh
npm run role:set -- email@anda.com admin
```

`npm run db:seed` mengisi lima toko, sepuluh produk contoh, pemasok, dan transaksi contoh. Seed bersifat idempoten (aman dijalankan ulang).

**Memakai PostgreSQL eksternal:** isi `DATABASE_URL` di `.env.local` sebelum setup. Jika penyedia memisahkan koneksi pooler dan direct, isi juga `MIGRATION_DATABASE_URL`. Jangan menonaktifkan verifikasi TLS.

## Environment

Nilai privat disimpan di `.env.local` (diabaikan git). Contoh ada di `.env.example`.

| Variabel | Wajib | Keterangan |
| -------- | ----- | ---------- |
| `BETTER_AUTH_SECRET` | Ya | Kunci acak untuk sesi/token. Dibuat otomatis oleh setup. |
| `BETTER_AUTH_URL` | Ya | Origin aplikasi, mis. `http://localhost:3000`. Harus sama dengan URL yang dibuka. |
| `DATABASE_URL` | Ya | Koneksi runtime PostgreSQL. Kosongkan agar setup Docker otomatis. |
| `MIGRATION_DATABASE_URL` | Tidak | Koneksi langsung untuk migrasi bila `DATABASE_URL` memakai pooler. |
| `POSTGRES_PORT` | Tidak | Port database lokal tetap. Default: port tinggi acak. |

Jangan commit `.env.local`, kredensial, atau connection string.

## Perintah npm

| Perintah | Fungsi |
| -------- | ------ |
| `npm run setup` | Install, buat env, jalankan PostgreSQL, migrasi, diagnosa |
| `npm run dev` | Siapkan database lalu jalankan dev server |
| `npm run build` | Build produksi ke `.output` |
| `npm start` | Jalankan hasil build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run check` | Lint + typecheck + unit/integration test |
| `npm test` | Test setup, migrasi, dan isolasi data dengan PostgreSQL disposable |
| `npm run test:e2e` | Test browser Playwright (port 3101) |
| `npm run test:setup` | Verifikasi setup baru, retry, dan persistensi data |
| `npm run format` | Format Prettier |
| `npm run doctor` | Cek env, database, tabel auth, dan file AI |
| `npm run db:generate` | Buat SQL migrasi setelah ubah schema |
| `npm run db:migrate` | Terapkan migrasi |
| `npm run db:seed` | Isi data contoh Dewandra Grup |
| `npm run db:studio` | Buka Drizzle Studio |
| `npm run db:up` / `db:down` / `db:status` / `db:logs` | Kelola database Docker |
| `npm run role:set -- <email> <role>` | Ubah role akun (`admin`/`user`) |

Test membutuhkan Docker karena menjalankan PostgreSQL disposable terpisah; database aplikasi tidak tersentuh. Untuk e2e pertama kali: `npx playwright install chromium`, lalu `npm run build`.

## Database

Migrasi berada di `drizzle/` dan **wajib ikut di-commit** bersama `drizzle/meta`:

| Migrasi | Isi |
| ------- | --- |
| `0000_auth.sql` | Tabel Better Auth (user, session, account, verification) |
| `0001_notes.sql` | Tabel notes contoh |
| `0002_roles.sql` | Kolom role |
| `0003_known_lenny_balinger.sql` | Toko, produk, pemasok, penjualan, pembelian, mutasi stok, kontak, proyek, profil perusahaan, log aktivitas |
| `0004_chunky_bullseye.sql` | Pesanan (`orders`, `order_items`) + enum fulfillment/status dan metode bayar QRIS |

Schema Drizzle ada di `src/db/schema/` (satu tabel per file, diekspor dari `index.ts`), mencakup: `stores`, `products`, `suppliers`, `sales`, `sale_items`, `purchases`, `purchase_items`, `stock_movements`, `orders`, `order_items`, `contact_messages`, `projects`, `company_profile`, `activity_logs`, serta tabel auth.

Alur perubahan schema:

```sh
# 1. edit src/db/schema/<tabel>.ts
npm run db:generate   # 2. periksa SQL baru di drizzle/
npm run db:migrate    # 3. terapkan
```

Jangan menulis ulang migrasi yang sudah diterapkan atau melakukan reset destruktif.

## Struktur proyek

```text
.
├── .agents/skills/        # Skill agen: starter-setup, build-feature, dev-database, create-variant
├── .github/workflows/     # CI (lint, typecheck, test, build)
├── drizzle/               # SQL migrasi + meta
├── docs/                  # Dokumentasi arsitektur, backend, deployment, dll.
├── e2e/                   # Test Playwright
├── images/                # Foto toko sumber
├── public/stores/         # Logo toko untuk website
├── scripts/               # setup, migrate, seed, doctor, test, database
├── src/
│   ├── components/        # UI shell, auth, shadcn primitives
│   ├── config/            # Identitas perusahaan (dewandra.ts) dan site
│   ├── db/                # Pool node-postgres + schema Drizzle
│   ├── features/sunlit/   # Halaman dan komponen UI per fitur
│   ├── lib/               # auth, session, permission, API helper, env
│   ├── routes/            # File route TanStack (halaman + API)
│   ├── services/          # Query Drizzle & logika domain (server-only)
│   ├── styles/            # Token Tailwind + tema sunlit-ledger
│   └── validators/        # Schema Zod
├── tests/                 # Test Node (setup, database, variant)
├── AGENTS.md              # Panduan kerja agen di repo ini
├── compose.dev.yaml       # PostgreSQL lokal
├── Dockerfile             # Build produksi + target migrator
└── starter.config.json    # Identitas starter/aplikasi
```

Konvensi penting:

- File `*.server.ts` khusus server; import dari browser akan menggagalkan build.
- Query domain hanya di `src/services/`, bukan di route/komponen/loader.
- Route API tipis: autentikasi (`withApiSession`) → validasi Zod → service.
- Tabel baru: file terpisah di `src/db/schema/` dan diekspor dari `index.ts`.

## Rute aplikasi

**Publik**

| Path | Halaman |
| ---- | ------- |
| `/` | Beranda lima layanan |
| `/katalog` | Katalog produk + filter toko |
| `/checkout` | Checkout pesanan |
| `/lacak-pesanan` | Lacak pesanan (`?kode=...`) |
| `/profil-kontak` | Profil perusahaan & kontak |
| `/sign-in`, `/sign-up` | Autentikasi |

**Internal (perlu login)**

| Path | Halaman |
| ---- | ------- |
| `/dashboard` | Dashboard pemilik |
| `/kasir` | Kasir transaksi |
| `/katalog-pemilik` | Katalog internal |
| `/pesanan` | Kelola pesanan masuk |
| `/stok` | Stok, pembelian, penyesuaian |
| `/riwayat` | Riwayat transaksi |
| `/pengguna` | Kelola pengguna |
| `/admin` | Contoh halaman khusus admin |

**API**

| Endpoint | Fungsi |
| -------- | ------ |
| `/api/auth/*` | Handler Better Auth |
| `/api/orders` | Buat & daftar pesanan |
| `/api/orders/lookup` | Cari pesanan (kode + telepon) |
| `/api/orders/$id` | Detail/ubah status pesanan |
| `/api/orders/proof`, `/api/orders/$id/proof` | Unggah/hapus bukti bayar |
| `/api/notes`, `/api/admin/notes` | Contoh CRUD notes dan permission admin |

## Peran dan akses

- Default akun baru: role `user` (tidak bisa mengakses data orang lain).
- Pemilik: `npm run role:set -- email@anda.com admin`. Role `admin` membuka resource tambahan di `src/lib/permissions.ts` dan halaman `/admin`.
- Sign-up tidak pernah bisa menetapkan role sendiri.
- Target PRD berikutnya: pembatasan kasir per toko (owner melihat semua toko, kasir hanya tokonya). Saat ini pembatasan tersebut belum diterapkan di semua halaman.

## Pengujian dan kualitas

```sh
npm run check        # lint + typecheck + test (butuh Docker)
npm run build
npm run test:e2e     # setelah build dan install chromium
npm run doctor       # diagnosa cepat
```

- Test database memakai PostgreSQL disposable dengan port unik.
- Test browser memakai port `3101` dan build produksi di `.output`.
- CI di `.github/workflows/ci.yml` menjalankan lint, typecheck, test, dan build.

## Deployment

1. Siapkan PostgreSQL persisten dan isi `DATABASE_URL`, `BETTER_AUTH_SECRET`, serta `BETTER_AUTH_URL` publik.
2. Terapkan migrasi sekali per rilis: `npm run db:migrate` (atau image target `migrator`).
3. Build dan jalankan: `npm run build && npm start`.

Docker:

```sh
docker build -t dewandra-grup .
docker build --target migrator -t dewandra-grup-migrate .
```

Dockerfile hanya untuk produksi; pengembangan lokal tetap memakai `npm run dev` + `compose.dev.yaml`. Untuk beberapa instance, gunakan pooler PostgreSQL dan batasi koneksi. Detail ada di [`docs/deployment.md`](docs/deployment.md).

## Dokumentasi tambahan

| Dokumen | Isi |
| ------- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Arsitektur aplikasi |
| [`docs/backend.md`](docs/backend.md) | Pola API, service, validasi, role |
| [`docs/local-development.md`](docs/local-development.md) | Alur setup & database lokal |
| [`docs/deployment.md`](docs/deployment.md) | Deployment produksi |
| [`docs/ai-workflow.md`](docs/ai-workflow.md) | Setup Context7 dan skill agen |
| [`docs/prompts.md`](docs/prompts.md) | Contoh prompt pengembangan |
| [`docs/derivatives.md`](docs/derivatives.md) | Membuat varian dari starter |
| [`docs/variant.md`](docs/variant.md) | Perbedaan dari base Next.js |

## Lisensi

MIT. Lihat [`LICENSE`](LICENSE) dan [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
