import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
  /** Use on dark surfaces (footer/admin) so the mark still reads cleanly */
  onDark?: boolean;
};

const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12 sm:h-14 sm:w-14",
  lg: "h-20 w-20",
  hero: "h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-72 lg:w-72",
};

export function BrandLogo({
  className,
  priority,
  size = "md",
  onDark = false,
}: Props) {
  return (
    <Image
      src="/logo-mark.png"
      alt="the ASHLAR CRAFTSMAN"
      width={1024}
      height={1024}
      priority={priority}
      className={cn(
        "object-contain",
        onDark
          ? "drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          : "drop-shadow-[0_10px_28px_rgba(42,32,12,0.12)]",
        sizes[size],
        className,
      )}
    />
  );
}
