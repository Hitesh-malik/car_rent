"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * next/image with a shimmer skeleton while loading and a graceful placeholder if the file is missing.
 * Must be rendered inside a positioned parent when using `fill`.
 */
export function ImageWithFallback({
  className,
  alt,
  onLoad,
  onError,
  tone = "dark",
  ...props
}: ImageProps & { tone?: "light" | "dark" }) {
  // Preloaded (above-the-fold) images render visible immediately so they never wait on hydration.
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(props.preload ? "loaded" : "loading");

  if (status === "error") {
    return (
      <div role="img" aria-label={alt} className={cn("absolute inset-0 flex flex-col items-center justify-center gap-2", tone === "dark" ? "bg-charcoal text-white/50" : "bg-surface text-muted")}>
        <ImageOff className="size-6" aria-hidden />
        <span className="text-xs">Image coming soon</span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && <div aria-hidden className={cn("absolute inset-0", tone === "dark" ? "skeleton-dark" : "skeleton")} />}
      <Image
        {...props}
        alt={alt}
        className={cn(className, "transition-opacity duration-500", status === "loading" ? "opacity-0" : "opacity-100")}
        onLoad={(e) => {
          setStatus("loaded");
          onLoad?.(e);
        }}
        onError={(e) => {
          setStatus("error");
          onError?.(e);
        }}
      />
    </>
  );
}
