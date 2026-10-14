"use client";

import type Lenis from "lenis";

/**
 * Tiny module-level store for the Lenis instance so any client
 * component can scroll / lock without prop drilling or context.
 */
let instance: Lenis | null = null;
let lockCount = 0;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { offset: opts.offset ?? 0, duration: 1.6, immediate: opts.immediate });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce || opts.immediate ? "auto" : "smooth" });
  }
}

export function lockScroll() {
  lockCount += 1;
  instance?.stop();
  document.documentElement.classList.add("is-locked");
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    instance?.start();
    document.documentElement.classList.remove("is-locked");
  }
}
