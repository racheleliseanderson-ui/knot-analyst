/**
 * Domain context — reads the persisted discipline preference and exposes the
 * matching descriptor. Fishing remains the default and its behavior is
 * unchanged.
 */
import { createContext, useContext, type ReactNode } from "react";
import type { KnotDomain } from "@/domain/domain";
import { FISHING_DOMAIN } from "@/domains/fishing";
import { domainById } from "@/domains/registry";
import { usePrefs } from "@/lib/prefs";

const DomainContext = createContext<KnotDomain | null>(null);

export function DomainProvider({
  domain,
  children,
}: {
  domain?: KnotDomain;
  children: ReactNode;
}) {
  const { domain: pref } = usePrefs();
  const active = domain ?? domainById(pref);
  return <DomainContext.Provider value={active}>{children}</DomainContext.Provider>;
}

export function useDomain(): KnotDomain {
  return useContext(DomainContext) ?? FISHING_DOMAIN;
}
