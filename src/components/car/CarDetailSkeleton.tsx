import { Container } from "@/components/ui/Container";

export function CarDetailSkeleton() {
  return (
    <div className="bg-night">
      {/* red progress line across the top while the car loads */}
      <div aria-hidden className="relative h-[2px] overflow-hidden bg-white/5">
        <span className="race-line absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-bright to-soft-red" />
      </div>
      <Container className="pb-16 pt-4 sm:pt-6">
        <div role="status" aria-label="Loading car details">
          <div className="skeleton-dark mb-8 h-10 w-36 rounded-full" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <div className="skeleton-dark aspect-[4/3] rounded-[var(--radius-panel)] sm:aspect-[16/10]" />
              <div className="mt-4 flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton-dark h-[4.5rem] w-28 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4 lg:pt-2">
              <div className="skeleton-dark h-4 w-32 rounded" />
              <div className="skeleton-dark h-16 w-3/4 rounded-lg" />
              <div className="skeleton-dark h-5 w-full rounded" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-dark h-24 rounded-2xl" />
                ))}
              </div>
              <div className="skeleton-dark h-80 w-full rounded-[var(--radius-panel)]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
