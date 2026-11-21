import { useEffect } from "react";

const ITEMS = ["🍬", "🎄", "⭐", "🎁", "❄️", "🔔", "🎅", "✨"];

export function FestiveCursor() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    let live = 0;
    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count && live < 24; i++) {
        const el = document.createElement("span");
        el.className = "festive-particle";
        el.textContent = ITEMS[Math.floor(Math.random() * ITEMS.length)] ?? "⭐";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.fontSize = `${12 + Math.random() * 12}px`;
        el.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}px`);
        el.style.setProperty("--dy", `${30 + Math.random() * 50}px`);
        el.style.setProperty("--rot", `${(Math.random() - 0.5) * 360}deg`);
        live++;
        el.addEventListener("animationend", () => { el.remove(); live--; }, { once: true });
        document.body.appendChild(el);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      spawn(e.clientX, e.clientY, 1);
    };
    const onDown = (e: PointerEvent) => spawn(e.clientX, e.clientY, e.pointerType === "mouse" ? 4 : 5);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);
  return null;
}
