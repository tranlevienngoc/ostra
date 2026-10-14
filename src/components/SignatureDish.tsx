import Image from "next/image";
import { Divider, Lines, SectionLabel } from "@/components/ui/Typography";
import { signatureDish } from "@/data/menu";

export function SignatureDish() {
  const d = signatureDish;
  return (
    <section className="section overflow-hidden bg-ink" aria-labelledby="signature-title">
      <div className="shell">
        <div className="grid-12 gap-y-12">
          {/* Copy column */}
          <div className="relative z-10 col-span-12 flex flex-col justify-between gap-12 lg:col-span-5 lg:gap-14">
            <div>
              <SectionLabel num="02" className="text-stone">
                Món đặc trưng
              </SectionLabel>
              <Lines
                id="signature-title"
                className="t-h1 mt-8 lg:mt-12 lg:!text-[clamp(3.8rem,8.2vw,9.5rem)]"
                lines={["Hàu.", "Đá.", "Biển."]}
              />
            </div>

            <div className="max-w-sm">
              <h3 className="t-h3" data-fade>
                {d.title}
              </h3>
              <ul className="mt-5">
                {d.components.map((c) => (
                  <li key={c} className="border-t border-[var(--line-dark)] py-3 text-[15px] text-stone" data-fade>
                    {c}
                  </li>
                ))}
              </ul>
              <Divider className="my-5" />
              <div className="flex items-baseline justify-between" data-fade>
                <p className="font-display text-3xl font-semibold tracking-[-0.03em] tabular">
                  {d.priceDisplay}
                  <span className="t-meta ml-3 text-mute">/ {d.unit}</span>
                </p>
              </div>
              <p className="t-quote mt-5 !text-[1.4rem] text-stone" data-fade>
                {d.microcopy}
              </p>
            </div>
          </div>

          {/* Image — macro oyster */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className="media relative aspect-[4/5] w-full lg:aspect-auto lg:h-[min(82vh,820px)]"
              data-clip="up"
            >
              <div className="absolute inset-0" data-scrub-scale>
                <Image
                  src={d.image.src}
                  alt={d.image.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <p className="t-meta absolute bottom-5 left-5 text-ivory/80">Nam Ô — Đà Nẵng</p>
              <p className="t-meta absolute bottom-5 right-5 text-ivory/80 tabular">04°C</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
