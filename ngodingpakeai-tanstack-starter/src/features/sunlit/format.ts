export function formatPrice(value: number) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatStoreList(items: { storeName: string }[]) {
  return [...new Set(items.map((item) => item.storeName))].join(", ");
}

export function paymentMethodLabel(method: string) {
  if (method === "cash") return "Tunai";
  if (method === "qris") return "QRIS";
  return "Transfer bank";
}
