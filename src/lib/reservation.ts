import { reservationConfig, type ReservationConfig } from "@/data/reservation";

const WEEKDAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const WEEKDAY_LONG = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

export interface BookableDay {
  iso: string; // yyyy-mm-dd
  day: number;
  month: number;
  weekdayShort: string;
  isToday: boolean;
  closed: boolean;
}

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getBookableDays(now: Date, config: ReservationConfig = reservationConfig): BookableDay[] {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Array.from({ length: config.daysAhead }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      iso: toISODate(d),
      day: d.getDate(),
      month: d.getMonth() + 1,
      weekdayShort: WEEKDAY_SHORT[d.getDay()],
      isToday: i === 0,
      closed: config.closedWeekdays.includes(d.getDay()),
    };
  });
}

/** "Thứ Sáu, 16 tháng 10" */
export function formatLongDate(iso: string) {
  const d = fromISODate(iso);
  return `${WEEKDAY_LONG[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}`;
}

/** Deterministic pseudo-availability so the demo feels real and stable. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type SlotState = "available" | "full" | "past";

export function getSlotState(
  iso: string,
  time: string,
  guests: number | null,
  now: Date,
  config: ReservationConfig = reservationConfig,
): SlotState {
  const [hh, mm] = time.split(":").map(Number);
  const slotDate = fromISODate(iso);
  slotDate.setHours(hh, mm, 0, 0);
  if (slotDate.getTime() - now.getTime() < config.leadTimeHours * 3600_000) return "past";

  // Busier at prime time and for bigger groups
  const prime = time === "19:00" || time === "19:30" || time === "20:00";
  const pressure = (prime ? 3 : 0) + (guests && guests >= 4 ? 2 : 0);
  const roll = hash(`${iso}|${time}`) % 10;
  return roll < 1 + pressure * 0.6 ? "full" : "available";
}

export function guestLabel(n: number, config: ReservationConfig = reservationConfig) {
  return n >= config.largePartyFrom ? `${config.largePartyFrom}+` : String(n);
}

/* ---------- Validation (Vietnamese messages) ---------- */

export interface GuestDetails {
  name: string;
  phone: string;
  email: string;
  note: string;
}

export type DetailErrors = Partial<Record<keyof GuestDetails, string>>;

const PHONE_RE = /^(?:\+?84|0)(?:3|5|7|8|9|2\d)\d{7,8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: keyof GuestDetails, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "name":
      if (!v) return "Vui lòng nhập họ và tên.";
      if (v.length < 2) return "Họ và tên cần ít nhất 2 ký tự.";
      return;
    case "phone": {
      const digits = v.replace(/[\s.-]/g, "");
      if (!digits) return "Vui lòng nhập số điện thoại.";
      if (!PHONE_RE.test(digits)) return "Số điện thoại chưa đúng định dạng.";
      return;
    }
    case "email":
      if (!v) return "Vui lòng nhập email.";
      if (!EMAIL_RE.test(v)) return "Email chưa đúng định dạng.";
      return;
    case "note":
      if (v.length > 300) return "Ghi chú tối đa 300 ký tự.";
      return;
  }
}

export function validateDetails(d: GuestDetails): DetailErrors {
  const errors: DetailErrors = {};
  (Object.keys(d) as (keyof GuestDetails)[]).forEach((k) => {
    const e = validateField(k, d[k]);
    if (e) errors[k] = e;
  });
  return errors;
}
