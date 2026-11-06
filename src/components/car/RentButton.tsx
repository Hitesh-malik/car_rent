import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/types/car";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Primary conversion: opens WhatsApp in a new tab with a car-specific, URL-encoded message. */
export function RentButton({ car, className, compact = false }: { car: Car; className?: string; compact?: boolean }) {
  return (
    <a
      href={buildWhatsAppUrl(car)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Rent now — enquire about the ${carDisplayName(car)} on WhatsApp (opens in a new tab)`}
      className={cn(
        "group/rent relative inline-flex items-center justify-between overflow-hidden rounded-full bg-ink pl-2 pr-5 font-semibold text-white transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] hover:bg-accent hover:shadow-[0_14px_32px_-14px_rgb(37_99_235/0.8)] active:scale-[0.99]",
        compact ? "h-12 w-auto gap-5 text-sm" : "h-16 w-full gap-3 text-base",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover/rent:bg-white group-hover/rent:text-whatsapp",
            compact ? "size-9" : "size-12",
          )}
        >
          <WhatsAppIcon className={compact ? "size-4" : "size-5"} />
        </span>
        Rent Now
      </span>
      <ArrowUpRight
        className="size-5 transition-transform duration-300 group-hover/rent:-translate-y-0.5 group-hover/rent:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
