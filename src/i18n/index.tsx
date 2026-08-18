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
  "domain.label": "On the water",
  "domain.switched": "Switched fishing or boating. The last run was cleared.",
  "lang.label": "Language",
  "decide.mode": "Mode 01 · Decide",
  "decide.run": "Run it",
  "decide.rerun": "Run it again",
  "decide.connection": "The job",
  "decide.materials": "Line and leader",
  "decide.conditions": "On the water",
  "decide.venue": "Where you are",
  "decide.venueHint":
    "Water first, then how you are standing. You can still change the conditions.",
  "venue.punishes": "What this venue punishes",
  "venue.watch": "Watch first",
  "venue.fix": "Standing correction",
  "venue.none": "No place picked",
  "venue.waterbody": "Waterbody",
  "venue.platform": "Platform",
  "venue.platformHint":
    "Optional. Changes hands, stability and retie tempo — not the water chemistry.",
  "decide.region": "Region",
  "decide.regionHint":
    "A starting guess for US water. You can still change every condition — it never forces a knot.",
  "region.broad": "US region",
  "region.fine": "More specific",
  "region.fineHint": "Optional second tap. Finer priors for abrasion, wire-watch, and hands.",
  "region.prior": "Starting guess",
  "region.override": "These notes only color the picture. What you tap still decides.",
  "region.none": "No region picked",
  "region.fieldNote": "Note for this water",
  "finder.placeholder": "Scenario, knot or symptom…",
  "finder.empty": "Nothing matches. Try a material, a job, or what went wrong.",
  "finder.scenarios": "Scenarios",
  "finder.knots": "Knots",
  "finder.symptoms": "Symptoms",
  "finder.close": "Close search",
  "boating.title": "No boat knots loaded",
  "boating.body":
    "Boating words are on, but there are no boat knots to pick yet. We will not guess.",
  skip: "Skip to content",
  "library.mode": "Mode 05 · Library",
  "library.title": "The knots",
  "library.lede":
    "Every fishing and boat knot we cover. Open a diagram or the steps — you don’t have to run Decide first.",
  "library.search": "Search Palomar, bowline, FG…",
  "library.empty": "Nothing matches. Switch to fishing or boating, or try another name.",
  "library.all": "All knots",
  "library.jobs": "Filter by kind",
  "library.tie": "Tie",
  "library.openPlayer": "How to tie it",
  "library.lookFor": "Look for",
  "library.related": "Related knots",
  "library.plates": "steps",
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
  "domain.label": "En el agua",
  "domain.switched": "Cambiaste pesca o náutica. Se borró el último cálculo.",
  "lang.label": "Idioma",
  "decide.mode": "Modo 01 · Decidir",
  "decide.run": "Probarlo",
  "decide.rerun": "Probarlo otra vez",
  "decide.connection": "El trabajo",
  "decide.materials": "Línea y bajo",
  "decide.conditions": "En el agua",
  "decide.venue": "Dónde estás",
  "decide.venueHint":
    "Primero el agua, luego cómo estás de pie. Aún puedes cambiar las condiciones.",
  "venue.punishes": "Lo que castiga este lugar",
  "venue.watch": "Qué revisar primero",
  "venue.fix": "Corrección permanente",
  "venue.none": "Sin lugar",
  "venue.waterbody": "Cuerpo de agua",
  "venue.platform": "Plataforma",
  "venue.platformHint":
    "Opcional. Cambia manos, estabilidad y ritmo de reatado — no la química del agua.",
  "decide.region": "Región",
  "decide.regionHint":
    "Una primera idea para aguas de EE. UU. Aún puedes cambiar cada condición — nunca impone un nudo.",
  "region.broad": "Región de EE. UU.",
  "region.fine": "Más específico",
  "region.fineHint": "Segundo toque opcional. Priores más finos de abrasión, wire-watch y manos.",
  "region.prior": "Primera idea",
  "region.override": "Estas notas solo colorean el cuadro. Lo que tocas sigue decidiendo.",
  "region.none": "Sin región",
  "region.fieldNote": "Nota para esta agua",
  "finder.placeholder": "Escenario, nudo o síntoma…",
  "finder.empty": "Nada coincide. Prueba con un material, un trabajo o lo que falló.",
  "finder.scenarios": "Escenarios",
  "finder.knots": "Nudos",
  "finder.symptoms": "Síntomas",
  "finder.close": "Cerrar la búsqueda",
  "boating.title": "Sin nudos de barco cargados",
  "boating.body":
    "Las palabras de náutica están, pero aún no hay nudos de barco que elegir. No vamos a adivinar.",
  skip: "Ir al contenido",
  "library.mode": "Modo 05 · Biblioteca",
  "library.title": "Los nudos",
  "library.lede":
    "Todos los nudos de pesca y de barco que cubrimos. Abre un diagrama o los pasos — no hace falta pasar por Decidir primero.",
  "library.search": "Buscar Palomar, as de guía, FG…",
  "library.empty": "Nada coincide. Cambia a pesca o a náutica, o prueba otro nombre.",
  "library.all": "Todos los nudos",
  "library.jobs": "Filtrar por tipo",
  "library.tie": "Atar",
  "library.openPlayer": "Cómo atarlo",
  "library.lookFor": "Busca",
  "library.related": "Nudos relacionados",
  "library.plates": "pasos",
};

const DICTS: Record<Locale, Record<Key, string>> = { en, es };

export function useT() {
  const { locale } = usePrefs();
  return (key: Key) => DICTS[locale][key] ?? en[key];
}
