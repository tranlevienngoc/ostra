"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { Lines, Serif } from "@/components/ui/Typography";

export function FinalCta() {
  // The fill grows from wherever the pointer enters the button
  const track = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
      aria-labelledby="final-title"
    >
      <div className="absolute inset-[-10%_0] will-change-transform" data-parallax="6">
        <Image
          src="/images/final_cta.jpg"
          alt="Bàn ăn đã sắp sẵn với hàu tươi, ly vang và ngọn nến trong phòng ăn tối"
          fill
          sizes="100vw"
          className="object-cover object-[50%_70%]"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/45 to-ink/85" />

      <div className="shell relative py-[var(--section-y)]">
        <Lines
          id="final-title"
          className="t-display"
          lines={["Tối nay,", "bạn muốn", <>ăn <Serif>gì?</Serif></>]}
        />
        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="t-quote text-stone" data-fade>
            Có lẽ là thứ gì đó từ biển.
          </p>
          <div data-fade>
            <a href="#lien-he" data-reserve className="cta-big" onPointerEnter={track} onPointerLeave={track}>
              Đặt bàn tại OSTRA <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
