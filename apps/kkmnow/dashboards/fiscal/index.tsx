import {
  AgencyBadge,
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
import { Chart, LegendItem, TooltipItem } from "chart.js";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, useState } from "react";
import { lineLegend, yearAxis } from "@components/Charts/axis";
import type { LogScatterPoint } from "@components/Charts/LogScatter";
import { ERROR_REPORT_CONTACT, PUBLISHER_URL } from "@lib/contact";
import { dateFormat } from "@lib/locales";
import type { BudgetAllocData, FiscalPayload, Series } from "./types";

/**
 * Fiscal Dashboard
 * @overview Status: In-development. Federal revenue and expenditure, the MoH budget, international
 * health-financing benchmarks and macroeconomic context.
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const LogScatter = dynamic(() => import("@components/Charts/LogScatter"), { ssr: false });
const HighlightLines = dynamic(() => import("@components/Charts/HighlightLines"), {
  ssr: false,
});

// Validated categorical order (dataviz reference palette), stepped per theme
const CATEGORICAL = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9"],
};
// Income groups take the first four categorical hues, so neighbouring groups contrast (validated
// for colour-blind separation in both themes). Malaysia is marked by shape and ink, not a hue.
const INCOME_COLORS = {
  light: CATEGORICAL.light.slice(0, 4),
  dark: CATEGORICAL.dark.slice(0, 4),
};
/** A darker step of a colour, for dot outlines that keep light hues visible on a light surface */
const darken = (hex: string, t = 0.35) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (shift: number) => Math.round(((n >> shift) & 255) * (1 - t));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
};
const INCOME_GROUPS = ["Low", "Lower-middle", "Upper-middle", "High"];

const DASH = [6, 4];
const DOT = [2, 3];

type Line = {
  key?: string;
  data?: Series;
  label: string;
  color: string;
  dash?: number[];
  width?: number;
};

const toBillion = (s: Series): Series => s.map(v => (v === null ? null : v / 1000));
const year = (ms: number) => new Date(ms).getUTCFullYear();

/** First year of the series and the latest Budget year (the KPIs' latest year) */
export const fiscalSpan = (fiscal: FiscalPayload["fiscal"]) => ({
  from: fiscal.years[0],
  to: Math.max(...Object.values(fiscal.kpi).map(k => k.year)),
});

/**
 * Trim the shared x-axis to the years in which any of the given series has data.
 */
const trim = (x: number[], series: Series[]) => {
  const has = (i: number) => series.some(s => s[i] !== null && s[i] !== undefined);
  let a = 0;
  let b = x.length - 1;
  while (a < b && !has(a)) a++;
  while (b > a && !has(b)) b--;
  return {
    labels: x.slice(a, b + 1),
    slice: (s: Series) => s.slice(a, b + 1),
    span: `${year(x[a])}–${year(x[b])}`,
  };
};

/** Hand-made legend; an item with `dash` is drawn as a line in that pattern, else a square */
const legendFor =
  (items: Array<{ text: string; color: string; datasetIndex: number; dash?: number[] }>) =>
  (chart: Chart): LegendItem[] =>
    items.map(({ text, color, datasetIndex, dash }) => ({
      text,
      fillStyle: color,
      strokeStyle: color,
      lineWidth: dash ? 2 : 0,
      lineDash: dash,
      pointStyle: dash ? "line" : "rect",
      datasetIndex,
      hidden: !chart.isDatasetVisible(datasetIndex),
    }));

const ALLOC_ROWS: Array<{ key: string; kind: "rm" | "pct" }> = [
  { key: "budget_alloc_federal_total", kind: "rm" },
  { key: "budget_alloc_federal_oe", kind: "rm" },
  { key: "budget_alloc_federal_de", kind: "rm" },
  { key: "budget_alloc_moh_total", kind: "rm" },
  { key: "budget_alloc_moh_oe", kind: "rm" },
  { key: "budget_alloc_moh_de", kind: "rm" },
  { key: "budget_alloc_moh_pct_federal_total", kind: "pct" },
  { key: "budget_alloc_moh_oe_pct_federal_oe", kind: "pct" },
  { key: "budget_alloc_moh_de_pct_federal_de", kind: "pct" },
];

/**
 * Original allocations as tabled in each year's own Budget, with the change between the last two.
 */
const BudgetVsBudget: FunctionComponent<{ data: BudgetAllocData }> = ({ data }) => {
  const { t } = useTranslation(["dashboard-fiscal"]);
  const { years, series } = data;
  if (!years.length) return null;

  const cell = (v: number | null, kind: "rm" | "pct") =>
    v === null ? "–" : numFormat(kind === "rm" ? v / 1000 : v, "standard", [2, 2]);
  const change = (a: number | null, b: number | null, kind: "rm" | "pct") => {
    if (a === null || b === null) return "–";
    const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "");
    if (kind === "rm") {
      const pct = (b / a - 1) * 100;
      return `${sign(pct)}${numFormat(Math.abs(pct), "standard", [1, 1])}%`;
    }
    return `${sign(b - a)}${numFormat(Math.abs(b - a), "standard", [2, 2])} ${t("budget_alloc.pp")}`;
  };

  return (
    <div className="mt-12 flex flex-col gap-3">
      <h5>{t("budget_alloc.title")}</h5>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
              <th className="py-2 pr-4 font-medium">{t("budget_alloc.item")}</th>
              {years.map(y => (
                <th key={y} className="px-4 py-2 text-right font-medium">
                  {t("budget_alloc.budget_year", { year: y })}
                </th>
              ))}
              {years.length >= 2 && (
                <th className="py-2 pl-4 text-right font-medium">{t("budget_alloc.change")}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {ALLOC_ROWS.map(({ key, kind }) => {
              const values = series[key];
              return (
                <tr key={key} className="border-outline dark:border-washed-dark border-b">
                  <td className="py-2 pr-4">{t(`budget_alloc.rows.${key}`)}</td>
                  {values.map((v, i) => (
                    <td key={years[i]} className="px-4 py-2 text-right tabular-nums">
                      {cell(v, kind)}
                    </td>
                  ))}
                  {years.length >= 2 && (
                    <td className="py-2 pl-4 text-right tabular-nums">
                      {change(values[values.length - 2], values[values.length - 1], kind)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-dim text-sm">{t("budget_alloc.note")}</p>
    </div>
  );
};

interface FiscalDashboardProps extends FiscalPayload {}

const FiscalDashboard: FunctionComponent<FiscalDashboardProps> = ({
  data_last_updated,
  fiscal,
  budget_alloc,
  ghed,
}) => {
  const { t, i18n } = useTranslation(["dashboard-fiscal", "common"]);
  const { theme } = useTheme();
  const C = CATEGORICAL[theme === "dark" ? "dark" : "light"];
  const S = fiscal.series;
  // Years quoted in the text come from the data, so they move with each Budget
  const span = fiscalSpan(fiscal);
  const lastYearOf = (key: string) => fiscal.years[S[key].findLastIndex(v => v !== null)];

  const [sectorTab, setSectorTab] = useState(0);
  const scatterYears = Object.keys(ghed.scatter).sort().reverse();
  // Default to the second-latest year: the latest GHED year covers only a few countries
  const [scatterYear, setScatterYear] = useState(scatterYears[1] ?? scatterYears[0]);

  /** Line datasets on the fiscal axis, trimmed to the years the lines cover */
  const lines = (items: Line[], transform: (s: Series) => Series = s => s) => {
    const series = items.map(item => transform(item.data ?? S[item.key!]));
    const { labels, slice, span } = trim(fiscal.x, series);
    return {
      span,
      data: {
        labels,
        datasets: items.map((item, i) => ({
          type: "line" as const,
          label: item.label,
          data: slice(series[i]),
          borderColor: item.color,
          backgroundColor: item.color,
          borderWidth: item.width ?? 2,
          borderDash: item.dash,
        })),
      },
    };
  };

  /** Stacked areas, filled down to the series below */
  const areas = (items: Line[], transform: (s: Series) => Series = toBillion) => {
    const { span, data } = lines(items, transform);
    data.datasets.forEach((set, i) =>
      Object.assign(set, {
        fill: i === 0 ? "origin" : "-1",
        backgroundColor: items[i].color + "B3",
        borderWidth: 1,
      })
    );
    return { span, data };
  };

  const statusLabel = (status: string) => t(`status.${status}`);

  // 1.1 Revenue vs expenditure, shaded by surplus / deficit
  const revExp = lines([
    { key: "federal_revenue_pct_gdp", label: t("series.revenue"), color: C[0] },
    { key: "federal_expenditure_pct_gdp", label: t("series.expenditure"), color: C[1] },
  ]);
  Object.assign(revExp.data.datasets[1], {
    fill: { target: 0, above: AKSARA_COLOR.DANGER + "26", below: AKSARA_COLOR.GREEN + "26" },
  });

  // 1.4 Balance: bars coloured by sign, primary balance as a dashed line
  const balance = (() => {
    const overall = S["federal_balance_pct_gdp"];
    const primary = S["federal_primary_balance_pct_gdp"];
    const { labels, slice, span } = trim(fiscal.x, [overall, primary]);
    const bars = slice(overall);
    return {
      span,
      data: {
        labels,
        datasets: [
          {
            type: "line" as const,
            label: t("series.primary_balance"),
            data: slice(primary),
            borderColor: C[6],
            borderWidth: 2,
            borderDash: DASH,
            order: 0,
          },
          {
            type: "bar" as const,
            label: t("series.overall_balance"),
            data: bars,
            backgroundColor: bars.map(v => (v !== null && v >= 0 ? C[0] : AKSARA_COLOR.DANGER)),
            order: 1,
          },
        ],
      },
    };
  })();

  // 2.5 MOH budget allocation: OE other = OE - emoluments - supplies
  const budget = (() => {
    const oe = S["moh_budget_oe"];
    const emol = S["moh_budget_emoluments"];
    const supplies = S["moh_budget_supplies"];
    const other = oe.map((v, i) =>
      v === null || emol[i] === null || supplies[i] === null ? null : v - emol[i]! - supplies[i]!
    );
    const items = [
      { data: emol, label: t("series.budget_emoluments"), color: C[0] },
      { data: supplies, label: t("series.budget_supplies"), color: C[1] },
      { data: other, label: t("series.budget_other"), color: C[2] },
      { key: "moh_budget_de", label: t("series.de"), color: C[3] },
    ];
    const { span, data } = lines(items, toBillion);
    data.datasets.forEach((set, i) =>
      Object.assign(set, { type: "bar", backgroundColor: items[i].color, borderWidth: 0 })
    );
    return { span, data };
  })();

  // 2.7 Federal OE by sector. Level-2 sub-sectors are split by parent sector so no
  // tab stacks more series than the categorical palette can keep apart.
  const SECTOR_TABS: Array<{
    tab: string;
    /** The sector's own total; the stack tops up to it with a "not broken down" layer */
    parent?: string;
    sectors: Array<[string, string[]]>;
  }> = [
    {
      tab: "major",
      sectors: [
        ["economic", ["mof_oe_economic"]],
        ["social", ["mof_oe_social"]],
        ["security", ["mof_oe_security"]],
        ["general_admin", ["mof_oe_general_admin"]],
        ["others", ["mof_oe_other_expenditures"]],
      ],
    },
    {
      tab: "economic",
      parent: "mof_oe_economic",
      sectors: [
        ["agriculture", ["mof_oe_agriculture"]],
        ["energy_utilities", ["mof_oe_energy_utilities", "mof_oe_public_utilities"]],
        ["trade_industry", ["mof_oe_trade_industry"]],
        ["transport", ["mof_oe_transport"]],
        ["communications", ["mof_oe_communications"]],
        ["environment", ["mof_oe_environment"]],
        ["economic_others", ["mof_oe_economic_others"]],
      ],
    },
    {
      tab: "social",
      parent: "mof_oe_social",
      sectors: [
        ["education", ["mof_oe_education"]],
        ["health", ["mof_oe_health"]],
        ["housing", ["mof_oe_housing"]],
        ["social_others", ["mof_oe_social_others"]],
      ],
    },
    {
      tab: "security",
      parent: "mof_oe_security",
      sectors: [
        ["defence", ["mof_oe_defence"]],
        ["internal_security", ["mof_oe_internal_security"]],
      ],
    },
  ];
  const sectors = (() => {
    const { parent, sectors: tabSectors } = SECTOR_TABS[sectorTab];
    const total = parent ? S[parent] : null;
    // Sum indicators that cover the same sector in different years
    const reported = tabSectors.map(([, keys]) =>
      S[keys[0]].map((_, y) =>
        keys.every(k => S[k][y] === null) ? null : keys.reduce((sum, k) => sum + (S[k][y] ?? 0), 0)
      )
    );
    // What the sector total has beyond its reported sub-sectors, e.g. security before 1989,
    // when MOF did not split it. Sub-RM1m differences are rounding.
    const rest: Series | null =
      total &&
      total.map((v, y) => {
        if (v === null) return null;
        const r = v - reported.reduce((sum, s) => sum + (s[y] ?? 0), 0);
        return Math.abs(r) < 1 ? 0 : r;
      });
    const items: Line[] = [
      ...(rest && rest.some(v => v !== null && v !== 0)
        ? [{ data: rest, label: t("sectors.not_broken_down"), color: AKSARA_COLOR.GREY }]
        : []),
      ...tabSectors.map(([id], i) => ({
        data: reported[i],
        label: t(`sectors.${id}`),
        color: C[i],
      })),
    ];
    // A stacked area cannot span a missing year, so draw unreported sub-sectors as 0 wherever
    // the sector total exists (its amount sits in the "not broken down" layer) and keep them
    // out of the tooltip.
    const hidden = items.map(item =>
      item.data!.map(
        (v, y) => (v === null && total?.[y] != null) || (item.data === rest && v === 0)
      )
    );
    items.forEach((item, i) => {
      item.data = item.data!.map((v, y) => (v === null && hidden[i][y] ? 0 : v));
    });
    const { span, data } = areas(items);
    // The chart starts at the first year with data; hidden is indexed from the full year axis
    const first = fiscal.x.indexOf(data.labels[0]);
    const tooltip = (item: TooltipItem<"line">) =>
      hidden[item.datasetIndex][first + item.dataIndex]
        ? []
        : `${item.dataset.label}: RM ${numFormat(item.parsed.y, "standard", [1, 1])}B`;
    return { span, data, tooltip };
  })();

  // 4.1 Real GDP growth, projections greyed out
  const growth = (() => {
    const values = S["imf_real_gdp_growth"];
    const { labels, slice, span } = trim(fiscal.x, [values]);
    const projected = labels.map(ms => year(ms) >= fiscal.imf_projection_from);
    const bars = slice(values);
    return {
      span,
      data: {
        labels,
        datasets: [
          {
            type: "bar" as const,
            label: t("series.real_gdp_growth"),
            data: bars,
            backgroundColor: bars.map((v, i) =>
              projected[i]
                ? AKSARA_COLOR.GREY
                : v !== null && v >= 0
                  ? AKSARA_COLOR.GREEN
                  : AKSARA_COLOR.DANGER
            ),
          },
        ],
      },
    };
  })();

  // 3.5 ASEAN priority to health: Malaysia highlighted, other members in grey, named on hover
  const priority = (() => {
    const codes = Object.keys(ghed.priority.series);
    const { labels, slice, span } = trim(
      ghed.priority.x,
      codes.map(c => ghed.priority.series[c])
    );
    return {
      span,
      years: labels.map(year),
      series: codes.map(code => ({
        label: ghed.countries[code]?.name ?? code,
        data: slice(ghed.priority.series[code]),
        highlight: code === "MYS",
      })),
    };
  })();

  // 3.6 Health spending vs income, by income group, Malaysia marked
  const scatter = (() => {
    const rows = ghed.scatter[scatterYear] ?? [];
    const point = ([code, x, y]: [string, number, number]): LogScatterPoint => ({
      x,
      y,
      name: ghed.countries[code]?.name ?? code,
    });
    return [
      {
        label: "Malaysia",
        data: rows.filter(r => r[0] === "MYS").map(point),
        backgroundColor: theme === "dark" ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK,
        borderColor: theme === "dark" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
        borderWidth: 2,
        pointStyle: "rectRot" as const,
        pointRadius: 9,
        pointHoverRadius: 11,
      },
      ...INCOME_GROUPS.map((group, i) => ({
        label: t(`income.${group}`),
        data: rows.filter(r => r[0] !== "MYS" && ghed.countries[r[0]]?.income === group).map(point),
        backgroundColor: INCOME_COLORS[theme === "dark" ? "dark" : "light"][i] + "D9",
        borderColor: darken(INCOME_COLORS[theme === "dark" ? "dark" : "light"][i]),
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    ];
  })();

  const KPIS: Array<{ key: string; format: (v: number) => string }> = [
    { key: "mof_oe_health", format: v => `RM ${numFormat(v / 1000, "standard", [1, 1])}B` },
    { key: "federal_de_health", format: v => `RM ${numFormat(v / 1000, "standard", [1, 1])}B` },
    { key: "moh_oe_de_pct_gdp", format: v => `${numFormat(v, "standard", [2, 2])}%` },
    { key: "moh_oe_de_pct_revenue", format: v => `${numFormat(v, "standard", [2, 2])}%` },
  ];

  const pct = { unitY: "%", precision: [1, 0] as [number, number] };
  const rm = { prefixY: "RM ", unitY: "B", precision: [1, 0] as [number, number] };
  const common = {
    className: "h-[350px] w-full",
    interval: "year" as const,
    round: "year" as const,
    mode: "grouped" as const,
    enableLegend: true,
    generateLabels: lineLegend,
    ...yearAxis,
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.public_finances"), "text-primary"]}
        header={[t("header")]}
        description={[t("description", span), "text-dim"]}
        action={
          // Not Hero's last_updated: it always adds a time, and only the date is known
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
        {/* 1. Federal government fiscal overview */}
        <Section
          title={t("section_overview.title")}
          description={t("estimates_note", { budget: span.to, revised: span.to - 1 })}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              {...common}
              {...pct}
              title={t("charts.rev_exp_gdp", { span: revExp.span })}
              description={t("charts.rev_exp_gdp_note")}
              data={revExp.data}
            />
            {(() => {
              const c = lines(
                [
                  { key: "federal_revenue", label: t("series.revenue"), color: C[0] },
                  { key: "federal_oe", label: t("series.oe"), color: C[1] },
                  { key: "federal_de_gross", label: t("series.de"), color: C[2] },
                  {
                    key: "federal_oe_debt_service",
                    label: t("series.debt_service"),
                    color: C[6],
                    dash: DOT,
                  },
                ],
                toBillion
              );
              return (
                <Timeseries
                  {...common}
                  {...rm}
                  title={t("charts.rev_oe_de", { span: c.span })}
                  description={t("charts.rev_oe_de_note")}
                  data={c.data}
                />
              );
            })()}
            {(() => {
              const c = areas([
                { key: "federal_revenue_tax_direct", label: t("series.tax_direct"), color: C[0] },
                {
                  key: "federal_revenue_tax_indirect",
                  label: t("series.tax_indirect"),
                  color: C[1],
                },
                { key: "federal_revenue_non_tax", label: t("series.non_tax"), color: C[2] },
              ]);
              return (
                <Timeseries
                  {...common}
                  {...rm}
                  mode="stacked"
                  title={t("charts.revenue_composition", { span: c.span })}
                  description={t("charts.revenue_composition_note")}
                  data={c.data}
                />
              );
            })()}
            <Timeseries
              {...common}
              {...pct}
              type="bar"
              title={t("charts.balance_gdp", { span: balance.span })}
              description={t("charts.balance_gdp_note")}
              data={balance.data}
              generateLabels={legendFor([
                { text: t("series.surplus"), color: C[0], datasetIndex: 1 },
                { text: t("series.deficit"), color: AKSARA_COLOR.DANGER, datasetIndex: 1 },
                { text: t("series.primary_balance"), color: C[6], datasetIndex: 0, dash: DASH },
              ])}
            />
          </div>
        </Section>

        {/* 2. Ministry of Health in the federal budget */}
        <Section title={t("section_moh.title")} description={t("section_moh.description")}>
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {KPIS.map(({ key, format }) => {
              const kpi = fiscal.kpi[key];
              return (
                <Card key={key} className="p-4">
                  <p className="text-dim text-sm">{t(`kpi.${key}`)}</p>
                  <p className="mt-2 text-2xl font-bold dark:text-white">{format(kpi.value)}</p>
                  <p className="text-dim mt-1 text-xs">
                    {kpi.status === "actual"
                      ? kpi.year
                      : `${kpi.year} · ${statusLabel(kpi.status)}`}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {[
              {
                title: "moh_nominal",
                transform: toBillion,
                oe: "mof_oe_health",
                de: "federal_de_health",
              },
              {
                title: "moh_real",
                transform: toBillion,
                oe: "moh_oe_real",
                de: "federal_de_health_real",
              },
            ].map(({ title, transform, oe, de }) => {
              const c = areas(
                [
                  { key: oe, label: t("series.oe"), color: C[0] },
                  { key: de, label: t("series.de"), color: C[2] },
                ],
                transform
              );
              return (
                <Timeseries
                  key={title}
                  {...common}
                  {...rm}
                  mode="stacked"
                  title={t(`charts.${title}`, { span: c.span })}
                  data={c.data}
                />
              );
            })}

            {[
              {
                title: "moh_gdp",
                precision: [2, 0] as [number, number],
                keys: ["moh_oe_de_pct_gdp", "moh_oe_pct_gdp", "health_de_pct_gdp"],
                labels: ["oe_de", "oe", "de"],
              },
              {
                title: "moh_share_expenditure",
                precision: [1, 0] as [number, number],
                keys: [
                  "moh_oe_de_pct_total_expenditure",
                  "moh_oe_pct_federal_oe",
                  "health_de_pct_total_de",
                ],
                labels: ["oe_de_of_total", "oe_of_federal_oe", "de_of_total_de"],
                description: budget_alloc.revision
                  ? t("charts.moh_share_expenditure_note", {
                      year: budget_alloc.revision.year,
                      prev: budget_alloc.revision.year - 1,
                      revised: numFormat(
                        budget_alloc.revision.revised_oe / 1000,
                        "standard",
                        [1, 1]
                      ),
                      original: numFormat(
                        budget_alloc.revision.original_oe / 1000,
                        "standard",
                        [1, 1]
                      ),
                    })
                  : undefined,
              },
              {
                title: "moh_revenue",
                precision: [1, 0] as [number, number],
                keys: ["moh_oe_de_pct_revenue", "health_de_pct_revenue"],
                labels: ["oe_de_of_revenue", "de_of_revenue"],
              },
            ].map(
              ({
                title,
                precision,
                keys,
                labels,
                description,
              }: {
                title: string;
                precision: [number, number];
                keys: string[];
                labels: string[];
                description?: string;
              }) => {
                const styles = [
                  { color: C[0], width: 2.5 },
                  { color: C[1], dash: DASH },
                  { color: C[2], dash: DOT },
                ];
                // DE is always the last line; keep its colour stable across charts
                const c = lines(
                  keys.map((key, i) => ({
                    key,
                    label: t(`series.${labels[i]}`),
                    ...(i === keys.length - 1 && i > 0 ? styles[2] : styles[i]),
                  }))
                );
                return (
                  <Timeseries
                    key={title}
                    {...common}
                    unitY="%"
                    precision={precision}
                    title={t(`charts.${title}`, { span: c.span })}
                    description={description}
                    data={c.data}
                  />
                );
              }
            )}

            <Timeseries
              {...common}
              {...rm}
              type="bar"
              mode="stacked"
              title={t("charts.moh_budget", { span: budget.span })}
              description={t("charts.moh_budget_note")}
              data={budget.data}
            />

            {[
              {
                title: "moh_per_capita",
                keys: ["moh_oe_de_per_capita", "moh_oe_per_capita", "federal_de_health_per_capita"],
              },
              {
                title: "moh_per_capita_real",
                keys: [
                  "moh_oe_de_real_per_capita",
                  "moh_oe_real_per_capita",
                  "federal_de_health_real_per_capita",
                ],
              },
            ].map(({ title, keys }) => {
              const c = lines([
                { key: keys[0], label: t("series.oe_de"), color: C[0], width: 2.5 },
                { key: keys[1], label: t("series.oe"), color: C[1], dash: DASH },
                { key: keys[2], label: t("series.de"), color: C[2], dash: DOT },
              ]);
              return (
                <Timeseries
                  key={title}
                  {...common}
                  prefixY="RM "
                  precision={[1, 0]}
                  title={t(`charts.${title}`, { span: c.span })}
                  data={c.data}
                />
              );
            })}
          </div>

          <BudgetVsBudget data={budget_alloc} />

          <div className="mt-12">
            <Timeseries
              {...common}
              {...rm}
              className="h-[450px] w-full"
              mode="stacked"
              title={t("charts.oe_by_sector", {
                level: t(`sector_tabs.${SECTOR_TABS[sectorTab].tab}`),
                span: sectors.span,
              })}
              description={t("charts.oe_by_sector_note")}
              menu={
                <Tabs.List
                  options={SECTOR_TABS.map(({ tab }) => t(`sector_tabs.${tab}`))}
                  current={sectorTab}
                  onChange={setSectorTab}
                />
              }
              data={sectors.data}
              tooltipCallback={sectors.tooltip}
            />
          </div>
        </Section>

        {/* 3. International benchmarks */}
        <Section
          title={t("section_international.title")}
          description={t("section_international.description")}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {[
              { key: "wb_health_exp_pct_gdp", title: "the_gdp" },
              { key: "wb_govt_health_exp_pct_gdp", title: "ghe_gdp" },
              { key: "wb_oop_pct_health_exp", title: "oop_the" },
              { key: "wb_govt_health_pct_govt_exp", title: "ghe_gge" },
            ].map(({ key, title }) => {
              const c = lines([{ key, label: "Malaysia", color: C[0] }]);
              return (
                <Timeseries
                  key={key}
                  {...common}
                  {...pct}
                  className="h-[300px] w-full"
                  enableLegend={false}
                  title={t(`charts.${title}`, { span: c.span })}
                  data={c.data}
                />
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12">
            <div className="flex flex-col gap-3">
              <h5>{t("charts.asean_priority", { span: priority.span })}</h5>
              <HighlightLines
                className="h-[450px] w-full"
                years={priority.years}
                series={priority.series}
                highlightColor={C[0]}
                formatY={v => `${v}%`}
                formatValue={v => `${numFormat(v, "standard", [1, 1])}%`}
              />
              <p className="text-dim text-sm">{t("charts.asean_priority_note")}</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h5>{t("charts.health_vs_income", { year: scatterYear })}</h5>
                <Dropdown
                  anchor="right"
                  width="w-fit"
                  options={scatterYears.map(y => ({ label: y, value: y }))}
                  selected={{ label: scatterYear, value: scatterYear }}
                  onChange={e => setScatterYear(e.value)}
                />
              </div>
              <LogScatter
                datasets={scatter}
                titleX={t("charts.gdp_per_capita_axis")}
                titleY={t("charts.health_per_capita_axis")}
                tooltipLabel={p =>
                  t("charts.health_vs_income_tooltip", {
                    country: p.name,
                    gdp: numFormat(p.x, "standard", [0, 0]),
                    health: numFormat(p.y, "standard", [0, 0]),
                  })
                }
              />
              <p className="text-dim text-sm">{t("charts.health_vs_income_note")}</p>
            </div>
          </div>
        </Section>

        {/* 4. Macroeconomic and debt context */}
        <Section title={t("section_macro.title")}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              {...common}
              {...pct}
              type="bar"
              title={t("charts.gdp_growth", { span: growth.span })}
              description={t("charts.gdp_growth_note", { year: fiscal.imf_projection_from })}
              data={growth.data}
              generateLabels={legendFor([
                { text: t("series.growth"), color: AKSARA_COLOR.GREEN, datasetIndex: 0 },
                { text: t("series.contraction"), color: AKSARA_COLOR.DANGER, datasetIndex: 0 },
                { text: t("series.projection"), color: AKSARA_COLOR.GREY, datasetIndex: 0 },
              ])}
            />
            {(() => {
              const c = lines([
                { key: "mof_debt_total_pct_gdp", label: t("series.debt_mof"), color: C[0] },
                {
                  key: "imf_govt_debt_pct_gdp",
                  label: t("series.debt_imf"),
                  color: C[1],
                  dash: DASH,
                },
              ]);
              return (
                <Timeseries
                  {...common}
                  {...pct}
                  title={t("charts.debt_gdp", { span: c.span })}
                  description={t("charts.debt_gdp_note", {
                    year: lastYearOf("mof_debt_total_pct_gdp"),
                  })}
                  data={c.data}
                />
              );
            })()}
            {(() => {
              const c = lines([
                {
                  key: "emoluments_retirement_pct_oe",
                  label: t("series.emoluments_pensions"),
                  color: C[1],
                },
                {
                  key: "debt_service_pct_revenue",
                  label: t("series.debt_service_revenue"),
                  color: C[6],
                  dash: DASH,
                },
              ]);
              return (
                // Last chart of the page: span both columns rather than leave half a row empty
                <div className="lg:col-span-2">
                  <Timeseries
                    {...common}
                    {...pct}
                    title={t("charts.fiscal_pressure", { span: c.span })}
                    data={c.data}
                  />
                </div>
              );
            })()}
          </div>
        </Section>

        <div className="text-dim flex flex-col gap-1 pb-12 text-sm">
          <p>{t("glossary")}</p>
          <p>
            {t("disclaimer")} {t("report_errors", { contact: ERROR_REPORT_CONTACT })}
          </p>
          <p>{t("sources")}</p>
        </div>
      </Container>
    </>
  );
};

export default FiscalDashboard;
