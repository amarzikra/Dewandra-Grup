import { useEffect, useRef, useState } from "react";
import { storeLogos } from "@/config/dewandra";

const STORES = [
  { id: "pupuk", name: "Rezeki Tani" },
  { id: "bangunan", name: "Central Jaya Bangunan" },
  { id: "atk", name: "Dewi Foto Copy" },
  { id: "listrik", name: "Gemilang Elektronik" },
  { id: "furniture", name: "Kasandra Furniture" },
];

const REFERENCE_DATE = new Date("2026-10-26T23:59:59");

const TRANSACTIONS = [
  {
    id: "trx-1042",
    invoice: "INV-2026-0042",
    type: "sale",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    party: "Pemilik",
    date: "2026-10-26T10:42:00",
    dateLabel: "26 Okt 2026 · 10.42",
    paymentMethod: "cash",
    status: "paid",
    total: 408000,
    items: [
      { name: "Semen Portland 50 kg", qty: 6, price: 68000, subtotal: 408000, unit: "sak" },
    ],
    stockMoves: [
      { product: "Semen Portland 50 kg", change: -6, after: 114, note: "Penjualan INV-2026-0042" },
    ],
  },
  {
    id: "trx-1041",
    invoice: "INV-2026-0041",
    type: "sale",
    storeId: "atk",
    store: "Dewi Foto Copy",
    party: "Pemilik",
    date: "2026-10-26T09:18:00",
    dateLabel: "26 Okt 2026 · 09.18",
    paymentMethod: "transfer",
    status: "paid",
    total: 145000,
    items: [
      { name: "Kertas A4 80 gsm", qty: 2, price: 55000, subtotal: 110000, unit: "rim" },
      { name: "Pulpen Gel 0,5 mm", qty: 10, price: 3500, subtotal: 35000, unit: "pcs" },
    ],
    stockMoves: [
      { product: "Kertas A4 80 gsm", change: -2, after: 34, note: "Penjualan INV-2026-0041" },
      { product: "Pulpen Gel 0,5 mm", change: -10, after: 140, note: "Penjualan INV-2026-0041" },
    ],
  },
  {
    id: "trx-1040",
    invoice: "INV-2026-0040",
    type: "sale",
    storeId: "pupuk",
    store: "Rezeki Tani",
    party: "Pemilik",
    date: "2026-10-25T16:05:00",
    dateLabel: "25 Okt 2026 · 16.05",
    paymentMethod: "cash",
    status: "paid",
    total: 765000,
    items: [
      { name: "Pupuk Urea 50 kg", qty: 2, price: 285000, subtotal: 570000, unit: "karung" },
      { name: "Pupuk NPK 25 kg", qty: 1, price: 195000, subtotal: 195000, unit: "karung" },
    ],
    stockMoves: [
      { product: "Pupuk Urea 50 kg", change: -2, after: 40, note: "Penjualan INV-2026-0040" },
      { product: "Pupuk NPK 25 kg", change: -1, after: 8, note: "Penjualan INV-2026-0040" },
    ],
  },
  {
    id: "trx-0319",
    invoice: "PO-2026-0319",
    type: "purchase",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    party: "CV Sumber Material",
    date: "2026-10-25T11:20:00",
    dateLabel: "25 Okt 2026 · 11.20",
    paymentMethod: "transfer",
    status: "received",
    total: 3400000,
    items: [
      { name: "Semen Portland 50 kg", qty: 50, price: 68000, subtotal: 3400000, unit: "sak" },
    ],
    stockMoves: [
      { product: "Semen Portland 50 kg", change: 50, after: 120, note: "Pembelian PO-2026-0319" },
    ],
  },
  {
    id: "trx-1039",
    invoice: "INV-2026-0039",
    type: "sale",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    party: "Pemilik",
    date: "2026-10-24T14:30:00",
    dateLabel: "24 Okt 2026 · 14.30",
    paymentMethod: "cash",
    status: "paid",
    total: 253000,
    items: [
      { name: "Lampu LED 12 W", qty: 4, price: 32000, subtotal: 128000, unit: "pcs" },
      { name: "Kabel NYM 2x1,5 mm", qty: 10, price: 12500, subtotal: 125000, unit: "meter" },
    ],
    stockMoves: [
      { product: "Lampu LED 12 W", change: -4, after: 20, note: "Penjualan INV-2026-0039" },
      { product: "Kabel NYM 2x1,5 mm", change: -10, after: 70, note: "Penjualan INV-2026-0039" },
    ],
  },
  {
    id: "trx-1038",
    invoice: "INV-2026-0038",
    type: "sale",
    storeId: "furniture",
    store: "Kasandra Furniture",
    party: "Pemilik",
    date: "2026-10-23T13:10:00",
    dateLabel: "23 Okt 2026 · 13.10",
    paymentMethod: "transfer",
    status: "cancelled",
    total: 1250000,
    items: [
      { name: "Meja Kerja 120 cm", qty: 1, price: 1250000, subtotal: 1250000, unit: "pcs" },
    ],
    stockMoves: [],
  },
  {
    id: "trx-0318",
    invoice: "PO-2026-0318",
    type: "purchase",
    storeId: "atk",
    store: "Dewi Foto Copy",
    party: "PT Kertas Nusantara",
    date: "2026-10-22T09:00:00",
    dateLabel: "22 Okt 2026 · 09.00",
    paymentMethod: "cash",
    status: "received",
    total: 1030000,
    items: [
      { name: "Kertas A4 80 gsm", qty: 20, price: 44000, subtotal: 880000, unit: "rim" },
      { name: "Pulpen Gel 0,5 mm", qty: 50, price: 3000, subtotal: 150000, unit: "pcs" },
    ],
    stockMoves: [
      { product: "Kertas A4 80 gsm", change: 20, after: 36, note: "Pembelian PO-2026-0318" },
      { product: "Pulpen Gel 0,5 mm", change: 50, after: 150, note: "Pembelian PO-2026-0318" },
    ],
  },
  {
    id: "trx-1037",
    invoice: "INV-2026-0037",
    type: "sale",
    storeId: "pupuk",
    store: "Rezeki Tani",
    party: "Pemilik",
    date: "2026-10-20T10:15:00",
    dateLabel: "20 Okt 2026 · 10.15",
    paymentMethod: "cash",
    status: "paid",
    total: 975000,
    items: [
      { name: "Pupuk NPK 25 kg", qty: 5, price: 195000, subtotal: 975000, unit: "karung" },
    ],
    stockMoves: [
      { product: "Pupuk NPK 25 kg", change: -5, after: 9, note: "Penjualan INV-2026-0037" },
    ],
  },
  {
    id: "trx-0317",
    invoice: "PO-2026-0317",
    type: "purchase",
    storeId: "listrik",
    store: "Gemilang Elektronik",
    party: "CV Terang Abadi",
    date: "2026-10-18T15:40:00",
    dateLabel: "18 Okt 2026 · 15.40",
    paymentMethod: "transfer",
    status: "received",
    total: 1960000,
    items: [
      { name: "Lampu LED 12 W", qty: 30, price: 32000, subtotal: 960000, unit: "pcs" },
      { name: "Kabel NYM 2x1,5 mm", qty: 100, price: 10000, subtotal: 1000000, unit: "meter" },
    ],
    stockMoves: [
      { product: "Lampu LED 12 W", change: 30, after: 24, note: "Pembelian PO-2026-0317" },
      { product: "Kabel NYM 2x1,5 mm", change: 100, after: 80, note: "Pembelian PO-2026-0317" },
    ],
  },
  {
    id: "trx-1036",
    invoice: "INV-2026-0036",
    type: "sale",
    storeId: "bangunan",
    store: "Central Jaya Bangunan",
    party: "Pemilik",
    date: "2026-10-15T11:05:00",
    dateLabel: "15 Okt 2026 · 11.05",
    paymentMethod: "cash",
    status: "paid",
    total: 290000,
    items: [
      { name: "Cat Tembok 5 kg", qty: 2, price: 145000, subtotal: 290000, unit: "pail" },
    ],
    stockMoves: [
      { product: "Cat Tembok 5 kg", change: -2, after: 14, note: "Penjualan INV-2026-0036" },
    ],
  },
];

const TYPE_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "sale", label: "Penjualan" },
  { value: "purchase", label: "Pembelian" },
];

const PERIOD_OPTIONS = [
  { value: "7", label: "7 hari terakhir" },
  { value: "30", label: "30 hari terakhir" },
  { value: "month", label: "Bulan ini" },
];

function formatPrice(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

function matchesPeriod(dateString, period) {
  const date = new Date(dateString);
  if (period === "month") {
    return (
      date >= new Date("2026-10-01T00:00:00") &&
      date <= new Date("2026-10-31T23:59:59")
    );
  }
  const start = new Date(REFERENCE_DATE);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (period === "7" ? 6 : 29));
  return date >= start && date <= REFERENCE_DATE;
}

function statusInfo(transaction) {
  if (transaction.status === "cancelled") {
    return { label: "Dibatalkan", tone: "danger" };
  }
  if (transaction.type === "purchase") {
    return { label: "Diterima", tone: "positive" };
  }
  return { label: "Lunas", tone: "positive" };
}

export default function Page() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) {
      dialog.showModal();
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const filtered = TRANSACTIONS.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStore = storeFilter === "all" || transaction.storeId === storeFilter;
    const matchesDate = matchesPeriod(transaction.date, periodFilter);
    return matchesType && matchesStore && matchesDate;
  });

  const salesTotal = filtered
    .filter((transaction) => transaction.type === "sale" && transaction.status === "paid")
    .reduce((sum, transaction) => sum + transaction.total, 0);
  const purchasesTotal = filtered
    .filter((transaction) => transaction.type === "purchase" && transaction.status === "received")
    .reduce((sum, transaction) => sum + transaction.total, 0);
  const cancelledCount = filtered.filter(
    (transaction) => transaction.type === "sale" && transaction.status === "cancelled"
  ).length;

  const storeLabel =
    storeFilter === "all"
      ? "Semua toko"
      : STORES.find((store) => store.id === storeFilter)?.name || "Semua toko";
  const periodLabel =
    PERIOD_OPTIONS.find((option) => option.value === periodFilter)?.label || "Bulan ini";

  function resetFilters() {
    setTypeFilter("all");
    setStoreFilter("all");
    setPeriodFilter("month");
  }

  function closeDialog() {
    setSelected(null);
  }

  const selectedStatus = selected ? statusInfo(selected) : null;

  return (
    <div className="riwayat-root">
      <header className="riwayat-header">
        <div className="riwayat-header-copy">
          <p className="riwayat-kicker">Operasional</p>
          <h1 className="riwayat-title">Riwayat transaksi.</h1>
          <p className="riwayat-lede">
            Telusuri penjualan dan pembelian lima toko, lengkap dengan jejak perubahan stok.
          </p>
        </div>
        <div className="riwayat-header-actions">
          <span className="riwayat-chip">
            <iconify-icon icon="lucide:info" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
            Data contoh
          </span>
          <a className="riwayat-secondary" href="/kasir">
            Buka kasir
            <iconify-icon icon="lucide:arrow-right" aria-hidden="true" style={{ fontSize: "14px" }}></iconify-icon>
          </a>
        </div>
      </header>

      <section className="riwayat-filter-panel" aria-label="Filter riwayat transaksi">
        <div className="riwayat-filter-grid">
          <div className="riwayat-field">
            <span className="riwayat-label">Jenis</span>
            <div className="riwayat-segment" role="group" aria-label="Jenis transaksi">
              {TYPE_OPTIONS.map((option) => (
                <button
                  type="button"
                  className="riwayat-segment-button"
                  key={option.value}
                  aria-pressed={typeFilter === option.value}
                  onClick={() => setTypeFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="riwayat-field">
            <label className="riwayat-label" htmlFor="riwayat-store">
              Toko
            </label>
            <select
              id="riwayat-store"
              className="riwayat-select"
              value={storeFilter}
              onChange={(event) => setStoreFilter(event.target.value)}
            >
              <option value="all">Semua toko</option>
              {STORES.map((store) => (
                <option value={store.id} key={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="riwayat-field">
            <label className="riwayat-label" htmlFor="riwayat-period">
              Periode
            </label>
            <select
              id="riwayat-period"
              className="riwayat-select"
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
            >
              {PERIOD_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="riwayat-filter-end">
            <button type="button" className="riwayat-reset" onClick={resetFilters}>
              Reset filter
            </button>
          </div>
        </div>

        <p className="riwayat-filter-summary" role="status" aria-live="polite" aria-atomic="true">
          Menampilkan <strong style={{ color: "var(--color-text)", fontWeight: "var(--weight-semibold)" }}>{filtered.length}</strong>{" "}
          transaksi · {storeLabel} · {periodLabel}
        </p>
      </section>

      <section className="riwayat-summary" aria-label="Ringkasan transaksi">
        <div className="riwayat-summary-grid">
          <div>
            <p className="riwayat-metric-label">Transaksi</p>
            <p className="riwayat-metric-value">{filtered.length}</p>
            <p className="riwayat-metric-sub">Sesuai filter</p>
          </div>
          <div>
            <p className="riwayat-metric-label">Penjualan</p>
            <p className="riwayat-metric-value">{formatPrice(salesTotal)}</p>
            <p className="riwayat-metric-sub">Transaksi lunas</p>
          </div>
          <div>
            <p className="riwayat-metric-label">Pembelian</p>
            <p className="riwayat-metric-value">{formatPrice(purchasesTotal)}</p>
            <p className="riwayat-metric-sub">Barang masuk diterima</p>
          </div>
          <div>
            <p className="riwayat-metric-label">Dibatalkan</p>
            <p className="riwayat-metric-value">{cancelledCount}</p>
            <p className="riwayat-metric-sub">Stok tidak berubah</p>
          </div>
        </div>
      </section>

      <section className="riwayat-table-card">
        <div className="riwayat-panel-head">
          <div>
            <h2 className="riwayat-panel-title">Daftar transaksi</h2>
            <p className="riwayat-panel-sub">
              Penjualan dan pembelian terbaru dari toko yang dipilih.
            </p>
          </div>
          <span className="riwayat-count">{filtered.length} transaksi</span>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="riwayat-table-scroll">
              <table className="riwayat-table">
                <caption className="riwayat-sr-only">
                  Daftar transaksi penjualan dan pembelian
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Invoice</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Toko</th>
                    <th scope="col">Jenis</th>
                    <th scope="col">Pihak</th>
                    <th scope="col" style={{ textAlign: "right" }}>
                      Total
                    </th>
                    <th scope="col">Status</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((transaction) => {
                    const status = statusInfo(transaction);
                    const cancelled = transaction.status === "cancelled";
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <span className="riwayat-invoice">{transaction.invoice}</span>
                        </td>
                        <td>{transaction.dateLabel}</td>
                        <td>
                          <span className="store-cell">
                            <img
                              className="store-cell-logo"
                              src={storeLogos[transaction.storeId]}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                            {transaction.store}
                          </span>
                        </td>
                        <td>
                          <span className="riwayat-type">
                            {transaction.type === "sale" ? "Penjualan" : "Pembelian"}
                          </span>
                        </td>
                        <td>{transaction.party}</td>
                        <td className="riwayat-total" data-cancelled={cancelled ? "true" : "false"}>
                          {formatPrice(transaction.total)}
                        </td>
                        <td>
                          <span className="riwayat-status">
                            <iconify-icon
                              className="riwayat-status-icon"
                              data-tone={status.tone}
                              icon={
                                status.tone === "danger"
                                  ? "lucide:x-circle"
                                  : "lucide:circle-check"
                              }
                              aria-hidden="true"
                              style={{ fontSize: "14px" }}
                            ></iconify-icon>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="riwayat-detail-button"
                            onClick={() => setSelected(transaction)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="riwayat-table-hint">
              Geser tabel untuk melihat semua kolom.
            </p>
          </>
        ) : (
          <div className="riwayat-empty" role="status">
            <iconify-icon
              icon="lucide:search-x"
              aria-hidden="true"
              style={{ flex: "0 0 auto", fontSize: "24px", color: "var(--color-text-muted)" }}
            ></iconify-icon>
            <div className="riwayat-empty-copy">
              <h3 className="riwayat-empty-title">Tidak ada transaksi</h3>
              <p className="riwayat-empty-text">
                Ubah jenis, toko, atau periode untuk melihat transaksi lain.
              </p>
              <button type="button" className="riwayat-reset" onClick={resetFilters}>
                Reset filter
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="riwayat-sample-note">
        <iconify-icon icon="lucide:info" aria-hidden="true" style={{ flex: "0 0 auto", fontSize: "14px" }}></iconify-icon>
        Data transaksi contoh. Riwayat ini belum terhubung ke database atau transaksi nyata.
      </p>

      <dialog
        ref={dialogRef}
        className="riwayat-dialog"
        aria-labelledby="riwayat-dialog-title"
        onClose={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        {selected ? (
          <div className="riwayat-dialog-inner">
            <div className="riwayat-dialog-top">
              <span className="riwayat-status">
                <iconify-icon
                  className="riwayat-status-icon"
                  data-tone={selectedStatus.tone}
                  icon={selectedStatus.tone === "danger" ? "lucide:x-circle" : "lucide:circle-check"}
                  aria-hidden="true"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {selectedStatus.label}
              </span>
              <button
                type="button"
                className="riwayat-dialog-close"
                aria-label="Tutup detail transaksi"
                onClick={() => dialogRef.current?.close()}
              >
                <iconify-icon icon="lucide:x" aria-hidden="true" style={{ fontSize: "18px" }}></iconify-icon>
              </button>
            </div>

            <h2 className="riwayat-dialog-title" id="riwayat-dialog-title">
              {selected.invoice}
            </h2>
            <p className="riwayat-dialog-sub">
              {selected.type === "sale" ? "Penjualan" : "Pembelian"} · {selected.store}
            </p>

            <dl className="riwayat-dialog-meta">
              <dt>Tanggal</dt>
              <dd>{selected.dateLabel}</dd>
              <dt>{selected.type === "sale" ? "Kasir" : "Pemasok"}</dt>
              <dd>{selected.party}</dd>
              <dt>Metode bayar</dt>
              <dd>{selected.paymentMethod === "cash" ? "Tunai" : "Transfer"}</dd>
              <dt>Status</dt>
              <dd>{selectedStatus.label}</dd>
            </dl>

            <div className="riwayat-items">
              {selected.items.map((item) => (
                <div className="riwayat-item" key={item.name}>
                  <div className="riwayat-item-copy">
                    <span className="riwayat-item-name">{item.name}</span>
                    <span className="riwayat-item-meta">
                      {item.qty} × {formatPrice(item.price)} / {item.unit}
                    </span>
                  </div>
                  <span className="riwayat-item-subtotal">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="riwayat-dialog-total">
              <span className="riwayat-dialog-total-label">Total</span>
              <span className="riwayat-dialog-total-value">{formatPrice(selected.total)}</span>
            </div>

            <h3 className="riwayat-stock-heading">Jejak perubahan stok</h3>
            {selected.stockMoves.length > 0 ? (
              <ul className="riwayat-stock-list">
                {selected.stockMoves.map((move) => (
                  <li className="riwayat-stock-item" key={move.product}>
                    <div className="riwayat-stock-copy">
                      <span className="riwayat-stock-name">{move.product}</span>
                      <span className="riwayat-stock-note">
                        {move.note} · stok akhir {move.after}
                      </span>
                    </div>
                    <span
                      className="riwayat-stock-change"
                      data-tone={move.change > 0 ? "positive" : "negative"}
                    >
                      {move.change > 0 ? "+" + move.change : move.change}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="riwayat-stock-empty">
                Transaksi dibatalkan. Tidak ada perubahan stok yang tercatat.
              </p>
            )}

            <p className="riwayat-dialog-note">
              Data contoh. Detail ini belum terhubung ke database transaksi.
            </p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
