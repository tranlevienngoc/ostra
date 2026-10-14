import { Lines, Serif } from "@/components/ui/Typography";
import { site } from "@/data/site";
import { MapGraphic } from "./MapGraphic";

export function Location() {
  return (
    <section id="lien-he" className="section theme-ivory" aria-labelledby="location-title">
      <div className="shell">
        <Lines
          id="location-title"
          className="t-h1"
          lines={["Hẹn bạn", <>bên <Serif>bàn ăn.</Serif></>]}
        />

        <div className="grid-12 mt-[clamp(3.5rem,7vw,7rem)] gap-y-14">
          <div className="col-span-12 flex flex-col justify-between gap-12 lg:col-span-4">
            <dl className="grid gap-10">
              <div data-fade>
                <dt className="font-display text-2xl font-semibold tracking-[-0.03em]">OSTRA</dt>
                <dd className="mt-2 text-lg leading-snug">
                  {site.address.street}
                  <br />
                  {site.address.city}
                </dd>
              </div>
              <div data-fade>
                <dt className="t-meta text-dim">Giờ mở cửa</dt>
                <dd className="mt-3 grid gap-1">
                  <span>{site.hours.days}</span>
                  <span className="font-display text-2xl font-medium tracking-[-0.02em] tabular">{site.hours.open}</span>
                </dd>
              </div>
              <div data-fade>
                <dt className="t-meta text-dim">Bếp nhận món cuối</dt>
                <dd className="mt-3 font-display text-2xl font-medium tracking-[-0.02em] tabular">{site.hours.lastOrder}</dd>
              </div>
              <div data-fade>
                <dt className="t-meta text-dim">Liên hệ</dt>
                <dd className="mt-3 grid gap-1">
                  <a href={site.phone.href} className="nav-link w-fit">
                    {site.phone.display}
                  </a>
                  <a href={`mailto:${site.email}`} className="nav-link w-fit">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3" data-fade>
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn">
                Chỉ đường <span className="arrow arrow--right" aria-hidden="true">→</span>
                <span className="sr-only">(mở trong thẻ mới)</span>
              </a>
              <a href="#lien-he" data-reserve className="btn btn--dark">
                Đặt bàn <span className="arrow arrow--right" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-2 md:aspect-[16/11]" data-clip="up">
              <MapGraphic />
              <p className="t-meta absolute right-4 top-4 tabular text-dim">{site.coordinates.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
