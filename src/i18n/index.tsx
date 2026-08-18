/**
 * Small typed dictionary. UI chrome translates; knot names and mechanical
 * procedure text deliberately stay in English so the technical record is
 * identical whatever language the interface speaks.
 */
import { usePrefs, type Locale } from "@/lib/prefs";

const en = {
  "nav.decide": "Decide",
  "nav.diagnose": "Diagnose",
  "nav.data": "Data",
  "nav.library": "Library",
  "nav.search": "Search",
  "nav.searchHint": "Search scenarios, knots, symptoms",
  "domain.fishing": "Fishing",
  "domain.boating": "Boating & Sailing",
  "domain.label": "Discipline",
  "domain.switched": "Discipline changed. The run was cleared.",
  "lang.label": "Language",
  "decide.mode": "Mode 01 · Decide",
  "decide.run": "Run mechanical model",
  "decide.rerun": "Re-run model",
  "decide.connection": "Connection",
  "decide.materials": "Material system",
  "decide.conditions": "Field conditions",
  "decide.venue": "Venue",
  "decide.venueHint":
    "Where the connection works, then how you are positioned. Each layer soft-loads conditions you can still edit.",
  "venue.punishes": "What this venue punishes",
  "venue.watch": "Watch first",
  "venue.fix": "Standing correction",
  "venue.none": "No venue declared",
  "venue.waterbody": "Waterbody",
  "venue.platform": "Platform",
  "venue.platformHint":
    "Optional. Changes hands, stability and retie tempo — not the water chemistry.",
  "decide.region": "Region",
  "decide.regionHint":
    "Soft prior for US waters. Loads conditions you can still edit — never forces a knot.",
  "region.broad": "US region",
  "region.fine": "More specific",
  "region.fineHint": "Optional second tap. Finer priors for abrasion, wire-watch, and hands.",
  "region.prior": "Regional prior",
  "region.override":
    "These notes bias judgment only. Field chips and the constraint engine still decide.",
  "region.none": "No region declared",
  "region.fieldNote": "Regional field note",
  "finder.placeholder": "Scenario, knot or symptom…",
  "finder.empty": "Nothing matches. Try a material, a job, or what went wrong.",
  "finder.scenarios": "Scenarios",
  "finder.knots": "Knots",
  "finder.symptoms": "Symptoms",
  "finder.close": "Close search",
  "boating.title": "Boating & Sailing — vocabulary live, catalog in modelling",
  "boating.body":
    "Rope terminology, connections, constructions and venues are active so the instrument speaks the right language. The mechanical catalog for rope work is not modelled yet, so nothing is scored — this instrument does not guess.",
  skip: "Skip to content",
  "library.mode": "Mode 05 · Library",
  "library.title": "Modelled connections",
  "library.lede":
    "Every fishing and boating connection already in the catalogue. Open a diagram or the tying procedure — no Decide form.",
  "library.search": "Search Palomar, bowline, FG…",
  "library.empty": "Nothing matches. Switch discipline or try another name.",
  "library.all": "All jobs",
  "library.jobs": "Filter by job",
  "library.tie": "Tie",
  "library.openPlayer": "Open step player",
  "library.lookFor": "Look for",
  "library.related": "Related connections",
  "library.plates": "plates",
} as const;

type Key = keyof typeof en;

const es: Record<Key, string> = {
  "nav.decide": "Decidir",
  "nav.diagnose": "Diagnosticar",
  "nav.data": "Datos",
  "nav.library": "Biblioteca",
  "nav.search": "Buscar",
  "nav.searchHint": "Buscar escenarios, nudos, síntomas",
  "domain.fishing": "Pesca",
  "domain.boating": "Náutica y vela",
  "domain.label": "Disciplina",
  "domain.switched": "Disciplina cambiada. Se borró el cálculo.",
  "lang.label": "Idioma",
  "decide.mode": "Modo 01 · Decidir",
  "decide.run": "Ejecutar el modelo mecánico",
  "decide.rerun": "Recalcular",
  "decide.connection": "Conexión",
  "decide.materials": "Sistema de materiales",
  "decide.conditions": "Condiciones de campo",
  "decide.venue": "Lugar",
  "decide.venueHint":
    "Dónde trabaja la conexión y cómo estás posicionado. Cada capa precarga condiciones que aún puedes editar.",
  "venue.punishes": "Lo que castiga este lugar",
  "venue.watch": "Qué revisar primero",
  "venue.fix": "Corrección permanente",
  "venue.none": "Sin lugar declarado",
  "venue.waterbody": "Cuerpo de agua",
  "venue.platform": "Plataforma",
  "venue.platformHint":
    "Opcional. Cambia manos, estabilidad y ritmo de reatado — no la química del agua.",
  "decide.region": "Región",
  "decide.regionHint":
    "Prior suave para aguas de EE. UU. Precarga condiciones que aún puedes editar — nunca impone un nudo.",
  "region.broad": "Región de EE. UU.",
  "region.fine": "Más específico",
  "region.fineHint": "Segundo toque opcional. Priores más finos de abrasión, wire-watch y manos.",
  "region.prior": "Prior regional",
  "region.override":
    "Estas notas solo orientan el criterio. Los chips y el motor de restricciones deciden.",
  "region.none": "Sin región declarada",
  "region.fieldNote": "Nota de campo regional",
  "finder.placeholder": "Escenario, nudo o síntoma…",
  "finder.empty": "Nada coincide. Prueba con un material, un trabajo o lo que falló.",
  "finder.scenarios": "Escenarios",
  "finder.knots": "Nudos",
  "finder.symptoms": "Síntomas",
  "finder.close": "Cerrar la búsqueda",
  "boating.title": "Náutica y vela — vocabulario activo, catálogo en modelado",
  "boating.body":
    "La terminología de cabo, las conexiones, las construcciones y los lugares ya están activos para que el instrumento hable el idioma correcto. El catálogo mecánico de cabo aún no está modelado, así que no se puntúa nada — este instrumento no adivina.",
  skip: "Ir al contenido",
  "library.mode": "Modo 05 · Biblioteca",
  "library.title": "Conexiones modeladas",
  "library.lede":
    "Todas las conexiones de pesca y náutica ya en el catálogo. Abre un diagrama o el procedimiento — sin formulario de Decidir.",
  "library.search": "Buscar Palomar, as de guía, FG…",
  "library.empty": "Nada coincide. Cambia de disciplina o prueba otro nombre.",
  "library.all": "Todos los trabajos",
  "library.jobs": "Filtrar por trabajo",
  "library.tie": "Atar",
  "library.openPlayer": "Abrir el procedimiento",
  "library.lookFor": "Busca",
  "library.related": "Conexiones relacionadas",
  "library.plates": "placas",
};

const DICTS: Record<Locale, Record<Key, string>> = { en, es };

export function useT() {
  const { locale } = usePrefs();
  return (key: Key) => DICTS[locale][key] ?? en[key];
}
