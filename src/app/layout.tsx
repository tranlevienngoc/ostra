import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ReservationProvider } from "@/components/reservation/ReservationProvider";
import { Cursor } from "@/components/ui/Cursor";

// Every family ships the Vietnamese subset — stacked diacritics render natively.
const display = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ostra.vn"),
  title: {
    default: "OSTRA — Nhà hàng hải sản đương đại tại Đà Nẵng",
    template: "%s — OSTRA",
  },
  description:
    "OSTRA là nhà hàng hải sản đương đại tại Đà Nẵng: hàu tươi, cá và sò điệp theo mùa từ biển miền Trung. Xem thực đơn và đặt bàn chỉ trong hai bước.",
  keywords: ["OSTRA", "nhà hàng hải sản", "Đà Nẵng", "hàu tươi", "fine dining", "đặt bàn"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "OSTRA",
    title: "OSTRA — Biển, được kể bằng hương vị",
    description: "Ẩm thực biển đương đại tại Đà Nẵng. Thực đơn thay đổi theo mùa.",
    images: [{ url: "/images/hero_oysters.jpg", width: 1376, height: 768, alt: "Hàu tươi trên đá lạnh tại OSTRA" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0A",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "OSTRA",
  servesCuisine: ["Hải sản", "Ẩm thực đương đại"],
  priceRange: "₫₫₫",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 Trần Phú",
    addressLocality: "Đà Nẵng",
    addressCountry: "VN",
  },
  telephone: "+842363888168",
  openingHours: "Mo-Su 17:30-23:00",
  acceptsReservations: true,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <noscript>
          <style>{`[data-intro]{visibility:visible!important}.preloader{display:none!important}`}</style>
        </noscript>
        <a href="#noi-dung" className="skip-link">
          Bỏ qua đến nội dung chính
        </a>
        <SmoothScroll />
        <ReservationProvider>{children}</ReservationProvider>
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
