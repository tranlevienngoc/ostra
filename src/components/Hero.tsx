import Image from "next/image";
import { Lines, Serif } from "@/components/ui/Typography";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="dau-trang" className="hero" aria-labelledby="hero-title">
      <div className="hero__media" data-hero-media>
        <div className="absolute inset-0 will-change-transform" data-hero-parallax>
          <Image
            src="/images/hero_oysters.jpg"
            alt="Hàu tươi mở vỏ trên đá bào trong khay thép, ánh sáng thấp"
            fill
            preload
            sizes="100vw"
            quality={75}
          />
        </div>
        <div className="hero__shade" />
      </div>

      <div
        className="shell relative flex h-full flex-col justify-between pb-8 pt-[calc(var(--header-h)+2.5rem)] sm:pb-10"
        data-hero-content
      >
        {/* Metadata */}
        <div className="t-meta flex items-start justify-between text-stone">
          <div data-intro data-intro-fade>
            <p className="text-ivory font-mono text-[11px] tracking-[0.2em]">{site.tagline}</p>
            <p className="mt-1 text-mute text-[10px] tracking-[0.16em]">{site.city}</p>
          </div>
          <p className="tabular hidden text-right md:block text-stone" data-intro data-intro-fade>
            {site.coordinates.label}
            <br />
            Mở cửa {site.hours.open}
          </p>
        </div>

        {/* Headline + copy */}
        <div className="grid-12 items-end gap-y-8 sm:gap-y-10">
          <Lines
            as="h1"
            id="hero-title"
            intro
            className="t-display col-span-12 lg:col-span-8 !text-[clamp(2.75rem,8.4vw,11.25rem)]"
            lines={["Biển,", "được kể", <>bằng <Serif>hương vị.</Serif></>]}
          />

          <div className="col-span-12 flex flex-col gap-6 sm:gap-8 sm:col-span-8 md:col-span-6 lg:col-span-4 lg:pb-3">
            <p className="t-body text-ivory/85" data-intro data-intro-fade>
              Một trải nghiệm ẩm thực đương đại, được dẫn dắt bởi mùa, biển và những nguyên liệu ở trạng thái
              nguyên bản nhất.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3" data-intro data-intro-fade>
              <a href="#cau-chuyen" className="link-line">
                Khám phá OSTRA <span className="arrow arrow--down" aria-hidden="true">↓</span>
              </a>
              <a href="#lien-he" data-reserve className="link-line text-stone">
                Đặt bàn <span className="arrow arrow--right" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
          data-intro
          data-intro-fade
          aria-hidden="true"
        >
          <span className="t-meta text-mute">Cuộn</span>
          <span className="scroll-cue" />
        </div>
      </div>
    </section>
  );
}
