export type Series = Array<number | null>;

/** Objek Am codes, in the order of every `oa_*` array */
export const OBJEK_AM = ["10000", "20000", "30000", "40000", "50000"] as const;

export type OeRow = {
  /** Programme (xx0000) or activity (xxyy00) code, in the numbering of that Budget's book */
  code: string;
  /** Canonical programme key; codes were renumbered in Budget 2018 and 2019 */
  programme: string;
  level: "programme" | "activity";
  /** Name as printed (Malay) */
  name: string;
  /** Previous year's original estimate ("Anggaran N-1"), regrouped in this book's structure */
  prev: number;
  /** This Budget's estimate */
  cur: number;
  oa_prev: number[];
  oa_cur: number[];
  /**
   * Posts as printed [N-1 column, N]; on activities and programmes. From Budget 2015 the book's
   * N-1 column repeats year N, so only the second value is meaningful.
   */
  posts: [number, number] | null;
  /**
   * The previous Budget's posts for this row, from the previous book's year-N column (activities
   * matched by name). Null when there is no previous book or no matching row.
   */
  posts_prev_book: number | null;
};

export type DeColumns = {
  cost: number;
  actual: number;
  revised: number;
  direct: number;
  loan: number;
};

export type DeProject = DeColumns & { code: string; name: string };

export type Book = {
  oe: {
    total_prev: number;
    total_cur: number;
    /** As OeRow.posts: only the second value is meaningful */
    posts: [number, number] | null;
    rows: OeRow[];
  };
  de: {
    /** Period of the actual-expenditure column: a year, or a span such as "2011-2015" */
    actual_period: string | null;
    revised_year: number;
    total: DeColumns | null;
    /** Adjustment row printed in some books (Budget 2022) */
    adjustment: DeColumns | null;
    projects: DeProject[];
  };
};

export type Source = {
  budget_year: number;
  part: string;
  url: string;
  sha256: string;
  extraction: "text" | "ocr";
};

/** The whole payload as the pipeline writes it */
export type MohBudgetPayload = {
  data_last_updated: string;
  years: number[];
  ministry: {
    oe: Series;
    oe_restated: Series;
    posts: Series;
    de: Series;
    /** Actual spending in RM, from each book's first-page chart (printed in RM million) */
    oe_actual: Series;
    de_actual: Series;
  };
  oe_by_objek_am: Record<(typeof OBJEK_AM)[number], Series>;
  /** DE estimate by Objek Am (DE has no emoluments or other expenditure) */
  de_by_objek_am: Record<"20000" | "30000" | "40000", Series>;
  programmes: Record<string, Series>;
  /** Posts (each book's year-N column) by programme; only programmes that print posts */
  posts_by_programme: Record<string, Series>;
  /** Emoluments (Objek Am 10000) estimate by programme */
  emoluments_by_programme: Record<string, Series>;
  books: Record<string, Book>;
  sources: Source[];
  /** Budget years whose printed totals differ by RM1 from the sum of their rows */
  source_rounding: number[];
  /** OCR misreads corrected after checking the page image */
  ocr_corrections: number;
  /** Chart labels OCR missed, filled after checking the page image */
  chart_corrections: number;
  source_differences: SourceDifferences;
};

/** Facts behind the differences between official figures, found by the pipeline */
export type SourceDifferences = {
  /** A DE estimate the next book prints differently from the tabled one */
  de_restated: Array<{
    year: number;
    tabled: number;
    restated: number;
    /** Objek Am code -> [tabled, restated], for the codes that differ */
    objek_am: Record<string, [number, number]>;
  }>;
  /** An actual (RM million, from the charts) equal to the estimate tabled for that year */
  actual_equals_estimate: Array<{
    year: number;
    measure: "oe" | "de";
    actual_mil: number;
    estimate: number;
    books: number[];
  }>;
  /** From this book on, the previous-year posts column repeats the Budget year */
  posts_repeated: { from_book: number; year: number; tabled: number; printed: number } | null;
  /** The largest regrouping of a programme's previous-year figure */
  programme_restated: {
    book: number;
    year: number;
    programme: string;
    tabled: number;
    restated: number;
  } | null;
  /** P.42's actual column against the chart's actual DE for the same year */
  p42_actual_vs_chart: Array<{
    book: number;
    year: number;
    p42_actual: number;
    chart_actual_mil: number;
  }>;
};

/** The few facts about every book that the sources table notes, keyed by Budget year */
export type BookFacts = {
  actual_period: string | null;
  /** Revised column of the adjustment row and of the P.42 total, when the book prints one */
  adjustment_revised: number | null;
  total_revised: number | null;
};

/** What one page receives: the series, plus the book of the Budget year shown */
export type MohBudgetProps = Omit<MohBudgetPayload, "books"> & {
  budget_years: number[];
  budget_year: number;
  book: Book;
  book_facts: Record<string, BookFacts>;
};
