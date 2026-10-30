export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("62") ? `0${digits.slice(2)}` : digits;
}

export function isValidPhone(value: string) {
  return normalizePhone(value).length >= 8;
}
