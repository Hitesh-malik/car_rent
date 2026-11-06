import { ViewTransition } from "react";

const PAGE = { "nav-forward": "page", "nav-back": "page", default: "page" };

/**
 * Wrap each page's content so route changes fade/rise via the browser View Transitions API
 * (CSS lives in globals.css under `.page`). Layouts persist, so this belongs in page.tsx.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={PAGE} exit={PAGE} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
