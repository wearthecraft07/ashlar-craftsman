import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-[var(--ink)] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
