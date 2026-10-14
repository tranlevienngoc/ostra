"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Contextual cursor — only appears over elements with `data-cursor`
 * (gallery images) and shows their label, e.g. "Xem".
 * Fine pointers only; the native cursor is never hidden.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    let active: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]") ?? null;
      if (target === active) return;
      active = target;
      if (target) {
        if (labelRef.current) labelRef.current.textContent = target.dataset.cursor ?? "";
        gsap.to(el, { scale: 1, duration: 0.6, ease: "expo.out" });
      } else {
        gsap.to(el, { scale: 0, duration: 0.45, ease: "expo.out" });
      }
    };
    const onLeave = () => {
      active = null;
      gsap.to(el, { scale: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span ref={labelRef} />
    </div>
  );
}
