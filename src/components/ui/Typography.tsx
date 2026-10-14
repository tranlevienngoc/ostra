import type { ElementType, ReactNode } from "react";

/**
 * Renders text as masked lines for the GSAP line-reveal.
 * Each line is clipped by `.ln` and animated via `.ln-i`.
 * A trailing space per line keeps the accessible text natural.
 */
export function Lines({
  as: Tag = "h2",
  lines,
  className = "",
  intro = false,
  id,
}: {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  /** Part of the page-load timeline instead of a scroll reveal */
  intro?: boolean;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={className}
      data-lines={intro ? "intro" : ""}
      {...(intro ? { "data-intro": "" } : {})}
    >
      {lines.map((line, i) => (
        <span className="ln" key={i}>
          <span className="ln-i">
            {line}{" "}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Serif({ children }: { children: ReactNode }) {
  return <em className="t-serif">{children}</em>;
}

export function SectionLabel({ num, children, className = "" }: { num: string; children: ReactNode; className?: string }) {
  return (
    <p className={`label ${className}`} data-fade="">
      <span className="label__num">{num}</span>
      <span className="label__rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <span className={`divider ${className}`} data-divider="" aria-hidden="true" />;
}
