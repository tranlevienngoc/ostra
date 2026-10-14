import { Divider, SectionLabel } from "@/components/ui/Typography";

export function Manifesto() {
  return (
    <section id="cau-chuyen" className="section theme-ivory" aria-labelledby="manifesto-title">
      <div className="shell">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel num="01">Triết lý</SectionLabel>
          </div>

          <h2
            id="manifesto-title"
            className="t-statement col-span-12 lg:col-span-9"
            data-scrub-words
          >
            “OSTRA không bán món hải sản.
            <br className="hidden md:block" /> Chúng tôi bán một buổi tối đáng nhớ xoay quanh <em className="t-serif">hương vị của biển.”</em>
          </h2>
        </div>

        <div className="grid-12 mt-[clamp(4rem,9vw,9rem)] gap-y-10">
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <Divider />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-4">
            <p className="t-meta text-dim" data-fade>
              Từ năm 2021
              <br />
              Bếp mở — 42 chỗ ngồi
            </p>
          </div>
          <p className="t-body text-dim col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8" data-split>
            Tại OSTRA, mỗi món ăn bắt đầu từ sự tôn trọng tự nhiên. Hải sản đánh bắt trong ngày từ các vùng biển
            miền Trung, chế biến trên lửa than mộc và phục vụ ngay khi còn lưu lại trọn vẹn vị mặn mòi nguyên bản.
          </p>
        </div>
      </div>
    </section>
  );
}
