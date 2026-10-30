import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/features/sunlit/cart";
import { formatPrice } from "@/features/sunlit/format";
import PaymentInstructions, {
  orderWhatsappUrl,
} from "@/features/sunlit/payment-instructions";

const MAX_PROOF_BYTES = 2 * 1024 * 1024;
const PROOF_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("Gagal membaca file bukti."));
    reader.readAsDataURL(file);
  });
}

function isPhoneValid(value) {
  return value.replace(/\D/g, "").length >= 8;
}

export default function CheckoutPage() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    fulfillment: "pickup",
    address: "",
    notes: "",
    payment: "transfer",
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofError, setProofError] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (field === "payment" && value === "cash") {
      setProofFile(null);
      setProofError("");
    }
    if (errors[field]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  }

  function pickProof(event) {
    const next = event.target.files?.[0] ?? null;
    setProofError("");
    if (!next) {
      setProofFile(null);
      return;
    }
    if (!PROOF_TYPES.includes(next.type)) {
      setProofError("Format bukti harus JPG, PNG, WEBP, atau PDF.");
      setProofFile(null);
      return;
    }
    if (next.size > MAX_PROOF_BYTES) {
      setProofError("Ukuran bukti maksimal 2 MB.");
      setProofFile(null);
      return;
    }
    setProofFile(next);
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting || items.length === 0) return;

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Nama wajib diisi.";
    if (!isPhoneValid(form.phone))
      nextErrors.phone = "Nomor WhatsApp wajib diisi dengan benar.";
    if (form.fulfillment === "delivery" && form.address.trim().length < 5)
      nextErrors.address = "Alamat pengiriman wajib diisi.";
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      let proof;
      if (proofFile && form.payment !== "cash") {
        proof = {
          name: proofFile.name,
          type: proofFile.type,
          dataBase64: await readFileAsBase64(proofFile),
        };
      }
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name.trim(),
          customerPhone: form.phone.trim(),
          customerAddress:
            form.fulfillment === "delivery" ? form.address.trim() : "",
          notes: form.notes.trim(),
          fulfillmentMethod: form.fulfillment,
          paymentMethod: form.payment,
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          proof,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          payload?.error?.message ||
            "Pesanan gagal dibuat. Periksa data lalu coba lagi.",
        );
      setResult(payload.data);
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="checkout-root">
        <div className="checkout-success">
          <span className="checkout-success-icon" aria-hidden="true">
            <iconify-icon
              icon="lucide:party-popper"
              style={{ fontSize: "28px" }}
            ></iconify-icon>
          </span>
          <p className="checkout-kicker">Pesanan dibuat</p>
          <h1 className="checkout-success-title">
            Terima kasih, {result.customerName}.
          </h1>
          <p className="checkout-success-copy">
            Simpan kode pesanan ini. Admin akan memverifikasi pembayaran lalu
            menyiapkan pesananmu.
          </p>
          <div className="checkout-code">
            <span>Kode pesanan</span>
            <strong>{result.orderNumber}</strong>
          </div>

          <PaymentInstructions
            order={result}
            phone={result.customerPhone}
            onUploaded={() => {
              setResult((previous) =>
                previous
                  ? { ...previous, status: "awaiting_confirmation", hasProof: true }
                  : previous,
              );
            }}
          />

          <div className="checkout-success-actions">
            <a
              className="checkout-primary"
              href={orderWhatsappUrl(result)}
              target="_blank"
              rel="noreferrer"
            >
              Kirim rekap ke WhatsApp admin
            </a>
            <Link
              className="checkout-secondary"
              to="/lacak-pesanan"
              search={{ kode: result.orderNumber }}
            >
              Lacak pesanan
            </Link>
          </div>
          <p className="checkout-note">
            Belum punya WhatsApp admin? Kode pesanan di atas juga bisa dipakai
            di halaman lacak pesanan.
          </p>
        </div>
      </div>
    );
  }


  if (items.length === 0) {
    return (
      <div className="checkout-root">
        <div className="checkout-empty">
          <iconify-icon
            icon="lucide:shopping-bag"
            aria-hidden="true"
            style={{ fontSize: "32px", color: "var(--color-text-muted)" }}
          ></iconify-icon>
          <h1 className="checkout-title">Keranjang masih kosong.</h1>
          <p className="checkout-empty-copy">
            Pilih barang dari katalog lima toko, lalu checkout di sini.
          </p>
          <Link className="checkout-primary" to="/katalog">
            Buka katalog
          </Link>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="checkout-root">
      <header className="checkout-header">
        <div>
          <p className="checkout-kicker">Checkout</p>
          <h1 className="checkout-title">Selesaikan pesananmu.</h1>
          <p className="checkout-lede">
            Isi data penerima, pilih pembayaran, lalu kirim pesanan. Admin
            memverifikasi pembayaran sebelum barang disiapkan.
          </p>
        </div>
        <Link className="checkout-back" to="/katalog">
          <iconify-icon
            icon="lucide:arrow-left"
            aria-hidden="true"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
          Lanjut belanja
        </Link>
      </header>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={submit} noValidate>
          {errorCount > 0 ? (
            <div className="checkout-alert" role="alert">
              Ada {errorCount} kolom yang perlu diperiksa.
            </div>
          ) : null}
          {serverError ? (
            <div className="checkout-alert" role="alert">
              {serverError}
            </div>
          ) : null}

          <section className="checkout-section">
            <h2 className="checkout-section-title">Data pembeli</h2>
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="checkout-name">
                Nama lengkap
              </label>
              <input
                id="checkout-name"
                className="checkout-input"
                value={form.name}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => update("name", event.target.value)}
              />
              {errors.name ? (
                <p className="checkout-error">{errors.name}</p>
              ) : null}
            </div>
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="checkout-phone">
                Nomor WhatsApp
              </label>
              <input
                id="checkout-phone"
                className="checkout-input"
                value={form.phone}
                inputMode="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => update("phone", event.target.value)}
              />
              {errors.phone ? (
                <p className="checkout-error">{errors.phone}</p>
              ) : (
                <p className="checkout-hint">
                  Dipakai untuk mencocokkan pesanan saat lacak pesanan.
                </p>
              )}
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section-title">Cara menerima</h2>
            <div className="checkout-choices">
              <label
                className="checkout-choice"
                data-selected={form.fulfillment === "pickup"}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={form.fulfillment === "pickup"}
                  onChange={() => update("fulfillment", "pickup")}
                />
                <span>
                  <strong>Ambil di toko</strong>
                  <small>Admin mengabari lokasi pengambilan.</small>
                </span>
              </label>
              <label
                className="checkout-choice"
                data-selected={form.fulfillment === "delivery"}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={form.fulfillment === "delivery"}
                  onChange={() => update("fulfillment", "delivery")}
                />
                <span>
                  <strong>Dikirim</strong>
                  <small>Ongkir dikonfirmasi admin.</small>
                </span>
              </label>
            </div>
            {form.fulfillment === "delivery" ? (
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="checkout-address">
                  Alamat pengiriman
                </label>
                <textarea
                  id="checkout-address"
                  className="checkout-textarea"
                  value={form.address}
                  rows={3}
                  autoComplete="street-address"
                  aria-invalid={Boolean(errors.address)}
                  onChange={(event) => update("address", event.target.value)}
                />
                {errors.address ? (
                  <p className="checkout-error">{errors.address}</p>
                ) : null}
              </div>
            ) : null}
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="checkout-notes">
                Catatan (opsional)
              </label>
              <textarea
                id="checkout-notes"
                className="checkout-textarea"
                value={form.notes}
                rows={2}
                placeholder="Contoh: tolong siapkan sebelum jam 12.00"
                onChange={(event) => update("notes", event.target.value)}
              />
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section-title">Pembayaran</h2>
            <div className="checkout-choices">
              <label
                className="checkout-choice"
                data-selected={form.payment === "transfer"}
              >
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={form.payment === "transfer"}
                  onChange={() => update("payment", "transfer")}
                />
                <span>
                  <strong>Transfer bank</strong>
                  <small>BRI, Mandiri, BNI, DANA, ShopeePay.</small>
                </span>
              </label>
              <label
                className="checkout-choice"
                data-selected={form.payment === "cash"}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={form.payment === "cash"}
                  onChange={() => update("payment", "cash")}
                />
                <span>
                  <strong>Tunai</strong>
                  <small>Bayar saat ambil di toko atau saat barang diterima.</small>
                </span>
              </label>
            </div>
            {form.payment === "cash" ? null : (
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="checkout-proof">
                  Bukti pembayaran (opsional)
                </label>
                <input
                  id="checkout-proof"
                  className="checkout-file"
                  type="file"
                  accept={PROOF_TYPES.join(",")}
                  onChange={pickProof}
                />
                <p className="checkout-hint">
                  Bisa diunggah sekarang atau nanti dari halaman lacak pesanan.
                  Maksimal 2 MB.
                </p>
                {proofError ? (
                  <p className="checkout-error">{proofError}</p>
                ) : null}
              </div>
            )}
          </section>

          <button
            className="checkout-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Mengirim pesanan..."
              : `Buat pesanan · ${formatPrice(total)}`}
          </button>
          <p className="checkout-note">
            Dengan membuat pesanan, kamu setuju admin menghubungi nomor
            WhatsApp di atas untuk konfirmasi pembayaran dan pengiriman.
          </p>
        </form>

        <aside className="checkout-summary" aria-labelledby="summary-title">
          <div className="checkout-summary-head">
            <h2 className="checkout-section-title" id="summary-title">
              Ringkasan
            </h2>
            <span className="checkout-count">{count} barang</span>
          </div>
          <div className="checkout-items">
            {items.map((item) => (
              <div className="checkout-item" key={item.productId}>
                <div className="checkout-item-main">
                  <span className="checkout-item-store">{item.storeName}</span>
                  <strong className="checkout-item-name">{item.name}</strong>
                  <span className="checkout-item-price">
                    {formatPrice(item.price)} / {item.unit}
                  </span>
                </div>
                <div className="checkout-item-controls">
                  <button
                    type="button"
                    className="checkout-qty"
                    aria-label={`Kurangi ${item.name}`}
                    onClick={() => setQty(item.productId, item.qty - 1)}
                  >
                    −
                  </button>
                  <span className="checkout-qty-value">{item.qty}</span>
                  <button
                    type="button"
                    className="checkout-qty"
                    aria-label={`Tambah ${item.name}`}
                    disabled={item.qty >= item.stock}
                    onClick={() => setQty(item.productId, item.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="checkout-remove"
                    onClick={() => remove(item.productId)}
                  >
                    Hapus
                  </button>
                </div>
                <span className="checkout-item-subtotal">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total barang</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="checkout-summary-note">
            Ongkir dan biaya lain dikonfirmasi admin sebelum pengiriman.
          </p>
        </aside>
      </div>
    </div>
  );
}
