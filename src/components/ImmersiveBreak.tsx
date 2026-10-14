import Image from "next/image";
import { Lines, Serif } from "@/components/ui/Typography";

/** A visual pause — no CTA, only water and three words. */
export function ImmersiveBreak() {
  return (
    <section
      className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden bg-ink"
      aria-label="Tươi. Nguyên bản. Đúng mùa."
    >
      <div className="absolute inset-[-12%_0] will-change-transform" data-parallax="8">
        <Image
          src="/images/immersive_sea.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(10_11_10/0.7)_100%)]" />

      <Lines
        as="p"
        className="t-display relative items-center text-center"
        lines={["Tươi.", "Nguyên bản.", <>Đúng <Serif>mùa.</Serif></>]}
      />
    </section>
  );
}
