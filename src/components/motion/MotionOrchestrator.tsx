"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, lockScroll, unlockScroll } from "@/lib/scroll";

/**
 * Central motion layer.
 *
 * Sections stay server components and only declare intent with data
 * attributes. This component wires those attributes to GSAP once fonts
 * are ready, and reverts everything on unmount (gsap.context + matchMedia).
 *
 *   [data-lines]         masked line reveal (headings)
 *   [data-split]         SplitText line reveal (paragraphs)
 *   [data-scrub-words]   word opacity tied to scroll (manifesto)
 *   [data-clip]          clip-path image reveal + settle scale
 *   [data-parallax="n"]  subtle parallax drift
 *   [data-divider]       hairline draws in
 *   [data-fade]          quiet fade-up
 *   [data-scrub-scale]   image settles from 1.12 → 1 while scrolling
 */

const CLIP_FROM: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

export function MotionOrchestrator() {
  useEffect(() => {
    let cancelled = false;
    const mm = gsap.matchMedia();
    const reduce = prefersReducedMotion();
    const preloader = document.querySelector<HTMLElement>(".preloader");

    const start = async () => {
      try {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
      } catch {
        /* ignore */
      }
      if (cancelled) return;

      if (reduce) {
        gsap.set("[data-intro]", { visibility: "visible" });
        if (preloader) gsap.set(preloader, { display: "none" });
        document.documentElement.classList.add("intro-done");
        return;
      }

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          playIntro(preloader);
          scrollReveals(desktop);
        },
      );

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    start();

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */

let introPlayed = false;

function playIntro(preloader: HTMLElement | null) {
  const heroMedia = document.querySelector<HTMLElement>("[data-hero-media]");
  const heroImg = heroMedia?.querySelector("img");
  const heroLines = document.querySelectorAll('[data-lines="intro"] .ln-i');
  const fades = document.querySelectorAll("[data-intro-fade]");

  gsap.set("[data-intro]", { visibility: "visible" });

  // Hero scroll-out: the image drifts and dims as the story begins
  if (heroMedia) {
    const hero = heroMedia.closest("section");
    gsap.to("[data-hero-parallax]", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-hero-content]", {
      yPercent: -18,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }

  if (introPlayed || !preloader) {
    if (preloader) gsap.set(preloader, { display: "none" });
    return;
  }
  introPlayed = true;

  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
  lockScroll();

  const letters = preloader.querySelectorAll(".preloader__word span");
  const line = preloader.querySelector(".preloader__line");
  const meta = preloader.querySelector(".preloader__meta");

  gsap.set(heroMedia, { clipPath: "inset(50% 0% 50% 0%)" });
  gsap.set(heroImg ?? [], { scale: 1.28 });
  gsap.set(heroLines, { yPercent: 118 });
  gsap.set(fades, { autoAlpha: 0, y: 18 });
  gsap.set(".header", { autoAlpha: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "expo.out" },
    onComplete: () => {
      gsap.set(preloader, { display: "none" });
      gsap.set(heroImg ?? [], { clearProps: "scale" });
      unlockScroll();
      document.documentElement.classList.add("intro-done");
    },
  });

  // 01 near-black → 02 OSTRA rises → 03 hairline draws across
  tl.to(letters, { yPercent: 0, duration: 0.85, stagger: 0.05 }, 0.1)
    .to(meta, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.3)
    .to(line, { scaleX: 1, duration: 0.85, ease: "expo.inOut" }, 0.35)
    .to(letters, { yPercent: -112, duration: 0.55, stagger: 0.025, ease: "expo.in" }, 0.95)
    .to(meta, { opacity: 0, duration: 0.3 }, 1.0)
    // 04 the line opens into the hero image
    .set(preloader, { backgroundColor: "transparent" }, 1.2)
    .to(heroMedia, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 1.2)
    .to(line, { opacity: 0, duration: 0.35, ease: "power1.out" }, 1.25)
    .to(heroImg ?? [], { scale: 1, duration: 1.8, ease: "expo.out" }, 1.2)
    // 05 typography line by line
    .to(heroLines, { yPercent: 0, duration: 1.0, stagger: 0.08 }, 1.55)
    .to(fades, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.05 }, 1.7)
    .to(".header", { autoAlpha: 1, duration: 0.8 }, 1.75);
}

/* ------------------------------------------------------------------ */

function scrollReveals(desktop: boolean) {
  // Headings — masked lines
  gsap.utils.toArray<HTMLElement>('[data-lines]:not([data-lines="intro"])').forEach((el) => {
    gsap.from(el.querySelectorAll(".ln-i"), {
      yPercent: 118,
      duration: 1.35,
      stagger: 0.09,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Paragraphs — SplitText lines with mask
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      },
    });
  });

  // Manifesto — words brighten with scroll
  gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((el) => {
    SplitText.create(el, {
      type: "words",
      tag: "span",
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 50%", scrub: 0.6 },
          },
        );
      },
    });
  });

  // Images — clip-path reveal with a settling scale
  gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
    const from = CLIP_FROM[el.dataset.clip ?? "up"] ?? CLIP_FROM.up;
    const img = el.querySelector("img");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    tl.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" });
    if (img) {
      tl.fromTo(
        img,
        { scale: 1.22 },
        { scale: 1, duration: 2.2, ease: "expo.out", clearProps: "transform" },
        0.1,
      );
    }
  });

  // Parallax — reduced on small screens
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax) * (desktop ? 1 : 0.4);
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-scrub-scale]").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1.14 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom 30%", scrub: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-divider]").forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      duration: 1.8,
      ease: "expo.inOut",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 22,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });

  // Footer wordmark rises letter by letter
  const word = document.querySelector("[data-footer-word]");
  if (word) {
    gsap.from(word.querySelectorAll("span"), {
      yPercent: 100,
      duration: 1.6,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: word, start: "top 98%", once: true },
    });
  }
}
