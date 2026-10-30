import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  formatDateTime,
  formatPrice,
  paymentMethodLabel,
} from "@/features/sunlit/format";
import {
  getOrderStatus,
  orderStatusDescription,
} from "@/features/sunlit/order-status";
import PaymentInstructions, {
  orderWhatsappUrl,
} from "@/features/sunlit/payment-instructions";

function isPhoneValid(value) {
  return value.replace(/\D/g, "").length >= 8;
}

const TIMELINE = [
  "Pesanan dibuat",
  "Bukti pembayaran diterima",
  "Pembayaran dikonfirmasi",
  "Selesai",
];

const CASH_TIMELINE = [
  "Pesanan dibuat",
  "Pembayaran tunai diterima",
  "Diproses",
  "Selesai",
];

export default function LacakPesananPage({ initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (!code.trim()) {
      setError("Kode pesanan wajib diisi.");
      return;
    }
    if (!isPhoneValid(phone)) {
      setError("Nomor WhatsApp wajib diisi dengan benar.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: code.trim(),
          phone: phone.trim(),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          payload?.error?.message ||
            "Pesanan tidak ditemukan. Periksa kode dan nomor WhatsApp.",
        );
      setOrder(payload.data);
    } catch (lookupError) {
      setOrder(null);
      setError(lookupError.message);
    } finally {
      setLoading(false);
    }
  }

  const status = order ? getOrderStatus(order.status) : null;
  const statusDescription = order
    ? orderStatusDescription(order.status, order.paymentMethod)
    : "";
  const timeline = order?.paymentMethod === "cash" ? CASH_TIMELINE : TIMELINE;
  const isCancelled = order?.status === "cancelled";
  const steps = order
    ? [
        true,
        Boolean(order.hasProof) ||
          ["processing", "ready", "completed"].includes(order.status),
        ["processing", "ready", "completed"].includes(order.status),
        order.status === "completed",
      ]
    : [];

  return (
    <div className="track-root">
      <header className="track-header">
        <p className="track-kicker">Lacak pesanan</p>
        <h1 className="track-title">Cek status pesanan online.</h1>
        <p className="track-lede">
          Masukkan kode pesanan dan nomor WhatsApp yang dipakai saat checkout.
        </p>
      </header>

      <div className="track-grid">
        <form className="track-form" onSubmit={submit} noValidate>
          <div className="track-field">
            <label className="track-label" htmlFor="track-code">
              Kode pesanan
            </label>
            <input
              id="track-code"
              className="track-input"
              value={code}
              placeholder="DG-20261026-XXXXXXXX"
              autoComplete="off"
              onChange={(event) => setCode(event.target.value.toUpperCase())}
            />
          </div>
          <div className="track-field">
            <label className="track-label" htmlFor="track-phone">
              Nomor WhatsApp
            </label>
            <input
              id="track-phone"
              className="track-input"
              value={phone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="08xxxxxxxxxx"
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <button className="track-submit" type="submit" disabled={loading}>
            {loading ? "Mencari..." : "Cek pesanan"}
          </button>
          {error ? (
            <p className="track-error" role="alert">
              {error}
            </p>
          ) : null}
          <p className="track-hint">
            Kode pesanan ada di halaman setelah checkout. Nomor WhatsApp harus
            sama dengan yang diisi saat memesan.
          </p>
        </form>

        <aside className="track-help">
          <h2 className="track-help-title">Butuh bantuan?</h2>
          <p>
            Kalau kode atau nomor tidak cocok, hubungi admin dengan menyebut
            nama dan tanggal pesanan.
          </p>
          <a
            className="track-wa"
            href="https://wa.me/6282142858094"
            target="_blank"
            rel="noreferrer"
          >
            Hubungi admin via WhatsApp
          </a>
          <Link className="track-catalog" to="/katalog">
            Lihat katalog lagi
          </Link>
        </aside>
      </div>

      {order ? (
        <section className="track-result" aria-labelledby="track-result-title">
          <div className="track-result-head">
            <div>
              <p className="track-result-code">{order.orderNumber}</p>
              <h2 className="track-result-title" id="track-result-title">
                Pesanan {order.customerName}
              </h2>
              <p className="track-result-date">
                Dibuat {formatDateTime(order.createdAt)}
              </p>
            </div>
            <span className="order-status" data-tone={status.tone}>
              {status.label}
            </span>
          </div>

          <p className="track-result-description">{statusDescription}</p>

          {isCancelled ? (
            <div className="track-cancelled">
              Pesanan dibatalkan
              {order.cancellationReason
                ? `: ${order.cancellationReason}`
                : "."}
            </div>
          ) : (
            <ol className="track-timeline">
              {timeline.map((label, index) => (
                <li
                  className="track-step"
                  key={label}
                  data-done={steps[index] ? "true" : "false"}
                >
                  <span className="track-step-dot" aria-hidden="true"></span>
                  <span>{label}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="track-detail-grid">
            <div>
              <h3 className="track-subtitle">Barang</h3>
              <div className="track-items">
                {order.items.map((item) => (
                  <div className="track-item" key={item.productId}>
                    <div>
                      <span className="track-item-store">
                        {item.storeName}
                      </span>
                      <strong className="track-item-name">
                        {item.productName}
                      </strong>
                      <span className="track-item-meta">
                        {item.qty} {item.unit} × {formatPrice(item.unitPrice)}
                      </span>
                    </div>
                    <span className="track-item-subtotal">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="track-total">
                <span>Total</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
            </div>

            <div className="track-info">
              <h3 className="track-subtitle">Penerimaan</h3>
              <p>
                <span>Metode</span>
                <strong>
                  {order.fulfillmentMethod === "pickup"
                    ? "Ambil di toko"
                    : "Dikirim"}
                </strong>
              </p>
              <p>
                <span>Pembayaran</span>
                <strong>
                  {paymentMethodLabel(order.paymentMethod)}
                </strong>
              </p>
              {order.customerAddress ? (
                <p>
                  <span>Alamat</span>
                  <strong>{order.customerAddress}</strong>
                </p>
              ) : null}
              {order.notes ? (
                <p>
                  <span>Catatan</span>
                  <strong>{order.notes}</strong>
                </p>
              ) : null}
              <p>
                <span>WhatsApp</span>
                <strong>{order.customerPhone}</strong>
              </p>
            </div>
          </div>

          {["pending", "awaiting_confirmation"].includes(order.status) ? (
            <PaymentInstructions
              order={order}
              phone={phone}
              onUploaded={(data) => {
                setOrder((previous) =>
                  previous
                    ? {
                        ...previous,
                        status: data.status,
                        hasProof: true,
                      }
                    : previous,
                );
              }}
            />
          ) : null}

          <div className="track-actions">
            <a
              className="track-wa"
              href={orderWhatsappUrl(order)}
              target="_blank"
              rel="noreferrer"
            >
              Tanya admin soal pesanan ini
            </a>
            <Link className="track-catalog" to="/katalog">
              Pesan lagi
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
