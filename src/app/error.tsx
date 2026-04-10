"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h2 className="font-display text-3xl text-foreground">Something went wrong</h2>
      <p className="max-w-lg text-sm text-muted-foreground">An unexpected issue occurred while loading this page.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
