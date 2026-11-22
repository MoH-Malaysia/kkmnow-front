import {
  AgencyBadge,
  At,
  Card,
  Container,
  Dropdown,
  Hero,
  Section,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import AgencyIcon from "datagovmy-ui/icons/agency";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo, useState } from "react";
import { lineLegend, yearAxis } from "@components/Charts/axis";
import { CATEGORICAL, colorScale, hierarchy } from "@dashboards/sha-2011/colors";
import { ERROR_REPORT_CONTACT, PUBLISHER_URL } from "@lib/contact";
import { dateFormat } from "@lib/locales";
import { routes } from "@lib/routes";
import { MohBudgetProps, OBJEK_AM, OeRow, Series } from "./types";

/**
 * MoH Budget Dashboard
 * @overview Status: In-development. The Ministry of Health's operating (B.42) and development
 * (P.42) estimates by programme, activity and project group, and its actual spending, from MoF's
 * annual Budget books.
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Treemap = dynamic(() => import("./treemap"), { ssr: false });

// The fiscal and SHA 2011 dashboards' palette. As on the fiscal page, OE takes the first hue and
// DE the third; Objek Am codes keep one hue each in the OE and DE charts.
const OE_HUE = 0;
const DE_HUE = 2;
const DASH = [6, 4];
/** Family code that colorScale draws in grey: the programmes folded into "other" */
const OTHER = "othernec";

/**
 * Diverging steps for year-on-year change: red arm (cuts), grey midpoint, blue arm (increases).
 * Each arm passes the ordinal checks (one hue, monotone lightness, light end >= 2:1 on the
 * surface); on dark the arms run the other way, so small changes stay dim.
 */
const CHANGE_BINS = [-25, -10, -3, 3, 10, 25];
const CHANGE_COLORS = {
  light: ["#a52323", "#d9473f", "#ee918a", "#b3b1aa", "#86b6ef", "#3987e5", "#1c5cab"],
  dark: ["#ee918a", "#d24840", "#8f2222", "#5a5a54", "#184f95", "#3987e5", "#86b6ef"],
};
/** Index into CHANGE_COLORS for a change from a to b; a new item (a = 0) takes the top step */
const changeBin = (a: number, b: number) => {
  if (a === 0) return CHANGE_BINS.length;
  const pct = (b / a - 1) * 100;
  const i = CHANGE_BINS.findIndex(edge => pct <= edge);
  return i === -1 ? CHANGE_BINS.length : i;
};

/** Programmes drawn on their own, in palette order; the rest are folded into "other" (grey) */
const MAIN_PROGRAMMES = [
  "medical",
  "public_health",
  "special",
  "management",
  "new_policy",
  "financial_commitment",
];
/** The treemap also shows Oral Health on its own, in its Posts-chart hue (the next one along) */
const TREEMAP_PROGRAMMES = [...MAIN_PROGRAMMES, "oral_health"];

/**
 * Programmes drawn on their own in the posts charts, with their hue: the overview's where the
 * programme has one there, the palette's seventh for Oral Health; the rest are "other" (grey)
 */
const POSTS_PROGRAMMES: Array<[string, number]> = [
  ["medical", 0],
  ["public_health", 1],
  ["oral_health", 6],
  ["management", 3],
];
/**
 * Programme lines in the emoluments-per-post chart. Management is left out: its Finance activity
 * prints large emoluments with few posts (see notes.emoluments_per_post).
 */
const PER_POST_PROGRAMMES = ["medical", "public_health", "oral_health"];
/** Activities in the chart of the largest changes in posts */
const POSTS_TOP = 10;

/** Fixed notes on particular books, shown in the sources table */
const BOOK_NOTES: Record<number, string[]> = {
  2018: ["book_notes.de_objek_am_2018"],
  2023: ["book_notes.retabled_2023"],
};

const epoch = (year: number) => Date.UTC(year, 0, 1);
const billion = (v: number | null) => (v === null ? null : v / 1e9);
const rmB = (v: number) => `RM ${numFormat(v / 1e9, "standard", [1, 1])}B`;
const rmM = (v: number) => numFormat(v / 1e6, "standard", [1, 1]);
const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "");
/** A signed count, e.g. +1,234 or −56 */
const signed = (v: number) => `${sign(v)}${numFormat(Math.abs(v), "standard")}`;
const pctOf = (v: number, total: number) =>
  total ? `${numFormat((v / total) * 100, "standard", [1, 1])}%` : "–";
/** Change from a to b; `added` labels an item that had nothing in the earlier year */
const pctChange = (a: number, b: number, added: string) =>
  a === 0
    ? b === 0
      ? "–"
      : added
    : `${sign(b - a)}${numFormat(Math.abs((b / a - 1) * 100), "standard", [1, 1])}%`;

const MohBudgetDashboard: FunctionComponent<MohBudgetProps> = ({
  data_last_updated,
  years,
  ministry,
  oe_by_objek_am,
  de_by_objek_am,
  programmes,
  posts_by_programme,
  emoluments_by_programme,
  sources,
  source_rounding,
  source_differences,
  budget_years,
  budget_year,
  book,
  book_facts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-moh-budget", "common"]);
  const { theme } = useTheme();
  const router = useRouter();
  const dark = theme === "dark";
  const C = CATEGORICAL[dark ? "dark" : "light"];
  const ink = dark ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK;
  const [query, setQuery] = useState("");
  const change = (a: number, b: number) => pctChange(a, b, t("new"));
  const [colourBy, setColourBy] = useState(0); // 0 programme, 1 change
  const [sizeBy, setSizeBy] = useState(0); // 0 allocation, 1 posts

  const first = budget_years[0];
  const last = budget_years[budget_years.length - 1];
  // Series are indexed on `years`; charts show the Budget years, and the estimate charts also the
  // year before the first book, which that book prints in its N-1 column
  const at = (s: Series, ys = budget_years) => ys.map(y => s[years.indexOf(y)] ?? null);
  const labels = budget_years.map(epoch);
  const before = first - 1;
  const estimateYears =
    (ministry.oe[years.indexOf(before)] ?? null) === null
      ? budget_years
      : [before, ...budget_years];
  const estimateSpan = { from: estimateYears[0], to: last };

  const common = {
    className: "h-[350px] w-full",
    interval: "year" as const,
    round: "year" as const,
    enableLegend: true,
    ...yearAxis,
    prefixY: "RM ",
    unitY: "B",
    precision: [1, 0] as [number, number],
  };
  const bars = (
    items: Array<{ label: string; data: Series; color: string }>,
    ys: number[] = budget_years
  ) => ({
    labels: ys.map(epoch),
    datasets: items.map(item => ({
      type: "bar" as const,
      label: item.label,
      data: at(item.data, ys).map(billion),
      backgroundColor: item.color,
      borderWidth: 0,
    })),
  });

  const totals = bars(
    [
      { label: t("series.oe"), data: ministry.oe, color: C[OE_HUE] },
      { label: t("series.de"), data: ministry.de, color: C[DE_HUE] },
    ],
    estimateYears
  );
  const objekAm = bars(
    OBJEK_AM.map((k, i) => ({
      label: t(`objek_am.${k}`),
      data: oe_by_objek_am[k],
      color: C[i],
    })),
    estimateYears
  );
  const deObjekAm = bars(
    (Object.keys(de_by_objek_am) as Array<keyof typeof de_by_objek_am>).map(k => ({
      label: t(`objek_am.${k}`),
      data: de_by_objek_am[k],
      color: C[OBJEK_AM.indexOf(k)],
    })),
    estimateYears
  );

  // Actual spending (each book's first-page chart) against the estimate tabled for that year
  const actualYears = years.filter(
    (_, i) =>
      ministry.oe_actual[i] !== null || ministry.oe[i] !== null || ministry.oe_restated[i] !== null
  );
  const vsActual = (actual: Series, estimate: Series, hue: number) => ({
    labels: actualYears.map(epoch),
    datasets: [
      {
        type: "bar" as const,
        label: t("series.actual"),
        data: actualYears.map(y => billion(actual[years.indexOf(y)])),
        backgroundColor: C[hue],
        borderWidth: 0,
      },
      {
        type: "line" as const,
        label: t("series.estimate"),
        data: actualYears.map(y => billion(estimate[years.indexOf(y)])),
        borderColor: ink,
        backgroundColor: ink,
        borderDash: DASH,
        borderWidth: 1.5,
        pointRadius: 2,
        fill: false,
      },
    ],
  });
  const oeVsActual = vsActual(ministry.oe_actual, ministry.oe, OE_HUE);
  const deVsActual = vsActual(ministry.de_actual, ministry.de, DE_HUE);
  const actualSpan = { from: actualYears[0], to: actualYears[actualYears.length - 1] };
  const byProgramme = (() => {
    const other = years.map((_, i) =>
      Object.entries(programmes)
        .filter(([k]) => !MAIN_PROGRAMMES.includes(k))
        .reduce<number | null>((sum, [, s]) => (s[i] === null ? sum : (sum ?? 0) + s[i]!), null)
    );
    return bars([
      ...MAIN_PROGRAMMES.map((k, i) => ({
        label: t(`programmes.${k}`),
        data: programmes[k] ?? years.map(() => null),
        color: C[i],
      })),
      { label: t("programmes.other"), data: other, color: AKSARA_COLOR.GREY },
    ]);
  })();
  // Posts: each book's year-N column, by programme; changes are between books
  const postsAt = (s: Series | undefined, y: number) => s?.[years.indexOf(y)] ?? null;
  const postGroups = [
    ...POSTS_PROGRAMMES.map(([k, hue]) => ({
      label: t(`programmes.${k}`),
      value: (y: number) => postsAt(posts_by_programme[k], y),
      color: C[hue],
    })),
    {
      label: t("programmes.other"),
      value: (y: number) =>
        Object.entries(posts_by_programme)
          .filter(([k]) => !POSTS_PROGRAMMES.some(([p]) => p === k))
          .reduce<number | null>((sum, [, s]) => {
            const v = postsAt(s, y);
            return v === null ? sum : (sum ?? 0) + v;
          }, null),
      color: AKSARA_COLOR.GREY,
    },
  ];
  const postsByProgramme = {
    labels,
    datasets: postGroups.map(g => ({
      type: "bar" as const,
      label: g.label,
      data: budget_years.map(g.value),
      backgroundColor: g.color,
      borderWidth: 0,
    })),
  };
  // A programme with no posts in one of the two years counts as 0 there
  const changeYears = budget_years.slice(1);
  const postsChange = {
    labels: changeYears.map(epoch),
    datasets: [
      ...postGroups.map(g => ({
        type: "bar" as const,
        label: g.label,
        data: changeYears.map(y => (g.value(y) ?? 0) - (g.value(y - 1) ?? 0)),
        backgroundColor: g.color,
        borderWidth: 0,
        stack: "programmes",
      })),
      {
        type: "line" as const,
        label: t("series.net_change"),
        data: changeYears.map(
          y => (postsAt(ministry.posts, y) ?? 0) - (postsAt(ministry.posts, y - 1) ?? 0)
        ),
        borderColor: dark ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
        backgroundColor: ink,
        showLine: false,
        pointRadius: 4.5,
        pointBorderWidth: 1.5,
        pointHoverRadius: 5.5,
        stack: "net",
      },
    ],
  };
  const perPost = (emoluments: Series | undefined, posts: Series | undefined) =>
    budget_years.map(y => {
      const e = postsAt(emoluments, y);
      const n = postsAt(posts, y);
      return e === null || !n ? null : e / n;
    });
  const emolumentsPerPost = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: t("series.ministry"),
        data: perPost(oe_by_objek_am["10000"], ministry.posts),
        borderColor: ink,
        backgroundColor: ink,
        borderWidth: 2,
        pointRadius: 0,
      },
      ...PER_POST_PROGRAMMES.map(k => {
        const hue = C[POSTS_PROGRAMMES.find(([p]) => p === k)![1]];
        return {
          type: "line" as const,
          label: t(`programmes.${k}`),
          data: perPost(emoluments_by_programme[k], posts_by_programme[k]),
          borderColor: hue,
          backgroundColor: hue,
          borderWidth: 2,
          pointRadius: 0,
        };
      }),
    ],
  };
  const postsLast = postsAt(ministry.posts, last) ?? 0;
  const postsPrev = postsAt(ministry.posts, last - 1) ?? 0;
  const postsFirst = postsAt(ministry.posts, first) ?? 0;
  const emolPerPostLast = perPost(oe_by_objek_am["10000"], ministry.posts)[budget_years.length - 1];

  // Activity table: programme rows with their activities beneath, filtered by name or code
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return book.oe.rows;
    const hits = new Set(
      book.oe.rows
        .filter(
          r =>
            r.name.toLowerCase().includes(q) ||
            r.code.includes(q) ||
            (r.level === "programme" && t(`programmes.${r.programme}`).toLowerCase().includes(q))
        )
        .map(r => r.code)
    );
    return book.oe.rows.filter(
      r =>
        hits.has(r.code) ||
        (r.level === "programme" &&
          book.oe.rows.some(
            a =>
              a.level === "activity" &&
              a.code.slice(0, 2) === r.code.slice(0, 2) &&
              hits.has(a.code)
          ))
    );
  }, [book, query, t]);

  const emolShare = (r: OeRow) =>
    r.cur ? `${numFormat((r.oa_cur[0] / r.cur) * 100, "standard", [0, 0])}%` : "–";
  const latest = (s: Series) => s[years.indexOf(last)];
  // Date line under each KPI, as on the fiscal page: "2027 · budget estimate"
  const kpiWhen = t("kpi_when", { year: last });
  const de = book.de;

  // Treemap of this book's activities, grouped by programme
  const activities = book.oe.rows.filter(r => r.level === "activity");
  const changeColors = CHANGE_COLORS[theme === "dark" ? "dark" : "light"];
  const byCode = Object.fromEntries(activities.map(r => [r.code, r]));
  const postsDelta = (r: { posts: [number, number] | null; posts_prev_book: number | null }) =>
    r.posts_prev_book === null ? null : (r.posts?.[1] ?? 0) - r.posts_prev_book;
  // Largest changes in posts from the previous book, for activities matched to it
  const postMoves = activities
    .map(r => ({ r, d: postsDelta(r) }))
    .filter((x): x is { r: OeRow; d: number } => x.d !== null && x.d !== 0)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
    .slice(0, POSTS_TOP);
  const postMovesMax = Math.max(1, ...postMoves.map(x => Math.abs(x.d)));
  const postMovesCut = postMoves.some(x => x.d < 0);
  // Box size; posts use the year-N column only (the book's N-1 posts column repeats year N)
  const size = (r: OeRow) => (sizeBy === 0 ? r.cur : r.posts?.[1] ?? 0);
  // Colours as on the SHA 2011 treemaps: hue by programme (the overview chart's), siblings
  // stepped lighter and darker around it, the folded programmes in grey
  const family = (key: string) => (TREEMAP_PROGRAMMES.includes(key) ? key : OTHER);
  const tree = hierarchy([
    ...TREEMAP_PROGRAMMES.map(k => ({ code: k, parent: null, sha: k })),
    { code: OTHER, parent: null, sha: OTHER },
    ...Array.from(new Set(activities.map(r => r.programme)))
      .filter(k => family(k) === OTHER)
      .map(k => ({ code: k, parent: OTHER, sha: k })),
    ...activities.map(r => ({ code: r.code, parent: r.programme, sha: r.code })),
  ]);
  const boxes = activities.filter(r => size(r) > 0);
  const shade = colorScale(
    tree,
    boxes.map(r => r.code),
    dark
  );
  const programmeColor = (key: string) => shade(family(key));
  const treemap = {
    rows: boxes.map(r => ({ group: r.programme, key: r.code, value: size(r) })),
    // Change is always in the estimate: the books print no previous-year posts to compare with
    color: (code: string) => {
      const r = byCode[code];
      return colourBy === 0 ? shade(code) : changeColors[changeBin(r.prev, r.cur)];
    },
    groupColor: (key: string) => (colourBy === 0 ? programmeColor(key) : changeColors[3]),
    groupLabel: (key: string) => t(`programmes.${key}`),
    label: (code: string) => byCode[code].name,
    tooltip: (code: string, share: string) => {
      const r = byCode[code];
      return [
        `${t("treemap.allocation", { year: budget_year })}: ${t("rm_million", {
          amount: rmM(r.cur),
        })} (${sizeBy === 0 ? share : pctOf(r.cur, book.oe.total_cur)})`,
        `${t("treemap.change", { year: budget_year - 1 })}: ${change(r.prev, r.cur)}`,
        `${t("oe_table.emoluments")}: ${emolShare(r)}`,
        `${t("treemap.posts", { year: budget_year })}: ${
          r.posts ? numFormat(r.posts[1], "standard") : "–"
        }`,
        `${t("oe_table.code")}: ${r.code}`,
      ];
    },
  };
  const changeLegend = changeColors.map((color, i) => ({
    color,
    label:
      i === 0
        ? `≤ −${-CHANGE_BINS[0]}%`
        : i === changeColors.length - 1
          ? `> +${CHANGE_BINS[CHANGE_BINS.length - 1]}% ${t("treemap.or_new")}`
          : i === 3
            ? `±${CHANGE_BINS[3]}%`
            : t("treemap.range", {
                from: `${CHANGE_BINS[i - 1] > 0 ? "+" : "−"}${Math.abs(CHANGE_BINS[i - 1])}`,
                to: `${CHANGE_BINS[i] > 0 ? "+" : "−"}${Math.abs(CHANGE_BINS[i])}%`,
              }),
  }));
  const programmeLegend = [
    ...TREEMAP_PROGRAMMES.filter(k => boxes.some(r => r.programme === k)).map(k => ({
      color: programmeColor(k),
      label: t(`programmes.${k}`),
    })),
    ...(boxes.some(r => !TREEMAP_PROGRAMMES.includes(r.programme))
      ? [{ color: AKSARA_COLOR.GREY, label: t("programmes.other") }]
      : []),
  ];
  /** Notes on the sources that hold for every year, in reading order */
  const notes = [
    "estimates_actuals",
    "fiscal",
    "previous_year",
    "programmes",
    "posts",
    "emoluments_per_post",
    "development",
    "p42_actual",
    "geography",
  ];

  /** Notes on one book: what it alone prints, or what this page takes from it */
  const bookNotes = (year: number) => {
    const facts = book_facts[String(year)];
    const restated = source_differences.de_restated.find(d => d.year + 1 === year);
    return [
      ...(year === first && estimateYears[0] < first
        ? [t("book_notes.first_book", { year, prev: before })]
        : []),
      ...(restated
        ? [
            t("book_notes.de_restated", {
              year: restated.year,
              tabled: numFormat(restated.tabled / 1e6, "standard", [2, 2]),
              restated: numFormat(restated.restated / 1e6, "standard", [2, 2]),
            }),
          ]
        : []),
      ...(facts?.actual_period?.includes("-")
        ? [t("book_notes.cumulative", { period: facts.actual_period })]
        : []),
      ...(facts?.adjustment_revised && facts.total_revised
        ? [
            t("book_notes.adjustment", {
              revised: year - 1,
              total: numFormat(facts.total_revised / 1e6, "standard", [2, 2]),
              rows: numFormat(
                (facts.total_revised - facts.adjustment_revised) / 1e6,
                "standard",
                [2, 2]
              ),
            }),
          ]
        : []),
      ...(source_rounding.includes(year) ? [t("book_notes.rounding")] : []),
      ...(BOOK_NOTES[year] ?? []).map(key => t(key)),
    ];
  };

  const books = Array.from(new Set(sources.map(s => s.budget_year))).map(
    year => [year, sources.filter(s => s.budget_year === year)] as const
  );

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.public_finances"), "text-primary"]}
        header={[t("header")]}
        description={[t("description", { from: first, to: last }), "text-dim"]}
        action={
          <p className="text-dim text-sm">
            {t("common:common.last_updated", {
              date: toDate(data_last_updated, dateFormat(i18n.language), i18n.language),
            })}
          </p>
        }
        agencyBadge={
          <AgencyBadge
            name={t("publisher")}
            url={PUBLISHER_URL}
            icon={<AgencyIcon agency="moh" />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* 1. Ministry totals over time */}
        <Section
          title={t("section_overview.title")}
          description={t("section_overview.description")}
        >
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: t("kpi.oe"), value: rmB(latest(ministry.oe) ?? 0) },
              { label: t("kpi.de"), value: rmB(latest(ministry.de) ?? 0) },
              {
                label: t("kpi.total"),
                value: rmB((latest(ministry.oe) ?? 0) + (latest(ministry.de) ?? 0)),
              },
              { label: t("kpi.posts"), value: numFormat(latest(ministry.posts) ?? 0, "standard") },
            ].map(k => (
              <Card key={k.label} className="p-4">
                <p className="text-dim text-sm">{k.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums dark:text-white">{k.value}</p>
                <p className="text-dim mt-1 text-xs">{kpiWhen}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              {...common}
              mode="stacked"
              title={t("charts.totals", estimateSpan)}
              description={t("charts.totals_note")}
              data={totals}
            />
            <Timeseries
              {...common}
              mode="stacked"
              title={t("charts.programmes", { from: first, to: last })}
              description={t("charts.programmes_note")}
              data={byProgramme}
            />
            {[
              { key: "oe_actual", data: oeVsActual },
              { key: "de_actual", data: deVsActual },
            ].map(({ key, data }) => (
              <Timeseries
                key={key}
                {...common}
                generateLabels={lineLegend}
                title={t(`charts.${key}`, actualSpan)}
                description={t(`charts.${key}_note`, actualSpan)}
                data={data}
              />
            ))}
            <Timeseries
              {...common}
              mode="stacked"
              title={t("charts.objek_am", estimateSpan)}
              description={t("charts.objek_am_note")}
              data={objekAm}
            />
            <Timeseries
              {...common}
              mode="stacked"
              title={t("charts.de_objek_am", estimateSpan)}
              description={t("charts.de_objek_am_note")}
              data={deObjekAm}
            />
          </div>
        </Section>

        {/* 2. Posts funded */}
        <Section title={t("section_posts.title")} description={t("section_posts.description")}>
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: t("kpi.posts"),
                value: numFormat(postsLast, "standard"),
              },
              {
                label: t("kpi.posts_change", { year: last - 1 }),
                value: `${signed(postsLast - postsPrev)} (${pctChange(postsPrev, postsLast, "–")})`,
              },
              {
                label: t("kpi.posts_change", { year: first }),
                value: `${signed(postsLast - postsFirst)} (${pctChange(postsFirst, postsLast, "–")})`,
              },
              {
                label: t("kpi.emoluments_per_post"),
                value:
                  emolPerPostLast === null ? "–" : `RM ${numFormat(emolPerPostLast, "standard")}`,
              },
            ].map(k => (
              <Card key={k.label} className="p-4">
                <p className="text-dim text-sm">{k.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums dark:text-white">{k.value}</p>
                <p className="text-dim mt-1 text-xs">{kpiWhen}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              {...common}
              mode="stacked"
              prefixY=""
              unitY=""
              precision={[0, 0]}
              title={t("charts.posts_programmes", { from: first, to: last })}
              description={t("charts.posts_note")}
              data={postsByProgramme}
            />
            <Timeseries
              {...common}
              mode="stacked"
              prefixY=""
              unitY=""
              precision={[0, 0]}
              title={t("charts.posts_change", { from: changeYears[0], to: last })}
              description={t("charts.posts_change_note")}
              data={postsChange}
            />
            <div className="lg:col-span-2">
              <Timeseries
                {...common}
                mode="grouped"
                generateLabels={lineLegend}
                unitY=""
                precision={[0, 0]}
                title={t("charts.emoluments_per_post", { from: first, to: last })}
                description={t("charts.emoluments_per_post_note")}
                data={emolumentsPerPost}
              />
            </div>
          </div>
        </Section>

        {/* 3. One Budget book in detail */}
        <Section
          title={t("section_book.title", { year: budget_year })}
          description={t("section_book.description", { year: budget_year })}
          menu={
            <Dropdown
              anchor="right"
              width="w-fit"
              options={[...budget_years]
                .reverse()
                .map(y => ({ label: t("budget_year", { year: y }), value: String(y) }))}
              selected={{
                label: t("budget_year", { year: budget_year }),
                value: String(budget_year),
              }}
              onChange={e =>
                router.push(`${routes.MOH_BUDGET}/${e.value}`, undefined, {
                  scroll: false,
                  locale: i18n.language,
                })
              }
            />
          }
        >
          <div className="mb-12 flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h5>
                {t(sizeBy === 0 ? "treemap.title" : "treemap.title_posts", { year: budget_year })}
              </h5>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-dim">{t("treemap.size")}</span>
                <Tabs.List
                  options={[t("treemap.size_allocation"), t("treemap.size_posts")]}
                  current={sizeBy}
                  onChange={setSizeBy}
                />
                <span className="text-dim">{t("treemap.colour")}</span>
                <Tabs.List
                  options={[t("treemap.colour_programme"), t("treemap.colour_change")]}
                  current={colourBy}
                  onChange={setColourBy}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {(colourBy === 0 ? programmeLegend : changeLegend).map(item => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
            <Treemap {...treemap} />
            <p className="text-dim text-sm">
              {t(colourBy === 0 ? "treemap.note" : "treemap.note_change", {
                year: budget_year,
                prev: budget_year - 1,
              })}
            </p>
          </div>

          {postMoves.length > 0 && (
            <div className="mb-12 flex flex-col gap-3">
              <h5>{t("posts_moves.title", { year: budget_year, prev: budget_year - 1 })}</h5>
              <div className="flex flex-col gap-2 text-sm">
                {postMoves.map(({ r, d }) => {
                  // Bars grow from the middle when some changes are cuts, else from the left
                  const width = (Math.abs(d) / postMovesMax) * (postMovesCut ? 50 : 100);
                  return (
                    <div
                      key={r.code}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_4.5rem] items-center gap-3 sm:grid-cols-[20rem_minmax(0,1fr)_5rem]"
                    >
                      <span className="leading-tight">{r.name}</span>
                      <span className="relative h-4">
                        {postMovesCut && (
                          <span className="bg-outline dark:bg-washed-dark absolute inset-y-0 left-1/2 w-px" />
                        )}
                        <span
                          className="absolute inset-y-0 rounded-sm"
                          style={{
                            background: changeColors[d > 0 ? 5 : 1],
                            width: `${width}%`,
                            left: !postMovesCut ? 0 : d > 0 ? "50%" : `${50 - width}%`,
                          }}
                        />
                      </span>
                      <span className="text-right tabular-nums">{signed(d)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-dim text-sm">
                {t("posts_moves.note", { year: budget_year, prev: budget_year - 1 })}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h5>{t("oe_table.title", { year: budget_year })}</h5>
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t("oe_table.search")}
                className="border-outline dark:border-washed-dark w-full rounded-md border bg-transparent px-3 py-1.5 text-sm sm:w-72"
              />
            </div>
            <p className="text-dim text-xs md:hidden">{t("table_scroll")}</p>
            <div className="max-h-[640px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-background dark:bg-black sticky top-0">
                  <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
                    <th className="py-2 pr-3 font-medium">{t("oe_table.code")}</th>
                    <th className="py-2 pr-3 font-medium">{t("oe_table.name")}</th>
                    <th className="px-3 py-2 text-right font-medium">
                      {t("oe_table.prev", { year: budget_year - 1 })}
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      {t("oe_table.cur", { year: budget_year })}
                    </th>
                    <th className="px-3 py-2 text-right font-medium">{t("oe_table.change")}</th>
                    <th className="px-3 py-2 text-right font-medium">{t("oe_table.emoluments")}</th>
                    <th className="px-3 py-2 text-right font-medium">
                      {t("oe_table.posts", { year: budget_year })}
                    </th>
                    {budget_year > first && (
                      <th className="py-2 pl-3 text-right font-medium">
                        {t("oe_table.posts_change", { year: budget_year - 1 })}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr
                      key={r.code}
                      className={
                        r.level === "programme"
                          ? "border-outline dark:border-washed-dark border-b font-semibold"
                          : "border-outline/50 dark:border-washed-dark/50 border-b"
                      }
                    >
                      <td className="py-1.5 pr-3 tabular-nums">{r.code}</td>
                      <td className={r.level === "activity" ? "py-1.5 pr-3 pl-4" : "py-1.5 pr-3"}>
                        {r.level === "programme" ? t(`programmes.${r.programme}`) : r.name}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{rmM(r.prev)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{rmM(r.cur)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {change(r.prev, r.cur)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{emolShare(r)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {r.posts ? numFormat(r.posts[1], "standard") : "–"}
                      </td>
                      {budget_year > first && (
                        <td className="py-1.5 pl-3 text-right tabular-nums">
                          {(() => {
                            const d = postsDelta(r);
                            return d === null || (d === 0 && !r.posts) ? "–" : signed(d);
                          })()}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {/* The total stays in view at the foot of the scroll box */}
                <tfoot className="bg-background sticky bottom-0 shadow-[inset_0_2px_0_0_#E2E8F0] dark:bg-black dark:shadow-[inset_0_2px_0_0_#27272A]">
                  <tr className="font-semibold">
                    <td />
                    <td className="py-2 pr-3">{t("oe_table.total")}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{rmM(book.oe.total_prev)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{rmM(book.oe.total_cur)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {change(book.oe.total_prev, book.oe.total_cur)}
                    </td>
                    <td />
                    <td className="px-3 py-2 text-right tabular-nums">
                      {book.oe.posts ? numFormat(book.oe.posts[1], "standard") : "–"}
                    </td>
                    {budget_year > first && (
                      <td className="py-2 pl-3 text-right tabular-nums">
                        {(() => {
                          const prev = postsAt(ministry.posts, budget_year - 1);
                          return book.oe.posts && prev !== null
                            ? signed(book.oe.posts[1] - prev)
                            : "–";
                        })()}
                      </td>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-dim text-sm">
              {t("oe_table.note", { year: budget_year, prev: budget_year - 1 })}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-3">
            <h5>{t("de_table.title", { year: budget_year })}</h5>
            <p className="text-dim text-xs md:hidden">{t("table_scroll")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
                    <th className="py-2 pr-3 font-medium">{t("de_table.code")}</th>
                    <th className="py-2 pr-3 font-medium">{t("de_table.name")}</th>
                    <th className="px-3 py-2 text-right font-medium">{t("de_table.cost")}</th>
                    <th className="px-3 py-2 text-right font-medium">
                      {t("de_table.actual", { period: de.actual_period ?? "" })}
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      {t("de_table.revised", { year: de.revised_year })}
                    </th>
                    <th className="py-2 pl-3 text-right font-medium">
                      {t("de_table.budget", { year: budget_year })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {de.projects.map(p => (
                    <tr
                      key={p.code}
                      className="border-outline/50 dark:border-washed-dark/50 border-b"
                    >
                      <td className="py-1.5 pr-3 tabular-nums">{p.code}</td>
                      <td className="py-1.5 pr-3">{p.name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{rmM(p.cost)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{rmM(p.actual)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{rmM(p.revised)}</td>
                      <td className="py-1.5 pl-3 text-right tabular-nums">
                        {rmM(p.direct + p.loan)}
                      </td>
                    </tr>
                  ))}
                  {de.adjustment && (
                    <tr className="border-outline/50 dark:border-washed-dark/50 border-b italic">
                      <td />
                      <td className="py-1.5 pr-3">{t("de_table.adjustment")}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {rmM(de.adjustment.cost)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {rmM(de.adjustment.actual)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {rmM(de.adjustment.revised)}
                      </td>
                      <td className="py-1.5 pl-3 text-right tabular-nums">
                        {rmM(de.adjustment.direct + de.adjustment.loan)}
                      </td>
                    </tr>
                  )}
                  {de.total && (
                    <tr className="border-outline dark:border-washed-dark border-t-2 font-semibold">
                      <td />
                      <td className="py-2 pr-3">{t("de_table.total")}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rmM(de.total.cost)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rmM(de.total.actual)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{rmM(de.total.revised)}</td>
                      <td className="py-2 pl-3 text-right tabular-nums">
                        {rmM(de.total.direct + de.total.loan)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-dim text-sm">{t("de_table.note")}</p>
          </div>
        </Section>

        {/* 4. Sources, differences between official figures, data notes */}
        <Section title={t("section_sources.title")}>
          <p className="text-dim text-sm">{t("section_sources.source")}</p>

          <h5 className="mt-10">{t("section_sources.books_title")}</h5>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
                  <th className="py-2 pr-3 font-medium">{t("section_sources.col_budget")}</th>
                  <th className="px-3 py-2 font-medium">{t("section_sources.col_book")}</th>
                  <th className="py-2 pl-3 font-medium">{t("section_sources.col_notes")}</th>
                </tr>
              </thead>
              <tbody>
                {books.map(([year, parts]) => {
                  const lines = bookNotes(year);
                  return (
                    <tr
                      key={year}
                      className="border-outline/50 dark:border-washed-dark/50 border-b align-top"
                    >
                      <td className="whitespace-nowrap py-2 pr-3">{t("budget_year", { year })}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        {parts.map((s, i) => (
                          <span key={s.part}>
                            {i > 0 && ", "}
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {parts.length > 1
                                ? t("section_sources.part", { part: s.part })
                                : "PDF"}
                            </a>
                          </span>
                        ))}
                      </td>
                      <td className="text-dim py-2 pl-3">{lines.length ? lines.join(" ") : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h5 className="mt-10">{t("notes.title")}</h5>
          <p className="text-dim mt-2 text-sm">{t("notes.description")}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
                  <th className="py-2 pr-3 font-medium">{t("notes.col_topic")}</th>
                  <th className="py-2 pl-3 font-medium">{t("notes.col_note")}</th>
                </tr>
              </thead>
              <tbody>
                {notes.map(key => (
                  <tr
                    key={key}
                    className="border-outline/50 dark:border-washed-dark/50 border-b align-top"
                  >
                    <td className="py-2 pr-3 font-medium sm:w-56">{t(`notes.${key}.title`)}</td>
                    <td className="text-dim py-2 pl-3">
                      {t(`notes.${key}.text`)}
                      {key === "fiscal" && (
                        <>
                          {" "}
                          <At href={routes.FISCAL} className="text-primary hover:underline">
                            {t("fiscal_link")}
                          </At>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <div className="text-dim flex flex-col gap-1 pb-12 text-sm">
          <p>{t("glossary")}</p>
          <p>
            {t("disclaimer")} {t("report_errors", { contact: ERROR_REPORT_CONTACT })}
          </p>
        </div>
      </Container>
    </>
  );
};

export default MohBudgetDashboard;
