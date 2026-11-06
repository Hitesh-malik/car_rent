import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10", className)}>{children}</Tag>;
}
