import { Divider, Lines, SectionLabel, Serif } from "@/components/ui/Typography";
import { Media } from "@/components/ui/Media";
import { sourcing } from "@/data/site";

export function IngredientStory() {
  return (
    <section id="nguyen-lieu" className="section theme-stone" aria-labelledby="ingredient-title">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel num="03">Nguyên liệu</SectionLabel>
          </div>
          <Lines
            id="ingredient-title"
            className="t-h1 col-span-12 lg:col-span-9"
            lines={["Mỗi ngày", "bắt đầu", <>từ <Serif>biển.</Serif></>]}
          />
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,8vw,8rem)] gap-y-14">
          {/* Image */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <Media
              src="/images/ingredient_fisherman.jpg"
              alt="Ngư dân miền Trung đặt con cá tươi vào thùng đá trên thuyền gỗ lúc bình minh"
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="aspect-[3/4] w-full"
              parallax={6}
            />
            <p className="t-meta mt-4 flex justify-between text-dim">
              <span>Cảng Thọ Quang</span>
              <span className="tabular">05:10</span>
            </p>
          </div>

          {/* Text */}
          <div className="col-span-12 flex flex-col justify-between gap-14 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <div>
              <blockquote className="t-quote" data-split>
                “Thực đơn của OSTRA không bắt đầu trong bếp. Nó bắt đầu từ những gì biển mang đến ngày hôm đó.”
              </blockquote>
              <p className="t-body text-dim mt-10" data-split>
                Chúng tôi ưu tiên nguyên liệu theo mùa và nguồn cung địa phương. Vì vậy, một số món có thể thay đổi
                mỗi ngày — không phải vì thiếu nhất quán, mà bởi chúng tôi chọn phục vụ nguyên liệu khi chúng ở trạng
                thái tốt nhất.
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-8">
                <div data-fade>
                  <dt className="t-meta text-dim">Nguồn gốc</dt>
                  <dd className="mt-2 font-display text-lg font-medium tracking-[-0.01em]">Miền Trung Việt Nam</dd>
                </div>
                <div data-fade>
                  <dt className="t-meta text-dim">Mùa</dt>
                  <dd className="mt-2 font-display text-lg font-medium tracking-[-0.01em]">Thay đổi hằng ngày</dd>
                </div>
              </dl>
            </div>

            {/* Harbor sourcing ledger */}
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="t-meta tracking-[0.2em] font-semibold" data-fade>
                  Nhật ký cảng Thọ Quang
                </h3>
                <span className="t-meta text-dim tabular text-[10px]" data-fade>
                  06:30 · Biển êm · Nước trong
                </span>
              </div>
              <Divider className="mt-4 !opacity-40" />
              <ul>
                {sourcing.map((s) => (
                  <li
                    key={s.item}
                    className="grid grid-cols-[1.2fr_1fr_auto] items-baseline gap-4 border-b border-[var(--line-light)] py-3.5"
                    data-fade
                  >
                    <span className={`font-display text-[17px] font-medium tracking-[-0.01em] ${s.out ? "line-through opacity-45" : ""}`}>
                      {s.item}
                    </span>
                    <span className="text-dim text-sm tracking-wide">{s.origin}</span>
                    <span className={`t-meta tabular text-[11px] ${s.out ? "text-accent font-medium" : "text-dim"}`}>{s.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
