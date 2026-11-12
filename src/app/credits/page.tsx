import type { Metadata } from "next";
import credits from "@/data/image-credits.json";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { Eyebrow } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Image credits",
  description: "Attribution for the vehicle photographs used on this website.",
  alternates: { canonical: "/credits" },
};

type Credit = { car: string; src: string; title: string; pageUrl: string; author: string; license: string; licenseUrl: string };

export default function CreditsPage() {
  const byCar = (credits as Credit[]).reduce<Record<string, Credit[]>>((acc, c) => {
    (acc[c.car] ??= []).push(c);
    return acc;
  }, {});

  return (
    <PageTransition>
      <section className="stage-dark relative isolate overflow-hidden pb-16 pt-10 text-white sm:pb-20 sm:pt-14">
        <div aria-hidden className="absolute -right-20 -top-40 -z-10 h-[26rem] w-[40rem] rounded-full bg-racing/8 blur-[110px]" />
        <Container className="[&>*]:max-w-4xl">
          <Eyebrow tone="dark">Attribution</Eyebrow>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-0.045em] sm:text-6xl">
            Image <span className="text-white/55">credits</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/60">
            Vehicle photographs are sourced from Wikimedia Commons under the licences listed below and are used as placeholders
            for illustration. Images were resized for the web; no other changes were made.
          </p>
        </Container>
      </section>

      <Container className="py-16 sm:py-20 [&>*]:max-w-4xl">

        <div className="space-y-10">
          {Object.entries(byCar).map(([car, items]) => (
            <section key={car} aria-labelledby={`credit-${items[0].src}`}>
              <h2 id={`credit-${items[0].src}`} className="text-lg font-bold tracking-[-0.02em] text-ink">
                {car}
              </h2>
              <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {items.map((c) => (
                  <li key={c.src} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <a href={c.pageUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 break-words font-medium text-ink underline-offset-2 hover:text-racing hover:underline">
                      {c.title}
                    </a>
                    <span className="shrink-0 text-muted">
                      {c.author} ·{" "}
                      {c.licenseUrl ? (
                        <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                          {c.license}
                        </a>
                      ) : (
                        c.license
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

        </div>
      </Container>
    </PageTransition>
  );
}
