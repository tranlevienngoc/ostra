import { Lines, SectionLabel } from "@/components/ui/Typography";
import { Media } from "@/components/ui/Media";
import { kitchenPrinciples } from "@/data/site";
import { pad2 } from "@/lib/format";

export function Kitchen() {
  return (
    <section className="section bg-ink" aria-labelledby="kitchen-title">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel num="04" className="text-stone">
              Gian bếp
            </SectionLabel>
          </div>
          <Lines
            id="kitchen-title"
            className="t-h1 col-span-12 lg:col-span-9 lg:!text-[clamp(3rem,6.8vw,7.5rem)]"
            lines={["Kỹ thuật", <>phục vụ <span className="t-serif">nguyên liệu.</span></>]}
          />
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,7vw,7rem)] gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <Media
              src="/images/chef_plating.jpg"
              alt="Bếp trưởng dùng nhíp hoàn thiện đĩa cá áp chảo, phía sau là ngọn lửa của bếp mở"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="aspect-[4/5] w-full md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]"
              reveal="left"
              parallax={5}
              objectPosition="50% 60%"
            />
          </div>

          <div className="col-span-12 flex flex-col justify-between gap-12 lg:col-span-4 lg:col-start-9">
            <div>
              <blockquote className="t-quote !text-[clamp(1.45rem,2.1vw,2.2rem)]" data-split>
                “Chúng tôi tin rằng một nguyên liệu tốt không cần quá nhiều thứ để trở nên đáng nhớ.”
              </blockquote>
              <p className="t-meta mt-6 text-stone" data-fade>
                — Lê Hải Nam, Bếp trưởng
              </p>
              <p className="t-body mt-8 text-mute" data-split>
                Bếp của OSTRA làm việc với lửa than và sự kiên nhẫn. Mỗi món đi qua ít công đoạn nhất có thể, để vị
                ngọt thanh của hải sản là thứ đầu tiên và sau cùng đọng lại trong bạn.
              </p>
            </div>

            <div className="border-t border-[var(--line-dark)] pt-2">
              {kitchenPrinciples.map((p, i) => (
                <div
                  key={p.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-[var(--line-dark)] py-4"
                  data-fade
                >
                  <span className="t-meta tabular pt-0.5 text-stone">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="t-h3 !text-[15px] tracking-[0.06em] text-ivory">{p.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-mute">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
