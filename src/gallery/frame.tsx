import * as React from "react";

import { cn } from "@/lib/utils";

/** One component or foundation. Anchored so the sidebar can jump to it. */
export function Section({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <div className="space-y-1">
        <h2>{title}</h2>
        {summary ? <p className="max-w-2xl text-muted-foreground">{summary}</p> : null}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/**
 * One labelled state of a component. The label is the point: a specimen with
 * no name tells you what it looks like but not what it is.
 */
export function Specimen({
  label,
  note,
  className,
  children,
}: {
  label: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="eyebrow">{label}</span>
        {note ? <span className="text-xs text-muted-foreground">{note}</span> : null}
      </div>
      <div className={cn("rounded-lg border border-border bg-card p-4 shadow-card", className)}>{children}</div>
    </div>
  );
}

/** A horizontal run of examples inside a Specimen. */
export function Row({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

/** A responsive grid of Specimens. */
export function Grid({ cols = 2, children }: { cols?: 1 | 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

/** Something the gallery cannot render statically, said plainly rather than omitted. */
export function CannotShow({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
      {children}
    </p>
  );
}
