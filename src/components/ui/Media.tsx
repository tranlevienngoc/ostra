import Image from "next/image";

/**
 * Editorial image block.
 *  - `reveal`   → clip-path reveal + subtle scale on scroll
 *  - `parallax` → inner layer drifts (percent) while scrolling
 *  - `hover`    → 1.035 scale on hover
 * The wrapper owns the aspect ratio, so there is never layout shift.
 */
export function Media({
  src,
  alt,
  sizes,
  className = "",
  reveal = "up",
  parallax = 0,
  hover = false,
  preload = false,
  cursor,
  objectPosition,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  reveal?: "up" | "down" | "left" | "right" | "none";
  parallax?: number;
  hover?: boolean;
  preload?: boolean;
  cursor?: string;
  objectPosition?: string;
}) {
  return (
    <div
      className={`media ${hover ? "media--hover" : ""} ${className}`}
      data-clip={reveal === "none" ? undefined : reveal}
      data-cursor={cursor}
    >
      <div className="media__inner" data-parallax={parallax || undefined} style={parallax ? undefined : { inset: 0 }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload ? undefined : "lazy"}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    </div>
  );
}
