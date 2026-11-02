/** Per-row status from the pipeline, anchored to the latest Budget year */
export type Status = "actual" | "revised_estimate" | "budget_estimate" | "projection";

export type Series = Array<number | null>;

export type FiscalData = {
  /** Epoch millis of 1 Jan of each year in `years` */
  x: number[];
  years: number[];
  /** Indicator -> values aligned with `x`, in source units (RM million, %, RM per person) */
  series: Record<string, Series>;
  kpi: Record<string, { year: number; value: number; status: Status }>;
  /** First year the source marks as an IMF WEO projection */
  imf_projection_from: number;
};

export type BudgetAllocData = {
  /** Budget years, each with its own original allocation */
  years: number[];
  /** budget_alloc_* indicator -> values aligned with `years` (RM million or %) */
  series: Record<string, Series>;
  /** How far the revised estimate for the year before the last Budget moved federal OE */
  revision: { year: number; revised_oe: number; original_oe: number } | null;
};

export type GhedData = {
  /** GGHE-D as % of GGE, per ASEAN member */
  priority: { x: number[]; series: Record<string, Series> };
  /** Year -> [country code, GDP per capita (USD), CHE per capita (USD)] */
  scatter: Record<string, Array<[string, number, number]>>;
  countries: Record<string, { name: string; income: string | null }>;
};

export type FiscalPayload = {
  data_last_updated: string;
  fiscal: FiscalData;
  budget_alloc: BudgetAllocData;
  ghed: GhedData;
};
