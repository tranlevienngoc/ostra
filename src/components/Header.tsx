"use client";

import { useEffect, useRef, useState } from "react";
import { navigation, site } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const prevOpen = useRef(false);

  /* transparent on hero → dark when scrolled; hides while scrolling down */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      el.classList.toggle("is-scrolled", y > 40);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > window.innerHeight * 0.6) el.classList.add("is-hidden");
      else if (goingUp || y < 80) el.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* fullscreen mobile navigation */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (prevOpen.current === menuOpen) return;
    prevOpen.current = menuOpen;
    const reduce = prefersReducedMotion();
    const links = nav.querySelectorAll("[data-nav-item]");
    if (menuOpen) {
      lockScroll();
      gsap
        .timeline()
        .set(nav, { visibility: "visible" })
        .fromTo(
          nav,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 0.9, ease: "expo.inOut" },
        )
        .fromTo(
          links,
          { yPercent: 110 },
          { yPercent: 0, duration: reduce ? 0 : 1.1, stagger: 0.06, ease: "expo.out" },
          reduce ? 0 : 0.35,
        );
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(nav, { visibility: "hidden" });
            unlockScroll();
          },
        })
        .to(nav, { clipPath: "inset(0% 0% 100% 0%)", duration: reduce ? 0 : 0.8, ease: "expo.inOut" });
    }
  }, [menuOpen]);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!menuOpen) return;
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    window.setTimeout(() => scrollToTarget(href), 650);
  };

  return (
    <>
      <header ref={ref} className="header">
        <div className="shell flex h-full items-center justify-between">
          <a
            href="#dau-trang"
            className="relative z-[61] font-display text-[22px] font-semibold tracking-[-0.045em]"
            aria-label="OSTRA — về đầu trang"
          >
            OSTRA
          </a>

          <nav aria-label="Điều hướng chính" className="hidden lg:block">
            <ul className="t-meta flex items-center gap-10">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[61] flex items-center gap-3">
            <a href="#lien-he" data-reserve className="btn !min-h-[42px] !px-5 max-sm:!px-4">
              Đặt bàn <span className="arrow arrow--right" aria-hidden="true">→</span>
            </a>
            <button
              ref={burgerRef}
              type="button"
              className="burger lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={navRef}
        id="mobile-nav"
        className="mobile-nav lg:hidden"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Điều hướng di động" className="flex-1">
          <ul className="flex flex-col gap-1">
            {navigation.map((item, i) => (
              <li key={item.href} className="overflow-hidden border-b border-[var(--line-dark)]">
                <a
                  href={item.href}
                  onClick={(e) => navigate(e, item.href)}
                  className="flex items-baseline justify-between py-4"
                  data-nav-item
                >
                  <span className="t-h2 !text-[clamp(2.4rem,11vw,4rem)]">{item.label}</span>
                  <span className="t-meta text-mute">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="t-meta grid gap-6 text-stone">
          <div className="overflow-hidden">
            <div data-nav-item>
              <p>{site.address.street}</p>
              <p>{site.address.city}</p>
            </div>
          </div>
          <div className="overflow-hidden">
            <div data-nav-item className="flex justify-between">
              <span>{site.hours.open}</span>
              <a href={site.phone.href}>{site.phone.display}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
