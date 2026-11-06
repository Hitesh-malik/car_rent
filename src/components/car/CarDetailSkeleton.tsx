import { Container } from "@/components/ui/Container";

export function CarDetailSkeleton() {
  return (
    <Container className="pb-16 pt-4 sm:pt-6" >
      <div role="status" aria-label="Loading car details">
        <div className="skeleton mb-8 h-10 w-36 rounded-full" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <div className="skeleton mb-4 h-12 w-56 rounded-full" />
            <div className="skeleton aspect-[4/3] rounded-[var(--radius-panel)] sm:aspect-[16/10]" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-[4.5rem] w-28 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4 lg:pt-14">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-14 w-3/4 rounded-lg" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-16 w-full rounded-2xl" />
            <div className="skeleton h-48 w-full rounded-2xl" />
            <div className="skeleton h-16 w-full rounded-full" />
          </div>
        </div>
      </div>
    </Container>
  );
}
