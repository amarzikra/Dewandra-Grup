import { useState } from "react";
import { companyProfile } from "@/config/dewandra";
import { formatPrice, paymentMethodLabel } from "./format";

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
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Gagal membaca file bukti."));
    reader.readAsDataURL(file);
  });
}

export function orderWhatsappUrl(order) {
  const message = [
    "Halo admin Dewandra Grup, saya checkout pesanan online.",
    `Kode: ${order.orderNumber}`,
    `Nama: ${order.customerName}`,
    `Total: ${formatPrice(order.totalAmount)}`,
    `Metode: ${paymentMethodLabel(order.paymentMethod)}`,
    "Mohon dicek. Terima kasih.",
  ].join("\n");
  return `${companyProfile.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="pay-copy" type="button" onClick={copy}>
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

export default function PaymentInstructions({ order, phone, onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const isCash = order.paymentMethod === "cash";
  const isQris = order.paymentMethod === "qris";
  const canUpload =
    !isCash && ["pending", "awaiting_confirmation"].includes(order.status);
  const hasProof = uploaded || order.hasProof;
  const methodLabel = paymentMethodLabel(order.paymentMethod);

  function pickFile(event) {
    const next = event.target.files?.[0] ?? null;
    setError("");
    if (!next) {
      setFile(null);
      return;
    }
    if (!PROOF_TYPES.includes(next.type)) {
      setError("Format bukti harus JPG, PNG, WEBP, atau PDF.");
      setFile(null);
      return;
    }
    if (next.size > MAX_PROOF_BYTES) {
      setError("Ukuran bukti maksimal 2 MB.");
      setFile(null);
      return;
    }
    setFile(next);
  }

  async function upload() {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    try {
      const dataBase64 = await readFileAsBase64(file);
      const response = await fetch("/api/orders/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          phone,
          proof: {
            name: file.name,
            type: file.type,
            dataBase64,
          },
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          payload?.error?.message || "Bukti gagal dikirim. Coba lagi.",
        );
      setUploaded(true);
      setFile(null);
      if (onUploaded) onUploaded(payload.data);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pay-panel" aria-labelledby="pay-title">
      <div className="pay-head">
        <div>
          <p className="pay-kicker">Pembayaran</p>
          <h2 className="pay-title" id="pay-title">
            {formatPrice(order.totalAmount)}
          </h2>
        </div>
        <span className="pay-method">{methodLabel}</span>
      </div>

      {isCash ? (
        <div className="pay-cash">
          <p>
            Bayar tunai saat mengambil pesanan di toko atau saat barang
            diterima. Admin akan mengonfirmasi setelah pembayaran diterima.
          </p>
        </div>
      ) : isQris ? (
        <div className="pay-qris">
          <p>
            Minta kode QRIS admin, lalu bayar sesuai total di atas. Setelah
            bayar, unggah bukti pembayaran.
          </p>
          <a
            className="pay-wa"
            href={orderWhatsappUrl(order)}
            target="_blank"
            rel="noreferrer"
          >
            Minta QRIS via WhatsApp
          </a>
        </div>
      ) : (
        <div className="pay-accounts">
          {companyProfile.bankAccounts.map((account) => (
            <div className="pay-account" key={account.label}>
              <span className="pay-account-label">{account.label}</span>
              <span className="pay-account-number">{account.number}</span>
              <CopyButton value={account.number} />
            </div>
          ))}
        </div>
      )}

      <p className="pay-note">
        {isCash
          ? `Siapkan uang tunai sebesar ${formatPrice(order.totalAmount)}. Ongkir, bila ada, dikonfirmasi admin.`
          : `Cantumkan kode ${order.orderNumber} pada berita transfer. Total di atas hanya untuk barang; ongkir, bila ada, dikonfirmasi admin.`}
      </p>

      {isCash ? (
        <p className="pay-locked">
          Pembayaran tunai dikonfirmasi admin setelah pesanan diserahkan.
        </p>
      ) : canUpload ? (
        <div className="pay-upload">
          <div className="pay-upload-head">
            <span className="pay-upload-title">
              {hasProof ? "Bukti sudah diterima" : "Unggah bukti pembayaran"}
            </span>
            {hasProof ? <span className="pay-badge">Terkirim</span> : null}
          </div>
          {hasProof ? (
            <p className="pay-upload-copy">
              Bukti sedang menunggu verifikasi admin. Kamu bisa mengganti
              bukti bila salah unggah.
            </p>
          ) : (
            <p className="pay-upload-copy">
              JPG, PNG, WEBP, atau PDF. Maksimal 2 MB.
            </p>
          )}
          <div className="pay-upload-row">
            <input
              className="pay-file"
              type="file"
              accept={PROOF_TYPES.join(",")}
              onChange={pickFile}
              aria-label="Pilih bukti pembayaran"
            />
            <button
              className="pay-submit"
              type="button"
              disabled={!file || busy}
              onClick={upload}
            >
              {busy ? "Mengirim..." : "Kirim bukti"}
            </button>
          </div>
          {error ? (
            <p className="pay-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="pay-locked">
          {order.status === "cancelled"
            ? "Pesanan ini dibatalkan."
            : "Pembayaran sudah diverifikasi admin."}
        </p>
      )}

      <a
        className="pay-wa pay-wa-secondary"
        href={orderWhatsappUrl(order)}
        target="_blank"
        rel="noreferrer"
      >
        Hubungi admin soal pesanan ini
      </a>
    </section>
  );
}
