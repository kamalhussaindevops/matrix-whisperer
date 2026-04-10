"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <h2 className="font-display text-2xl text-foreground">Unable to load this section</h2>
      <button
        onClick={reset}
        className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Retry
      </button>
    </div>
  );
}
