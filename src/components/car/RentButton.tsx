import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/types/car";
import { buildWhatsAppUrl, carDisplayName } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Direct WhatsApp enquiry with a car-specific, URL-encoded message.
 * `variant="primary"` is the red CTA (sticky bar); `variant="ghost"` is the quiet secondary on the dark panel.
 */
export function RentButton({
  car,
  className,
  compact = false,
  variant = "primary",
  label = "Rent Now",
}: {
  car: Car;
  className?: string;
  compact?: boolean;
  variant?: "primary" | "ghost";
  label?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(car)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — enquire about the ${carDisplayName(car)} on WhatsApp (opens in a new tab)`}
      className={cn(
        "group/rent relative isolate inline-flex items-center justify-between overflow-hidden rounded-full pl-2 pr-5 font-semibold text-white transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.99]",
        variant === "primary"
          ? "bg-racing hover:bg-racing-deep shadow-[var(--shadow-btn)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          : "border border-white/12 bg-white/[0.03] hover:border-whatsapp hover:bg-whatsapp",
        compact ? "h-12 w-auto gap-5 text-sm" : "h-14 w-full gap-3 text-[15px]",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-white/12 transition-colors duration-300 group-hover/rent:bg-white group-hover/rent:text-whatsapp",
            compact ? "size-9" : "size-10",
          )}
        >
          <WhatsAppIcon className={compact ? "size-4" : "size-[18px]"} />
        </span>
        {label}
      </span>
      <ArrowUpRight
        className="size-5 transition-transform duration-300 group-hover/rent:-translate-y-0.5 group-hover/rent:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
