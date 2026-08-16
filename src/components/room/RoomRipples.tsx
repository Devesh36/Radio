"use client";

import { useEffect, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function RoomRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nextId = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const id = nextId;
      nextId += 1;
      setRipples((prev) => [...prev.slice(-6), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 900);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (ripples.length === 0) return null;

  return (
    <div className="room-ripples" aria-hidden="true">
      {ripples.map((ripple) => (
        <span key={ripple.id} className="room-ripple" style={{ left: ripple.x, top: ripple.y }}>
          <i />
          <i />
          <i />
        </span>
      ))}
    </div>
  );
}
