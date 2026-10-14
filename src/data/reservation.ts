/**
 * OSTRA — Reservation configuration
 * Everything the booking flow needs that an operator might change.
 */

export interface ReservationConfig {
  /** How many days ahead guests can book (including today) */
  daysAhead: number;
  /** Minimum hours between now and a slot for same-day booking */
  leadTimeHours: number;
  /** Seating times, "HH:mm" */
  slots: string[];
  /** Party size options. The last one is treated as "N+" */
  guestOptions: number[];
  /** From this size the team calls back to arrange the space */
  largePartyFrom: number;
  /** Weekdays the restaurant is closed (0 = Sunday) */
  closedWeekdays: number[];
}

export const reservationConfig: ReservationConfig = {
  daysAhead: 14,
  leadTimeHours: 2,
  slots: ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  guestOptions: [2, 3, 4, 5, 6],
  largePartyFrom: 6,
  closedWeekdays: [],
};

export const reservationCopy = {
  overline: "OSTRA — Đặt bàn",
  step1: "Chọn ngày",
  guests: "Số khách",
  time: "Giờ",
  step2: "Thông tin đặt bàn",
  largeParty:
    "Với nhóm từ 6 khách trở lên, OSTRA sẽ gọi lại để sắp xếp không gian phù hợp.",
  hintIncomplete: "Chọn ngày, số khách và giờ để tiếp tục.",
  success:
    "OSTRA sẽ gửi thông tin xác nhận đến email và số điện thoại của bạn.",
  policy:
    "Chúng tôi giữ bàn trong 15 phút. Nếu thay đổi kế hoạch, vui lòng báo trước ít nhất 4 giờ.",
};
