import type { Metadata } from "next";
import credits from "@/data/image-credits.json";
import { Container } from "@/components/ui/Container";
import { PageTransition } from "@/components/layout/PageTransition";
import { Eyebrow } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Image credits",
  description: "Attribution for the vehicle photographs and 3D model used on this website.",
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
      <Container className="max-w-4xl py-16 sm:py-24">
        <Eyebrow>Attribution</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">Image credits</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Vehicle photographs are sourced from Wikimedia Commons under the licences listed below and are used as placeholders
          for illustration. Images were resized for the web; no other changes were made.
        </p>

        <div className="mt-12 space-y-10">
          {Object.entries(byCar).map(([car, items]) => (
            <section key={car} aria-labelledby={`credit-${items[0].src}`}>
              <h2 id={`credit-${items[0].src}`} className="text-lg font-semibold tracking-[-0.02em] text-ink">
                {car}
              </h2>
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {items.map((c) => (
                  <li key={c.src} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <a href={c.pageUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 break-words font-medium text-ink underline-offset-2 hover:underline">
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

          <section aria-labelledby="credit-3d">
            <h2 id="credit-3d" className="text-lg font-semibold tracking-[-0.02em] text-ink">
              3D sample model
            </h2>
            <p className="mt-3 rounded-2xl border border-line p-4 text-sm text-muted">
              <a
                href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                “Car Concept”
              </a>{" "}
              by Eric Chadwick / Darmstadt Graphics Group GmbH, based on a public-domain model by Unity Fan —{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                CC BY 4.0
              </a>
              . Optimised for the web (meshopt geometry, WebP textures). Shown as a representative sample, not a model of any
              specific vehicle in the fleet.
            </p>
          </section>
        </div>
      </Container>
    </PageTransition>
  );
}
