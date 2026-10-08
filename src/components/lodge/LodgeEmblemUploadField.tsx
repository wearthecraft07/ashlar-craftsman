"use client";

import { useEffect, useId, useRef } from "react";
import { EMBLEM_ACCEPT } from "@/lib/lodge/emblem-upload";
import { cn } from "@/lib/utils";

type Props = {
  fileName: string | null;
  error: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  className?: string;
};

export function LodgeEmblemUploadField({
  fileName,
  error,
  onFile,
  onRemove,
  className,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!fileName && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [fileName]);

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-[var(--lodge-blue)]"
      >
        Upload your Lodge emblem
      </label>
      <p className="text-xs text-[var(--walnut)]/75">
        PNG or SVG recommended. JPG is also accepted. Prefer a transparent
        background for the best preview.
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={EMBLEM_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          // Allow re-selecting the same filename.
          event.target.value = "";
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-[var(--stone)]/60 bg-white px-4 py-2 text-xs font-semibold text-[var(--lodge-blue)] transition hover:border-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          {fileName ? "Replace emblem" : "Choose file"}
        </button>
        {fileName ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-[var(--stone)]/60 bg-white px-4 py-2 text-xs font-semibold text-[var(--lodge-blue)] transition hover:border-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            Remove emblem
          </button>
        ) : null}
      </div>

      {fileName ? (
        <p className="truncate text-xs text-[var(--walnut)]/80" title={fileName}>
          Selected: {fileName}
        </p>
      ) : null}

      {error ? (
        <p className="text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
