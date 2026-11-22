export type Dim = "hf" | "fs" | "hp" | "hc";

export const DIMS: Dim[] = ["hf", "fs", "hp", "hc"];

/** View-mode metric suffixes, as named in the payload */
export type Metric = "value" | "_che" | "_gdp" | "_usd" | "_usd2023" | "_usd_pc" | "_usd2023_pc";
/** HC government / private cross-tab metrics (NCU millions) */
export type CrosstabMetric = "_gghed" | "_pvtd";

export const METRICS: Metric[] = [
  "value",
  "_che",
  "_gdp",
  "_usd",
  "_usd2023",
  "_usd_pc",
  "_usd2023_pc",
];

export type Values = Array<number | null>;

export type DimensionData = {
  /** Years with data for this country, ascending */
  years: number[];
  /** Fewer years than this and the tab shows a notice instead of charts */
  min_years: number;
  /** Codes with data, in classification order */
  codes: string[];
  /** Aggregation level -> codes whose values sum to the total at that level */
  levels: Record<string, string[]>;
  /** Deepest complete breakdown, used for composition charts */
  leaf: string[];
  has_crosstab: boolean;
  /** Metric -> code -> values aligned with `years` */
  values: Partial<Record<Metric | CrosstabMetric, Record<string, Values>>>;
};

export const SDG382_COMPONENTS = ["total", "large", "impoverishing"] as const;
export type Sdg382Component = (typeof SDG382_COMPONENTS)[number];

export type CountryPayload = {
  country: { code: string; name: string };
  dims: Record<Dim, DimensionData | null>;
  /** [year, OOP % of CHE] */
  oop_share: Array<[number, number]>;
  /** SDG 3.8.2, 2015 definition: [survey year, threshold ("10%" | "25%"), % of population] */
  sdg382: Array<[number, string, number]>;
  /** SDG 3.8.2, 2025 definition: [survey year, component, % of population] */
  sdg382_2025: Array<[number, Sdg382Component, number]>;
  /** SDG 3.8.1 UHC service coverage index: [year, index 0-100] */
  uhc_sci: Array<[number, number]>;
  /** [year, CHE per capita (USD), OOP % of CHE] */
  transition: Array<[number, number, number]>;
};

/** One SHA 2011 code: parent is null at level 1; sha is the official notation (HF.1.nec) */
export type HierarchyEntry = { code: string; parent: string | null; sha: string };

export type SharedPayload = {
  /** Publication date of the GHED edition (YYYY-MM-DD or YYYY-MM), when the exporter provides it */
  data_last_updated?: string;
  countries: Array<{ code: string; name: string }>;
  /** Every code of each dimension, in classification order */
  hierarchy: Record<Dim, HierarchyEntry[]>;
  asean: Record<string, { name: string; transition: Array<[number, number, number]> }>;
  /** SDG 3.8.1 in sci_year against each country's latest SDG 3.8.2 (2025 definition):
   * points are [iso3, service coverage index, % of population, survey year] */
  uhc_scatter: { sci_year: number; points: Array<[string, number, number, number]> };
};
