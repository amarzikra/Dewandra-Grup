# Dewandra Grup

Website terpusat untuk mengelola dan memperkenalkan lima unit toko milik satu pemilik usaha: **pupuk, bangunan, ATK, listrik, dan furniture**. Repositori ini berisi aplikasi kasir digital, dashboard pemilik, katalog produk publik, profil perusahaan, serta seluruh dokumen perencanaannya.

> Dokumen kebutuhan lengkap ada di [dewandra-grup-PRD.md](dewandra-grup-PRD.md).

## Unit toko

| Toko | Kategori |
| ---- | -------- |
| Rezeki Tani | Pupuk & pertanian |
| Central Jaya Bangunan | Material bangunan |
| Dewi Foto Copy | Alat tulis kantor |
| Gemilang Elektronik | Peralatan listrik |
| Kasandra Furniture | Mebel & interior |

Semua toko tampil di halaman `/katalog` dengan filter per toko.

## Isi repositori

| Path | Keterangan |
| ---- | ---------- |
| [`dewandra-grup-PRD.md`](dewandra-grup-PRD.md) | PRD: masalah, kebutuhan, fitur per fase, alur pengguna, arsitektur, skema database, dan tech stack. |
| [`ngodingpakeai-tanstack-starter/`](ngodingpakeai-tanstack-starter/) | Aplikasi utama Dewandra Grup (TanStack Start + PostgreSQL). Lihat [README aplikasi](ngodingpakeai-tanstack-starter/README.md). |
| [`godingpakeai-tanstack-starter/`](godingpakeai-tanstack-starter/) | Fragmen fitur pesanan (schema, service, validator, API helper) hasil generate yang dipakai sebagai referensi. |

## Fitur utama

**Publik**

- Beranda lima layanan toko, profil singkat perusahaan, dan tombol WhatsApp.
- Katalog produk dengan pencarian, filter per toko, detail produk, dan status stok.
- Checkout pesanan (ambil di toko atau kirim), pembayaran tunai/transfer/QRIS, dan unggah bukti bayar.
- Lacak pesanan berdasarkan nomor pesanan dan nomor telepon.
- Halaman profil perusahaan, galeri proyek, formulir kontak, lokasi, dan jam buka.

**Internal (login)**

- **Pemilik:** dashboard ringkasan semua toko, grafik tren, nilai persediaan, filter toko/periode.
- **Kasir:** transaksi penjualan, pembayaran, struk, dan pembatalan tanpa mengubah stok.
- Katalog pemilik, stok & pembelian, peringatan stok menipis, penyesuaian stok, riwayat transaksi dan jejak perubahan stok.
- Kelola pesanan masuk, verifikasi bukti bayar, ubah status pesanan.
- Kelola pengguna dan peran (`owner` / `cashier`), akses dibatasi per toko.

## Teknologi

- **Frontend:** TanStack Start (React 19, Vite, Nitro), Tailwind CSS v4, shadcn/ui, Motion, Lucide.
- **Backend:** Node.js, REST API routes, Better Auth (sesi database), Zod.
- **Database:** PostgreSQL 17 dengan Drizzle ORM dan migrasi SQL.
- **Operasional:** Docker Compose untuk database lokal, Dockerfile untuk build produksi.
- **Kualitas:** ESLint, TypeScript strict, Prettier, unit test + Playwright e2e, GitHub Actions CI.

## Menjalankan aplikasi

Prasyarat: **Node.js 22.12+** dan **Docker Desktop** (untuk database lokal).

```sh
cd ngodingpakeai-tanstack-starter
npm run setup      # install dependency, buat .env.local, jalankan PostgreSQL, migrasi
npm run db:seed    # isi data contoh lima toko, produk, pemasok, transaksi
npm run dev        # buka http://localhost:3000
```

Buat akun lewat halaman sign-up, lalu jadikan pemilik:

```sh
npm run role:set -- email@anda.com admin
```

Daftar perintah lengkap, konfigurasi environment, struktur kode, dan panduan deployment ada di [README aplikasi](ngodingpakeai-tanstack-starter/README.md).

## Lisensi

MIT. Lihat [LICENSE](ngodingpakeai-tanstack-starter/LICENSE) dan [THIRD_PARTY_NOTICES](ngodingpakeai-tanstack-starter/THIRD_PARTY_NOTICES.md).
