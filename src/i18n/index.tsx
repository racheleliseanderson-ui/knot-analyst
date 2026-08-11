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
  "finder.placeholder": "Scenario, knot or symptom…",
  "finder.empty": "Nothing matches. Try a material, a job, or what went wrong.",
  "finder.scenarios": "Scenarios",
  "finder.knots": "Knots",
  "finder.symptoms": "Symptoms",
  "finder.close": "Close search",
  "boating.title": "Boating & Sailing — vocabulary live, catalog in modelling",
  "boating.body":
    "Rope terminology, connections, constructions and venues are active so the instrument speaks the right language. The mechanical catalog for rope work is not modelled yet, so nothing is scored — this instrument does not guess.",
  "skip": "Skip to content",
} as const;

type Key = keyof typeof en;

const es: Record<Key, string> = {
  "nav.decide": "Decidir",
  "nav.diagnose": "Diagnosticar",
  "nav.data": "Datos",
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
  "finder.placeholder": "Escenario, nudo o síntoma…",
  "finder.empty": "Nada coincide. Prueba con un material, un trabajo o lo que falló.",
  "finder.scenarios": "Escenarios",
  "finder.knots": "Nudos",
  "finder.symptoms": "Síntomas",
  "finder.close": "Cerrar la búsqueda",
  "boating.title": "Náutica y vela — vocabulario activo, catálogo en modelado",
  "boating.body":
    "La terminología de cabo, las conexiones, las construcciones y los lugares ya están activos para que el instrumento hable el idioma correcto. El catálogo mecánico de cabo aún no está modelado, así que no se puntúa nada — este instrumento no adivina.",
  "skip": "Ir al contenido",
};

const DICTS: Record<Locale, Record<Key, string>> = { en, es };

export function useT() {
  const { locale } = usePrefs();
  return (key: Key) => DICTS[locale][key] ?? en[key];
}
