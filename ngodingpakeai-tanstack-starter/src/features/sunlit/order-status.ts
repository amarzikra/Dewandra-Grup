export type OrderStatus =
  | "pending"
  | "awaiting_confirmation"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled";

type OrderStatusMeta = {
  label: string;
  tone: "warning" | "info" | "positive" | "danger";
  description: string;
};

const STATUS: Record<OrderStatus, OrderStatusMeta> = {
  pending: {
    label: "Menunggu pembayaran",
    tone: "warning",
    description: "Pesanan sudah dibuat. Silakan transfer lalu unggah bukti.",
  },
  awaiting_confirmation: {
    label: "Menunggu verifikasi",
    tone: "info",
    description: "Bukti pembayaran sudah diterima. Admin akan memverifikasi.",
  },
  processing: {
    label: "Diproses",
    tone: "info",
    description: "Pembayaran dikonfirmasi. Pesanan sedang disiapkan.",
  },
  ready: {
    label: "Siap",
    tone: "positive",
    description: "Pesanan siap diambil atau dikirim.",
  },
  completed: {
    label: "Selesai",
    tone: "positive",
    description: "Pesanan sudah selesai.",
  },
  cancelled: {
    label: "Dibatalkan",
    tone: "danger",
    description: "Pesanan ini dibatalkan.",
  },
};

export const ORDER_STATUS_OPTIONS = (
  Object.keys(STATUS) as OrderStatus[]
).map((value) => ({ value, label: STATUS[value].label }));

export function getOrderStatus(status: string): OrderStatusMeta {
  return STATUS[status as OrderStatus] ?? STATUS.pending;
}

export function orderStatusDescription(
  status: string,
  paymentMethod?: string,
) {
  if (paymentMethod === "cash") {
    if (status === "pending")
      return "Pesanan sudah dibuat. Bayar tunai saat mengambil pesanan atau saat barang diterima.";
    if (status === "awaiting_confirmation")
      return "Pesanan menunggu konfirmasi pembayaran tunai dari admin.";
  }
  return getOrderStatus(status).description;
}
