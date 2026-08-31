import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { APPLICATION_ID, ENGINE_VERSION, KNOT_CATALOG_VERSION } from "@/domain/types";
import { PRODUCT_MONOGRAM, PRODUCT_NAME, PRODUCT_TAGLINE, PUBLISHER_NAME } from "@/domain/brand";
import { knotsForDomain } from "@/data/catalog";
import { catalogReviewDue } from "@/data/connection-model-meta";
import { DomainSwitch } from "@/components/instrument/domain-switch";
import { AppearanceMenu } from "@/components/instrument/appearance-menu";
import { Finder } from "@/components/instrument/finder";
import { useT } from "@/i18n";
import { useDomain } from "@/domain/context";

function ModeLink({ to, label, code }: { to: string; label: string; code: string }) {
  return (
    <Link
      to={to}
      className="group relative flex min-h-[40px] items-center rounded-md px-2 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground sm:px-3"
      activeProps={{ "data-status": "active" } as never}
    >
      <span className="font-mono text-[0.625rem] tracking-[0.16em] text-primary/70">{code}</span>
      <span className="ml-1 hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
      <span className="absolute inset-x-2 -bottom-[9px] h-px scale-x-0 bg-primary transition-transform duration-300 group-data-[status=active]:scale-x-100" />
    </Link>
  );
}

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  const t = useT();
  const domain = useDomain();
  const review = catalogReviewDue();
  const [finderOpen, setFinderOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setFinderOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh">
      <div className="ki-ambient no-print" aria-hidden="true" />
      <a
        href="#ki-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-primary/60 focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        {t("skip")}
      </a>
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/85 backdrop-blur-xl no-print">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 sm:flex-nowrap sm:px-8">
          <Link
            to="/"
            aria-label={`${PRODUCT_NAME} — home`}
            className="ki-press flex min-h-11 min-w-0 touch-manipulation items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-primary/40 bg-primary/10 font-mono text-[0.6875rem] font-semibold tracking-tight text-primary">
              {PRODUCT_MONOGRAM}
            </span>
            <span className="hidden min-w-0 leading-none sm:block">
              <span className="block text-[0.875rem] font-semibold tracking-tight">
                {PRODUCT_NAME}
              </span>
              <span className="label-micro mt-1 block truncate">
                {domain.label} · {PUBLISHER_NAME}
              </span>
            </span>
          </Link>
          <DomainSwitch />
          <nav
            className="flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-end"
            aria-label="Modes"
          >
            <ModeLink to="/" label={t("nav.decide")} code="01" />
            <ModeLink to="/diagnose" label={t("nav.diagnose")} code="02" />
            <ModeLink to="/compare" label={t("nav.compare")} code="03" />
            <ModeLink to="/library" label={t("nav.library")} code="04" />
            <ModeLink to="/applications" label={t("nav.applications")} code="05" />
            <ModeLink to="/admin" label={t("nav.data")} code="06" />
            <button
              type="button"
              onClick={() => setFinderOpen(true)}
              aria-label={t("nav.searchHint")}
              title="⌘K"
              className="ki-press ml-1 flex min-h-11 min-w-11 items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-9 sm:min-w-9"
            >
              <Search size={15} aria-hidden="true" />
            </button>
            <AppearanceMenu />
          </nav>
        </div>
      </header>
      <Finder open={finderOpen} onClose={() => setFinderOpen(false)} />
      <main
        id="ki-main"
        className={cn("mx-auto max-w-[1240px] px-5 pb-24 pt-8 sm:px-8", className)}
      >
        {children}
      </main>
      <footer className="border-t border-hairline no-print">
        <div className="mx-auto max-w-[1240px] px-5 pt-6 sm:px-8">
          <p className="label-micro mb-3 text-muted-foreground/70">
            In this site
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              ["Decide", "/"],
              ["Diagnose", "/diagnose"],
              ["Compare", "/compare"],
              ["Library", "/library"],
              ["Applications", "/applications"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  to={href}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="rule-brass mt-5 opacity-50" />
        </div>
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <div className="max-w-md space-y-1">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Run Decide or Diagnose when you need a call or something failed. Or just open a knot
              and tie it. Applications never picks a knot for you.
            </p>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/60">
              {PRODUCT_NAME} · {PRODUCT_TAGLINE}
            </p>
          </div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            {APPLICATION_ID} · {ENGINE_VERSION} · {KNOT_CATALOG_VERSION} ·{" "}
            {knotsForDomain(domain.id).length} knots · {domain.label}
            {review.due
              ? ` · review due · ${review.daysSince ?? "?"}d since ${review.newestReviewed ?? "unknown"}`
              : review.newestReviewed
                ? ` · reviewed ${review.newestReviewed}`
                : ""}
          </p>
        </div>
      </footer>
    </div>
  );
}
