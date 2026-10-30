# Fragmen Fitur Pesanan — Dewandra Grup

Folder ini berisi **potongan kode fitur pesanan** (orders) yang dihasilkan saat pengembangan aplikasi utama. Isinya bukan aplikasi yang bisa dijalankan sendiri, melainkan bahan referensi/snapshot yang sudah diintegrasikan ke [`../ngodingpakeai-tanstack-starter`](../ngodingpakeai-tanstack-starter).

> Folder ini tidak memiliki `package.json`, dependency, atau konfigurasi build. Untuk menjalankan aplikasi, gunakan folder utama di atas.

## Isi folder

| File | Keterangan |
| ---- | ---------- |
| `src/db/schema/orders.ts` | Definisi tabel Drizzle `orders` dan `order_items`: nomor pesanan, data pelanggan, metode pengambilan (`pickup`/`delivery`), metode bayar (`cash`/`transfer`/`qris`), status, total, metadata bukti bayar, dan timestamp status. |
| `src/services/orders.service.server.ts` | Logika domain pesanan: pembuatan pesanan, pencarian berdasarkan kode + nomor telepon, daftar/ubah status, unggah dan hapus bukti bayar (maks. 2 MB), serta integrasi stok/penjualan. |
| `src/validators/orders.ts` | Schema Zod untuk input pesanan, lookup, update status, dan bukti bayar. |
| `src/lib/api-error.ts` | Helper error API yang konsisten (`ApiError`). |
| `src/lib/api.server.ts` | Helper route API: sesi, permission, parsing body, dan respons JSON. |
| `src/lib/phone.ts` | Normalisasi dan validasi nomor telepon Indonesia (`62…` → `0…`). |

File `*.pending.txt` adalah versi draf/awal dari file `.ts` di sebelahnya, disimpan sebagai jejak proses generate. File `pwsh_created.txt` hanya penanda bahwa folder dibuat melalui PowerShell.

## Hubungan dengan aplikasi utama

Semua file di sini sudah ada di aplikasi utama pada path yang sama:

```text
ngodingpakeai-tanstack-starter/
├── src/db/schema/orders.ts
├── src/services/orders.service.server.ts
├── src/validators/orders.ts
├── src/lib/api-error.ts
├── src/lib/api.server.ts
└── src/lib/phone.ts
```

Sumber kebenaran (source of truth) ada di folder aplikasi utama. Jika mengubah fitur pesanan, ubah di sana, lalu jalankan `npm run db:generate` dan `npm run db:migrate` bila schema berubah. Folder ini tidak perlu diperbarui kecuali diinginkan sebagai arsip.

Endpoint terkait di aplikasi utama:

| Endpoint | Fungsi |
| -------- | ------ |
| `POST /api/orders` | Buat pesanan baru |
| `GET /api/orders` | Daftar pesanan (internal) |
| `GET /api/orders/lookup` | Cari pesanan dengan kode + nomor WhatsApp |
| `PATCH /api/orders/$id` | Ubah status pesanan |
| `POST/DELETE /api/orders/proof` | Unggah/hapus bukti bayar |

## Menjalankan fitur pesanan

```sh
cd ../ngodingpakeai-tanstack-starter
npm run setup
npm run db:seed
npm run dev
```

Panduan lengkap ada di [README aplikasi](../ngodingpakeai-tanstack-starter/README.md) dan [PRD](../dewandra-grup-PRD.md).
