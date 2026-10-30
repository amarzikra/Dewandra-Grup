import { Pool } from "pg";
import { loadEnvironment } from "./lib.mjs";

const storePhone = "082142858094";
const openingHours = "07.50-17.00";

const stores = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Rezeki Tani", slug: "pupuk", category: "pupuk" },
  { id: "00000000-0000-4000-8000-000000000002", name: "Central Jaya Bangunan", slug: "bangunan", category: "bangunan" },
  { id: "00000000-0000-4000-8000-000000000003", name: "Dewi Foto Copy", slug: "atk", category: "atk" },
  { id: "00000000-0000-4000-8000-000000000004", name: "Gemilang Elektronik", slug: "listrik", category: "listrik" },
  { id: "00000000-0000-4000-8000-000000000005", name: "Kasandra Furniture", slug: "furniture", category: "furniture" },
];

const products = [
  { id: "10000000-0000-4000-8000-000000000001", store: 0, sku: "PUP-001", barcode: "899000100001", name: "Pupuk Urea 50 kg", unit: "karung", sell: 285000, buy: 245000, stock: 42, min: 10, description: "Pupuk nitrogen untuk membantu pertumbuhan daun dan batang." },
  { id: "10000000-0000-4000-8000-000000000002", store: 0, sku: "PUP-002", barcode: "899000100002", name: "Pupuk NPK 25 kg", unit: "karung", sell: 195000, buy: 170000, stock: 8, min: 10, description: "Pupuk majemuk untuk kebutuhan hara tanaman pada masa pertumbuhan." },
  { id: "10000000-0000-4000-8000-000000000003", store: 1, sku: "BGN-001", barcode: "899000200001", name: "Semen Portland 50 kg", unit: "sak", sell: 68000, buy: 58000, stock: 120, min: 20, description: "Semen serbaguna untuk pekerjaan struktur dan finishing." },
  { id: "10000000-0000-4000-8000-000000000004", store: 1, sku: "BGN-002", barcode: "899000200002", name: "Cat Tembok 5 kg", unit: "pail", sell: 145000, buy: 120000, stock: 14, min: 5, description: "Cat tembok untuk perawatan dan penyegaran ruang." },
  { id: "10000000-0000-4000-8000-000000000005", store: 2, sku: "ATK-001", barcode: "899000300001", name: "Kertas A4 80 gsm", unit: "rim", sell: 55000, buy: 44000, stock: 36, min: 10, description: "Kertas ukuran A4 untuk kebutuhan cetak dan administrasi harian." },
  { id: "10000000-0000-4000-8000-000000000006", store: 2, sku: "ATK-002", barcode: "899000300002", name: "Pulpen Gel 0,5 mm", unit: "pcs", sell: 3500, buy: 3000, stock: 150, min: 30, description: "Pulpen gel untuk catatan dan pekerjaan kantor sehari-hari." },
  { id: "10000000-0000-4000-8000-000000000007", store: 3, sku: "LSK-001", barcode: "899000400001", name: "Lampu LED 12 W", unit: "pcs", sell: 32000, buy: 25000, stock: 24, min: 10, description: "Lampu LED hemat energi untuk kebutuhan penerangan rumah." },
  { id: "10000000-0000-4000-8000-000000000008", store: 3, sku: "LSK-002", barcode: "899000400002", name: "Kabel NYM 2x1,5 mm", unit: "meter", sell: 12500, buy: 10000, stock: 80, min: 20, description: "Kabel listrik untuk instalasi rumah dan kebutuhan harian." },
  { id: "10000000-0000-4000-8000-000000000009", store: 4, sku: "FUR-001", barcode: "899000500001", name: "Kursi Kayu Jati", unit: "pcs", sell: 850000, buy: 650000, stock: 6, min: 2, description: "Kursi kayu untuk ruang makan atau ruang kerja." },
  { id: "10000000-0000-4000-8000-000000000010", store: 4, sku: "FUR-002", barcode: "899000500002", name: "Meja Kerja 120 cm", unit: "pcs", sell: 1250000, buy: 1000000, stock: 3, min: 2, description: "Meja kerja dengan permukaan luas untuk rumah atau kantor." },
];

const suppliers = [
  { id: "20000000-0000-4000-8000-000000000001", store: 0, name: "CV Tani Makmur", phone: "0812-0000-0011", address: "Jl. Tani Raya No. 8 (contoh)", active: true },
  { id: "20000000-0000-4000-8000-000000000002", store: 1, name: "CV Sumber Material", phone: "0812-0000-0012", address: "Jl. Material No. 21 (contoh)", active: true },
  { id: "20000000-0000-4000-8000-000000000003", store: 2, name: "PT Kertas Nusantara", phone: "0812-0000-0013", address: "Jl. Kantor No. 5 (contoh)", active: true },
  { id: "20000000-0000-4000-8000-000000000004", store: 3, name: "CV Terang Abadi", phone: "0812-0000-0014", address: "Jl. Listrik No. 17 (contoh)", active: true },
  { id: "20000000-0000-4000-8000-000000000005", store: 4, name: "CV Kayu Jati", phone: "0812-0000-0015", address: "Jl. Mebel No. 3 (contoh)", active: false },
  { id: "20000000-0000-4000-8000-000000000006", store: 4, name: "CV Mebel Sejahtera", phone: "0812-0000-0016", address: "Jl. Interior No. 9 (contoh)", active: true },
];

const salesByStore = [
  [18.2, 19.5, 21.1, 20.4, 22.8, 24.6],
  [32.4, 30.8, 35.2, 33.1, 36.7, 38.9],
  [12.1, 12.8, 13.4, 13.9, 14.2, 15.1],
  [16.8, 17.4, 18.2, 17.9, 19.3, 20.5],
  [22.5, 24.1, 23.8, 26.2, 27.4, 29.3],
];
const purchasesByStore = [
  [10.4, 11.2, 12.1, 11.8, 12.9, 13.8],
  [18.2, 17.6, 20.4, 19.8, 21.2, 22.6],
  [6.8, 7.1, 7.6, 7.8, 8.1, 8.5],
  [9.2, 9.8, 10.4, 10.1, 11.2, 11.8],
  [13.4, 14.1, 13.9, 15.2, 16.1, 17.5],
];

function uuid(prefix, n) {
  return `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

await loadEnvironment();
const client = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
await client.connect();
try {
  await client.query("BEGIN");
  for (const store of stores) {
    await client.query(
      `INSERT INTO stores (id, name, slug, category, address, phone, whatsapp, opening_hours)
       VALUES ($1,$2,$3,$4,'',$5,$5,$6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         whatsapp = EXCLUDED.whatsapp,
         opening_hours = EXCLUDED.opening_hours`,
      [store.id, store.name, store.slug, store.category, storePhone, openingHours],
    );
  }
  for (const product of products) {
    await client.query(
      `INSERT INTO products (id, store_id, sku, barcode, name, unit, sell_price, buy_price, stock_current, stock_min, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (store_id, sku) DO NOTHING`,
      [product.id, stores[product.store].id, product.sku, product.barcode, product.name, product.unit, product.sell, product.buy, product.stock, product.min, product.description],
    );
  }
  for (const supplier of suppliers) {
    await client.query(
      `INSERT INTO suppliers (id, store_id, name, phone, address, is_active)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`,
      [supplier.id, stores[supplier.store].id, supplier.name, supplier.phone, supplier.address, supplier.active],
    );
  }
  await client.query(
    `INSERT INTO company_profile (id, about, experience, legal_info)
     VALUES ('80000000-0000-4000-8000-000000000001', $1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [
      "Dewandra Grup mengelola lima unit toko untuk kebutuhan harian: pupuk, bangunan, ATK, listrik, dan furniture.",
      "Satu pemilik, satu standar layanan, dan satu pintu untuk pelanggan maupun mitra.",
      "Informasi legal dan alamat lengkap akan dilengkapi oleh pemilik.",
    ],
  );
  for (const [index, project] of [
    ["Proyek bangunan", "Dokumentasi pekerjaan material dan renovasi."],
    ["Instalasi listrik", "Kebutuhan penerangan dan instalasi harian."],
    ["Pengadaan ATK", "Pasokan alat tulis untuk kantor dan sekolah."],
  ].entries()) {
    await client.query(
      `INSERT INTO projects (id, title, description) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING`,
      [uuid("90000000", index + 1), project[0], project[1]],
    );
  }

  const now = new Date();
  let seq = 0;
  for (let storeIndex = 0; storeIndex < stores.length; storeIndex += 1) {
    const firstProduct = products.find((product) => product.store === storeIndex);
    const firstSupplier = suppliers.find((supplier) => supplier.store === storeIndex && supplier.active);
    if (!firstProduct || !firstSupplier) continue;
    for (let monthIndex = 0; monthIndex < 6; monthIndex += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + monthIndex, 15, 10, 0, 0);
      const dateText = date.toISOString();
      seq += 1;
      const saleId = uuid("30000000", seq);
      const saleItemId = uuid("50000000", seq);
      const movementId = uuid("70000000", seq);
      const saleAmount = salesByStore[storeIndex][monthIndex] * 1_000_000;
      await client.query(
        `INSERT INTO sales (id, store_id, invoice_number, total_amount, payment_method, amount_paid, change_amount, status, sale_date)
         VALUES ($1,$2,$3,$4,'cash',$4,0,'paid',$5)
         ON CONFLICT (id) DO NOTHING`,
        [saleId, stores[storeIndex].id, `INV-SEED-${seq}`, saleAmount, dateText],
      );
      await client.query(
        `INSERT INTO sale_items (id, sale_id, product_id, qty, sell_price, subtotal, product_name, unit)
         VALUES ($1,$2,$3,1,$4,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [saleItemId, saleId, firstProduct.id, saleAmount, firstProduct.name, firstProduct.unit],
      );
      await client.query(
        `INSERT INTO stock_movements (id, store_id, product_id, type, reference_id, qty_change, stock_after, notes)
         VALUES ($1,$2,$3,'sale',$4,-1,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [movementId, stores[storeIndex].id, firstProduct.id, saleId, firstProduct.stock, `Penjualan INV-SEED-${seq}`],
      );
      const purchaseId = uuid("40000000", seq);
      const purchaseItemId = uuid("60000000", seq);
      const purchaseMovementId = uuid("70000001", seq);
      const purchaseAmount = purchasesByStore[storeIndex][monthIndex] * 1_000_000;
      await client.query(
        `INSERT INTO purchases (id, store_id, supplier_id, invoice_number, total_amount, payment_method, purchase_date, notes)
         VALUES ($1,$2,$3,$4,$5,'transfer',$6,$7) ON CONFLICT (id) DO NOTHING`,
        [purchaseId, stores[storeIndex].id, firstSupplier.id, `PO-SEED-${seq}`, purchaseAmount, dateText, "Pembelian contoh"],
      );
      await client.query(
        `INSERT INTO purchase_items (id, purchase_id, product_id, qty, buy_price, subtotal, product_name, unit)
         VALUES ($1,$2,$3,1,$4,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [purchaseItemId, purchaseId, firstProduct.id, purchaseAmount, firstProduct.name, firstProduct.unit],
      );
      await client.query(
        `INSERT INTO stock_movements (id, store_id, product_id, type, reference_id, qty_change, stock_after, notes)
         VALUES ($1,$2,$3,'purchase',$4,1,$5,$6) ON CONFLICT (id) DO NOTHING`,
        [purchaseMovementId, stores[storeIndex].id, firstProduct.id, purchaseId, firstProduct.stock, `Pembelian PO-SEED-${seq}`],
      );
    }
  }
  const cancelledId = uuid("30000000", 999);
  await client.query(
    `INSERT INTO sales (id, store_id, invoice_number, total_amount, payment_method, amount_paid, change_amount, status, sale_date)
     VALUES ($1,$2,'INV-SEED-999',1250000,'transfer',1250000,0,'cancelled',$3) ON CONFLICT (id) DO NOTHING`,
    [cancelledId, stores[4].id, new Date(now.getFullYear(), now.getMonth(), 23, 13, 0, 0).toISOString()],
  );
  await client.query(
    `INSERT INTO sale_items (id, sale_id, product_id, qty, sell_price, subtotal, product_name, unit)
     VALUES ($1,$2,$3,1,1250000,1250000,'Meja Kerja 120 cm','pcs') ON CONFLICT (id) DO NOTHING`,
    [uuid("50000000", 999), cancelledId, products[9].id],
  );
  await client.query("COMMIT");
  console.log("Seed selesai: 5 toko, 10 produk, 6 pemasok, 3 proyek, dan transaksi contoh 6 bulan.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}

process.exit(0);
