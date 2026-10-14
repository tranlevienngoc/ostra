import { site } from "@/data/site";

/** Page-load curtain. Animated by MotionOrchestrator; hidden for reduced motion / no-JS. */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__word">
        {"OSTRA".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <span className="preloader__line" />
      <div className="preloader__meta t-meta">
        <span>{site.tagline}</span>
        <span className="hidden sm:inline">{site.city}</span>
      </div>
    </div>
  );
}
