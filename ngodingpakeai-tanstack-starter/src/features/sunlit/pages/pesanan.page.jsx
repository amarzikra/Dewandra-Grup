import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatDateTime,
  formatPrice,
  paymentMethodLabel,
} from "@/features/sunlit/format";
import {
  getOrderStatus,
  orderStatusDescription,
} from "@/features/sunlit/order-status";

const STATUS_TABS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Belum bayar" },
  { value: "awaiting_confirmation", label: "Perlu verifikasi" },
  { value: "processing", label: "Diproses" },
  { value: "ready", label: "Siap" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const ACTION_LABELS = {
  "confirm-payment": "Mengonfirmasi...",
  "mark-ready": "Menyimpan...",
  "mark-completed": "Menyelesaikan...",
  cancel: "Membatalkan...",
};

function waLink(phone) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export default function PesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [proof, setProof] = useState({ orderId: "", url: "", type: "" });
  const dialogRef = useRef(null);

  const selected = orders.find((order) => order.id === selectedId) ?? null;
  const proofUrl =
    selected && proof.orderId === selected.id ? proof.url : "";
  const proofType =
    selected && proof.orderId === selected.id ? proof.type : "";

  function loadOrders() {
    setLoading(true);
    setError("");
    setRefreshKey((value) => value + 1);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/orders")
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok)
          throw new Error(
            payload?.error?.message || "Pesanan gagal dimuat. Coba lagi.",
          );
        if (active) {
          setOrders(payload.data ?? []);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  useEffect(() => {
    if (!selected?.hasProof) return;
    let cancelled = false;
    let objectUrl = "";
    fetch(`/api/orders/${selected.id}/proof`)
      .then(async (response) => {
        if (!response.ok) throw new Error("proof");
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setProof({
            orderId: selected.id,
            url: objectUrl,
            type: blob.type,
          });
        }
      })
      .catch(() => {
        // Keep the last proof hidden by the order-id guard when loading fails.
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selected?.id, selected?.hasProof, selected?.paymentProofUploadedAt]);

  function closeDialog() {
    setSelectedId(null);
  }

  const counts = useMemo(() => {
    return {
      total: orders.length,
      awaiting: orders.filter(
        (order) => order.status === "awaiting_confirmation",
      ).length,
      processing: orders.filter((order) => order.status === "processing")
        .length,
      paidValue: orders
        .filter((order) =>
          ["processing", "ready", "completed"].includes(order.status),
        )
        .reduce((sum, order) => sum + order.totalAmount, 0),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesQuery =
        !needle ||
        [order.orderNumber, order.customerName, order.customerPhone]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, query]);

  async function runAction(action) {
    if (!selected || busy) return;
    let reason = "";
    if (action === "confirm-payment") {
      const warning =
        selected.paymentMethod === "cash"
          ? "\n\nPesanan ini dibayar tunai. Pastikan uang sudah diterima."
          : selected.hasProof
            ? ""
            : "\n\nBelum ada bukti bayar. Pastikan dana sudah diterima.";
      if (
        !window.confirm(
          `Konfirmasi pembayaran ${selected.orderNumber}? Stok akan berkurang dan penjualan dicatat.${warning}`,
        )
      )
        return;
    }
    if (action === "cancel") {
      const input = window.prompt(
        "Alasan pembatalan (opsional):",
        "Dibatalkan oleh admin",
      );
      if (input === null) return;
      if (!window.confirm("Batalkan pesanan ini?")) return;
      reason = input.trim();
    }

    setBusy(action);
    setNotice("");
    try {
      const response = await fetch(`/api/orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(payload?.error?.message || "Aksi gagal dijalankan.");
      const updated = payload.data;
      setOrders((previous) =>
        previous.map((order) => (order.id === updated.id ? updated : order)),
      );
      setNotice(
        action === "confirm-payment"
          ? "Pembayaran dikonfirmasi. Stok sudah dikurangi dan penjualan dicatat."
          : action === "cancel"
            ? "Pesanan dibatalkan."
            : action === "mark-ready"
              ? "Pesanan ditandai siap."
              : "Pesanan diselesaikan.",
      );
    } catch (actionError) {
      setNotice(actionError.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="orders-root">
      <header className="orders-header">
        <div>
          <p className="orders-kicker">Pesanan online</p>
          <h1 className="orders-title">Pesanan dari pelanggan.</h1>
          <p className="orders-lede">
            Setiap checkout publik masuk ke sini. Konfirmasi pembayaran akan
            mengurangi stok dan mencatat penjualan ke riwayat.
          </p>
        </div>
        <button
          className="orders-refresh"
          type="button"
          onClick={loadOrders}
          disabled={loading}
        >
          <iconify-icon
            icon="lucide:refresh-cw"
            aria-hidden="true"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
          {loading ? "Memuat..." : "Muat ulang"}
        </button>
      </header>

      <section className="orders-summary" aria-label="Ringkasan pesanan">
        <div className="orders-summary-card">
          <span>Perlu verifikasi</span>
          <strong>{counts.awaiting}</strong>
        </div>
        <div className="orders-summary-card">
          <span>Sedang diproses</span>
          <strong>{counts.processing}</strong>
        </div>
        <div className="orders-summary-card">
          <span>Total pesanan</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="orders-summary-card">
          <span>Nilai terbayar</span>
          <strong>{formatPrice(counts.paidValue)}</strong>
        </div>
      </section>

      {notice ? (
        <p className="orders-notice" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <div className="orders-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadOrders}>
            Coba lagi
          </button>
        </div>
      ) : null}

      <section className="orders-panel" aria-label="Daftar pesanan">
        <div className="orders-toolbar">
          <div className="orders-tabs" role="tablist" aria-label="Filter status">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.value}
                className="orders-tab"
                data-active={statusFilter === tab.value}
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="orders-search">
            <iconify-icon
              icon="lucide:search"
              aria-hidden="true"
              style={{ fontSize: "18px" }}
            ></iconify-icon>
            <input
              type="search"
              value={query}
              placeholder="Cari kode, nama, atau nomor HP"
              aria-label="Cari pesanan"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="orders-empty">Memuat pesanan...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <iconify-icon
              icon="lucide:inbox"
              aria-hidden="true"
              style={{ fontSize: "28px", color: "var(--color-text-muted)" }}
            ></iconify-icon>
            <h2>Tidak ada pesanan.</h2>
            <p>
              {orders.length === 0
                ? "Pesanan baru dari checkout publik akan muncul di sini."
                : "Tidak ada pesanan yang cocok dengan filter."}
            </p>
            {orders.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setQuery("");
                }}
              >
                Reset filter
              </button>
            ) : null}
          </div>
        ) : (
          <div className="orders-table">
            <div className="orders-table-head" aria-hidden="true">
              <span>Kode</span>
              <span>Pembeli</span>
              <span>Barang</span>
              <span>Total</span>
              <span>Status</span>
              <span>Waktu</span>
            </div>
            {filteredOrders.map((order) => {
              const status = getOrderStatus(order.status);
              return (
                <button
                  className="orders-row"
                  type="button"
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                >
                  <span className="orders-code">{order.orderNumber}</span>
                  <span className="orders-customer">
                    <strong>{order.customerName}</strong>
                    <small>{order.customerPhone}</small>
                  </span>
                  <span className="orders-items">
                    {order.items.length} jenis
                  </span>
                  <span className="orders-total">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <span className="order-status" data-tone={status.tone}>
                    {status.label}
                  </span>
                  <span className="orders-date">
                    {formatDateTime(order.createdAt)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <dialog
        ref={dialogRef}
        className="orders-dialog"
        aria-labelledby="orders-dialog-title"
        onClose={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {selected ? (
          <div className="orders-dialog-inner">
            <div className="orders-dialog-head">
              <div>
                <p className="orders-code">{selected.orderNumber}</p>
                <h2 className="orders-dialog-title" id="orders-dialog-title">
                  {selected.customerName}
                </h2>
                <p className="orders-dialog-date">
                  {formatDateTime(selected.createdAt)}
                </p>
              </div>
              <div className="orders-dialog-head-right">
                <span
                  className="order-status"
                  data-tone={getOrderStatus(selected.status).tone}
                >
                  {getOrderStatus(selected.status).label}
                </span>
                <button
                  className="orders-dialog-close"
                  type="button"
                  aria-label="Tutup detail pesanan"
                  onClick={() => dialogRef.current?.close()}
                >
                  <iconify-icon
                    icon="lucide:x"
                    aria-hidden="true"
                    style={{ fontSize: "18px" }}
                  ></iconify-icon>
                </button>
              </div>
            </div>

            <p className="orders-dialog-description">
              {orderStatusDescription(
                selected.status,
                selected.paymentMethod,
              )}
            </p>

            <div className="orders-detail-grid">
              <div>
                <h3 className="orders-subtitle">Pembeli</h3>
                <p className="orders-info-row">
                  <span>WhatsApp</span>
                  <a
                    href={waLink(selected.customerPhone)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selected.customerPhone}
                  </a>
                </p>
                <p className="orders-info-row">
                  <span>Penerimaan</span>
                  <strong>
                    {selected.fulfillmentMethod === "pickup"
                      ? "Ambil di toko"
                      : "Dikirim"}
                  </strong>
                </p>
                {selected.customerAddress ? (
                  <p className="orders-info-row">
                    <span>Alamat</span>
                    <strong>{selected.customerAddress}</strong>
                  </p>
                ) : null}
                {selected.notes ? (
                  <p className="orders-info-row">
                    <span>Catatan</span>
                    <strong>{selected.notes}</strong>
                  </p>
                ) : null}
                <p className="orders-info-row">
                  <span>Pembayaran</span>
                  <strong>
                    {paymentMethodLabel(selected.paymentMethod)}
                  </strong>
                </p>
              </div>

              <div>
                <h3 className="orders-subtitle">Barang</h3>
                <div className="orders-items-list">
                  {selected.items.map((item) => (
                    <div className="orders-item" key={item.productId}>
                      <div>
                        <span className="orders-item-store">
                          {item.storeName}
                        </span>
                        <strong>{item.productName}</strong>
                        <small>
                          {item.qty} {item.unit} × {formatPrice(item.unitPrice)}
                        </small>
                      </div>
                      <span>{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="orders-total-row">
                  <span>Total</span>
                  <strong>{formatPrice(selected.totalAmount)}</strong>
                </div>
              </div>
            </div>

            <div className="orders-proof-block">
              <h3 className="orders-subtitle">Bukti pembayaran</h3>
              {selected.paymentMethod === "cash" ? (
                <p className="orders-muted">
                  Pembayaran tunai. Konfirmasi setelah uang diterima.
                </p>
              ) : selected.hasProof ? (
                proofUrl ? (
                  proofType.startsWith("image/") ? (
                    <a
                      className="orders-proof-image"
                      href={proofUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={proofUrl} alt="Bukti pembayaran pesanan" />
                      <span>Buka ukuran penuh</span>
                    </a>
                  ) : (
                    <a
                      className="orders-proof-file"
                      href={proofUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <iconify-icon
                        icon="lucide:file-text"
                        aria-hidden="true"
                        style={{ fontSize: "20px" }}
                      ></iconify-icon>
                      Buka bukti PDF
                    </a>
                  )
                ) : (
                  <p className="orders-muted">Memuat bukti...</p>
                )
              ) : (
                <p className="orders-muted">
                  Belum ada bukti. Konfirmasi hanya jika dana sudah benar-benar
                  diterima.
                </p>
              )}
            </div>

            <div className="orders-actions">
              {["pending", "awaiting_confirmation"].includes(
                selected.status,
              ) ? (
                <button
                  className="orders-button"
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => runAction("confirm-payment")}
                >
                  <iconify-icon
                    icon="lucide:check"
                    aria-hidden="true"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                  {busy === "confirm-payment"
                    ? ACTION_LABELS["confirm-payment"]
                    : "Konfirmasi pembayaran"}
                </button>
              ) : null}
              {selected.status === "processing" ? (
                <button
                  className="orders-button"
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => runAction("mark-ready")}
                >
                  <iconify-icon
                    icon="lucide:package-check"
                    aria-hidden="true"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                  {busy === "mark-ready"
                    ? ACTION_LABELS["mark-ready"]
                    : "Tandai siap"}
                </button>
              ) : null}
              {selected.status === "ready" ? (
                <button
                  className="orders-button"
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => runAction("mark-completed")}
                >
                  <iconify-icon
                    icon="lucide:badge-check"
                    aria-hidden="true"
                    style={{ fontSize: "16px" }}
                  ></iconify-icon>
                  {busy === "mark-completed"
                    ? ACTION_LABELS["mark-completed"]
                    : "Selesaikan pesanan"}
                </button>
              ) : null}
              {["pending", "awaiting_confirmation", "processing", "ready"].includes(
                selected.status,
              ) ? (
                <button
                  className="orders-button orders-button-danger"
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => runAction("cancel")}
                >
                  {busy === "cancel"
                    ? ACTION_LABELS.cancel
                    : "Batalkan pesanan"}
                </button>
              ) : null}
              <button
                className="orders-button orders-button-plain"
                type="button"
                onClick={() => dialogRef.current?.close()}
              >
                Tutup
              </button>
            </div>
            <p className="orders-dialog-note">
              Konfirmasi pembayaran membuat transaksi penjualan dan mengurangi
              stok. Pembatalan setelah pembayaran dikonfirmasi akan
              mengembalikan stok.
            </p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
