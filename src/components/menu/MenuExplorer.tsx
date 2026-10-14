"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { MenuCategoryWithItems } from "@/lib/menu";
import type { MenuItem } from "@/data/menu";
import { formatMenuPrice, pad2 } from "@/lib/format";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* matchMedia as an external store → no setState-in-effect, SSR-safe */
const DESKTOP_QUERY = "(min-width: 1024px)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useIsDesktop = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );

export function MenuExplorer({ categories }: { categories: MenuCategoryWithItems[] }) {
  const isDesktop = useIsDesktop();
  const [categoryId, setCategoryId] = useState(categories[0]?.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const zRef = useRef(1);
  const mounted = useRef(false);

  const category = categories.find((c) => c.id === categoryId) ?? categories[0];
  const items = category.items;
  const activeId = items.some((i) => i.id === hoveredId) ? hoveredId! : items[0]?.id;
  const activeItem = items.find((i) => i.id === activeId);

  /* category change → rows rise in, ScrollTrigger re-measures */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const rows = listRef.current?.querySelectorAll(".menu-row");
    if (rows && !prefersReducedMotion()) {
      gsap.fromTo(
        rows,
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, ease: "expo.out", clearProps: "transform,opacity,visibility" },
      );
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 750);
    return () => window.clearTimeout(t);
  }, [categoryId]);

  /* preview crossfade — newest layer reveals on top with clip-path */
  useEffect(() => {
    const root = previewRef.current;
    if (!root || !activeId) return;
    const layer = root.querySelector<HTMLElement>(`[data-preview="${activeId}"]`);
    if (!layer) return;
    zRef.current += 1;
    const reduce = prefersReducedMotion();
    gsap.set(layer, { zIndex: zRef.current });
    gsap.fromTo(
      layer,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 1, ease: "expo.out" },
    );
    const img = layer.querySelector("img");
    if (img && !reduce) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "expo.out" });
  }, [activeId, categoryId]);

  const selectCategory = (id: typeof categoryId) => {
    if (id === categoryId) return;
    setCategoryId(id);
    setHoveredId(null);
    setOpenId(null);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % categories.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (index - 1 + categories.length) % categories.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = categories.length - 1;
    tabRefs.current[next]?.focus();
    selectCategory(categories[next].id);
  };

  return (
    <div className="grid-12 mt-[clamp(3.5rem,7vw,7rem)] gap-y-8">
      {/* Category navigation */}
      <div className="col-span-12 lg:col-span-3">
        <div
          role="tablist"
          aria-label="Danh mục thực đơn"
          aria-orientation={isDesktop ? "vertical" : "horizontal"}
          className="-mx-[var(--gutter)] flex gap-6 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {categories.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={c.id === category.id}
              aria-controls="menu-panel"
              tabIndex={c.id === category.id ? 0 : -1}
              className="menu-tab t-meta shrink-0 !w-auto lg:!w-full"
              onClick={() => selectCategory(c.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <span className="menu-tab__mark hidden lg:block" aria-hidden="true" />
              <span className="tabular hidden opacity-60 lg:inline">{pad2(i + 1)}</span>
              <span className="whitespace-nowrap">{c.label}</span>
              <span className="tabular ml-auto hidden opacity-50 lg:inline">({pad2(c.items.length)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editorial list */}
      <div
        id="menu-panel"
        role="tabpanel"
        aria-labelledby={`tab-${category.id}`}
        className="col-span-12 lg:col-span-5"
      >
        <p className="t-quote mb-6 !text-[1.35rem] text-stone">{category.note}</p>
        <ul ref={listRef} className="menu-list" key={category.id}>
          {items.map((item, i) => (
            <MenuRow
              key={item.id}
              item={item}
              index={i}
              active={isDesktop ? item.id === activeId : item.id === openId}
              open={!isDesktop && item.id === openId}
              onActivate={() => isDesktop && setHoveredId(item.id)}
              onToggle={() => !isDesktop && setOpenId((cur) => (cur === item.id ? null : item.id))}
              isDesktop={isDesktop}
            />
          ))}
        </ul>
      </div>

      {/* Sticky preview (desktop) */}
      <div className="col-span-4 hidden lg:block" aria-hidden="true">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <div ref={previewRef} className="media relative aspect-[4/5] w-full" key={category.id}>
            {items.map((item, i) => (
              <div
                key={item.id}
                data-preview={item.id}
                className={`menu-preview__layer ${i === 0 ? "is-initial" : ""}`}
              >
                <Image
                  src={item.image.src}
                  alt=""
                  fill
                  sizes="30vw"
                  className={`object-cover ${item.soldOutToday ? "grayscale" : ""}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="t-meta text-ivory">{activeItem?.name}</p>
            <p className="t-meta text-mute">{activeItem?.origin ? `Nguồn: ${activeItem.origin}` : category.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuRow({
  item,
  index,
  active,
  open,
  onActivate,
  onToggle,
  isDesktop,
}: {
  item: MenuItem;
  index: number;
  active: boolean;
  open: boolean;
  onActivate: () => void;
  onToggle: () => void;
  isDesktop: boolean;
}) {
  const price = formatMenuPrice(item);
  const drawerId = `drawer-${item.id}`;
  return (
    <li
      className={`menu-row ${active ? "is-active" : ""} ${open ? "is-open" : ""} ${item.soldOutToday ? "is-soldout" : ""}`}
      onPointerEnter={onActivate}
    >
      <button
        type="button"
        className="menu-row__btn"
        onFocus={onActivate}
        onClick={onToggle}
        aria-expanded={isDesktop ? undefined : open}
        aria-controls={isDesktop ? undefined : drawerId}
      >
        <span className="t-meta tabular text-mute">{pad2(index + 1)}</span>
        <span className="min-w-0">
          <span className="menu-row__name block">{item.name}</span>
          <span className="menu-row__desc block">{item.description}</span>
          {(item.soldOutToday || item.seasonal) && (
            <span className="mt-3 flex flex-wrap gap-2">
              {item.soldOutToday && <span className="tag tag--accent">Hết hôm nay</span>}
              {item.seasonal && !item.soldOutToday && <span className="tag tag--muted">Theo mùa</span>}
            </span>
          )}
        </span>
        <span className="menu-row__price">
          <span>{price}</span>
          {item.unit && <span className="mt-1 block text-[10px] tracking-[0.12em] text-mute !no-underline">/ {item.unit}</span>}
          {item.soldOutToday && <span className="sr-only">, hết hôm nay</span>}
        </span>
      </button>

      {!isDesktop && (
        <div id={drawerId} className="menu-row__drawer">
          <div>
            <div className="media relative mb-6 aspect-[4/3] w-full">
              {open && (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="100vw"
                  className={`object-cover ${item.soldOutToday ? "grayscale" : ""}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
