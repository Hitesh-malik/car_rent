import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Faq, type FaqItem } from "./Faq";

/** Answers describe how this site and the enquiry process work — rental terms are confirmed by the team. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How do I book a car?",
    a: "Choose a car, add your pickup and return details in the trip planner on the car's page and tap Book on WhatsApp. WhatsApp opens with your trip details pre-filled — send it, and our team confirms availability, price and terms with you directly.",
  },
  {
    q: "Are the prices on the website final?",
    a: "Rates shown are a guide. Final pricing, availability and rental terms are always confirmed with you on WhatsApp before anything is agreed.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There are no sign-ups or online checkout — you talk to a real person who handles your booking end to end.",
  },
  {
    q: "Are the vehicle specifications exact?",
    a: "Specifications are indicative and may vary by variant. If a particular feature matters to you, just ask and we'll confirm it for the car you'll receive.",
  },
  {
    q: "Are the photos of the actual cars?",
    a: "The showroom and car pages use genuine photographs of each vehicle model. Colour and trim of the exact car you receive may differ — ask us on WhatsApp if a specific colour matters to you.",
  },
  {
    q: "When can I reach the team?",
    a: `We're available ${siteConfig.contact.hours}. Message us on WhatsApp, call ${siteConfig.contact.phoneDisplay} or email ${siteConfig.contact.email}.`,
  },
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="text-red-gradient">answered.</span>
              </>
            }
            description="Everything you need to know about renting with us."
          />
          <Reveal delay={0.15} className="mt-8 rounded-[var(--radius-card)] bg-night p-6 text-white">
            <p className="font-semibold">Still have a question?</p>
            <p className="mt-1 text-sm text-white/55">Message us and a real person will get back to you.</p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon className="size-4" />
              Ask on WhatsApp
            </a>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <Faq items={FAQ_ITEMS} />
        </Reveal>
      </Container>
    </section>
  );
}
