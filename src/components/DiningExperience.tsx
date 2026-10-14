"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { diningMoments } from "@/data/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll";

/**
 * "Một bữa tối tại OSTRA" — vertical scroll drives a horizontal timeline
 * on desktop (pinned). On touch / small screens it becomes a native
 * swipe gallery with scroll-snap. Images open in a minimal viewer.
 */
export function DiningExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
          },
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-moment]", track).forEach((panel) => {
        const media = panel.querySelector<HTMLElement>("[data-moment-media]");
        const inner = panel.querySelector<HTMLElement>("[data-moment-inner]");
        const text = panel.querySelectorAll("[data-moment-text]");
        if (media) {
          gsap.fromTo(
            media,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "expo.inOut",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 92%", toggleActions: "play none none none" },
            },
          );
        }
        if (inner) {
          gsap.fromTo(
            inner,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        }
        gsap.from(text, {
          y: 24,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 75%", toggleActions: "play none none none" },
        });
      });

      return () => {
        gsap.set(track, { clearProps: "transform" });
      };
    });

    // Re-measure after fonts/images settle
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(id);
      mm.revert();
    };
  }, []);

  return (
    <section
      id="khong-gian"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink-2 py-[var(--section-y)] lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0"
      aria-labelledby="dining-title"
    >
      <div ref={trackRef} className="dining-track lg:items-end lg:pl-[var(--gutter)] lg:pr-[20vw]">
        {/* Intro panel */}
        <div className="flex w-[82vw] shrink-0 flex-col justify-between gap-10 sm:w-[60vw] lg:h-[min(72vh,760px)] lg:w-[34vw]">
          <p className="label text-stone">
            <span className="label__num">05</span>
            <span className="label__rule" aria-hidden="true" />
            <span>Không gian</span>
          </p>
          <div>
            <h2 id="dining-title" className="t-h1 lg:!text-[clamp(3rem,6vw,7rem)]">
              Một bữa tối
              <br />
              tại <em className="t-serif">OSTRA.</em>
            </h2>
            <p className="t-body mt-8 max-w-sm text-mute">
              Bốn khoảnh khắc, từ lúc ánh nắng cuối cùng chạm bàn đến ly vang sau cùng.
            </p>
            <p className="t-meta mt-10 hidden items-center gap-3 text-mute lg:flex" aria-hidden="true">
              Cuộn để đi tiếp <span className="inline-block h-px w-10 bg-mute" />
            </p>
            <p className="t-meta mt-8 text-mute lg:hidden" aria-hidden="true">
              Vuốt để xem →
            </p>
          </div>
        </div>

        {diningMoments.map((m, i) => (
          <article
            key={m.index}
            data-moment
            className={`flex w-[82vw] shrink-0 flex-col sm:w-[62vw] lg:w-[46vw] ${i % 2 === 1 ? "lg:mb-[8vh]" : ""}`}
            aria-labelledby={`moment-${m.index}`}
          >
            <button
              type="button"
              className="media relative block aspect-[4/3] w-full cursor-pointer lg:aspect-auto lg:h-[min(58vh,620px)]"
              data-moment-media
              data-cursor="Xem"
              onClick={() => setViewer(i)}
              aria-label={`Xem ảnh lớn: ${m.title}`}
            >
              <span className="absolute inset-[0_-8%] block will-change-transform" data-moment-inner>
                <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width: 1024px) 46vw, 82vw" className="object-cover" loading="lazy" />
              </span>
            </button>
            <div className="mt-6 grid grid-cols-[auto_1fr] items-baseline gap-x-6">
              <p className="t-meta tabular text-mute" data-moment-text>
                {m.index} — {m.time}
              </p>
              <h3 id={`moment-${m.index}`} className="t-h3" data-moment-text>
                {m.title}
              </h3>
              <p className="col-start-2 mt-3 max-w-md text-[15px] leading-relaxed text-mute" data-moment-text>
                {m.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Progress */}
      <div className="shell absolute inset-x-0 bottom-8 hidden lg:block" aria-hidden="true">
        <div className="flex items-center gap-6">
          <span className="t-meta tabular text-mute">18:30</span>
          <div className="relative h-px flex-1 bg-[var(--line-dark)]">
            <div ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-ivory" />
          </div>
          <span className="t-meta tabular text-mute">23:00</span>
        </div>
      </div>

      <Viewer index={viewer} onClose={() => setViewer(null)} onChange={setViewer} />
    </section>
  );
}

function Viewer({
  index,
  onClose,
  onChange,
}: {
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const total = diningMoments.length;

  const step = useCallback(
    (dir: 1 | -1) => index !== null && onChange((index + dir + total) % total),
    [index, onChange, total],
  );

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    if (ref.current) gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      prev?.focus({ preventScroll: true });
    };
  }, [open, onClose, step]);

  if (index === null) return null;
  const m = diningMoments[index];

  return createPortal(
    <div
      ref={ref}
      className="fixed inset-0 z-[110] flex flex-col bg-ink/95"
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh ${m.index}: ${m.title}`}
    >
      <div className="shell flex items-center justify-between py-5">
        <p className="t-meta tabular text-mute">
          {m.index} / 0{total} — {m.time}
        </p>
        <button ref={closeRef} type="button" className="link-line" onClick={onClose} aria-label="Đóng ảnh">
          Đóng <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div className="relative mx-[var(--gutter)] flex-1">
        <Image key={m.image.src} src={m.image.src} alt={m.image.alt} fill sizes="100vw" className="object-contain" />
      </div>
      <div className="shell flex items-center justify-between py-6">
        <button type="button" className="link-line" onClick={() => step(-1)}>
          <span aria-hidden="true">←</span> Trước
        </button>
        <p className="t-h3 hidden text-center sm:block">{m.title}</p>
        <button type="button" className="link-line" onClick={() => step(1)}>
          Tiếp <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
