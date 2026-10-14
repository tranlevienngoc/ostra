"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { reservationConfig, reservationCopy } from "@/data/reservation";
import { site } from "@/data/site";
import {
  formatLongDate,
  getBookableDays,
  getSlotState,
  guestLabel,
  validateDetails,
  validateField,
  type DetailErrors,
  type GuestDetails,
} from "@/lib/reservation";

type Step = 1 | 2 | 3;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const EMPTY: GuestDetails = { name: "", phone: "", email: "", note: "" };

export function Reservation({
  openedAt,
  onClose,
  onReset,
  returnFocusRef,
}: {
  openedAt: number | null;
  onClose: () => void;
  onReset: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const isOpen = openedAt !== null;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasOpen = useRef(false);
  const uid = useId();

  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<string | null>(null);
  const [guests, setGuests] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<GuestDetails>(EMPTY);
  const [errors, setErrors] = useState<DetailErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState("");

  // "now" is frozen at the moment the overlay opens → stable during the session
  const now = useMemo(() => (openedAt ? new Date(openedAt) : null), [openedAt]);
  const days = useMemo(() => (now ? getBookableDays(now) : []), [now]);

  // Pre-select nearest bookable date and party of 2 for effortless 1-tap slot selection
  useEffect(() => {
    if (isOpen && days.length > 0 && !date) {
      const firstAvailable = days.find((d) => !d.closed)?.iso;
      if (firstAvailable) setDate(firstAvailable);
      if (guests === null) setGuests(2);
    }
  }, [isOpen, days, date, guests]);

  const slotState = useCallback(
    (t: string) => (now && date ? getSlotState(date, t, guests, now) : "past"),
    [now, date, guests],
  );
  // If availability changes (other date / party size), drop an invalid time
  const validTime = time && slotState(time) === "available" ? time : null;
  const canContinue = Boolean(date && guests && validTime);
  const largeParty = guests !== null && guests >= reservationConfig.largePartyFrom;

  const finishClose = useCallback(
    (completed: boolean) => {
      unlockScroll();
      returnFocusRef.current?.focus({ preventScroll: true });
      if (completed) onReset();
    },
    [onReset, returnFocusRef],
  );

  /* ---------- open / close animation ---------- */
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    const reduce = prefersReducedMotion();
    const backdrop = root.querySelector(".resv__backdrop");
    const items = root.querySelectorAll("[data-resv-anim]");

    if (isOpen && !wasOpen.current) {
      wasOpen.current = true;
      lockScroll();
      const tl = gsap.timeline();
      tl.set(root, { visibility: "visible" })
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.5, ease: "power2.out" }, 0)
        .fromTo(
          panel,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 1.05, ease: "expo.inOut" },
          0,
        )
        .fromTo(
          items,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: reduce ? 0 : 1, stagger: 0.05, ease: "expo.out" },
          reduce ? 0 : 0.55,
        )
        .add(() => headingRef.current?.focus({ preventScroll: true }));
      return () => {
        tl.kill();
      };
    }

    if (!isOpen && wasOpen.current) {
      wasOpen.current = false;
      const completed = step === 3;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { visibility: "hidden" });
          finishClose(completed);
        },
      });
      tl.to(items, { autoAlpha: 0, duration: reduce ? 0 : 0.3, ease: "power2.in" }, 0)
        .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: reduce ? 0 : 0.9, ease: "expo.inOut" }, reduce ? 0 : 0.1)
        .to(backdrop, { opacity: 0, duration: reduce ? 0 : 0.5 }, reduce ? 0 : 0.5);
      return () => {
        tl.progress(1).kill();
      };
    }
  }, [isOpen, step, finishClose]);

  /* ---------- keyboard: Esc + focus trap ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* ---------- step transitions ---------- */
  const goTo = (next: Step) => {
    const el = stepRef.current;
    const reduce = prefersReducedMotion();
    const swap = () => {
      setStep(next);
      requestAnimationFrame(() => {
        const scroller = panelRef.current?.querySelector("[data-resv-scroll]");
        scroller?.scrollTo({ top: 0 });
        if (stepRef.current) {
          gsap.fromTo(
            stepRef.current.children,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.9, stagger: 0.06, ease: "expo.out" },
          );
        }
        headingRef.current?.focus({ preventScroll: true });
      });
    };
    if (!el || reduce) return swap();
    gsap.to(el.children, { y: -16, autoAlpha: 0, duration: 0.35, stagger: 0.02, ease: "power2.in", onComplete: swap });
  };

  /* ---------- form ---------- */
  const update = (field: keyof GuestDetails, value: string) => {
    setDetails((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: validateField(field, value) }));
  };
  const blur = (field: keyof GuestDetails) => {
    if (field !== "note" && !details[field]) return; // don't nag on untouched empty fields
    setErrors((er) => ({ ...er, [field]: validateField(field, details[field]) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateDetails(details);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof GuestDetails)[])[0];
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitting(true);
    // Simulated network round-trip — replace with a POST to the booking API.
    window.setTimeout(() => {
      const d = date ? date.slice(5).replace("-", "") : "0000";
      setCode(`OS-${d}-${Math.floor(100 + Math.random() * 900)}`);
      setSubmitting(false);
      goTo(3);
    }, 1400);
  };

  const finish = () => onClose();

  const summaryDate = date ? formatLongDate(date) : null;
  const summaryGuests = guests ? `${guestLabel(guests)} khách` : null;
  const firstMonth = days[0]?.month;
  const lastMonth = days[days.length - 1]?.month;

  return (
    <div
      ref={rootRef}
      className="resv"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="resv__backdrop" onClick={onClose} />
      <div ref={panelRef} className="resv__panel">
        {/* ——— Visual side (desktop) ——— */}
        <aside className="relative hidden overflow-hidden lg:block" aria-hidden="true">
          <Image
            src="/images/dining_interior.jpg"
            alt=""
            fill
            sizes="40vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-12">
            <p className="font-display text-2xl font-semibold tracking-[-0.04em]" data-resv-anim>
              OSTRA
            </p>
            <div data-resv-anim>
              <p className="t-meta text-stone">Bàn của bạn</p>
              <dl className="mt-6 grid gap-4">
                <SummaryRow label="Ngày" value={summaryDate} />
                <SummaryRow label="Giờ" value={validTime} />
                <SummaryRow label="Số khách" value={summaryGuests} />
              </dl>
              <p className="t-meta mt-10 text-mute">
                {site.address.street} — {site.address.city}
                <br />
                {site.hours.days} · {site.hours.open}
              </p>
            </div>
          </div>
        </aside>

        {/* ——— Flow side ——— */}
        <div className="relative flex min-h-0 flex-col">
          <header
            className="flex items-center justify-between border-b border-[var(--line-dark)] px-5 py-4 sm:px-8 lg:px-12"
            data-resv-anim
          >
            <p className="t-meta text-stone">{reservationCopy.overline}</p>
            <div className="flex items-center gap-6">
              {step < 3 && (
                <p className="t-meta tabular hidden text-mute sm:block" aria-live="polite">
                  Bước 0{step} / 02
                </p>
              )}
              <button
                type="button"
                onClick={onClose}
                className="link-line !py-3"
                aria-label="Đóng cửa sổ đặt bàn"
              >
                Đóng <span aria-hidden="true">✕</span>
              </button>
            </div>
          </header>

          {/* progress */}
          <div className="h-px w-full bg-[var(--line-dark)]" aria-hidden="true">
            <div
              className="h-px bg-ivory transition-[width] duration-700 ease-[var(--ease-expo)]"
              style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent data-resv-scroll>
            <div ref={stepRef} className="px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pt-12" data-resv-anim>
              {step === 1 && (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <h2 id={`${uid}-title`} ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                      Chọn ngày
                    </h2>
                    <p className="t-meta pb-1 text-mute">
                      Tháng {firstMonth}
                      {lastMonth !== firstMonth ? ` — ${lastMonth}` : ""}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2" role="group" aria-label="Chọn ngày">
                    {days.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        className="chip !min-h-[64px] sm:!min-h-[72px]"
                        aria-pressed={date === d.iso}
                        aria-label={`${formatLongDate(d.iso)}${d.isToday ? " (hôm nay)" : ""}`}
                        disabled={d.closed}
                        onClick={() => setDate(d.iso)}
                      >
                        <span className="text-[10px] tracking-[0.14em] opacity-70">
                          {d.isToday ? "NAY" : d.weekdayShort}
                        </span>
                        <span className="chip__main mt-1 font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                          {d.day}
                        </span>
                      </button>
                    ))}
                  </div>

                  <h3 className="t-meta mt-10 text-stone">{reservationCopy.guests}</h3>
                  <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-label="Số khách">
                    {reservationConfig.guestOptions.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className="chip"
                        aria-pressed={guests === g}
                        aria-label={`${guestLabel(g)} khách`}
                        onClick={() => setGuests(g)}
                      >
                        <span className="chip__main text-base">{guestLabel(g)}</span>
                      </button>
                    ))}
                  </div>
                  {largeParty && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">{reservationCopy.largeParty}</p>
                  )}

                  <div className="mt-10 flex items-baseline justify-between">
                    <h3 className="t-meta text-stone">{reservationCopy.time}</h3>
                    {date && guests && (
                      <p className="t-meta flex items-center gap-4 text-mute">
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block h-2 w-2 border border-ivory/60" /> Còn bàn
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block h-2 w-2 bg-mute/40" /> Hết bàn
                        </span>
                      </p>
                    )}
                  </div>
                  {date && guests ? (
                    <div className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2" role="group" aria-label="Chọn giờ">
                      {reservationConfig.slots.map((t) => {
                        const s = slotState(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            className="chip"
                            aria-pressed={validTime === t}
                            disabled={s !== "available"}
                            aria-label={`${t}${s === "full" ? ", hết bàn" : s === "past" ? ", không còn nhận" : ""}`}
                            onClick={() => setTime(t)}
                          >
                            <span className="chip__main text-[15px]">{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 border border-dashed border-[var(--line-dark)] px-4 py-6 text-sm text-mute">
                      Chọn ngày và số khách để xem giờ còn trống.
                    </p>
                  )}
                </>
              )}

              {step === 2 && (
                <form onSubmit={submit} noValidate>
                  <h2 id={`${uid}-title`} ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                    Thông tin
                    <br />
                    đặt bàn
                  </h2>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[var(--line-dark)] py-4">
                    <p className="t-meta tabular text-ivory">
                      {summaryDate} · {validTime} · {summaryGuests}
                    </p>
                    <button type="button" className="link-line !py-1 text-stone" onClick={() => goTo(1)}>
                      Thay đổi
                    </button>
                  </div>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-x-8">
                    <Field
                      id={`${uid}-name`}
                      label="Họ và tên"
                      autoComplete="name"
                      value={details.name}
                      error={errors.name}
                      onChange={(v) => update("name", v)}
                      onBlur={() => blur("name")}
                      className="sm:col-span-2"
                      placeholder="Nguyễn Minh Anh"
                    />
                    <Field
                      id={`${uid}-phone`}
                      label="Số điện thoại"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={details.phone}
                      error={errors.phone}
                      onChange={(v) => update("phone", v)}
                      onBlur={() => blur("phone")}
                      placeholder="0905 123 456"
                    />
                    <Field
                      id={`${uid}-email`}
                      label="Email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={details.email}
                      error={errors.email}
                      onChange={(v) => update("email", v)}
                      onBlur={() => blur("email")}
                      placeholder="ten@email.com"
                    />
                    <Field
                      id={`${uid}-note`}
                      label="Ghi chú"
                      optional
                      multiline
                      value={details.note}
                      error={errors.note}
                      onChange={(v) => update("note", v)}
                      onBlur={() => blur("note")}
                      className="sm:col-span-2"
                      placeholder="Dị ứng, dịp đặc biệt, chỗ ngồi gần bếp mở…"
                    />
                  </div>

                  <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">{reservationCopy.policy}</p>

                  <button
                    type="submit"
                    className="btn btn--solid mt-8 w-full sm:w-auto"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? "Đang giữ bàn…" : "Xác nhận đặt bàn"}
                    {!submitting && <span className="arrow arrow--right" aria-hidden="true">→</span>}
                  </button>
                </form>
              )}

              {step === 3 && (
                <div aria-live="polite">
                  <p className="t-meta text-accent">Đã xác nhận — {code}</p>
                  <h2
                    id={`${uid}-title`}
                    ref={headingRef}
                    tabIndex={-1}
                    className="t-h1 mt-6 outline-none !text-[clamp(2.6rem,6vw,6rem)]"
                  >
                    Bàn của bạn
                    <br />
                    đã được <em className="t-serif">giữ.</em>
                  </h2>
                  <dl className="mt-10 grid max-w-xl gap-4 border-t border-[var(--line-dark)] pt-6">
                    <SummaryRow label="Ngày" value={summaryDate} />
                    <SummaryRow label="Giờ" value={validTime} />
                    <SummaryRow label="Số khách" value={summaryGuests} />
                  </dl>
                  <p className="t-body mt-8 text-stone">{reservationCopy.success}</p>
                  <button type="button" className="btn btn--solid mt-10" onClick={finish}>
                    Hoàn tất
                  </button>
                </div>
              )}
            </div>
          </div>

          {step === 1 && (
            <footer
              className="flex flex-col gap-3 border-t border-[var(--line-dark)] bg-ink-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"
              data-resv-anim
            >
              <p className="t-meta tabular text-mute" aria-live="polite">
                {canContinue ? `${summaryDate} · ${validTime} · ${summaryGuests}` : reservationCopy.hintIncomplete}
              </p>
              <button
                type="button"
                className="btn btn--solid w-full sm:w-auto"
                disabled={!canContinue}
                onClick={() => goTo(2)}
              >
                Tiếp tục <span className="arrow arrow--right" aria-hidden="true">→</span>
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[var(--line-dark)] pb-3">
      <dt className="t-meta text-mute">{label}</dt>
      <dd className={`font-display text-lg tracking-[-0.01em] ${value ? "text-ivory" : "text-mute/60"}`}>
        {value ?? "—"}
      </dd>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  optional,
  multiline,
  className = "",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  optional?: boolean;
  multiline?: boolean;
  className?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  placeholder?: string;
}) {
  const errId = `${id}-error`;
  const common = {
    id,
    value,
    onBlur,
    className: "field__input",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errId : undefined,
    "aria-required": !optional,
    placeholder: rest.placeholder,
  };
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field__label">
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal">Không bắt buộc</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={2} maxLength={300} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...common}
          type={rest.type ?? "text"}
          inputMode={rest.inputMode}
          autoComplete={rest.autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <span id={errId} className="field__error" role={error ? "alert" : undefined}>
        {error ?? ""}
      </span>
    </div>
  );
}
