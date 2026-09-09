"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";

type Path = {
  id: string;
  label: string;
  title: string;
  line: string;
};

const QUESTIONS = [
  {
    id: "q1",
    prompt: "What draws you most?",
    options: [
      { id: "labor", label: "The work of refining yourself" },
      { id: "travel", label: "The road between Lodges" },
      { id: "study", label: "History, symbols, and meaning" },
      { id: "service", label: "Serving the Brothers beside you" },
    ],
  },
  {
    id: "q2",
    prompt: "Where do you wear the mark?",
    options: [
      { id: "labor", label: "Quietly, in everyday life" },
      { id: "travel", label: "Wherever the journey takes you" },
      { id: "study", label: "In conversation and contemplation" },
      { id: "service", label: "When the Craft needs a steady hand" },
    ],
  },
  {
    id: "q3",
    prompt: "Which tool fits your path?",
    options: [
      { id: "labor", label: "The chisel — patient progress" },
      { id: "travel", label: "The staff — movement with purpose" },
      { id: "study", label: "The compasses — measured understanding" },
      { id: "service", label: "The gavel — order and care" },
    ],
  },
] as const;

const RESULTS: Record<string, Path> = {
  labor: {
    id: "labor",
    label: "The Rough Ashlar",
    title: "You are still doing the work.",
    line: "Your path is refinement — deliberate, unfinished, honest. Wear the Craft as a reminder that every day shapes the stone.",
  },
  travel: {
    id: "travel",
    label: "The Traveling Craftsman",
    title: "You carry the Craft on the road.",
    line: "Your path is motion — Lodges visited, Brothers met, lessons taken further than the tiled floor.",
  },
  study: {
    id: "study",
    label: "The Builder of Meaning",
    title: "You look closer than most.",
    line: "Your path is understanding — symbols, architecture, and philosophy worn without needing explanation.",
  },
  service: {
    id: "service",
    label: "The Steward",
    title: "You strengthen the Craft for others.",
    line: "Your path is responsibility — quiet leadership, harmony in the work, and apparel that honors the Lodge.",
  },
};

export function CraftsmanQuizTeaser() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Path | null>(null);

  function choose(optionId: string) {
    const next = { ...votes, [optionId]: (votes[optionId] ?? 0) + 1 };
    setVotes(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }
    const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0]?.[0];
    setResult(RESULTS[winner ?? "labor"]);
  }

  function reset() {
    setStarted(false);
    setStep(0);
    setVotes({});
    setResult(null);
  }

  const question = QUESTIONS[step];

  return (
    <section
      id="craftsman-quiz"
      className="scroll-mt-24 bg-[var(--lodge-blue)] px-4 py-20 text-[var(--ivory)] sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Identity
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-5xl">
            What kind of Craftsman are you?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[var(--ivory)]/70 sm:text-lg">
            Every Brother walks a different path.
          </p>
        </Reveal>

        <Reveal delayMs={60}>
          <div className="mt-12 rounded-[1.75rem] border border-[var(--gold)]/25 bg-[color-mix(in_srgb,var(--lodge-blue)_70%,black)] p-6 text-left sm:p-10">
            {!started && !result && (
              <div className="text-center">
                <p className="text-sm leading-relaxed text-[var(--ivory)]/70">
                  A short reflection — not a personality gimmick. Three questions.
                  One path to explore.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button type="button" onClick={() => setStarted(true)}>
                    Discover Your Craft
                  </Button>
                </div>
              </div>
            )}

            {started && !result && question && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
                  {question.prompt}
                </h3>
                <ul className="mt-8 space-y-3">
                  {question.options.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => choose(option.id)}
                        className={cn(
                          "w-full rounded-2xl border border-[var(--gold)]/25 bg-transparent px-5 py-4 text-left text-sm text-[var(--ivory)] transition",
                          "hover:border-[var(--gold)]/60 hover:bg-[var(--ivory)]/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result && (
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  {result.label}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
                  {result.title}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--ivory)]/75">
                  {result.line}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href="/shop">Explore the Craft</Button>
                  <Button
                    href="/avatar"
                    variant="ghost"
                    className="border-[var(--gold)]/45 bg-transparent text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)]"
                  >
                    Build Your Craftsman
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]/80 underline-offset-4 hover:underline"
                >
                  Begin again
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
