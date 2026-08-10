import type { DomainId, KnotDomain } from "@/domain/domain";
import { FISHING_DOMAIN } from "@/domains/fishing";
import { BOATING_DOMAIN } from "@/domains/boating";

export const DOMAINS: Record<DomainId, KnotDomain> = {
  fishing: FISHING_DOMAIN,
  boating: BOATING_DOMAIN,
};

export function domainById(id: DomainId | string | undefined): KnotDomain {
  return (id && DOMAINS[id as DomainId]) || FISHING_DOMAIN;
}
