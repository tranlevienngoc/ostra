/**
 * OSTRA — Global site content
 * Navigation, contact details and editorial lists that are
 * reused across sections. CMS-ready: one "settings" document.
 */

export const site = {
  name: "OSTRA",
  tagline: "Ẩm thực biển đương đại",
  city: "Đà Nẵng — Việt Nam",
  address: { street: "12 Trần Phú", city: "Đà Nẵng, Việt Nam" },
  coordinates: { label: "16°04′B — 108°13′Đ", lat: 16.0718, lng: 108.2236 },
  phone: { display: "0236 3888 168", href: "tel:+842363888168" },
  email: "datban@ostra.vn",
  hours: {
    days: "Thứ Hai — Chủ Nhật",
    open: "17:30 — 23:00",
    lastOrder: "21:30",
  },
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=12+Tr%E1%BA%A7n+Ph%C3%BA+%C4%90%C3%A0+N%E1%BA%B5ng",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
};

export const navigation = [
  { label: "Câu chuyện", href: "#cau-chuyen" },
  { label: "Thực đơn", href: "#thuc-don" },
  { label: "Không gian", href: "#khong-gian" },
  { label: "Nguyên liệu", href: "#nguyen-lieu" },
];

/** Today's sourcing board (Ingredient section) */
export const sourcing = [
  { item: "Hàu", origin: "Nam Ô", status: "Về lúc 05:10" },
  { item: "Sò điệp", origin: "Lý Sơn", status: "Về lúc 05:40" },
  { item: "Cá cam", origin: "Cù Lao Chàm", status: "Về lúc 06:15" },
  { item: "Bạch tuộc", origin: "Sơn Trà", status: "Về lúc 06:30" },
  { item: "Nhum biển", origin: "Lý Sơn", status: "Hết hôm nay", out: true },
];

/** Kitchen principles */
export const kitchenPrinciples = [
  {
    title: "Lửa than nhãn",
    text: "Nhiệt độ than được kiểm soát ở mức tuyệt đối để giữ lại giọt nước ngọt thanh bên trong thớ thịt.",
  },
  {
    title: "Tối giản gia vị",
    text: "Chỉ muối biển thô, chanh vàng và bơ nâu — không sốt công nghiệp, không che lấp vị tươi của biển.",
  },
  {
    title: "Bếp mở 42 chỗ",
    text: "Ranh giới giữa người nấu và thực khách tan biến, chỉ còn lại âm thanh của than hồng và sự kiên nhẫn.",
  },
];

/** "Một bữa tối tại OSTRA" — dining timeline panels */
export const diningMoments = [
  {
    index: "01",
    time: "18:30",
    title: "Ánh sáng cuối ngày",
    text: "Những tia nắng cuối cùng trên khăn linen, trước khi gian phòng chìm vào ánh nến.",
    image: { src: "/images/dining_interior.jpg", alt: "Phòng ăn OSTRA lúc hoàng hôn với bàn trải khăn linen" },
  },
  {
    index: "02",
    time: "19:10",
    title: "Món đầu tiên",
    text: "Một đĩa nhỏ, lạnh và trong — để vị giác bắt đầu bằng biển.",
    image: { src: "/images/dining_first_course.jpg", alt: "Món khai vị cá sống bên ly vang trắng và ngọn nến" },
  },
  {
    index: "03",
    time: "20:00",
    title: "Từ bếp mở",
    text: "Lửa than, tiếng dao, mùi bơ nâu — gian bếp ở ngay trước mắt bạn.",
    image: { src: "/images/dining_open_kitchen.jpg", alt: "Đầu bếp nướng cá trên lửa than trong gian bếp mở" },
  },
  {
    index: "04",
    time: "21:15",
    title: "Một ly cuối",
    text: "Một ly vang ngọt, ngọn nến thấp, và cuộc trò chuyện chưa muốn kết thúc.",
    image: { src: "/images/dining_last_glass.jpg", alt: "Ly vang ngọt bên ngọn nến trên bàn gỗ" },
  },
];
