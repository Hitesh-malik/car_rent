"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const STEPS = [
  { n: "01", title: "Explore Cars", body: "Browse the collection and discover your ideal vehicle." },
  { n: "02", title: "View Details", body: "Check photos, specifications, and available information." },
  { n: "03", title: "Inquire on WhatsApp", body: "Contact our team to discuss availability and rental arrangements." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Three steps to the driver's seat."
          description="No sign-ups, no checkout. Just pick a car and start a conversation."
          align="center"
        />

        <div ref={ref} className="relative mt-16">
          {/* connecting line (desktop: horizontal, mobile: vertical) */}
          <div aria-hidden className="absolute left-[1.6rem] top-0 h-full w-px bg-line md:left-0 md:top-[1.6rem] md:h-px md:w-full">
            <m.div
              style={{ scaleY: progress }}
              className="h-full w-full origin-top bg-accent md:hidden"
            />
            <m.div style={{ scaleX: progress }} className="hidden h-full w-full origin-left bg-accent md:block" />
          </div>

          <RevealGroup as="ol" stagger={0.14} className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((s) => (
              <RevealItem as="li" key={s.n} className="relative flex gap-6 md:block">
                <span
                  className="relative z-10 inline-flex size-[3.2rem] shrink-0 items-center justify-center rounded-full border border-line bg-white text-sm font-bold tabular-nums tracking-tight text-ink shadow-[var(--shadow-soft)]"
                >
                  {s.n}
                </span>
                <div className="md:mt-8 md:pr-8">
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-ink sm:text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
