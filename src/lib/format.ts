/** Shared, framework-free formatters (safe for server and client). */

export function formatMenuPrice(item: { price: number | null; priceLabel?: string }): string {
  if (item.price === null) return item.priceLabel ?? "Theo ngày";
  return new Intl.NumberFormat("vi-VN").format(item.price);
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
