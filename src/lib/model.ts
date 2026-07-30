/**
 * The Ezekiel demo organisation model.
 *
 * Every visual on the page — hero graph, layer explorer, diagnostic view,
 * simulation, closing graph — reads from this single dataset. That is the
 * product claim made structural: there is one model, and the sections are
 * views of it. If a node gains a connection here, every section shows it.
 *
 * The subject is a deliberately ordinary mid-size Hungarian company: eight
 * units, a procure-to-contract spine, and the usual mix of ERP, DMS and
 * spreadsheets holding it together.
 */

export type LayerId =
  | 'org'
  | 'roles'
  | 'services'
  | 'processes'
  | 'systems'
  | 'data'
  | 'costs'
  | 'risks';

export type SignalId = 'gap' | 'conflict' | 'risk' | 'loss';

/** Confidence in the underlying evidence, surfaced in the node panel. */
export type Certainty = 'high' | 'medium' | 'low';

/**
 * Rendering tier. The graph thins out on small screens by dropping higher
 * tiers, so mobile keeps the story without keeping the node count.
 *   1 — structural, always drawn (mobile included)
 *   2 — drawn from tablet up
 *   3 — density, desktop only
 */
export type Tier = 1 | 2 | 3;

export type ClusterId =
  | 'vezetes'
  | 'penzugy'
  | 'beszerzes'
  | 'jogi'
  | 'it'
  | 'uzemeltetes'
  | 'hr'
  | 'ertekesites';

export interface ModelNode {
  id: string;
  label: string;
  layer: LayerId;
  cluster: ClusterId;
  tier: Tier;
  /** Responsible role id, or null when the model found no clear owner. */
  owner: string | null;
  certainty: Certainty;
  signal?: SignalId;
  /** Short factual note shown in the detail panel. */
  note?: string;
  /** Annual operating cost in million HUF, where the model quantified it. */
  annualCostMHUF?: number;
}

export type EdgeKind =
  | 'structure' /* unit ↔ unit, unit ↔ role */
  | 'flow' /* process step ↔ process step */
  | 'support' /* system ↔ process, data ↔ system */
  | 'accountability' /* role ↔ process, role ↔ service */
  | 'cost' /* cost ↔ process */
  | 'exposure'; /* risk ↔ anything */

export interface ModelEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  tier: Tier;
}

export interface LayerMeta {
  id: LayerId;
  label: string;
  /** One line answering "what does this layer tell a manager?" */
  hint: string;
  /** Base depth in the pseudo-3D graph; +z is nearer the camera. */
  depth: number;
}

/** Spec order: Szervezet → Szerepkörök → … → Kockázatok. */
export const LAYERS: readonly LayerMeta[] = [
  { id: 'org', label: 'Szervezet', hint: 'Egységek és alárendeltségek.', depth: 0.34 },
  { id: 'roles', label: 'Szerepkörök', hint: 'Ki miért felel — és mi maradt felelős nélkül.', depth: 0.12 },
  { id: 'services', label: 'Szolgáltatások', hint: 'Amit a szervezet befelé és kifelé nyújt.', depth: -0.06 },
  { id: 'processes', label: 'Folyamatok', hint: 'A tényleges lépéssorrend, nem a szabályzat szerinti.', depth: 0.2 },
  { id: 'systems', label: 'Rendszerek', hint: 'Ami a működést hordozza — és ami mellette Excelben fut.', depth: -0.32 },
  { id: 'data', label: 'Adatok', hint: 'Törzsadatok, dokumentumok, naplók és a köztük lévő átvitel.', depth: -0.58 },
  { id: 'costs', label: 'Költségek', hint: 'Hol keletkezik ráfordítás, és mennyi.', depth: 0.02 },
  { id: 'risks', label: 'Kockázatok', hint: 'Kritikus függőségek és szabályozatlan pontok.', depth: 0.46 },
] as const;

export const CLUSTERS: Record<ClusterId, { label: string; x: number; y: number; radius: number }> = {
  vezetes: { label: 'Vezetés', x: 0.0, y: -0.66, radius: 0.17 },
  jogi: { label: 'Jogi', x: 0.3, y: -0.3, radius: 0.19 },
  ertekesites: { label: 'Értékesítés', x: 0.76, y: -0.56, radius: 0.17 },
  it: { label: 'IT', x: 0.66, y: 0.14, radius: 0.24 },
  uzemeltetes: { label: 'Üzemeltetés', x: 0.22, y: 0.62, radius: 0.22 },
  beszerzes: { label: 'Beszerzés', x: -0.3, y: 0.18, radius: 0.25 },
  hr: { label: 'HR', x: -0.72, y: 0.56, radius: 0.19 },
  penzugy: { label: 'Pénzügy', x: -0.7, y: -0.24, radius: 0.22 },
};

export const NODES: readonly ModelNode[] = [
  /* ---- Szervezet ---- */
  { id: 'org-vezetes', label: 'Vezetés', layer: 'org', cluster: 'vezetes', tier: 1, owner: null, certainty: 'high' },
  { id: 'org-penzugy', label: 'Pénzügy', layer: 'org', cluster: 'penzugy', tier: 1, owner: 'role-kontroller', certainty: 'high' },
  { id: 'org-beszerzes', label: 'Beszerzés', layer: 'org', cluster: 'beszerzes', tier: 1, owner: 'role-beszerzesi-vezeto', certainty: 'high' },
  { id: 'org-jogi', label: 'Jogi', layer: 'org', cluster: 'jogi', tier: 1, owner: 'role-jogi-szakerto', certainty: 'high' },
  { id: 'org-it', label: 'IT', layer: 'org', cluster: 'it', tier: 1, owner: 'role-rendszergazda', certainty: 'high' },
  { id: 'org-uzemeltetes', label: 'Üzemeltetés', layer: 'org', cluster: 'uzemeltetes', tier: 1, owner: 'role-uzemeltetesi-vezeto', certainty: 'high' },
  { id: 'org-hr', label: 'HR', layer: 'org', cluster: 'hr', tier: 1, owner: 'role-hr-partner', certainty: 'high' },
  { id: 'org-ertekesites', label: 'Értékesítés', layer: 'org', cluster: 'ertekesites', tier: 2, owner: null, certainty: 'medium' },

  /* ---- Szerepkörök ---- */
  { id: 'role-beszerzesi-vezeto', label: 'Beszerzési vezető', layer: 'roles', cluster: 'beszerzes', tier: 1, owner: null, certainty: 'high' },
  { id: 'role-szerzodeskezelo', label: 'Szerződéskezelő', layer: 'roles', cluster: 'jogi', tier: 2, owner: null, certainty: 'medium', signal: 'risk', note: 'Egyetlen személy, helyettesítés nincs kijelölve.' },
  { id: 'role-kontroller', label: 'Pénzügyi kontroller', layer: 'roles', cluster: 'penzugy', tier: 1, owner: null, certainty: 'high' },
  { id: 'role-jogi-szakerto', label: 'Jogi szakértő', layer: 'roles', cluster: 'jogi', tier: 2, owner: null, certainty: 'high' },
  { id: 'role-rendszergazda', label: 'Rendszergazda', layer: 'roles', cluster: 'it', tier: 2, owner: null, certainty: 'high' },
  { id: 'role-folyamatfelelos', label: 'Folyamatfelelős', layer: 'roles', cluster: 'uzemeltetes', tier: 2, owner: null, certainty: 'low', signal: 'gap', note: 'A szerepkör létezik, de három folyamathoz nincs hozzárendelve.' },
  { id: 'role-uzemeltetesi-vezeto', label: 'Üzemeltetési vezető', layer: 'roles', cluster: 'uzemeltetes', tier: 2, owner: null, certainty: 'high' },
  { id: 'role-hr-partner', label: 'HR partner', layer: 'roles', cluster: 'hr', tier: 3, owner: null, certainty: 'medium' },

  /* ---- Szolgáltatások ---- */
  { id: 'svc-szerzodeskotes', label: 'Szállítói szerződéskötés', layer: 'services', cluster: 'beszerzes', tier: 1, owner: 'role-beszerzesi-vezeto', certainty: 'high' },
  { id: 'svc-szamlafeldolgozas', label: 'Számlafeldolgozás', layer: 'services', cluster: 'penzugy', tier: 2, owner: 'role-kontroller', certainty: 'high' },
  { id: 'svc-incidenskezeles', label: 'Incidenskezelés', layer: 'services', cluster: 'it', tier: 2, owner: 'role-rendszergazda', certainty: 'medium' },
  { id: 'svc-karbantartas', label: 'Karbantartás-tervezés', layer: 'services', cluster: 'uzemeltetes', tier: 3, owner: 'role-uzemeltetesi-vezeto', certainty: 'low' },
  { id: 'svc-munkaero-felvetel', label: 'Munkaerő-felvétel', layer: 'services', cluster: 'hr', tier: 3, owner: 'role-hr-partner', certainty: 'medium' },

  /* ---- Folyamatok (a beszerzési gerinc) ---- */
  { id: 'proc-igeny', label: 'Beszerzési igény', layer: 'processes', cluster: 'beszerzes', tier: 1, owner: 'role-beszerzesi-vezeto', certainty: 'high' },
  { id: 'proc-minosites', label: 'Szállítói minősítés', layer: 'processes', cluster: 'beszerzes', tier: 1, owner: null, certainty: 'low', signal: 'gap', note: 'Nincs kijelölt felelős és jóváhagyási pont.' },
  { id: 'proc-ajanlatkeres', label: 'Ajánlatkérés', layer: 'processes', cluster: 'beszerzes', tier: 2, owner: 'role-beszerzesi-vezeto', certainty: 'medium' },
  { id: 'proc-szerzodeskotes', label: 'Szerződéskötés', layer: 'processes', cluster: 'jogi', tier: 1, owner: 'role-szerzodeskezelo', certainty: 'medium', signal: 'loss', annualCostMHUF: 18.4, note: '18 nap átfutás, ebből 7 nap várakozás jóváhagyásra.' },
  { id: 'proc-szamlaigazolas', label: 'Számlaigazolás', layer: 'processes', cluster: 'penzugy', tier: 1, owner: 'role-kontroller', certainty: 'high', signal: 'loss', annualCostMHUF: 9.6 },
  { id: 'proc-kifizetes', label: 'Kifizetés', layer: 'processes', cluster: 'penzugy', tier: 2, owner: 'role-kontroller', certainty: 'high' },
  { id: 'proc-incidensrogzites', label: 'Incidensrögzítés', layer: 'processes', cluster: 'it', tier: 2, owner: 'role-rendszergazda', certainty: 'medium', signal: 'conflict', note: 'A szabályzat ticketet ír elő, a gyakorlat e-mailt használ.' },
  { id: 'proc-onboarding', label: 'Belépés és jogosultságok', layer: 'processes', cluster: 'hr', tier: 2, owner: null, certainty: 'low', signal: 'gap', annualCostMHUF: 4.2, note: 'A jogosultságkiosztás felelőse HR és IT között nem tisztázott.' },

  /* ---- Rendszerek ---- */
  { id: 'sys-erp', label: 'ERP', layer: 'systems', cluster: 'it', tier: 1, owner: 'role-rendszergazda', certainty: 'high' },
  { id: 'sys-dms', label: 'Iktató (DMS)', layer: 'systems', cluster: 'jogi', tier: 2, owner: 'role-szerzodeskezelo', certainty: 'high' },
  { id: 'sys-excel', label: 'Excel-nyilvántartás', layer: 'systems', cluster: 'beszerzes', tier: 1, owner: null, certainty: 'low', signal: 'risk', note: 'Négy folyamat támaszkodik rá, verziókövetés nélkül.' },
  { id: 'sys-email', label: 'E-mail', layer: 'systems', cluster: 'uzemeltetes', tier: 2, owner: null, certainty: 'medium', signal: 'risk', note: 'Jóváhagyás és incidensbejelentés is itt zajlik, nyomon követhetetlenül.' },
  { id: 'sys-jogi-tar', label: 'Szerződéstár', layer: 'systems', cluster: 'jogi', tier: 3, owner: 'role-jogi-szakerto', certainty: 'medium' },
  { id: 'sys-ticketing', label: 'Ticketing', layer: 'systems', cluster: 'it', tier: 2, owner: 'role-rendszergazda', certainty: 'high' },
  { id: 'sys-hr', label: 'HR-rendszer', layer: 'systems', cluster: 'hr', tier: 3, owner: 'role-hr-partner', certainty: 'medium' },

  /* ---- Adatok ---- */
  { id: 'data-szallitoi-torzs', label: 'Szállítói törzs', layer: 'data', cluster: 'beszerzes', tier: 2, owner: null, certainty: 'low', signal: 'conflict', note: 'Az ERP és az Excel-nyilvántartás eltérő szállítói adatokat tartalmaz.' },
  { id: 'data-szerzodesadatok', label: 'Szerződésadatok', layer: 'data', cluster: 'jogi', tier: 2, owner: 'role-szerzodeskezelo', certainty: 'medium' },
  { id: 'data-koltseghelyek', label: 'Költséghelyek', layer: 'data', cluster: 'penzugy', tier: 3, owner: 'role-kontroller', certainty: 'high' },
  { id: 'data-jogosultsagok', label: 'Jogosultságok', layer: 'data', cluster: 'it', tier: 2, owner: null, certainty: 'low', signal: 'gap' },
  { id: 'data-folyamatnaplok', label: 'Folyamatnaplók', layer: 'data', cluster: 'it', tier: 3, owner: 'role-rendszergazda', certainty: 'medium' },

  /* ---- Költségek ---- */
  { id: 'cost-szerzodeskotes', label: '18,4 MFt / év', layer: 'costs', cluster: 'jogi', tier: 1, owner: 'role-kontroller', certainty: 'medium', annualCostMHUF: 18.4, note: 'A szerződéskötési folyamat teljes éves működési költsége.' },
  { id: 'cost-szamlafeldolgozas', label: '9,6 MFt / év', layer: 'costs', cluster: 'penzugy', tier: 2, owner: 'role-kontroller', certainty: 'high', annualCostMHUF: 9.6 },
  { id: 'cost-incidens', label: '6,1 MFt / év', layer: 'costs', cluster: 'it', tier: 2, owner: 'role-rendszergazda', certainty: 'medium', annualCostMHUF: 6.1 },
  { id: 'cost-onboarding', label: '4,2 MFt / év', layer: 'costs', cluster: 'hr', tier: 3, owner: null, certainty: 'low', annualCostMHUF: 4.2 },

  /* ---- Kockázatok ---- */
  { id: 'risk-kulcsember', label: 'Kulcsemberi függés', layer: 'risks', cluster: 'jogi', tier: 1, owner: 'role-jogi-szakerto', certainty: 'high', signal: 'risk' },
  { id: 'risk-manualis-atvitel', label: 'Manuális adatátvitel', layer: 'risks', cluster: 'beszerzes', tier: 1, owner: null, certainty: 'medium', signal: 'risk' },
  { id: 'risk-szabalyozatlan', label: 'Szabályozatlan lépés', layer: 'risks', cluster: 'uzemeltetes', tier: 2, owner: null, certainty: 'medium', signal: 'gap' },
  { id: 'risk-ellentmondas', label: 'Ellentmondó szabályzat', layer: 'risks', cluster: 'it', tier: 2, owner: null, certainty: 'medium', signal: 'conflict' },
];

export const EDGES: readonly ModelEdge[] = [
  /* Szervezeti struktúra */
  { from: 'org-vezetes', to: 'org-penzugy', kind: 'structure', tier: 1 },
  { from: 'org-vezetes', to: 'org-beszerzes', kind: 'structure', tier: 1 },
  { from: 'org-vezetes', to: 'org-jogi', kind: 'structure', tier: 1 },
  { from: 'org-vezetes', to: 'org-it', kind: 'structure', tier: 1 },
  { from: 'org-vezetes', to: 'org-uzemeltetes', kind: 'structure', tier: 1 },
  { from: 'org-vezetes', to: 'org-hr', kind: 'structure', tier: 2 },
  { from: 'org-vezetes', to: 'org-ertekesites', kind: 'structure', tier: 2 },

  /* Egység → szerepkör */
  { from: 'org-beszerzes', to: 'role-beszerzesi-vezeto', kind: 'structure', tier: 1 },
  { from: 'org-jogi', to: 'role-szerzodeskezelo', kind: 'structure', tier: 2 },
  { from: 'org-jogi', to: 'role-jogi-szakerto', kind: 'structure', tier: 2 },
  { from: 'org-penzugy', to: 'role-kontroller', kind: 'structure', tier: 1 },
  { from: 'org-it', to: 'role-rendszergazda', kind: 'structure', tier: 2 },
  { from: 'org-uzemeltetes', to: 'role-uzemeltetesi-vezeto', kind: 'structure', tier: 2 },
  { from: 'org-uzemeltetes', to: 'role-folyamatfelelos', kind: 'structure', tier: 2 },
  { from: 'org-hr', to: 'role-hr-partner', kind: 'structure', tier: 3 },

  /* Szolgáltatás → egység, szolgáltatás → folyamat */
  { from: 'org-beszerzes', to: 'svc-szerzodeskotes', kind: 'structure', tier: 1 },
  { from: 'org-penzugy', to: 'svc-szamlafeldolgozas', kind: 'structure', tier: 2 },
  { from: 'org-it', to: 'svc-incidenskezeles', kind: 'structure', tier: 2 },
  { from: 'org-uzemeltetes', to: 'svc-karbantartas', kind: 'structure', tier: 3 },
  { from: 'org-hr', to: 'svc-munkaero-felvetel', kind: 'structure', tier: 3 },
  { from: 'svc-szerzodeskotes', to: 'proc-igeny', kind: 'flow', tier: 1 },
  { from: 'svc-szamlafeldolgozas', to: 'proc-szamlaigazolas', kind: 'flow', tier: 2 },
  { from: 'svc-incidenskezeles', to: 'proc-incidensrogzites', kind: 'flow', tier: 2 },
  { from: 'svc-munkaero-felvetel', to: 'proc-onboarding', kind: 'flow', tier: 3 },

  /* A beszerzési gerinc — a folyamat tényleges lépéssorrendje */
  { from: 'proc-igeny', to: 'proc-minosites', kind: 'flow', tier: 1 },
  { from: 'proc-minosites', to: 'proc-ajanlatkeres', kind: 'flow', tier: 2 },
  { from: 'proc-ajanlatkeres', to: 'proc-szerzodeskotes', kind: 'flow', tier: 2 },
  { from: 'proc-igeny', to: 'proc-szerzodeskotes', kind: 'flow', tier: 1 },
  { from: 'proc-szerzodeskotes', to: 'proc-szamlaigazolas', kind: 'flow', tier: 1 },
  { from: 'proc-szamlaigazolas', to: 'proc-kifizetes', kind: 'flow', tier: 2 },

  /* Felelősségek */
  { from: 'role-beszerzesi-vezeto', to: 'proc-igeny', kind: 'accountability', tier: 1 },
  { from: 'role-beszerzesi-vezeto', to: 'proc-ajanlatkeres', kind: 'accountability', tier: 2 },
  { from: 'role-szerzodeskezelo', to: 'proc-szerzodeskotes', kind: 'accountability', tier: 2 },
  { from: 'role-jogi-szakerto', to: 'proc-szerzodeskotes', kind: 'accountability', tier: 2 },
  { from: 'role-kontroller', to: 'proc-szamlaigazolas', kind: 'accountability', tier: 1 },
  { from: 'role-kontroller', to: 'proc-kifizetes', kind: 'accountability', tier: 2 },
  { from: 'role-rendszergazda', to: 'proc-incidensrogzites', kind: 'accountability', tier: 2 },
  { from: 'role-folyamatfelelos', to: 'proc-minosites', kind: 'accountability', tier: 2 },
  { from: 'role-hr-partner', to: 'proc-onboarding', kind: 'accountability', tier: 3 },

  /* Rendszertámogatás */
  { from: 'sys-erp', to: 'proc-igeny', kind: 'support', tier: 1 },
  { from: 'sys-erp', to: 'proc-szamlaigazolas', kind: 'support', tier: 1 },
  { from: 'sys-erp', to: 'proc-kifizetes', kind: 'support', tier: 2 },
  { from: 'sys-dms', to: 'proc-szerzodeskotes', kind: 'support', tier: 2 },
  { from: 'sys-jogi-tar', to: 'proc-szerzodeskotes', kind: 'support', tier: 3 },
  { from: 'sys-excel', to: 'proc-minosites', kind: 'support', tier: 1 },
  { from: 'sys-excel', to: 'proc-ajanlatkeres', kind: 'support', tier: 2 },
  { from: 'sys-excel', to: 'proc-igeny', kind: 'support', tier: 2 },
  { from: 'sys-email', to: 'proc-szerzodeskotes', kind: 'support', tier: 2 },
  { from: 'sys-email', to: 'proc-incidensrogzites', kind: 'support', tier: 2 },
  { from: 'sys-ticketing', to: 'proc-incidensrogzites', kind: 'support', tier: 2 },
  { from: 'sys-hr', to: 'proc-onboarding', kind: 'support', tier: 3 },

  /* Adatkapcsolatok */
  { from: 'data-szallitoi-torzs', to: 'sys-erp', kind: 'support', tier: 2 },
  { from: 'data-szallitoi-torzs', to: 'sys-excel', kind: 'support', tier: 2 },
  { from: 'data-szerzodesadatok', to: 'sys-dms', kind: 'support', tier: 2 },
  { from: 'data-szerzodesadatok', to: 'sys-erp', kind: 'support', tier: 3 },
  { from: 'data-koltseghelyek', to: 'sys-erp', kind: 'support', tier: 3 },
  { from: 'data-jogosultsagok', to: 'sys-erp', kind: 'support', tier: 2 },
  { from: 'data-jogosultsagok', to: 'proc-onboarding', kind: 'support', tier: 2 },
  { from: 'data-folyamatnaplok', to: 'sys-ticketing', kind: 'support', tier: 3 },

  /* Költségek */
  { from: 'cost-szerzodeskotes', to: 'proc-szerzodeskotes', kind: 'cost', tier: 1 },
  { from: 'cost-szamlafeldolgozas', to: 'proc-szamlaigazolas', kind: 'cost', tier: 2 },
  { from: 'cost-incidens', to: 'proc-incidensrogzites', kind: 'cost', tier: 2 },
  { from: 'cost-onboarding', to: 'proc-onboarding', kind: 'cost', tier: 3 },

  /* Kockázati kitettség */
  { from: 'risk-kulcsember', to: 'role-szerzodeskezelo', kind: 'exposure', tier: 1 },
  { from: 'risk-kulcsember', to: 'proc-szerzodeskotes', kind: 'exposure', tier: 1 },
  { from: 'risk-manualis-atvitel', to: 'sys-excel', kind: 'exposure', tier: 1 },
  { from: 'risk-manualis-atvitel', to: 'data-szallitoi-torzs', kind: 'exposure', tier: 2 },
  { from: 'risk-szabalyozatlan', to: 'proc-minosites', kind: 'exposure', tier: 2 },
  { from: 'risk-szabalyozatlan', to: 'proc-onboarding', kind: 'exposure', tier: 2 },
  { from: 'risk-ellentmondas', to: 'proc-incidensrogzites', kind: 'exposure', tier: 2 },
  { from: 'risk-ellentmondas', to: 'sys-email', kind: 'exposure', tier: 2 },
];

/* ------------------------------------------------------------------ layout */

/**
 * Deterministic hash → [0, 1). Node positions must be identical on server and
 * client (no hydration drift) and stable across renders, so no Math.random.
 */
function seed(id: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift finalise, then map to [0, 1)
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

export interface PositionedNode extends ModelNode {
  /** Normalised model space: x, y ∈ [-1, 1] · z ∈ [-1, 1], +z toward camera. */
  x: number;
  y: number;
  z: number;
  /**
   * Abstract start position: where the node sits before the model assembles.
   * The hero opens here — an undifferentiated point cloud — and resolves into
   * (x, y, z) as the story explains what the points are.
   */
  ax: number;
  ay: number;
  az: number;
  /** Arrival offset in [0, 1); staggers assembly so nodes don't land in unison. */
  delay: number;
  /** Per-node phase so pulses and drift never move in lockstep. */
  phase: number;
}

/**
 * Places each node around its organisational cluster. The angle and radius come
 * from the id hash, so the layout reads as organic rather than gridded while
 * staying byte-identical between renders. Depth comes from the layer, which is
 * what makes the graph legible: switching layers changes what is in focus.
 */
function layout(nodes: readonly ModelNode[]): PositionedNode[] {
  const depthByLayer = new Map(LAYERS.map((l) => [l.id, l.depth]));

  return nodes.map((node) => {
    const cluster = CLUSTERS[node.cluster];
    const angle = seed(node.id, 1) * Math.PI * 2;
    // sqrt keeps nodes from bunching in the cluster centre.
    const radius = Math.sqrt(0.18 + seed(node.id, 2) * 0.82) * cluster.radius;
    const baseDepth = depthByLayer.get(node.layer) ?? 0;

    // Abstract cloud: a wide, shallow, layer-agnostic scatter. Deliberately
    // uninformative — at this stage the points carry no meaning yet.
    const aAngle = seed(node.id, 5) * Math.PI * 2;
    const aRadius = 0.35 + seed(node.id, 6) * 0.72;

    return {
      ...node,
      x: cluster.x + Math.cos(angle) * radius,
      // Vertical squash: the model reads as a wide field, not a ball.
      y: cluster.y + Math.sin(angle) * radius * 0.78,
      z: baseDepth + (seed(node.id, 3) - 0.5) * 0.22,
      ax: Math.cos(aAngle) * aRadius * 1.15,
      ay: Math.sin(aAngle) * aRadius * 0.92,
      az: (seed(node.id, 7) - 0.5) * 1.5,
      delay: seed(node.id, 8) * 0.4,
      phase: seed(node.id, 4) * Math.PI * 2,
    };
  });
}

export const POSITIONED_NODES: readonly PositionedNode[] = layout(NODES);

export const NODE_BY_ID: ReadonlyMap<string, PositionedNode> = new Map(
  POSITIONED_NODES.map((n) => [n.id, n]),
);

/* ------------------------------------------------------------------ queries */

export function nodeLabel(id: string): string {
  return NODE_BY_ID.get(id)?.label ?? id;
}

/** Neighbour ids of `id`, optionally restricted to one layer. */
export function neighbours(id: string, layer?: LayerId): string[] {
  const out = new Set<string>();
  for (const e of EDGES) {
    const other = e.from === id ? e.to : e.to === id ? e.from : null;
    if (other === null) continue;
    if (layer && NODE_BY_ID.get(other)?.layer !== layer) continue;
    out.add(other);
  }
  return [...out];
}

/** Degree of a node — used to scale its visual weight in the graph. */
export function degree(id: string): number {
  let d = 0;
  for (const e of EDGES) {
    if (e.from === id || e.to === id) d += 1;
  }
  return d;
}

export const MAX_DEGREE: number = POSITIONED_NODES.reduce(
  (max, n) => Math.max(max, degree(n.id)),
  1,
);

export const CERTAINTY_LABEL: Record<Certainty, string> = {
  high: 'magas',
  medium: 'közepes',
  low: 'alacsony',
};

export const SIGNAL_LABEL: Record<SignalId, string> = {
  gap: 'Hiányosság',
  conflict: 'Konfliktus',
  risk: 'Kockázat',
  loss: 'Veszteség',
};
