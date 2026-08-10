import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { APPLICATION_ID, ENGINE_VERSION, KNOT_CATALOG_VERSION } from "@/domain/types";
import { KNOTS } from "@/data/catalog";

function ModeLink({ to, label, code }: { to: string; label: string; code: string }) {
  return (
    <Link
      to={to}
      className="group relative rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
      activeProps={{ "data-status": "active" } as never}
    >
      <span className="font-mono text-[0.625rem] tracking-[0.16em] text-primary/70">{code}</span>{" "}
      {label}
      <span className="absolute inset-x-2 -bottom-[9px] h-px scale-x-0 bg-primary transition-transform duration-300 group-data-[status=active]:scale-x-100" />
    </Link>
  );
}

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/85 backdrop-blur-xl no-print">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary/40 bg-primary/10 font-mono text-[0.6875rem] font-semibold tracking-tight text-primary">
              KI
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-[0.875rem] font-semibold tracking-tight">
                Knot Intelligence
              </span>
              <span className="label-micro mt-1 block">Hook the Horizon</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <ModeLink to="/" label="Decide" code="01" />
            <ModeLink to="/diagnose" label="Diagnose" code="02" />
          </nav>
        </div>
      </header>
      <main className={cn("mx-auto max-w-[1240px] px-5 pb-24 pt-8 sm:px-8", className)}>
        {children}
      </main>
      <footer className="border-t border-hairline no-print">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            A decision and diagnosis instrument, not a knot library. Invalid options never score.
            Unsuitable recommendations fail closed.
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            {APPLICATION_ID} · {ENGINE_VERSION} · catalog {KNOT_CATALOG_VERSION} ·{" "}
            {KNOTS.length} modelled connections
          </p>
        </div>
      </footer>
    </div>
  );
}
