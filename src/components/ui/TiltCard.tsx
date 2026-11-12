"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Subtle mouse-driven 3D tilt with a moving glare highlight.
 * Writes CSS variables directly (no React re-renders); touch and reduced-motion users get a static card.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  as?: "div" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * max * 1.4}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
      el.dataset.tilting = "true";
    });
  }

  function onPointerLeave(e: React.PointerEvent<HTMLElement>) {
    cancelAnimationFrame(frame.current);
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.tilting;
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "group/tilt relative [transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] transition-transform duration-500 ease-[var(--ease-out-expo)] data-[tilting]:duration-150",
        className,
      )}
    >
      {children}
      {/* glare */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.16),transparent_45%)] group-hover/tilt:opacity-100"
      />
    </Tag>
  );
}
