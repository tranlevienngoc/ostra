"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Reservation } from "./Reservation";

interface ReservationContextValue {
  open: (trigger?: HTMLElement | null) => void;
}

const ReservationContext = createContext<ReservationContextValue>({ open: () => {} });

export const useReservation = () => useContext(ReservationContext);

/**
 * Owns the booking overlay. Any element with `data-reserve` anywhere in
 * the page opens it (event delegation), so server components can render
 * plain anchors that still work as a no-JS fallback (they link to #lien-he).
 */
export function ReservationProvider({ children }: { children: ReactNode }) {
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const [session, setSession] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setOpenedAt(Date.now());
  }, []);

  const close = useCallback(() => setOpenedAt(null), []);
  const reset = useCallback(() => setSession((s) => s + 1), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-reserve]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      open(el);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ReservationContext.Provider value={value}>
      {children}
      <Reservation
        key={session}
        openedAt={openedAt}
        onClose={close}
        onReset={reset}
        returnFocusRef={triggerRef}
      />
    </ReservationContext.Provider>
  );
}
