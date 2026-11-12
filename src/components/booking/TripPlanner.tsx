"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock, MapPin } from "lucide-react";
import type { Car } from "@/types/car";
import { buildTripWhatsAppUrl, type TripDetails } from "@/lib/whatsapp";
import { rentalDays, toDateInput, validateTrip, type TripErrors } from "@/lib/trip";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";
import { Field, inputClasses } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/* Today's date for `min` — read on the client only (the static shell is prerendered without it). */
const noopSubscribe = () => () => {};
const useToday = () => useSyncExternalStore(noopSubscribe, () => toDateInput(new Date()), () => "");

const EMPTY: TripDetails = {
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "10:00",
  returnDate: "",
  returnTime: "10:00",
  vehicleType: "Any",
};

type Props = { variant: "panel"; car: Car; className?: string };

/**
 * Trip planner: collects locations, dates and times, validates them, then opens WhatsApp with a
 * pre-filled availability request. There is no booking backend — confirmation happens with the team on WhatsApp.
 */
export function TripPlanner(props: Props) {
  const { className, car } = props;
  const tone = "dark" as "dark" | "light";
  const uid = useId();
  const today = useToday();
  const [trip, setTrip] = useState<TripDetails>(EMPTY);
  const [sameReturn, setSameReturn] = useState(true);
  const [errors, setErrors] = useState<TripErrors>({});
  const [sent, setSent] = useState(false);

  const days = rentalDays(trip);
  const estimate = car?.pricePerDay && days ? car.pricePerDay * days : null;
  const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  function update<K extends keyof TripDetails>(key: K, value: TripDetails[K]) {
    setTrip((t) => {
      const next = { ...t, [key]: value };
      // Keep the return date sensible: default to the day after pickup when it's empty or no longer after it.
      if (key === "pickupDate" && typeof value === "string" && value && (!t.returnDate || t.returnDate <= value)) {
        const d = new Date(`${value}T12:00`);
        if (!Number.isNaN(d.getTime())) {
          d.setDate(d.getDate() + 1);
          next.returnDate = toDateInput(d);
        }
      }
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setSent(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const details = { ...trip, dropoffLocation: sameReturn ? "" : trip.dropoffLocation };
    const found = validateTrip(details);
    if (!sameReturn && (details.dropoffLocation ?? "").trim().length < 2) found.dropoffLocation = "Enter a drop-off location";
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = Object.keys(found)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const url = buildTripWhatsAppUrl(details, car);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
    setSent(true);
  }

  const fid = (k: keyof TripDetails) => `${uid}-${k}`;
  const ctrl = (k: keyof TripDetails) => ({
    id: fid(k),
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `${fid(k)}-error` : undefined,
    className: inputClasses({ tone, invalid: Boolean(errors[k]) }),
  });
  const iconCls = cn("size-3.5", tone === "dark" ? "text-soft-red" : "text-racing");

  const locationFields = (
    <>
      <Field id={fid("pickupLocation")} label="Pickup location" icon={<MapPin className={iconCls} aria-hidden />} error={errors.pickupLocation} tone={tone}>
        <input
          {...ctrl("pickupLocation")}
          type="text"
          autoComplete="address-level2"
          placeholder="City, area or airport"
          value={trip.pickupLocation}
          onChange={(e) => update("pickupLocation", e.target.value)}
        />
      </Field>
      {!sameReturn && (
        <Field id={fid("dropoffLocation")} label="Drop-off location" icon={<MapPin className={iconCls} aria-hidden />} error={errors.dropoffLocation} tone={tone}>
          <input
            {...ctrl("dropoffLocation")}
            type="text"
            placeholder="Where will you return it?"
            value={trip.dropoffLocation}
            onChange={(e) => update("dropoffLocation", e.target.value)}
          />
        </Field>
      )}
    </>
  );

  const dateFields = (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
        <Field id={fid("pickupDate")} label="Pickup date" icon={<CalendarDays className={iconCls} aria-hidden />} error={errors.pickupDate} tone={tone}>
          <input {...ctrl("pickupDate")} type="date" min={today || undefined} value={trip.pickupDate} onChange={(e) => update("pickupDate", e.target.value)} />
        </Field>
        <Field id={fid("pickupTime")} label="Time" icon={<Clock className={iconCls} aria-hidden />} error={errors.pickupTime} tone={tone}>
          <input {...ctrl("pickupTime")} type="time" step={900} value={trip.pickupTime} onChange={(e) => update("pickupTime", e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
        <Field id={fid("returnDate")} label="Return date" icon={<CalendarDays className={iconCls} aria-hidden />} error={errors.returnDate} tone={tone}>
          <input
            {...ctrl("returnDate")}
            type="date"
            min={trip.pickupDate || today || undefined}
            value={trip.returnDate}
            onChange={(e) => update("returnDate", e.target.value)}
          />
        </Field>
        <Field id={fid("returnTime")} label="Time" icon={<Clock className={iconCls} aria-hidden />} error={errors.returnTime} tone={tone}>
          <input {...ctrl("returnTime")} type="time" step={900} value={trip.returnTime} onChange={(e) => update("returnTime", e.target.value)} />
        </Field>
      </div>
    </>
  );

  const sameReturnToggle = (
    <label className={cn("inline-flex cursor-pointer select-none items-center gap-2.5 text-sm", tone === "dark" ? "text-white/70" : "text-ink-soft")}>
      <input
        type="checkbox"
        checked={sameReturn}
        onChange={(e) => {
          setSameReturn(e.target.checked);
          setErrors((er) => ({ ...er, dropoffLocation: undefined }));
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bright",
          sameReturn ? "bg-racing" : tone === "dark" ? "bg-white/15" : "bg-ink/15",
        )}
      >
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200", sameReturn ? "translate-x-[1.1rem]" : "translate-x-0.5")} />
      </span>
      Return to the same location
    </label>
  );

  const sentNote = (
    <AnimatePresence>
      {sent && (
        <m.p
          role="status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className={cn("flex items-start gap-2 text-[13px] leading-snug", tone === "dark" ? "text-white/70" : "text-ink-soft")}
        >
          <CheckCircle2 className="mt-px size-4 shrink-0 text-whatsapp" aria-hidden />
          WhatsApp opened with your trip details — send the message and our team will confirm availability.
        </m.p>
      )}
    </AnimatePresence>
  );

  /* ───────── Car detail panel (dark) ───────── */
  const panelCar = car;
  return (
    <form noValidate onSubmit={onSubmit} aria-label={`Plan your trip in the ${panelCar.brand} ${panelCar.model}`} className={cn("space-y-3", className)}>
      {locationFields}
      <div className="pb-1">{sameReturnToggle}</div>
      {dateFields}

      {/* pricing breakdown */}
      <dl className="mt-1 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-white/55">Daily rate</dt>
          <dd className="font-semibold text-white">{panelCar.pricePerDay ? `${inr(panelCar.pricePerDay)} / day` : "On inquiry"}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-white/55">Rental duration</dt>
          <dd className="font-semibold text-white">{days ? `${days} ${days === 1 ? "day" : "days"}` : "Select dates"}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-white/55">Estimated total</dt>
          <dd className="font-semibold text-white">{estimate ? inr(estimate) : "Confirmed on WhatsApp"}</dd>
        </div>
      </dl>

      <button
        type="submit"
        className="group/rent relative isolate flex h-14 w-full items-center justify-between overflow-hidden rounded-full bg-racing hover:bg-racing-deep pl-2 pr-6 text-base font-semibold text-white shadow-[var(--shadow-btn)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/15 transition-colors duration-300 group-hover/rent:bg-white group-hover/rent:text-whatsapp">
            <WhatsAppIcon className="size-[18px]" />
          </span>
          Book on WhatsApp
        </span>
        <ArrowRight className="size-5 transition-transform duration-300 group-hover/rent:translate-x-1" aria-hidden />
      </button>
      {sentNote}
    </form>
  );
}
