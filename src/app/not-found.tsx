import Link from "next/link";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <main className="shell flex min-h-[100svh] flex-col justify-between py-10">
      <Link href="/" className="font-display text-[22px] font-semibold tracking-[-0.045em]">
        OSTRA
      </Link>
      <div>
        <p className="t-meta text-accent">404</p>
        <h1 className="t-display mt-6">
          Trang này
          <br />
          đã ra <em className="t-serif">khơi.</em>
        </h1>
        <p className="t-body mt-8 text-mute">
          Đường dẫn bạn tìm không còn ở đây. Có lẽ nó đã theo thuyền ra biển từ sáng sớm.
        </p>
      </div>
      <Link href="/" className="link-line w-fit">
        Về trang chủ <span className="arrow arrow--right" aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
