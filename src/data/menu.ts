/**
 * OSTRA — Menu content
 * --------------------------------------------------------------
 * This file is the single source of truth for menu content.
 * The shape intentionally mirrors a headless-CMS collection
 * (Sanity / Contentful / Strapi / Payload): UI components never
 * import this file directly — they go through `lib/menu.ts`,
 * which can later be swapped for a real CMS fetch without
 * touching any component.
 *
 * Editorial controls per item:
 *  - price        number (thousand VND) or null → uses `priceLabel`
 *  - available    false  → item is hidden from the public menu
 *  - soldOutToday true   → item stays visible, marked "Hết hôm nay"
 *  - seasonal     true   → item only shows when the season is on
 *  - featured     true   → candidate for highlight placements
 */

export type MenuCategoryId =
  | "khai-vi"
  | "hai-san-song"
  | "mon-chinh"
  | "mon-an-kem"
  | "trang-mieng";

export interface MenuCategory {
  id: MenuCategoryId;
  /** Display label (Vietnamese, user-facing) */
  label: string;
  /** Short editorial line under the category */
  note?: string;
  order: number;
  visible: boolean;
}

export interface MenuImage {
  src: string;
  alt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in thousand VND. `null` → display `priceLabel` instead. */
  price: number | null;
  priceLabel?: string;
  /** Optional unit, e.g. "3 con" */
  unit?: string;
  category: MenuCategoryId;
  image: MenuImage;
  available: boolean;
  soldOutToday?: boolean;
  seasonal: boolean;
  featured: boolean;
  /** Origin of the main ingredient — used for editorial tags */
  origin?: string;
  order: number;
}

export interface MenuSettings {
  seasonLabel: string;
  /** Global switch: hide every `seasonal` item when the season ends */
  seasonalEnabled: boolean;
  currencyNote: string;
}

export const menuSettings: MenuSettings = {
  seasonLabel: "Mùa thu — 2026",
  seasonalEnabled: true,
  currencyNote:
    "Giá tính bằng nghìn đồng, chưa bao gồm 5% phí phục vụ và VAT. Thực đơn có thể thay đổi theo nguồn hải sản trong ngày.",
};

export const menuCategories: MenuCategory[] = [
  { id: "khai-vi", label: "Khai vị", note: "Mở đầu nhẹ, sạch vị", order: 1, visible: true },
  { id: "hai-san-song", label: "Hải sản sống", note: "Mở vỏ, phục vụ ngay", order: 2, visible: true },
  { id: "mon-chinh", label: "Món chính", note: "Lửa than và thời gian", order: 3, visible: true },
  { id: "mon-an-kem", label: "Món ăn kèm", note: "Để chia sẻ", order: 4, visible: true },
  { id: "trang-mieng", label: "Tráng miệng", note: "Một chút ngọt, một chút muối", order: 5, visible: true },
];

const img = (file: string, alt: string): MenuImage => ({ src: `/images/${file}`, alt });

export const menuItems: MenuItem[] = [
  // — Khai vị
  {
    id: "so-diep-ap-chao",
    name: "Sò điệp áp chảo",
    description: "Súp lơ trắng, bơ nâu, trứng cá",
    price: 320,
    category: "khai-vi",
    image: img("dish_scallop.jpg", "Ba con sò điệp áp chảo trên nền súp lơ trắng, kèm một thìa trứng cá"),
    available: true,
    seasonal: false,
    featured: true,
    origin: "Lý Sơn",
    order: 1,
  },
  {
    id: "ca-cam-crudo",
    name: "Cá cam crudo",
    description: "Quýt, dầu ớt, muối biển",
    price: 260,
    category: "khai-vi",
    image: img("dish_crudo.jpg", "Những lát cá cam sống xếp thẳng hàng trên đĩa gốm tối màu"),
    available: true,
    seasonal: true,
    featured: false,
    origin: "Cù Lao Chàm",
    order: 2,
  },
  {
    id: "bach-tuoc-nuong",
    name: "Bạch tuộc nướng",
    description: "Khoai tây, paprika hun khói",
    price: 360,
    category: "khai-vi",
    image: img("dish_octopus.jpg", "Xúc tu bạch tuộc nướng than cùng khoai tây dập và paprika"),
    available: true,
    seasonal: false,
    featured: false,
    origin: "Sơn Trà",
    order: 3,
  },

  // — Hải sản sống
  {
    id: "hau-tuoi-theo-mua",
    name: "Hàu tươi theo mùa",
    description: "Mignonette hành tím, chanh vàng",
    price: 180,
    unit: "3 con",
    category: "hai-san-song",
    image: img("oyster_macro.jpg", "Cận cảnh một con hàu tươi với mignonette hành tím trên đá lạnh"),
    available: true,
    seasonal: true,
    featured: true,
    origin: "Nam Ô",
    order: 1,
  },
  {
    id: "dia-hai-san-lanh",
    name: "Đĩa hải sản lạnh",
    description: "Hàu, sò, tôm và cá sống theo ngày",
    price: null,
    priceLabel: "Theo ngày",
    category: "hai-san-song",
    image: img("hero_oysters.jpg", "Khay hàu tươi trên đá bào cùng chanh vàng"),
    available: true,
    seasonal: false,
    featured: false,
    order: 2,
  },
  {
    id: "nhum-bien-ly-son",
    name: "Nhum biển Lý Sơn",
    description: "Bơ cháy, bánh mì nướng củi",
    price: 290,
    category: "hai-san-song",
    image: img("dish_crudo.jpg", "Hải sản sống trình bày tối giản trên đĩa gốm"),
    available: true,
    soldOutToday: true,
    seasonal: true,
    featured: false,
    origin: "Lý Sơn",
    order: 3,
  },

  // — Món chính
  {
    id: "ca-bien-nuong-than",
    name: "Cá biển nướng than",
    description: "Rau theo mùa, beurre blanc",
    price: 420,
    category: "mon-chinh",
    image: img("dish_fish.jpg", "Cá biển nướng than với rau theo mùa và sốt beurre blanc"),
    available: true,
    seasonal: false,
    featured: true,
    order: 1,
  },
  {
    id: "tom-hum-nuong-bo",
    name: "Tôm hùm nướng bơ",
    description: "Bơ thảo mộc, chanh nướng",
    price: null,
    priceLabel: "Theo ngày",
    category: "mon-chinh",
    image: img("dish_lobster.jpg", "Nửa con tôm hùm nướng bơ thảo mộc cùng chanh nướng"),
    available: true,
    seasonal: false,
    featured: true,
    order: 2,
  },
  {
    id: "ca-mu-ap-chao",
    name: "Cá mú áp chảo",
    description: "Bí đỏ, nghệ tươi, rau củ non",
    price: 460,
    category: "mon-chinh",
    image: img("chef_plating.jpg", "Bếp trưởng hoàn thiện đĩa cá mú áp chảo bằng nhíp"),
    available: true,
    seasonal: false,
    featured: false,
    order: 3,
  },

  // — Món ăn kèm
  {
    id: "rau-cu-nuong-than",
    name: "Rau củ nướng than",
    description: "Tỏi tây, cà rốt non, dầu thảo mộc",
    price: 120,
    category: "mon-an-kem",
    image: img("dish_side.jpg", "Tỏi tây và cà rốt non nướng than trong bát gốm"),
    available: true,
    seasonal: true,
    featured: false,
    order: 1,
  },
  {
    id: "banh-mi-nuong-cui",
    name: "Bánh mì nướng củi",
    description: "Bơ rong biển lên men",
    price: 90,
    category: "mon-an-kem",
    image: img("dish_side.jpg", "Bánh mì nướng củi cùng bơ rong biển"),
    available: true,
    seasonal: false,
    featured: false,
    order: 2,
  },
  {
    id: "khoai-tay-dap",
    name: "Khoai tây dập",
    description: "Bơ lên men, hẹ, muối hoa",
    price: 90,
    category: "mon-an-kem",
    image: img("dish_octopus.jpg", "Khoai tây dập nướng giòn rắc paprika"),
    available: true,
    seasonal: false,
    featured: false,
    order: 3,
  },

  // — Tráng miệng
  {
    id: "kem-caramel-muoi-bien",
    name: "Kem caramel muối biển",
    description: "Tuile sô-cô-la, mật ong cháy",
    price: 150,
    category: "trang-mieng",
    image: img("dish_dessert.jpg", "Kem caramel muối biển bên cạnh tuile sô-cô-la"),
    available: true,
    seasonal: false,
    featured: true,
    order: 1,
  },
  {
    id: "so-co-la-den",
    name: "Sô-cô-la đen 70%",
    description: "Dầu ô liu, muối hoa",
    price: 160,
    category: "trang-mieng",
    image: img("dish_dessert.jpg", "Tráng miệng sô-cô-la đen trình bày tối giản"),
    available: true,
    seasonal: false,
    featured: false,
    order: 2,
  },
  {
    // Example of an item switched off by the editor — never rendered.
    id: "xoai-cat-kem-chua",
    name: "Xoài cát & kem chua",
    description: "Tiêu rừng, lá chanh",
    price: 140,
    category: "trang-mieng",
    image: img("dish_dessert.jpg", "Tráng miệng xoài cát"),
    available: false,
    seasonal: true,
    featured: false,
    order: 3,
  },
];

/** Signature dish block — editable independently from the list. */
export const signatureDish = {
  itemId: "hau-tuoi-theo-mua",
  title: "Hàu tươi OSTRA",
  components: ["Hàu theo mùa", "Mignonette hành tím", "Dầu thảo mộc", "Chanh vàng"],
  priceDisplay: "180.000",
  unit: "3 con",
  microcopy: "Phục vụ ngay khi mở vỏ.",
  image: img("oyster_macro.jpg", "Cận cảnh hàu tươi OSTRA với hành tím và dầu thảo mộc trên đá lạnh"),
};
