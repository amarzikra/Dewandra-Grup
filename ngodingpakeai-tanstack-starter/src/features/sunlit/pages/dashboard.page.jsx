import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { storeLogos } from "@/config/dewandra";

const STORES = [
  {
    id: "pupuk",
    name: "Rezeki Tani",
    category: "Pupuk & pertanian",
    icon: "lucide:sprout",
    sales: [18.2, 19.5, 21.1, 20.4, 22.8, 24.6],
    purchases: [10.4, 11.2, 12.1, 11.8, 12.9, 13.8],
    transactions: [286, 302, 318, 309, 334, 352],
    inventory: 68.2,
    lowStock: 0,
  },
  {
    id: "bangunan",
    name: "Central Jaya Bangunan",
    category: "Material bangunan",
    icon: "lucide:hammer",
    sales: [32.4, 30.8, 35.2, 33.1, 36.7, 38.9],
    purchases: [18.2, 17.6, 20.4, 19.8, 21.2, 22.6],
    transactions: [214, 205, 226, 219, 238, 251],
    inventory: 94.6,
    lowStock: 1,
  },
  {
    id: "atk",
    name: "Dewi Foto Copy",
    category: "Alat tulis kantor",
    icon: "lucide:pencil",
    sales: [12.1, 12.8, 13.4, 13.9, 14.2, 15.1],
    purchases: [6.8, 7.1, 7.6, 7.8, 8.1, 8.5],
    transactions: [428, 441, 452, 460, 471, 489],
    inventory: 28.4,
    lowStock: 3,
  },
  {
    id: "listrik",
    name: "Gemilang Elektronik",
    category: "Peralatan listrik",
    icon: "lucide:plug",
    sales: [16.8, 17.4, 18.2, 17.9, 19.3, 20.5],
    purchases: [9.2, 9.8, 10.4, 10.1, 11.2, 11.8],
    transactions: [196, 203, 211, 208, 219, 228],
    inventory: 39.8,
    lowStock: 1,
  },
  {
    id: "furniture",
    name: "Kasandra Furniture",
    category: "Mebel & interior",
    icon: "lucide:sofa",
    sales: [22.5, 24.1, 23.8, 26.2, 27.4, 29.3],
    purchases: [13.4, 14.1, 13.9, 15.2, 16.1, 17.5],
    transactions: [58, 61, 59, 66, 69, 74],
    inventory: 81.8,
    lowStock: 0,
  },
];

const MONTHS = ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];

const PERIOD_OPTIONS = [
  {
    value: "current",
    label: "Bulan ini · Okt 2026",
    short: "Oktober 2026",
    monthIndex: 5,
  },
  {
    value: "previous",
    label: "Bulan lalu · Sep 2026",
    short: "September 2026",
    monthIndex: 4,
  },
];

const STORE_OPTIONS = [
  { value: "all", label: "Semua toko" },
  ...STORES.map((store) => ({ value: store.id, label: store.name })),
];

const PANEL_STYLE = {
  background: "var(--color-surface)",
  border: "var(--border-hairline) solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  padding: "var(--space-6)",
};

const H2_STYLE = {
  margin: 0,
  fontFamily: "var(--font-ui)",
  fontSize: "var(--text-heading-sm)",
  fontWeight: "var(--weight-medium)",
  lineHeight: "var(--leading-heading-sm)",
  letterSpacing: "var(--tracking-label)",
  color: "var(--color-text)",
};

const SUBTITLE_STYLE = {
  margin: "var(--space-1) 0 0",
  fontSize: "var(--text-body-sm)",
  lineHeight: "var(--leading-body-sm)",
  color: "var(--color-text-muted)",
};

const LABEL_STYLE = {
  fontSize: "var(--text-label-sm)",
  fontWeight: "var(--weight-semibold)",
  color: "var(--color-text-muted)",
};

const METRIC_SUB_STYLE = {
  fontSize: "var(--text-label-sm)",
  lineHeight: "var(--leading-label-sm)",
  color: "var(--color-text-muted)",
};

function formatMillions(value) {
  return (
    "Rp " +
    value.toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) +
    " jt"
  );
}

function formatCompact(value) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatNumber(value) {
  return value.toLocaleString("id-ID");
}

function formatPercent(value) {
  return (
    Math.abs(value).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
}

function getDelta(current, previous) {
  if (!previous) {
    return null;
  }
  return ((current - previous) / previous) * 100;
}

function Delta({ current, previous, neutral }) {
  const delta = getDelta(current, previous);
  if (delta === null) {
    return <span style={METRIC_SUB_STYLE}>—</span>;
  }
  const tone = neutral ? "neutral" : delta >= 0 ? "positive" : "negative";
  const icon = delta >= 0 ? "lucide:arrow-up-right" : "lucide:arrow-down-right";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--space-1)",
        fontSize: "var(--text-label-sm)",
        lineHeight: "var(--leading-label-sm)",
        color: "var(--color-text-muted)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          color: "var(--color-text-soft)",
          fontWeight: "var(--weight-medium)",
        }}
      >
        <iconify-icon
          className="dashboard-delta-icon"
          data-tone={tone}
          icon={icon}
          aria-hidden="true"
          style={{ fontSize: "14px" }}
        ></iconify-icon>
        {formatPercent(delta)}
      </span>
      <span>vs bulan lalu</span>
    </span>
  );
}

function Panel({ className, label, children }) {
  const classes = className ? "dashboard-panel " + className : "dashboard-panel";
  return (
    <section
      className={classes}
      aria-label={label}
      style={PANEL_STYLE}
    >
      {children}
    </section>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="dashboard-metric">
      <p style={{ margin: 0, ...LABEL_STYLE }}>{label}</p>
      <p
        style={{
          margin: "var(--space-2) 0 0",
          fontFamily: "var(--font-ui)",
          fontSize: "var(--text-heading-sm)",
          fontWeight: "var(--weight-medium)",
          lineHeight: "var(--leading-heading-sm)",
          letterSpacing: "var(--tracking-label)",
          color: "var(--color-text)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
      <div style={{ marginTop: "var(--space-1)", minHeight: "18px" }}>{sub}</div>
    </div>
  );
}

function FilterBar({ storeId, period, onStoreChange, onPeriodChange, storeLabel, periodLabel }) {
  return (
    <div className="dashboard-filters">
      <div className="dashboard-filter-row">
        <div className="dashboard-filter">
          <label htmlFor="dashboard-store" style={LABEL_STYLE}>
            Toko
          </label>
          <select
            id="dashboard-store"
            className="dashboard-select"
            value={storeId}
            onChange={(event) => onStoreChange(event.target.value)}
          >
            {STORE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="dashboard-filter">
          <label htmlFor="dashboard-period" style={LABEL_STYLE}>
            Periode
          </label>
          <select
            id="dashboard-period"
            className="dashboard-select"
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <span className="dashboard-sample-chip">
          <iconify-icon
            icon="lucide:info"
            aria-hidden="true"
            style={{ fontSize: "14px" }}
          ></iconify-icon>
          Data contoh
        </span>
      </div>
      <p
        className="dashboard-filter-summary"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Menampilkan{" "}
        <strong style={{ color: "var(--color-text)", fontWeight: "var(--weight-semibold)" }}>
          {storeLabel}
        </strong>{" "}
        · {periodLabel}
      </p>
    </div>
  );
}

function SummaryCard({ stores, periodIndex }) {
  const previousIndex = Math.max(0, periodIndex - 1);
  const totals = stores.reduce(
    (acc, store) => ({
      sales: acc.sales + store.sales[periodIndex],
      purchases: acc.purchases + store.purchases[periodIndex],
      transactions: acc.transactions + store.transactions[periodIndex],
      previousSales: acc.previousSales + store.sales[previousIndex],
      previousPurchases: acc.previousPurchases + store.purchases[previousIndex],
      previousTransactions: acc.previousTransactions + store.transactions[previousIndex],
      inventory: acc.inventory + store.inventory,
    }),
    {
      sales: 0,
      purchases: 0,
      transactions: 0,
      previousSales: 0,
      previousPurchases: 0,
      previousTransactions: 0,
      inventory: 0,
    }
  );

  return (
    <Panel className="dashboard-summary" label="Ringkasan periode">
      <div className="dashboard-summary-grid">
        <Metric
          label="Penjualan"
          value={formatMillions(totals.sales)}
          sub={<Delta current={totals.sales} previous={totals.previousSales} />}
        />
        <Metric
          label="Pembelian"
          value={formatMillions(totals.purchases)}
          sub={
            <Delta
              current={totals.purchases}
              previous={totals.previousPurchases}
              neutral
            />
          }
        />
        <Metric
          label="Nilai persediaan"
          value={formatMillions(totals.inventory)}
          sub={
            <span style={METRIC_SUB_STYLE}>
              Nilai saat ini
              {stores.length > 1 ? " · " + stores.length + " toko" : ""}
            </span>
          }
        />
        <Metric
          label="Transaksi"
          value={formatNumber(totals.transactions)}
          sub={
            <Delta
              current={totals.transactions}
              previous={totals.previousTransactions}
            />
          }
        />
      </div>
    </Panel>
  );
}

function ChartCard({ stores, periodIndex, storeLabel }) {
  const values = MONTHS.map((_, index) =>
    stores.reduce((sum, store) => sum + store.sales[index], 0)
  );
  const max = Math.max(...values, 1);
  const currentMonth = MONTHS[periodIndex];
  const accessibleSummary = MONTHS.map(
    (month, index) => month + ": " + formatMillions(values[index])
  ).join("; ");

  return (
    <Panel className="dashboard-chart">
      <div className="dashboard-section-head">
        <div>
          <h2 style={H2_STYLE}>Tren penjualan</h2>
          <p style={SUBTITLE_STYLE}>6 bulan terakhir · {storeLabel}</p>
        </div>
        <div className="dashboard-legend" aria-hidden="true">
          <span className="dashboard-legend-item">
            <span className="dashboard-legend-swatch" data-current="true"></span>
            Bulan dipilih
          </span>
          <span className="dashboard-legend-item">
            <span className="dashboard-legend-swatch"></span>
            Bulan lain
          </span>
        </div>
      </div>

      <p className="dashboard-sr-only">
        Tren penjualan {storeLabel} enam bulan terakhir. {accessibleSummary}. Bulan
        dipilih: {currentMonth}.
      </p>

      <div className="dashboard-chart-plot" aria-hidden="true">
        {values.map((value, index) => {
          const percentage = Math.max(4, (value / max) * 100);
          const isCurrent = index === periodIndex;
          return (
            <div className="dashboard-chart-col" key={MONTHS[index]}>
              <div className="dashboard-chart-track">
                <div
                  className="dashboard-chart-bar-wrap"
                  style={{ height: percentage + "%" }}
                >
                  <span
                    className="dashboard-chart-value"
                    data-current={isCurrent ? "true" : "false"}
                  >
                    {formatCompact(value)}
                  </span>
                  <div
                    className="dashboard-chart-bar"
                    data-current={isCurrent ? "true" : "false"}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="dashboard-chart-months" aria-hidden="true">
        {MONTHS.map((month, index) => (
          <span
            className="dashboard-chart-month"
            data-current={index === periodIndex ? "true" : "false"}
            key={month}
          >
            {month}
          </span>
        ))}
      </div>
      <p className="dashboard-chart-caption">Nilai penjualan dalam juta rupiah.</p>
    </Panel>
  );
}

function AttentionCard({ stores, storeLabel, onAction }) {
  const alerts = stores.filter((store) => store.lowStock > 0);

  return (
    <Panel className="dashboard-attention">
      <div className="dashboard-section-head">
        <div>
          <h2 style={{ ...H2_STYLE, display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <iconify-icon
              icon="lucide:triangle-alert"
              aria-hidden="true"
              style={{ fontSize: "18px", color: "var(--color-warning)" }}
            ></iconify-icon>
            Perlu perhatian
          </h2>
          <p style={SUBTITLE_STYLE}>Barang di bawah batas minimum.</p>
        </div>
        {alerts.length > 0 ? (
          <span className="dashboard-scope-chip">{alerts.length} toko</span>
        ) : null}
      </div>

      <div className="dashboard-alert-list">
        {alerts.length > 0 ? (
          alerts.map((store) => (
            <div className="dashboard-alert-row" key={store.id}>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body-sm)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-text)",
                  }}
                >
                  {store.name}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "var(--text-label-sm)",
                    lineHeight: "var(--leading-label-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {store.lowStock} barang di bawah stok minimum
                </p>
              </div>
              <span className="dashboard-status-chip">
                <iconify-icon
                  className="dashboard-status-icon"
                  data-tone="warning"
                  icon="lucide:triangle-alert"
                  aria-hidden="true"
                  style={{ fontSize: "14px" }}
                ></iconify-icon>
                {store.lowStock} barang
              </span>
            </div>
          ))
        ) : (
          <div className="dashboard-empty">
            <iconify-icon
              icon="lucide:circle-check"
              aria-hidden="true"
              style={{ fontSize: "20px", color: "var(--color-positive)", flex: "0 0 auto" }}
            ></iconify-icon>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-body-sm)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text)",
                }}
              >
                Semua stok aman
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "var(--text-label-sm)",
                  lineHeight: "var(--leading-label-sm)",
                  color: "var(--color-text-muted)",
                }}
              >
                Tidak ada barang di bawah batas minimum untuk {storeLabel}.
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="dashboard-secondary"
        onClick={onAction}
        style={{ marginTop: "auto" }}
      >
        Lihat stok
        <iconify-icon
          icon="lucide:arrow-right"
          aria-hidden="true"
          style={{ fontSize: "14px" }}
        ></iconify-icon>
      </button>
    </Panel>
  );
}

function StoreLedger({ stores, periodIndex, storeLabel }) {
  return (
    <Panel className="dashboard-ledger-card">
      <div className="dashboard-section-head">
        <div>
          <h2 style={H2_STYLE}>Kinerja lima toko</h2>
          <p style={SUBTITLE_STYLE}>
            Penjualan dan pembelian pada periode terpilih; nilai stok saat ini.
          </p>
        </div>
        <span className="dashboard-scope-chip">{storeLabel}</span>
      </div>

      <div className="dashboard-ledger-scroll">
        <table className="dashboard-ledger">
          <caption className="dashboard-sr-only">
            Ringkasan penjualan, pembelian, nilai stok, dan status lima toko
          </caption>
          <thead>
            <tr>
              <th scope="col">Toko</th>
              <th scope="col" style={{ textAlign: "right" }}>
                Penjualan
              </th>
              <th scope="col" style={{ textAlign: "right" }}>
                Pembelian
              </th>
              <th scope="col" style={{ textAlign: "right" }}>
                Nilai stok
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              const sales = store.sales[periodIndex];
              const purchases = store.purchases[periodIndex];
              const hasAlert = store.lowStock > 0;
              return (
                <tr key={store.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        minWidth: 0,
                      }}
                    >
                      <img
                        className="dashboard-store-logo"
                        src={storeLogos[store.id]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            color: "var(--color-text)",
                            fontWeight: "var(--weight-medium)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {store.name}
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--text-label-sm)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {store.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatMillions(sales)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatMillions(purchases)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatMillions(store.inventory)}
                  </td>
                  <td>
                    <span className="dashboard-status-chip">
                      <iconify-icon
                        className="dashboard-status-icon"
                        data-tone={hasAlert ? "warning" : "positive"}
                        icon={hasAlert ? "lucide:triangle-alert" : "lucide:circle-check"}
                        aria-hidden="true"
                        style={{ fontSize: "14px" }}
                      ></iconify-icon>
                      {hasAlert ? store.lowStock + " barang menipis" : "Stok aman"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="dashboard-ledger-hint">
        Geser tabel untuk melihat semua kolom.
      </p>
    </Panel>
  );
}

export default function Page() {
  const [storeId, setStoreId] = useState("all");
  const [period, setPeriod] = useState("current");
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");

  const periodOption =
    PERIOD_OPTIONS.find((option) => option.value === period) || PERIOD_OPTIONS[0];
  const selectedStores =
    storeId === "all" ? STORES : STORES.filter((store) => store.id === storeId);
  const storeLabel =
    storeId === "all" ? "Semua toko" : selectedStores[0]?.name || "Semua toko";

  function openCashier() {
    navigate({ to: "/kasir" });
  }

  function openStock() {
    navigate({ to: "/stok" });
  }

  return (
    <div
      className="dashboard-root"
      style={{
        minHeight: "100%",
        background: "var(--color-canvas)",
        color: "var(--color-text)",
      }}
    >
      <header className="dashboard-header">
        <div style={{ maxWidth: "640px" }}>
          <h1
            className="dashboard-title"
            style={{
              margin: 0,
              fontWeight: "var(--weight-regular)",
              color: "var(--color-text)",
            }}
          >
            Ringkasan lima toko
          </h1>
          <p
            style={{
              margin: "var(--space-2) 0 0",
              fontSize: "var(--text-body-md)",
              lineHeight: "var(--leading-body-md)",
              color: "var(--color-text-muted)",
              maxWidth: "560px",
            }}
          >
            Pantau penjualan, pembelian, dan nilai persediaan dalam satu layar.
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-primary"
            onClick={openCashier}
          >
            <iconify-icon
              icon="lucide:plus"
              aria-hidden="true"
              style={{ fontSize: "18px" }}
            ></iconify-icon>
            Catat penjualan
          </button>
        </div>
      </header>

      <FilterBar
        storeId={storeId}
        period={period}
        onStoreChange={setStoreId}
        onPeriodChange={setPeriod}
        storeLabel={storeLabel}
        periodLabel={periodOption.short}
      />

      <SummaryCard stores={selectedStores} periodIndex={periodOption.monthIndex} />

      <div className="dashboard-main-grid">
        <ChartCard
          stores={selectedStores}
          periodIndex={periodOption.monthIndex}
          storeLabel={storeLabel}
        />
        <AttentionCard
          stores={selectedStores}
          storeLabel={storeLabel}
          onAction={openStock}
        />
      </div>

      <StoreLedger
        stores={selectedStores}
        periodIndex={periodOption.monthIndex}
        storeLabel={storeLabel}
      />

      <p className="dashboard-sample-note">
        <iconify-icon
          icon="lucide:info"
          aria-hidden="true"
          style={{ flex: "0 0 auto", fontSize: "14px" }}
        ></iconify-icon>
        Angka di halaman ini adalah data contoh untuk prototype. Belum terhubung
        ke database atau transaksi nyata.
      </p>

      <div
        className="dashboard-toast-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notice ? (
          <div className="dashboard-toast">
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-label-md)",
                  fontWeight: "var(--weight-semibold)",
                  color: "var(--color-text)",
                }}
              >
                Belum tersedia
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-text-muted)",
                }}
              >
                {notice}
              </p>
            </div>
            <button
              type="button"
              className="dashboard-toast-close"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              <iconify-icon
                icon="lucide:x"
                aria-hidden="true"
                style={{ fontSize: "16px" }}
              ></iconify-icon>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
