/**
 * Domain context. Defaults to Fishing and there is deliberately no switch UI
 * yet — shared screens can start reading terminology and dimensions from here
 * without any visible change.
 */
import { createContext, useContext, type ReactNode } from "react";
import type { KnotDomain } from "@/domain/domain";
import { FISHING_DOMAIN } from "@/domains/fishing";

const DomainContext = createContext<KnotDomain>(FISHING_DOMAIN);

export function DomainProvider({
  domain = FISHING_DOMAIN,
  children,
}: {
  domain?: KnotDomain;
  children: ReactNode;
}) {
  return <DomainContext.Provider value={domain}>{children}</DomainContext.Provider>;
}

export function useDomain(): KnotDomain {
  return useContext(DomainContext);
}