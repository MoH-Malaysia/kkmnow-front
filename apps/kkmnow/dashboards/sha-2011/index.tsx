import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  Section,
  Slider,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import AgencyIcon from "datagovmy-ui/icons/agency";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import type { LogScatterPoint } from "@components/Charts/LogScatter";
import { lineLegend, yearAxis } from "@components/Charts/axis";
import { ERROR_REPORT_CONTACT, PUBLISHER_URL } from "@lib/contact";
import { dateFormat } from "@lib/locales";
import { routes } from "@lib/routes";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { colorScale, hierarchy } from "./colors";
import type { TreemapRow } from "./treemap";
import {
  CountryPayload,
  CrosstabMetric,
  Dim,
  DimensionData,
  DIMS,
  Metric,
  METRICS,
  SharedPayload,
  Values,
} from "./types";

/**
 * Health Accounts (SHA 2011) Dashboard
 * @overview Status: In-development. One tab per SHA 2011 classification (financing schemes,
 * revenue sources, providers, functions) for every country in WHO GHED.
 */

// Every Chart.js chart loads after chart-setup, so plugin registration happens first
const withSetup =
  <T,>(load: () => Promise<T>) =>
  () =>
    import("./chart-setup").then(load);
const Timeseries = dynamic(
  withSetup(() => import("datagovmy-ui/charts/timeseries")),
  { ssr: false }
);
const Heatmap = dynamic(
  withSetup(() => import("datagovmy-ui/charts/heatmap")),
  { ssr: false }
);
const LogScatter = dynamic(
  withSetup(() => import("@components/Charts/LogScatter")),
  { ssr: false }
);
const Treemap = dynamic(
  withSetup(() => import("./treemap")),
  { ssr: false }
);
const Sunburst = dynamic(() => import("./sunburst"), { ssr: false });
const Doughnut = dynamic(
  withSetup(() => import("./doughnut")),
  { ssr: false }
);

const HIGHLIGHT = { light: "#2a78d6", dark: "#3987e5" };
const SDG_COLORS = { "10%": "#eb6834", "25%": "#2a78d6" };

/** Default codes in the trend comparison, per dimension */
const TREND_DEFAULTS: Partial<Record<Dim, string[]>> = {
  hf: ["hf1", "hf2", "hf3"],
  fs: ["fs1", "fs3", "fs5", "fs6"],
};

const epoch = (year: number) => Date.UTC(year, 0, 1);

type Scale = {
  /** Divide source values by this for display */
  divisor: number;
  prefixY?: string;
  unitY?: string;
  /** i18n key suffix naming the displayed unit */
  unit: string;
  precision: [number, number];
};

/**
 * Display units for a metric. Million-denominated metrics switch to billions past 5,000 million,
 * National-currency values take ncuPrefix (e.g. "RM ") when known.
 */
const scaleFor = (metric: Metric | CrosstabMetric, maxAbs: number, ncuPrefix?: string): Scale => {
  const millions = ["value", "_usd", "_usd2023", "_gghed", "_pvtd"].includes(metric);
  const usd = metric.startsWith("_usd");
  if (millions) {
    const billions = maxAbs >= 5000;
    return {
      divisor: billions ? 1000 : 1,
      prefixY: usd ? "US$" : ncuPrefix,
      unitY: billions ? "B" : "M",
      unit: `${usd ? "usd" : "ncu"}_${billions ? "billion" : "million"}${
        metric === "_usd2023" ? "_real" : ""
      }`,
      precision: [1, 0],
    };
  }
  if (metric === "_che" || metric === "_gdp")
    return { divisor: 1, unitY: "%", unit: metric.slice(1), precision: [1, 0] };
  return {
    divisor: 1,
    prefixY: "US$",
    unit: metric === "_usd2023_pc" ? "usd_pc_real" : "usd_pc",
    precision: [0, 0],
  };
};

const maxAbs = (series: Values[]) =>
  Math.max(0, ...series.flatMap(s => s.map(v => Math.abs(v ?? 0))));

interface SHA2011DashboardProps extends CountryPayload {
  shared: SharedPayload;
}

const SHA2011Dashboard: FunctionComponent<SHA2011DashboardProps> = props => {
  const { country, dims, shared } = props;
  const { t, i18n } = useTranslation(["dashboard-sha-2011", "common"]);
  const router = useRouter();

  const tabFromQuery = DIMS.indexOf(router.query.tab as Dim);
  const tab = tabFromQuery >= 0 ? tabFromQuery : 0;
  const [metric, setMetric] = useState<Metric>("value");

  const setTab = (index: number) =>
    router.replace({ query: { ...router.query, tab: DIMS[index] } }, undefined, {
      shallow: true,
      scroll: false,
    });

  const countryOptions = shared.countries.map(c => ({ label: c.name, value: c.code }));

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.healthcare"), "text-primary"]}
        header={[t("header")]}
        description={[t("description"), "text-dim"]}
        action={
          <div className="flex flex-col gap-3">
            <Dropdown
              anchor="left"
              width="w-full sm:w-64"
              enableSearch
              options={countryOptions}
              selected={countryOptions.find(o => o.value === country.code)}
              onChange={e =>
                router.push(
                  {
                    pathname: `${routes.SHA_2011}/${e.value.toLowerCase()}`,
                    query: { tab: DIMS[tab] },
                  },
                  undefined,
                  { scroll: false }
                )
              }
            />
            {shared.data_last_updated && (
              <p className="text-dim text-sm">
                {t("common:common.last_updated", {
                  date: toDate(shared.data_last_updated, dateFormat(i18n.language), i18n.language),
                })}
              </p>
            )}
          </div>
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
        <Section>
          <Tabs.List
            className="mb-6"
            options={DIMS.map(dim => t(`tabs.${dim}`))}
            current={tab}
            onChange={setTab}
          />
          <DimensionPanel
            key={`${country.code}-${DIMS[tab]}`}
            dim={DIMS[tab]}
            data={dims[DIMS[tab]]}
            metric={metric}
            setMetric={setMetric}
            {...props}
          />
        </Section>
      </Container>
    </>
  );
};

interface DimensionPanelProps extends SHA2011DashboardProps {
  dim: Dim;
  data: DimensionData | null;
  metric: Metric;
  setMetric: (metric: Metric) => void;
}

const DimensionPanel: FunctionComponent<DimensionPanelProps> = ({
  dim,
  data,
  metric,
  setMetric,
  country,
  oop_share,
  sdg382,
  transition,
  shared,
}) => {
  const { t } = useTranslation(["dashboard-sha-2011", "common"]);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const years = data?.years ?? [];
  const [levelNo, setLevelNo] = useState(1);
  const [range, setRange] = useState<[number, number]>([0, Math.max(years.length - 1, 0)]);
  const [compYear, setCompYear] = useState(years[years.length - 1]);
  const [trendCodes, setTrendCodes] = useState<string[]>(
    (TREND_DEFAULTS[dim] ?? []).filter(c => data?.codes.includes(c))
  );
  const [heatmapSource, setHeatmapSource] = useState(0);
  const [showTable, setShowTable] = useState(false);

  if (!data || years.length < data.min_years)
    return (
      <p className="text-dim py-12 text-center">
        {t("insufficient", { dim: t(`tabs.${dim}`), country: country.name })}
      </p>
    );

  const h = hierarchy(shared.hierarchy[dim]);
  // GHED reports national currency units; name the currency where we know it
  const ncu = country.code === "MYS" ? "RM" : "NCU";
  const scaleOf = (m: Metric | CrosstabMetric, max: number) =>
    scaleFor(m, max, ncu === "RM" ? "RM " : undefined);
  const label = (code: string) => `${h.sha(code)}: ${t(`codes.${code}`)}`;
  const levelCodes = data.levels[String(levelNo)] ?? [];
  const inRange = years.slice(range[0], range[1] + 1);
  const x = inRange.map(epoch);
  const slice = (s: Values | undefined): Values =>
    (s ?? years.map(() => null)).slice(range[0], range[1] + 1);
  const at = (s: Values | undefined, year: number) => s?.[years.indexOf(year)] ?? null;

  /** Stacked area of the level codes for one metric */
  const area = (m: Metric | CrosstabMetric, title: string) => {
    const series = levelCodes.map(code => slice(data.values[m]?.[code]));
    // Stacked: the axis has to fit the yearly totals
    const totals = inRange.map((_, i) => series.reduce((sum, s) => sum + Math.abs(s[i] ?? 0), 0));
    const scale = scaleOf(m, maxAbs([totals]));
    const color = colorScale(h, levelCodes, dark);
    return (
      <Timeseries
        className="h-[400px] w-full"
        interval="year"
        {...yearAxis}
        generateLabels={lineLegend}
        round="year"
        mode="stacked"
        enableLegend
        prefixY={scale.prefixY}
        unitY={scale.unitY}
        precision={scale.precision}
        title={`${title} (${t(`units.${scale.unit}`, { ncu })})`}
        data={{
          labels: x,
          datasets: levelCodes.map((code, i) => ({
            type: "line",
            label: label(code),
            data: series[i].map(v => (v === null ? null : v / scale.divisor)),
            borderColor: color(code),
            backgroundColor: color(code) + "CC",
            borderWidth: 1,
            fill: i === 0 ? "origin" : "-1",
          })),
        }}
      />
    );
  };

  const compScale = scaleOf(
    metric,
    maxAbs([data.leaf.map(code => at(data.values[metric]?.[code], compYear))])
  );
  const compFormat = (v: number) =>
    `${compScale.prefixY ?? ""}${numFormat(v / compScale.divisor, "standard", [1, 1])}${
      compScale.unitY ?? ""
    }`;

  const yearOptions = years
    .slice()
    .reverse()
    .map(y => ({ label: String(y), value: String(y) }));
  const levelOptions = Object.keys(data.levels).map(l => ({
    label: t("filters.level", { level: l }),
    value: l,
  }));
  const metricOptions = METRICS.map(m => ({ label: t(`metrics.${m}`, { ncu }), value: m }));

  return (
    <div className="flex flex-col gap-12">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <Dropdown
            width="w-full sm:w-fit"
            sublabel={t("filters.view_mode")}
            options={metricOptions}
            selected={metricOptions.find(o => o.value === metric)}
            onChange={e => setMetric(e.value)}
          />
          <Dropdown
            width="w-full sm:w-fit"
            sublabel={t("filters.aggregation")}
            options={levelOptions}
            selected={levelOptions.find(o => o.value === String(levelNo))}
            onChange={e => setLevelNo(Number(e.value))}
          />
          <Dropdown
            width="w-full sm:w-fit"
            sublabel={t("filters.composition_year")}
            options={yearOptions}
            selected={{ label: String(compYear), value: String(compYear) }}
            onChange={e => setCompYear(Number(e.value))}
          />
        </div>
        {years.length >= 2 && (
          <div className="max-w-xl">
            <p className="text-dim text-sm">{t("filters.year_range")}</p>
            <SliderProvider>
              {() => (
                <Slider
                  className="pt-2"
                  type="range"
                  parseAsDate={false}
                  enablePlayer={false}
                  data={years}
                  value={range}
                  onChange={e => setRange([e[0], e[1]])}
                />
              )}
            </SliderProvider>
          </div>
        )}
        {(dim === "hp" || dim === "hc") && (
          <p className="text-dim text-sm">
            {t("summary", {
              dim: t(`tabs.${dim}`),
              country: country.name,
              years: years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]),
            })}
          </p>
        )}
      </div>

      {/* Over time, at the chosen aggregation level */}
      {area(metric, t(`charts.area.${dim}`, { country: country.name, level: levelNo }))}

      {/* Composition at the deepest complete level */}
      {(dim === "hf" || dim === "fs" || dim === "hp") &&
        (() => {
          const leaves = data.leaf
            .map(code => ({ code, value: at(data.values[metric]?.[code], compYear) }))
            .filter((r): r is { code: string; value: number } => r.value !== null);
          const color = colorScale(h, data.leaf, dark);
          const title = t(dim === "hp" ? "charts.hierarchy" : "charts.composition", {
            dim: t(`tabs.${dim}`),
            country: country.name,
            year: compYear,
          });
          if (!leaves.length)
            return <p className="text-dim">{t("no_data_year", { year: compYear })}</p>;
          return (
            <div className="flex flex-col gap-3">
              <h5>{title}</h5>
              {dim === "hp" ? (
                <Sunburst
                  leaves={Object.fromEntries(leaves.map(r => [r.code, r.value]))}
                  parent={h.parent}
                  notation={h.sha}
                  color={color}
                  label={label}
                  format={compFormat}
                />
              ) : (
                <Treemap
                  rows={leaves
                    .filter(r => r.value > 0)
                    .map<TreemapRow>(r => ({ family: h.family(r.code), ...r }))}
                  color={color}
                  label={label}
                  format={compFormat}
                />
              )}
              <p className="text-dim text-sm">{t("charts.composition_note")}</p>
            </div>
          );
        })()}

      {/* Trend comparison of individual codes */}
      {TREND_DEFAULTS[dim] &&
        (() => {
          const options = data.codes.map(code => ({ label: label(code), value: code }));
          const series = trendCodes.map(code => slice(data.values[metric]?.[code]));
          const scale = scaleOf(metric, maxAbs(series));
          const color = colorScale(h, trendCodes, dark);
          return (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h5>
                  {t("charts.trend", { country: country.name })} (
                  {t(`units.${scale.unit}`, { ncu })})
                </h5>
                <Dropdown
                  multiple
                  anchor="right"
                  width="w-full sm:w-fit"
                  title={t("filters.compare_codes")}
                  options={options}
                  selected={options.filter(o => trendCodes.includes(o.value))}
                  onChange={(selected: Array<{ value: string }>) =>
                    // Keep classification order so colours stay put
                    setTrendCodes(data.codes.filter(c => selected.some(s => s.value === c)))
                  }
                />
              </div>
              {trendCodes.length ? (
                <Timeseries
                  className="h-[350px] w-full"
                  interval="year"
                  {...yearAxis}
                  generateLabels={lineLegend}
                  round="year"
                  mode="grouped"
                  enableLegend
                  prefixY={scale.prefixY}
                  unitY={scale.unitY}
                  precision={scale.precision}
                  data={{
                    labels: x,
                    datasets: trendCodes.map((code, i) => ({
                      type: "line",
                      label: label(code),
                      data: series[i].map(v => (v === null ? null : v / scale.divisor)),
                      borderColor: color(code),
                      backgroundColor: color(code),
                      borderWidth: 2,
                    })),
                  }}
                />
              ) : (
                <p className="text-dim">{t("charts.trend_empty")}</p>
              )}
            </div>
          );
        })()}

      {dim === "hf" && (
        <FinancialProtection
          country={country}
          oop_share={oop_share}
          sdg382={sdg382}
          transition={transition}
          shared={shared}
        />
      )}

      {dim === "hc" && (
        <>
          <div className="flex flex-col gap-3">
            <h5>{t("charts.govt_private", { country: country.name, level: levelNo })}</h5>
            {data.has_crosstab ? (
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {area("_gghed", t("charts.govt_short"))}
                {area("_pvtd", t("charts.private_short"))}
              </div>
            ) : (
              <p className="text-dim">{t("charts.crosstab_unavailable")}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h5>{t("charts.function_composition", { country: country.name, year: compYear })}</h5>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {(
                [
                  [metric, "total"],
                  ...(data.has_crosstab
                    ? [
                        ["_gghed", "govt"],
                        ["_pvtd", "private"],
                      ]
                    : []),
                ] as Array<[Metric | CrosstabMetric, string]>
              ).map(([m, key]) => {
                const slices = levelCodes
                  .map(code => ({ code, value: at(data.values[m]?.[code], compYear) ?? 0 }))
                  .filter(s => s.value > 0);
                const scale = scaleOf(m, maxAbs([slices.map(s => s.value)]));
                return slices.length ? (
                  <Doughnut
                    key={key}
                    title={t(`charts.${key}`)}
                    slices={slices}
                    color={colorScale(h, levelCodes, dark)}
                    label={label}
                    format={v =>
                      `${scale.prefixY ?? ""}${numFormat(v / scale.divisor, "standard", [1, 1])}${
                        scale.unitY ?? ""
                      }`
                    }
                  />
                ) : null;
              })}
            </div>
          </div>

          {(() => {
            const sources: Array<Metric | CrosstabMetric> = data.has_crosstab
              ? [metric, "_gghed", "_pvtd"]
              : [metric];
            const m = sources[heatmapSource] ?? metric;
            const scale = scaleOf(m, maxAbs(levelCodes.map(code => slice(data.values[m]?.[code]))));
            return (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h5>
                    {t("charts.heatmap", { country: country.name })} (
                    {t(`units.${scale.unit}`, { ncu })})
                  </h5>
                  {data.has_crosstab && (
                    <Tabs.List
                      options={[t("charts.total"), t("charts.govt"), t("charts.private")]}
                      current={heatmapSource}
                      onChange={setHeatmapSource}
                    />
                  )}
                </div>
                <Heatmap
                  className="w-full"
                  height={Math.max(300, levelCodes.length * 30 + 60)}
                  color="blues"
                  prefix={scale.prefixY}
                  unit={scale.unitY}
                  precision={[2, 2]}
                  data={levelCodes.flatMap(code =>
                    inRange.map(y => {
                      const v = at(data.values[m]?.[code], y);
                      return {
                        x: String(y),
                        y: label(code),
                        z: v === null ? null : v / scale.divisor,
                      };
                    })
                  )}
                />
              </div>
            );
          })()}
        </>
      )}

      {/* Data table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h5>{t("table.title")}</h5>
          <button
            className="border-outline dark:border-washed-dark rounded-md border px-3 py-1.5 text-sm"
            onClick={() => setShowTable(!showTable)}
          >
            {t(showTable ? "table.hide" : "table.show")}
          </button>
        </div>
        {showTable && (
          <DataTable dim={dim} data={data} metric={metric} range={range} label={label} ncu={ncu} />
        )}
      </div>

      <div className="text-dim flex flex-col gap-1 pb-12 text-sm">
        <p>{t("glossary")}</p>
        <p>
          {t("disclaimer")} {t("report_errors", { contact: ERROR_REPORT_CONTACT })}
        </p>
        <p>{t("sources.ghed")}</p>
        {dim === "hf" && (
          <>
            <p>{t("sources.sdg382")}</p>
            <p>{t("sources.transition")}</p>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Out-of-pocket share, SDG 3.8.2 catastrophic spending and the health financing transition.
 */
const FinancialProtection: FunctionComponent<
  Pick<SHA2011DashboardProps, "country" | "oop_share" | "sdg382" | "transition" | "shared">
> = ({ country, oop_share, sdg382, transition, shared }) => {
  const { t } = useTranslation(["dashboard-sha-2011", "common"]);
  const { theme } = useTheme();
  const dark = theme === "dark";
  const highlight = HIGHLIGHT[dark ? "dark" : "light"];
  const hoverInk = dark ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK;

  const surveyYears = [...new Set(sdg382.map(([y]) => y))];
  const paths = { ...shared.asean, [country.code]: { name: country.name, transition } };
  // Draw the selected country last so it sits on top
  const order = [...Object.keys(paths).filter(c => c !== country.code), country.code];
  const allYears = order.flatMap(c => paths[c].transition.map(([y]) => y));

  return (
    <>
      <div className="flex flex-col gap-3">
        <h5>{t("charts.financial_protection")}</h5>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {oop_share.length ? (
            <Timeseries
              className="h-[350px] w-full"
              interval="year"
              {...yearAxis}
              generateLabels={lineLegend}
              round="year"
              mode="grouped"
              unitY="%"
              precision={[1, 0]}
              title={t("charts.oop_share", { country: country.name })}
              data={{
                labels: oop_share.map(([y]) => epoch(y)),
                datasets: [
                  {
                    type: "line",
                    label: t("charts.oop_series"),
                    data: oop_share.map(([, v]) => v),
                    borderColor: highlight,
                    backgroundColor: highlight,
                    borderWidth: 2,
                  },
                ],
              }}
            />
          ) : (
            <p className="text-dim">{t("charts.no_oop")}</p>
          )}
          {sdg382.length ? (
            <Timeseries
              className="h-[350px] w-full"
              interval="year"
              {...yearAxis}
              generateLabels={lineLegend}
              round="year"
              mode="grouped"
              type="line"
              enableLegend
              unitY="%"
              precision={[2, 0]}
              title={t("charts.sdg382", { country: country.name })}
              description={t("charts.sdg382_note")}
              data={{
                labels: surveyYears.map(epoch),
                datasets: (["10%", "25%"] as const).map(threshold => ({
                  type: "line",
                  label: t(`charts.sdg382_${threshold === "10%" ? "10" : "25"}`),
                  data: surveyYears.map(
                    y => sdg382.find(([sy, th]) => sy === y && th === threshold)?.[2] ?? null
                  ),
                  borderColor: SDG_COLORS[threshold],
                  backgroundColor: SDG_COLORS[threshold],
                  showLine: false,
                  pointRadius: 6,
                  pointHoverRadius: 8,
                })),
              }}
            />
          ) : (
            <p className="text-dim">{t("charts.no_sdg382", { country: country.name })}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h5>{t("charts.transition", { country: country.name })}</h5>
        <p className="text-dim text-sm">
          {t("charts.transition_note", {
            from: Math.min(...allYears),
            to: Math.max(...allYears),
          })}
        </p>
        <LogScatter
          className="h-[500px] w-full"
          scaleY="linear"
          formatY={v => `${v}%`}
          titleX={t("charts.transition_x")}
          titleY={t("charts.transition_y")}
          tooltipLabel={(p: LogScatterPoint) =>
            t("charts.transition_tooltip", {
              country: p.name,
              year: p.year,
              che: numFormat(p.x, "standard", [0, 0]),
              oop: numFormat(p.y, "standard", [1, 1]),
            })
          }
          datasets={order.map(code => {
            const selected = code === country.code;
            const color = selected ? highlight : AKSARA_COLOR.GREY;
            return {
              label: paths[code].name,
              data: paths[code].transition.map(([year, che, oop]) => ({
                x: che,
                y: oop,
                name: paths[code].name,
                year,
              })),
              showLine: true,
              borderColor: selected ? color : color + "99",
              backgroundColor: color,
              borderWidth: selected ? 3 : 1,
              pointRadius: selected ? 3 : 1.5,
              // Hovering a grey path darkens it; the tooltip names the country
              hoverBorderColor: selected ? color : hoverInk,
              hoverBorderWidth: selected ? 4 : 3,
              pointHoverBackgroundColor: selected ? color : hoverInk,
              pointHoverRadius: 4,
            };
          })}
          highlightOnHover
          legendLabels={() => [
            {
              text: country.name,
              fillStyle: highlight,
              strokeStyle: highlight,
              lineWidth: 0,
              pointStyle: "circle",
            },
            {
              text: t("charts.asean_members"),
              fillStyle: AKSARA_COLOR.GREY,
              strokeStyle: AKSARA_COLOR.GREY,
              lineWidth: 0,
              pointStyle: "circle",
            },
          ]}
        />
      </div>
    </>
  );
};

/**
 * Every code with data, by year, in source units; CAGR column for providers.
 */
const DataTable: FunctionComponent<{
  dim: Dim;
  data: DimensionData;
  metric: Metric;
  range: [number, number];
  label: (code: string) => string;
  /** National currency name for the absolute metric, e.g. "RM" */
  ncu: string;
}> = ({ dim, data, metric, range, label, ncu }) => {
  const { t } = useTranslation(["dashboard-sha-2011"]);
  const years = data.years.slice(range[0], range[1] + 1);
  const withCagr = dim === "hp" && years.length >= 2;
  const span = years[years.length - 1] - years[0];

  return (
    <div className="overflow-x-auto">
      <p className="text-dim pb-2 text-sm">{t(`metrics.${metric}`, { ncu })}</p>
      <table className="w-full whitespace-nowrap text-sm">
        <thead>
          <tr className="border-outline dark:border-washed-dark border-b-2 text-left">
            <th className="sticky left-0 bg-white py-2 pr-4 font-medium dark:bg-black">
              {t("table.code")}
            </th>
            {years.map(y => (
              <th key={y} className="px-3 py-2 text-right font-medium">
                {y}
              </th>
            ))}
            {withCagr && <th className="px-3 py-2 text-right font-medium">{t("table.cagr")}</th>}
          </tr>
        </thead>
        <tbody>
          {data.codes.map(code => {
            const row = (data.values[metric]?.[code] ?? []).slice(range[0], range[1] + 1);
            const first = row[0];
            const last = row[row.length - 1];
            const cagr =
              withCagr && first && last && first > 0 && last > 0
                ? (Math.pow(last / first, 1 / span) - 1) * 100
                : null;
            return (
              <tr key={code} className="border-outline dark:border-washed-dark border-b">
                <td className="sticky left-0 bg-white py-2 pr-4 dark:bg-black">{label(code)}</td>
                {row.map((v, i) => (
                  <td key={years[i]} className="px-3 py-2 text-right tabular-nums">
                    {v === null ? "–" : numFormat(v, "standard", [1, 1])}
                  </td>
                ))}
                {withCagr && (
                  <td className="px-3 py-2 text-right tabular-nums">
                    {cagr === null ? "–" : numFormat(cagr, "standard", [1, 1])}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SHA2011Dashboard;
