/** Tiny className joiner (avoids pulling in clsx/tailwind-merge). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
