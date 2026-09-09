"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  ProductStage,
  ProductVisual,
} from "@/components/product/ProductVisual";
import {
  LODGE_EMBLEM_OPTIONS,
  LODGE_QUANTITY_RANGES,
  LODGE_STYLES,
  type LodgeEmblemId,
  type LodgeQuantityId,
  type LodgeStyleId,
} from "@/data/lodge-edition";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

type Step = "configure" | "request" | "done";

export function LodgeEditionExperience({ products }: Props) {
  const search = useSearchParams();
  const initialSlug = search.get("product") ?? "";

  const initialProduct =
    products.find((p) => p.slug === initialSlug) ?? products[0] ?? null;

  const [step, setStep] = useState<Step>("configure");
  const [productId, setProductId] = useState(initialProduct?.id ?? "");
  const [style, setStyle] = useState<LodgeStyleId>("classic");
  const [emblem, setEmblem] = useState<LodgeEmblemId>("none");
  const [quantity, setQuantity] = useState<LodgeQuantityId>("6-12");

  const [lodgeName, setLodgeName] = useState("");
  const [lodgeNumber, setLodgeNumber] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [lodgeColors, setLodgeColors] = useState("");
  const [hasTargetDate, setHasTargetDate] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const product = useMemo(
    () => products.find((p) => p.id === productId) ?? products[0] ?? null,
    [products, productId],
  );

  const styleMeta = LODGE_STYLES.find((s) => s.id === style)!;

  function validateConfigure() {
    const next: Record<string, string> = {};
    if (!product) next.product = "Choose a foundation product.";
    if (!lodgeName.trim() || lodgeName.trim().length < 2) {
      next.lodgeName = "Enter your Lodge name.";
    }
    if (!city.trim()) next.city = "Enter a city.";
    if (!region.trim()) next.region = "Enter a state or province.";
    if (
      yearEstablished.trim() &&
      !/^(1[6-9]\d{2}|20\d{2})$/.test(yearEstablished.trim())
    ) {
      next.yearEstablished = "Enter a valid year (e.g. 1894).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateRequest() {
    const next: Record<string, string> = {};
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      next.contactEmail = "Enter a valid email.";
    }
    if (hasTargetDate && (!targetDate || Number.isNaN(Date.parse(targetDate)))) {
      next.targetDate = "Enter a valid target date.";
    }
    if (!authorized) {
      next.authorized =
        "Confirm you are authorized to request Lodge branding.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!product || !validateRequest()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/lodge-edition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lodgeName: lodgeName.trim(),
          lodgeNumber: lodgeNumber.trim(),
          city: city.trim(),
          region: region.trim(),
          yearEstablished: yearEstablished.trim(),
          lodgeColors: lodgeColors.trim(),
          productId: product.id,
          productSlug: product.slug,
          style,
          emblemIntent: emblem,
          quantityRange: quantity,
          targetDate: hasTargetDate ? targetDate : "",
          contactEmail: contactEmail.trim(),
          notes: notes.trim(),
          authorized: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStep("done");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to submit request",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!products.length) {
    return (
      <p className="mx-auto max-w-2xl px-4 py-24 text-center text-[var(--walnut)]">
        No compatible foundation products are available yet.
      </p>
    );
  }

  if (step === "done") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Request received
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)] sm:text-4xl">
          We&apos;ll prepare the concept.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--walnut)]">
          Your Lodge Edition request for{" "}
          <strong>{lodgeName || "your Lodge"}</strong> is in. Next, we prepare
          a concept for Lodge review — this is not an automatic order.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/shop">Shop the Collection</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep("configure");
              setAuthorized(false);
              setSubmitError("");
            }}
          >
            Start another request
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="border-b border-[var(--gold)]/15 bg-[var(--lodge-blue)] px-4 pb-16 pt-28 text-[var(--ivory)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Lodge Editions
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl md:text-6xl">
            Make it your Lodge.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--ivory)]/75 sm:text-lg">
            Your Lodge has a history. Your Lodge has a personality. Give it a
            piece of your own.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--ivory)]/60">
            Create a Lodge Edition designed around the Brothers who call it
            home.
          </p>
          <div className="mt-8">
            <Button href="#lodge-start" size="lg">
              Start Your Lodge Edition
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          How it works
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]">
          Design request to approval
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Tell us about your Lodge.",
            "We prepare the concept.",
            "Your Lodge reviews it.",
            "Once approved, we prepare it for ordering.",
          ].map((item, i) => (
            <li
              key={item}
              className="rounded-2xl border border-[var(--stone)]/50 bg-[var(--panel)] p-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Step {i + 1}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--walnut)]">
                {item}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-[var(--walnut)]/70">
          This is a request experience — not an instant checkout. Lodge
          Editions move through review before any order is placed.
        </p>
      </section>

      <div
        id="lodge-start"
        className="mx-auto grid max-w-7xl scroll-mt-24 gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8"
      >
        <div className="space-y-12">
          {/* Foundation */}
          <section aria-labelledby="foundation-heading">
            <h2
              id="foundation-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]"
            >
              Choose your foundation
            </h2>
            <p className="mt-2 text-sm text-[var(--walnut)]">
              Select an existing Ashlar Craftsman piece. No invented products.
            </p>
            {errors.product && (
              <p className="mt-2 text-sm text-red-700" role="alert">
                {errors.product}
              </p>
            )}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {products.map((p) => {
                const selected = p.id === product?.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setProductId(p.id)}
                      aria-pressed={selected}
                      className={cn(
                        "flex w-full gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                        selected
                          ? "border-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_10%,white)]"
                          : "border-[var(--stone)]/50 hover:border-[var(--gold)]/40",
                      )}
                    >
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--lodge-blue)]">
                        <ProductVisual product={p} size="sm" decorative />
                      </div>
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] text-base text-[var(--lodge-blue)]">
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[var(--lodge-blue)]">
                          {formatCurrency(p.price)}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--walnut)]/70">
                          {p.colors.length} colors · {p.sizes.join(", ")}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Lodge info */}
          <section aria-labelledby="lodge-info-heading">
            <h2
              id="lodge-info-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]"
            >
              Lodge information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                id="lodge-name"
                label="Lodge name"
                value={lodgeName}
                onChange={setLodgeName}
                error={errors.lodgeName}
                required
                className="sm:col-span-2"
              />
              <Field
                id="lodge-number"
                label="Lodge number"
                value={lodgeNumber}
                onChange={setLodgeNumber}
              />
              <Field
                id="year"
                label="Year established"
                value={yearEstablished}
                onChange={setYearEstablished}
                error={errors.yearEstablished}
                placeholder="e.g. 1894"
              />
              <Field
                id="city"
                label="City"
                value={city}
                onChange={setCity}
                error={errors.city}
                required
              />
              <Field
                id="region"
                label="State / Province"
                value={region}
                onChange={setRegion}
                error={errors.region}
                required
              />
              <Field
                id="colors"
                label="Lodge colors (optional)"
                value={lodgeColors}
                onChange={setLodgeColors}
                className="sm:col-span-2"
                placeholder="e.g. navy & gold"
              />
            </div>
          </section>

          {/* Style */}
          <section aria-labelledby="style-heading">
            <h2
              id="style-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]"
            >
              Design direction
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {LODGE_STYLES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={style === s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "h-full w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                      style === s.id
                        ? "border-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_10%,white)]"
                        : "border-[var(--stone)]/50 hover:border-[var(--gold)]/40",
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                      {s.name}
                    </p>
                    <p className="mt-2 text-sm text-[var(--walnut)]">
                      {s.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Emblem */}
          <section aria-labelledby="emblem-heading">
            <h2
              id="emblem-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]"
            >
              Lodge emblem
            </h2>
            <p className="mt-2 text-sm text-[var(--walnut)]">
              Uploads are not required in this phase. Tell us your intent — we
              coordinate approved artwork separately.
            </p>
            <ul className="mt-6 space-y-3">
              {LODGE_EMBLEM_OPTIONS.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    aria-pressed={emblem === opt.id}
                    onClick={() => setEmblem(opt.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                      emblem === opt.id
                        ? "border-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_10%,white)]"
                        : "border-[var(--stone)]/50",
                    )}
                  >
                    <p className="text-sm font-semibold text-[var(--lodge-blue)]">
                      {opt.label}
                    </p>
                    <p className="mt-1 text-xs text-[var(--walnut)]/75">
                      {opt.hint}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Quantity + continue */}
          <section aria-labelledby="qty-heading">
            <h2
              id="qty-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--lodge-blue)]"
            >
              Approximate quantity
            </h2>
            <p className="mt-2 text-sm text-[var(--walnut)]">
              No bulk pricing is calculated here — this helps us prepare the
              concept.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {LODGE_QUANTITY_RANGES.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  aria-pressed={quantity === q.id}
                  onClick={() => setQuantity(q.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                    quantity === q.id
                      ? "border-[var(--lodge-blue)] bg-[var(--lodge-blue)] text-[var(--ivory)]"
                      : "border-[var(--stone)]/60 text-[var(--lodge-blue)]",
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  if (validateConfigure()) setStep("request");
                }}
              >
                Continue to request
              </Button>
            </div>
          </section>
        </div>

        {/* Sticky concept preview */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Concept preview
          </p>
          <p className="mt-2 text-xs text-[var(--walnut)]/70">
            Not a production proof — a visual direction only.
          </p>
          <div className="mt-4">
            <ProductStage caption="Concept preview">
              {product && (
                <div className="relative w-full max-w-[280px]">
                  <ProductVisual
                    product={product}
                    color={product.colors[0]}
                    size="lg"
                    decorative
                  />
                  <div className="pointer-events-none absolute inset-x-8 top-[38%] text-center">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)] drop-shadow">
                      the ASHLAR CRAFTSMAN
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-sm leading-tight text-[var(--ivory)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] sm:text-base">
                      {(lodgeName || "Your Lodge").toUpperCase()}
                      {lodgeNumber ? ` No. ${lodgeNumber}` : ""}
                    </p>
                    {(yearEstablished || city) && (
                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[var(--ivory)]/80">
                        {yearEstablished ? `Est. ${yearEstablished}` : ""}
                        {yearEstablished && city ? " · " : ""}
                        {city}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ProductStage>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--stone)]/50 bg-[var(--panel)] p-4 text-sm text-[var(--walnut)]">
            <p>
              <span className="font-semibold text-[var(--lodge-blue)]">
                Style:
              </span>{" "}
              {styleMeta.name}
            </p>
            <p className="mt-1">{styleMeta.description}</p>
            <p className="mt-3 text-xs text-[var(--walnut)]/65">
              Built around your Lodge. Made for your Brothers.
            </p>
          </div>
        </aside>
      </div>

      {/* Request step */}
      {step === "request" && (
        <section
          id="lodge-request"
          className="mx-auto mt-16 max-w-3xl scroll-mt-24 border-t border-[var(--stone)]/40 px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="request-heading"
        >
          <h2
            id="request-heading"
            className="font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]"
          >
            Request your Lodge Edition
          </h2>
          <p className="mt-3 text-sm text-[var(--walnut)]">
            Submit a design request. We will follow up — this does not place an
            order or charge a card.
          </p>

          <div className="mt-8 space-y-4">
            <Field
              id="email"
              label="Contact email"
              type="email"
              value={contactEmail}
              onChange={setContactEmail}
              error={errors.contactEmail}
              required
            />

            <div>
              <label className="flex items-start gap-3 text-sm text-[var(--lodge-blue)]">
                <input
                  type="checkbox"
                  checked={hasTargetDate}
                  onChange={(e) => setHasTargetDate(e.target.checked)}
                  className="mt-1"
                />
                <span>I have a specific target date</span>
              </label>
              {hasTargetDate && (
                <div className="mt-3">
                  <Field
                    id="target-date"
                    label="Target date"
                    type="date"
                    value={targetDate}
                    onChange={setTargetDate}
                    error={errors.targetDate}
                  />
                  <p className="mt-1 text-xs text-[var(--walnut)]/65">
                    A target date helps planning — it is not a guaranteed
                    delivery.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-[var(--lodge-blue)]"
              >
                Additional notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                maxLength={2000}
                className="mt-2 w-full rounded-2xl border border-[var(--stone)]/60 bg-[var(--panel)] px-4 py-3 text-sm text-[var(--lodge-blue)] outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-[var(--lodge-blue)]">
              <input
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className="mt-1"
                aria-invalid={Boolean(errors.authorized)}
              />
              <span>
                I am authorized to request use of this Lodge&apos;s name and
                any related public branding for a concept review.
              </span>
            </label>
            {errors.authorized && (
              <p className="text-sm text-red-700" role="alert">
                {errors.authorized}
              </p>
            )}

            {submitError && (
              <p className="text-sm text-red-700" role="alert">
                {submitError}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="button"
                size="lg"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Request Your Lodge Edition"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("configure")}
              >
                Back
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Use cases */}
      <section className="mx-auto mt-8 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
          Lodge orders
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--lodge-blue)]">
          Give your Lodge its own edition
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--walnut)]">
          Lodge Editions may be useful for anniversaries, officer teams, new
          Brother gifts, events, Brother appreciation, and special occasions —
          when your Lodge chooses to pursue them.
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="dark"
            onClick={() => {
              if (step !== "request") {
                if (validateConfigure()) setStep("request");
              }
              document
                .getElementById("lodge-request")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Request Your Lodge Edition
          </Button>
        </div>
        <p className="mt-6 text-xs text-[var(--walnut)]/60">
          Prefer a ready-made piece?{" "}
          <Link href="/shop" className="underline underline-offset-2">
            Shop the collection
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  type = "text",
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-[var(--lodge-blue)]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-full border border-[var(--stone)]/60 bg-[var(--panel)] px-4 text-sm text-[var(--lodge-blue)] outline-none focus:ring-2 focus:ring-[var(--gold)]"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
