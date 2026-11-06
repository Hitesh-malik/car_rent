import { cacheLife } from "next/cache";

/** Cached server value so the static shell stays prerendered while the year refreshes daily. */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
