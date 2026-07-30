/**
 * Section content. Kept out of the components so the copy can be reviewed as
 * copy, and so every number stays traceable to one place.
 *
 * All figures describe the illustrative example organisation in lib/model.ts.
 * They are labelled as an example wherever they appear on the page — the site
 * makes no claim about real client results.
 */

import type { SignalId } from '@/lib/model';

/* --------------------------------------------------- 6.3 Problémafelvetés */

export interface ProblemSource {
  id: string;
  label: string;
  /** What actually lives here, in a manager's words. */
  holds: string;
  /** Scatter position before the sources connect, in [-1, 1] space. */
  x: number;
  y: number;
}

export const PROBLEM_SOURCES: readonly ProblemSource[] = [
  { id: 'szabalyzat', label: 'Szabályzatok', holds: 'A dokumentált működés', x: -0.72, y: -0.58 },
  { id: 'excel', label: 'Excel-táblák', holds: 'Nyilvántartások és számítások', x: 0.58, y: -0.66 },
  { id: 'interju', label: 'Interjúk', holds: 'A tényleges gyakorlat', x: -0.34, y: 0.62 },
  { id: 'rendszer', label: 'Vállalati rendszerek', holds: 'Tranzakciók és törzsadatok', x: 0.76, y: 0.28 },
  { id: 'fejek', label: 'Munkatársak fejében', holds: 'A kivételek kezelése', x: -0.82, y: 0.2 },
  { id: 'email', label: 'E-mailek', holds: 'Döntések és jóváhagyások', x: 0.24, y: 0.7 },
  { id: 'folyamat', label: 'Folyamatleírások', holds: 'A tervezett lépéssorrend', x: 0.06, y: -0.78 },
];

/* --------------------------------------------------------- 6.5 Felmérés */

export interface AssessmentStep {
  n: number;
  title: string;
  body: string;
  /** The transformation shown alongside this step. */
  visual: 'document' | 'structure' | 'interview' | 'process' | 'systems' | 'compare' | 'quality';
}

export const ASSESSMENT_STEPS: readonly AssessmentStep[] = [
  {
    n: 1,
    title: 'Dokumentált állapot feltárása',
    body: 'Szabályzatok, folyamatleírások, szerződések és utasítások feldolgozása. Az Ezekiel ezekből kiolvassa a szervezet saját állítását önmagáról.',
    visual: 'document',
  },
  {
    n: 2,
    title: 'Szervezeti struktúra leképezése',
    body: 'Egységek, alárendeltségek, szerepkörök és formális felelősségek strukturált objektumokká alakítása.',
    visual: 'structure',
  },
  {
    n: 3,
    title: 'Interjúk és kérdőívek',
    body: 'A tényleges gyakorlat rögzítése azoktól, akik végzik. Itt derül ki, mi történik a szabályzat helyett.',
    visual: 'interview',
  },
  {
    n: 4,
    title: 'Folyamatok rögzítése',
    body: 'Lépések, jóváhagyási pontok, várakozások, kivételek és visszacsatolások. Átfutási idő és munkaigény lépésenként.',
    visual: 'process',
  },
  {
    n: 5,
    title: 'Rendszerek és adatkapcsolatok azonosítása',
    body: 'Mely rendszer melyik lépést támogatja, hol történik manuális adatátvitel, és mi fut a rendszerek mellett.',
    visual: 'systems',
  },
  {
    n: 6,
    title: 'Dokumentált és valós működés összevetése',
    body: 'A két állapot külön objektumként létezik a modellben. Ahol eltérnek, az eltérés maga lesz megállapítás.',
    visual: 'compare',
  },
  {
    n: 7,
    title: 'Adatminőség és bizonyossági szint',
    body: 'Minden megállapítás megkapja a saját bizonyossági szintjét és a forrásait. A bizonytalanság jelölve marad, nem tűnik el.',
    visual: 'quality',
  },
];

/** The sentence that gets parsed into model objects in the assessment visual. */
export const ASSESSMENT_SOURCE_SENTENCE =
  'A beszerzési igényt a szervezeti egység vezetője hagyja jóvá, majd a beszerzési vezető minősíti a szállítót az ERP-ben.';

export interface ParsedEntity {
  /** The exact substring highlighted in the source sentence. */
  text: string;
  kind: 'role' | 'process' | 'system' | 'org';
  label: string;
}

export const ASSESSMENT_ENTITIES: readonly ParsedEntity[] = [
  { text: 'beszerzési igényt', kind: 'process', label: 'Beszerzési igény' },
  { text: 'szervezeti egység vezetője', kind: 'role', label: 'Egységvezető' },
  { text: 'hagyja jóvá', kind: 'process', label: 'Jóváhagyási pont' },
  { text: 'beszerzési vezető', kind: 'role', label: 'Beszerzési vezető' },
  { text: 'minősíti a szállítót', kind: 'process', label: 'Szállítói minősítés' },
  { text: 'ERP-ben', kind: 'system', label: 'ERP' },
];

/* ---------------------------------------------------------- 6.6 Elemzés */

export interface Finding {
  nodeId: string;
  title: string;
  /** What the model found, stated as fact. */
  statement: string;
  /** Affected objects, by label. */
  affects: string[];
  /** The operational consequence. */
  consequence: string;
}

export interface DiagnosticArea {
  id: SignalId;
  label: string;
  /** The executive question, verbatim from the brief. */
  question: string;
  findings: readonly Finding[];
}

export const DIAGNOSTIC_AREAS: readonly DiagnosticArea[] = [
  {
    id: 'gap',
    label: 'Hiányosságok',
    question: 'Mely feladatoknak nincs egyértelmű felelőse vagy szabályozott folyamata?',
    findings: [
      {
        nodeId: 'proc-minosites',
        title: 'Szállítói minősítés',
        statement: 'Nincs kijelölt felelős és nincs jóváhagyási pont.',
        affects: ['Beszerzés', 'Jogi', 'Ajánlatkérés', 'Szerződéskötés'],
        consequence: 'Az átfutási idő szállítónként 4–6 nappal nő, a minősítés eredménye nem visszakereshető.',
      },
      {
        nodeId: 'proc-onboarding',
        title: 'Belépés és jogosultságok',
        statement: 'A jogosultságkiosztás felelőse HR és IT között nem tisztázott.',
        affects: ['HR', 'IT', 'Jogosultságok'],
        consequence: 'Belépéskor átlagosan 5 nap csúszás, kilépéskor a jogosultság visszavonása nem garantált.',
      },
      {
        nodeId: 'role-folyamatfelelos',
        title: 'Folyamatfelelős szerepkör',
        statement: 'A szerepkör létezik a szabályzatban, de három folyamathoz nincs hozzárendelve.',
        affects: ['Üzemeltetés', 'Karbantartás-tervezés'],
        consequence: 'A folyamatváltozásokat senki nem tartja karban; a leírások elavulnak.',
      },
    ],
  },
  {
    id: 'conflict',
    label: 'Konfliktusok',
    question: 'Hol mondanak ellent egymásnak a szabályzatok, szerepkörök és valós működési gyakorlatok?',
    findings: [
      {
        nodeId: 'proc-incidensrogzites',
        title: 'Incidensrögzítés',
        statement: 'A szabályzat ticket nyitását írja elő, a mért gyakorlat 68%-ban e-mailt használ.',
        affects: ['IT', 'Ticketing', 'E-mail', 'Folyamatnaplók'],
        consequence: 'Az incidensstatisztika nem valós; a szolgáltatási szint nem mérhető.',
      },
      {
        nodeId: 'data-szallitoi-torzs',
        title: 'Szállítói törzs',
        statement: 'Az ERP és az Excel-nyilvántartás eltérő szállítói adatokat tartalmaz, elsődleges forrás nincs kijelölve.',
        affects: ['Beszerzés', 'Pénzügy', 'ERP', 'Excel-nyilvántartás'],
        consequence: 'Számlaigazolásnál egyeztetési kör indul; hibás kifizetés kockázata.',
      },
    ],
  },
  {
    id: 'risk',
    label: 'Kockázatok',
    question: 'Mely személyek, rendszerek vagy manuális lépések jelentenek kritikus függőséget?',
    findings: [
      {
        nodeId: 'role-szerzodeskezelo',
        title: 'Szerződéskezelő',
        statement: 'Egyetlen személy, kijelölt helyettesítés nélkül, a szerződéskötés minden ágán szerepel.',
        affects: ['Szerződéskötés', 'Szerződéstár', 'Iktató (DMS)'],
        consequence: 'Kiesése esetén a szerződéskötés leáll; a folyamat nincs más által átvehető állapotban.',
      },
      {
        nodeId: 'sys-excel',
        title: 'Excel-nyilvántartás',
        statement: 'Négy folyamat támaszkodik rá, verziókövetés és hozzáférés-szabályozás nélkül.',
        affects: ['Beszerzési igény', 'Szállítói minősítés', 'Ajánlatkérés', 'Szállítói törzs'],
        consequence: 'Adatvesztés és néma hibák; a hiba forrása utólag nem azonosítható.',
      },
      {
        nodeId: 'sys-email',
        title: 'E-mail mint folyamateszköz',
        statement: 'Jóváhagyás és incidensbejelentés is itt zajlik, a folyamatból kikerülve.',
        affects: ['Szerződéskötés', 'Incidensrögzítés'],
        consequence: 'A jóváhagyás ténye nem auditálható; a várakozási idő nem mérhető.',
      },
    ],
  },
  {
    id: 'loss',
    label: 'Veszteségek',
    question: 'Hol folyik el a legtöbb idő, pénz és vezetői figyelem?',
    findings: [
      {
        nodeId: 'proc-szerzodeskotes',
        title: 'Szerződéskötés',
        statement: '18 nap átfutás, ebből 7 nap jóváhagyásra várakozás. Éves működési költség 18,4 MFt.',
        affects: ['Jogi', 'Beszerzés', 'Szerződéskezelő'],
        consequence: 'A várakozás a teljes átfutás 39%-a, és nem hoz létre értéket.',
      },
      {
        nodeId: 'proc-szamlaigazolas',
        title: 'Számlaigazolás',
        statement: 'Havi 62 óra manuális egyeztetés két rendszer között. Éves költség 9,6 MFt.',
        affects: ['Pénzügy', 'ERP', 'Excel-nyilvántartás'],
        consequence: 'A kontroller kapacitásának 34%-a adategyeztetésre megy el, nem elemzésre.',
      },
    ],
  },
];

/* ------------------------------------------- 6.7 Költség és megtérülés */

export interface ProcessMetric {
  key: string;
  label: string;
  /** Present-state value. */
  value: number;
  unit: string;
  /** Decimal places for the animated counter. */
  decimals?: number;
}

export const EXAMPLE_PROCESS = {
  name: 'Beszerzési igény → szerződéskötés',
  scope: 'Példafolyamat egy 420 fős szervezetnél, évi 310 szerződéskötéssel.',
} as const;

export const PROCESS_METRICS: readonly ProcessMetric[] = [
  { key: 'lead', label: 'Átfutási idő', value: 18, unit: 'nap' },
  { key: 'manual', label: 'Manuális munkaigény', value: 62, unit: 'óra / hó' },
  { key: 'fte', label: 'Érintett FTE', value: 2.4, unit: 'FTE', decimals: 1 },
  { key: 'cost', label: 'Éves működési költség', value: 18.4, unit: 'MFt', decimals: 1 },
  { key: 'error', label: 'Hibaköltség', value: 2.1, unit: 'MFt / év', decimals: 1 },
  { key: 'delay', label: 'Késedelmi kockázat', value: 39, unit: '% várakozás' },
  { key: 'auto', label: 'Automatizálhatóság', value: 64, unit: '%' },
];

export interface Scenario {
  id: string;
  n: number;
  label: string;
  summary: string;
  /** What actually changes in the operation. */
  changes: readonly string[];
  outcome: {
    investmentMHUF: number;
    timeSavedPct: number;
    fteDelta: number;
    riskFrom: string;
    riskTo: string;
    paybackMonths: number;
  };
  /** Metric values after this scenario, keyed by ProcessMetric.key. */
  after: Record<string, number>;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'governed',
    n: 1,
    label: 'Szabályozott működés',
    summary: 'Nincs új rendszer. A felelősségek, jóváhagyási pontok és lépéssorrend rögzítése.',
    changes: [
      'A szállítói minősítés felelőse és jóváhagyási pontja kijelölve',
      'Egyetlen elsődleges szállítói adatforrás',
      'A jóváhagyás e-mailről a folyamatba visszahelyezve',
    ],
    outcome: {
      investmentMHUF: 1.8,
      timeSavedPct: 17,
      fteDelta: -0.3,
      riskFrom: 'magas',
      riskTo: 'közepes',
      paybackMonths: 7,
    },
    after: { lead: 15, manual: 54, fte: 2.1, cost: 15.6, error: 1.4, delay: 31, auto: 64 },
  },
  {
    id: 'workflow',
    n: 2,
    label: 'Workflow és digitalizáció',
    summary: 'A folyamat digitális workflow-ban fut, mért lépésekkel és auditálható jóváhagyással.',
    changes: [
      'Igény, minősítés és jóváhagyás egy workflow-ban',
      'Az Excel-nyilvántartás kivezetve a folyamatból',
      'Lépésenkénti átfutásmérés, automatikus emlékeztetők',
    ],
    outcome: {
      investmentMHUF: 6.5,
      timeSavedPct: 41,
      fteDelta: -0.9,
      riskFrom: 'magas',
      riskTo: 'alacsony',
      paybackMonths: 11,
    },
    after: { lead: 11, manual: 33, fte: 1.5, cost: 11.2, error: 0.7, delay: 18, auto: 64 },
  },
  {
    id: 'automated',
    n: 3,
    label: 'Automatizáció és intelligens támogatás',
    summary: 'A rutindöntések automatizáltan futnak, emberi jóváhagyás csak kivételnél.',
    changes: [
      'Szállítói minősítés automatikus előszűréssel',
      'Szerződéstervezet generálás és adategyeztetés rendszerek között',
      'Kivételkezelés emberi döntéssel, minden más automatikusan',
    ],
    outcome: {
      investmentMHUF: 14.2,
      timeSavedPct: 63,
      fteDelta: -1.5,
      riskFrom: 'magas',
      riskTo: 'alacsony',
      paybackMonths: 16,
    },
    after: { lead: 7, manual: 18, fte: 0.9, cost: 7.4, error: 0.3, delay: 9, auto: 64 },
  },
];

/* ------------------------------------- 6.8 Vezetői döntéstámogatás */

export interface Simulation {
  id: string;
  question: string;
  /** One-line answer the model gives. */
  answer: string;
  /** Node ids the change starts from. */
  origin: readonly string[];
  /** Node ids the change reaches, in propagation order. */
  affected: readonly string[];
  /** Named consequence, shown next to the graph. */
  effects: readonly { label: string; value: string }[];
  /** New bottleneck created, or null when the change removes one. */
  bottleneck: string | null;
}

export const SIMULATIONS: readonly Simulation[] = [
  {
    id: 'new-hire',
    question: 'Mi történik, ha új munkatársat veszünk fel a beszerzésre?',
    answer:
      'Az igénykezelés kapacitása nő, de a szűk keresztmetszet a jóváhagyásra tolódik: a szerződéskötés nem gyorsul.',
    origin: ['org-beszerzes'],
    affected: ['role-beszerzesi-vezeto', 'proc-igeny', 'proc-minosites', 'proc-szerzodeskotes'],
    effects: [
      { label: 'Igénykezelési kapacitás', value: '+35%' },
      { label: 'Teljes átfutási idő', value: '−1 nap' },
      { label: 'Éves személyi költség', value: '+7,2 MFt' },
    ],
    bottleneck: 'Szerződéskötés — jóváhagyási várakozás',
  },
  {
    id: 'key-person',
    question: 'Mi történik, ha a szerződéskezelő kiesik?',
    answer:
      'A szerződéskötés minden ága megáll. Négy folyamat és két egység érintett, helyettesítés nincs kijelölve.',
    origin: ['role-szerzodeskezelo'],
    affected: ['proc-szerzodeskotes', 'data-szerzodesadatok', 'sys-dms', 'proc-szamlaigazolas', 'org-jogi'],
    effects: [
      { label: 'Leálló folyamatok', value: '4' },
      { label: 'Becsült késedelem', value: '12–18 nap' },
      { label: 'Érintett szerződésérték', value: '310 / év' },
    ],
    bottleneck: 'Jogi — egyetlen átvevő nélküli szerepkör',
  },
  {
    id: 'system-swap',
    question: 'Mely folyamatokra hat, ha lecseréljük az ERP-t?',
    answer:
      'Öt folyamat és három adatobjektum függ tőle közvetlenül. A számlaigazolás és a kifizetés a legkitettebb.',
    origin: ['sys-erp'],
    affected: [
      'proc-igeny',
      'proc-szamlaigazolas',
      'proc-kifizetes',
      'data-szallitoi-torzs',
      'data-jogosultsagok',
      'data-koltseghelyek',
    ],
    effects: [
      { label: 'Közvetlenül érintett folyamat', value: '5' },
      { label: 'Migrálandó adatobjektum', value: '3' },
      { label: 'Érintett szerepkör', value: '4' },
    ],
    bottleneck: 'Pénzügy — párhuzamos működés a migráció alatt',
  },
  {
    id: 'bottleneck',
    question: 'Hol keletkezik új szűk keresztmetszet, ha a beszerzés gyorsul?',
    answer:
      'A jogi jóváhagyásnál. A beszerzési oldal gyorsulása a várakozást a szerződéskötésre tolja át.',
    origin: ['proc-igeny', 'proc-minosites'],
    affected: ['proc-szerzodeskotes', 'role-jogi-szakerto', 'role-szerzodeskezelo', 'org-jogi'],
    effects: [
      { label: 'Beérkező igény', value: '+35%' },
      { label: 'Jogi terhelés', value: '+42%' },
      { label: 'Nettó átfutási nyereség', value: '6%' },
    ],
    bottleneck: 'Jogi — jóváhagyási kapacitás',
  },
  {
    id: 'fastest-roi',
    question: 'Mely fejlesztés térül meg a leggyorsabban?',
    answer:
      'A szabályozott működés: 7 hónap. A legnagyobb hatás a workflow-nál jelentkezik, 11 hónap megtérüléssel.',
    origin: ['proc-minosites'],
    affected: ['proc-igeny', 'proc-szerzodeskotes', 'cost-szerzodeskotes', 'risk-manualis-atvitel'],
    effects: [
      { label: 'Szabályozott működés', value: '7 hónap' },
      { label: 'Workflow és digitalizáció', value: '11 hónap' },
      { label: 'Automatizáció', value: '16 hónap' },
    ],
    bottleneck: null,
  },
  {
    id: 'risk-profile',
    question: 'Hogyan változik a szervezet kockázati profilja?',
    answer:
      'Két kritikus függőség szűnik meg, egy közepes marad. A manuális adatátvitel kivezetése adja a legnagyobb csökkenést.',
    origin: ['risk-manualis-atvitel', 'risk-szabalyozatlan'],
    affected: ['sys-excel', 'data-szallitoi-torzs', 'proc-minosites', 'proc-onboarding'],
    effects: [
      { label: 'Kritikus függőség', value: '3 → 1' },
      { label: 'Szabályozatlan lépés', value: '5 → 1' },
      { label: 'Auditálható jóváhagyás', value: '41% → 96%' },
    ],
    bottleneck: null,
  },
];

/* ------------------------------------------------------ 6.9 Az eredmény */

export interface OutcomeProperty {
  title: string;
  body: string;
}

export const OUTCOME_PROPERTIES: readonly OutcomeProperty[] = [
  { title: 'Frissíthető', body: 'A szervezet változásait a modellen követjük, nem új projektben.' },
  { title: 'Összehasonlítható', body: 'Két időpont állapota egymásra vetíthető, az eltérés mért.' },
  { title: 'Verziózható', body: 'Minden állapot megmarad, a döntés kontextusa visszakereshető.' },
  { title: 'Mérhető', body: 'Átfutás, költség, kockázat és lefedettség számként létezik.' },
  { title: 'Továbbfejleszthető', body: 'Új terület, folyamat vagy leányvállalat a meglévő modellhez kapcsolódik.' },
  { title: 'Döntéstámogató', body: 'A vezetői kérdés a modellen futtatható, nem külön elemzésben.' },
  { title: 'Integrálható', body: 'Workflow-k, automatizációk és rendszerbevezetések alapjaként használható.' },
];

export interface ModelVersion {
  id: string;
  label: string;
  metrics: readonly { label: string; value: string }[];
}

export const MODEL_VERSIONS: readonly ModelVersion[] = [
  {
    id: 'v1',
    label: '2026 Q1 — kiinduló felmérés',
    metrics: [
      { label: 'Leképezett folyamat', value: '38' },
      { label: 'Felelős nélküli feladat', value: '11' },
      { label: 'Szabályozatlan lépés', value: '5' },
      { label: 'Auditálható jóváhagyás', value: '41%' },
      { label: 'Azonosított éves veszteség', value: '38,3 MFt' },
    ],
  },
  {
    id: 'v2',
    label: '2026 Q3 — a szabályozás után',
    metrics: [
      { label: 'Leképezett folyamat', value: '46' },
      { label: 'Felelős nélküli feladat', value: '3' },
      { label: 'Szabályozatlan lépés', value: '1' },
      { label: 'Auditálható jóváhagyás', value: '78%' },
      { label: 'Azonosított éves veszteség', value: '22,9 MFt' },
    ],
  },
];

/* --------------------------------------------- 6.10 Bizalom és módszertan */

export interface Principle {
  title: string;
  body: string;
}

export const PRINCIPLES: readonly Principle[] = [
  {
    title: 'Strukturált felmérés',
    body: 'A modell rögzített kérdéskörök és objektumtípusok szerint épül, nem szabad interpretációból. Ugyanaz a felmérés máskor is ugyanazt a szerkezetet adja.',
  },
  {
    title: 'Dokumentált és tényleges állapot',
    body: 'A két állapot külön objektum a modellben. Ahol eltérnek, azt az Ezekiel megállapításként kezeli, nem hibaként javítja.',
  },
  {
    title: 'Bizonyossági szint',
    body: 'Minden megállapítás magas, közepes vagy alacsony bizonyossági szintet kap, a forrás típusa és egyezése alapján. A bizonytalanság látható marad.',
  },
  {
    title: 'Forrásvisszavezetés',
    body: 'Minden állítás mögött ott van a forrás: szabályzatpont, interjú, rendszerkivonat vagy mérés. A vezetői összefoglalótól két kattintás a forrás.',
  },
  {
    title: 'Nem fekete doboz',
    body: 'A következtetés levezetése megnyitható: mely objektumok és kapcsolatok alapján állítja a rendszer, amit állít.',
  },
  {
    title: 'Emberi ellenőrzés',
    body: 'A modell állításai jóváhagyhatók, vitathatók és korrigálhatók. A korrekció a forrással együtt rögzül, így a döntés története megmarad.',
  },
];

export interface TraceSource {
  type: string;
  ref: string;
  agrees: boolean;
}

export const SOURCE_TRACE = {
  statement: 'A szállítói minősítésnek nincs kijelölt felelőse.',
  certainty: 'high' as const,
  sources: [
    { type: 'Szabályzat', ref: 'Beszerzési szabályzat 4.2 § — felelőst nem nevez meg', agrees: true },
    { type: 'Interjú', ref: 'Beszerzési vezető — „ki ráér, az csinálja"', agrees: true },
    { type: 'Rendszerkivonat', ref: 'ERP jogosultsági kiosztás — nincs minősítési szerepkör', agrees: true },
    { type: 'Folyamatleírás', ref: 'P-04 minősítési lépés — felelős mező kitöltetlen', agrees: true },
  ] as readonly TraceSource[],
} as const;

/* ---------------------------------------------------------------- navigáció */

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Módszertan', href: '#felmeres' },
  { label: 'Megoldások', href: '#elemzes' },
  { label: 'Eredmények', href: '#megterules' },
  { label: 'Rólunk', href: '#modszertan' },
];
