import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-[clamp(4rem,8vw,7rem)]" aria-label="Chân trang">
      <div className="shell">
        <div className="grid-12 gap-y-10 border-t border-[var(--line-dark)] pt-10">
          <div className="col-span-6 lg:col-span-3">
            <p className="font-display text-lg font-semibold tracking-[-0.03em]">OSTRA</p>
            <p className="mt-1 text-mute">{site.tagline}</p>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <p className="t-meta text-mute">Địa chỉ</p>
            <p className="mt-3 leading-relaxed">
              {site.address.street}
              <br />
              {site.address.city}
            </p>
          </div>
          <div className="col-span-6 lg:col-span-2">
            <p className="t-meta text-mute">Mở cửa</p>
            <p className="mt-3 tabular">{site.hours.open}</p>
          </div>
          <nav className="col-span-6 lg:col-span-4" aria-label="Liên kết chân trang">
            <ul className="t-meta grid grid-cols-2 gap-y-3 lg:justify-items-end">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="nav-link">
                    {s.label}
                    <span className="sr-only"> (mở trong thẻ mới)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="nav-link">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#lien-he" data-reserve className="nav-link">
                  Đặt bàn
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="mt-[clamp(3rem,7vw,6rem)] select-none overflow-hidden px-[2vw]" aria-hidden="true">
        <p className="footer-word flex overflow-hidden pb-[0.02em]" data-footer-word>
          {"OSTRA".split("").map((c, i) => (
            <span key={i} className="block">
              {c}
            </span>
          ))}
        </p>
      </div>

      <div className="shell t-meta flex flex-col gap-3 border-t border-[var(--line-dark)] py-6 text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 OSTRA — Dự án concept</p>
        <a href="#dau-trang" className="nav-link w-fit">
          Lên đầu trang ↑
        </a>
      </div>
    </footer>
  );
}
