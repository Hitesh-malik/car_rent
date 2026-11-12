"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { CalendarRange, CarFront, CircleCheckBig, Route } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE_OUT } from "@/lib/motion";

const STEPS = [
  { n: "01", icon: CarFront, title: "Explore your car", body: "Browse the fleet, compare specs and see every angle in the showroom." },
  { n: "02", icon: CalendarRange, title: "Select your dates", body: "Add pickup and return details in the trip planner." },
  { n: "03", icon: CircleCheckBig, title: "Confirm your booking", body: "We confirm availability, price and terms with you on WhatsApp." },
  { n: "04", icon: Route, title: "Enjoy your journey", body: "Collect a clean, checked car and hit the road." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title={
            <>
              Four steps to the <span className="text-muted">driver&apos;s seat.</span>
            </>
          }
          description="No sign-ups, no checkout. Pick a car, share your dates and we take it from there."
          align="center"
        />

        <div ref={ref} className="relative mt-16 [perspective:1200px]">
          {/* progress rail (desktop: horizontal, mobile: vertical) */}
          <div aria-hidden className="absolute left-[1.75rem] top-0 h-full w-px bg-line lg:left-0 lg:top-[1.75rem] lg:h-px lg:w-full">
            <m.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-gradient-to-b from-racing to-bright lg:hidden" />
            <m.div style={{ scaleX: progress }} className="hidden h-full w-full origin-left bg-gradient-to-r from-racing to-bright  lg:block" />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <m.li
                key={s.n}
                initial={{ opacity: 0, rotateX: 28, y: 40 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.12 }}
                className="relative flex origin-top gap-5 lg:block"
              >
                <span className="relative z-10 inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-night font-[family-name:var(--font-display)] text-base font-extrabold tabular-nums text-white shadow-[0_12px_30px_-12px_rgb(21_22_25/0.7)] ring-4 ring-white">
                  {s.n}
                  <span aria-hidden className="absolute -right-1 -top-1 size-3 rounded-full bg-bright " />
                </span>
                <div className="flex-1 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-racing/30 hover:shadow-[var(--shadow-lift)] lg:mt-8">
                  <s.icon className="size-6 text-racing" strokeWidth={1.7} aria-hidden />
                  <h3 className="mt-4 text-xl font-bold tracking-[-0.025em] text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft/80">{s.body}</p>
                </div>
              </m.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
