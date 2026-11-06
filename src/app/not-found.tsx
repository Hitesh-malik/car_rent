import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">This road doesn&apos;t lead anywhere.</h1>
      <p className="mt-4 max-w-md text-muted">The page or car you&apos;re looking for isn&apos;t here. Let&apos;s get you back to the fleet.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/#fleet" arrow>
          Explore Our Cars
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
