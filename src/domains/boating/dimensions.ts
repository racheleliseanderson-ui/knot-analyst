import type { DomainDimension } from "@/domain/domain";
import { FISHING_DIMENSIONS } from "@/domains/fishing/dimensions";

/**
 * Boating reuses the shared field-fit dimensions. A "rope construction"
 * axis was declared here earlier but never scored — do not advertise a
 * dead dimension. Construction still lives on the material disclosure.
 */
export const BOATING_DIMENSIONS: DomainDimension[] = [...FISHING_DIMENSIONS];
