import {
  Hero,
  Container,
  Tabs,
  Panel,
  StateDropdown,
  Tooltip,
  Section,
  Stages,
  DonutMeter,
  Dropdown,
  Slider,
} from "@components/index";
import Image from "next/image";
import { FunctionComponent, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useRouter } from "next/router";
import { CountryAndStates, COVID_COLOR } from "@lib/constants";
import { routes } from "@lib/routes";
import { COVID_TABLE_SCHEMA } from "@lib/schema/covid";
import { filterCaseDeath } from "@lib/options";
import { useTranslation } from "next-i18next";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface CovidDashboardProps {
  last_updated: number;
  bar_chart: any;
  snapshot_bar: any;
  snapshot_graphic: any;
  snapshot_table: any;
  timeseries_admitted: any;
  timeseries_cases: any;
  timeseries_deaths: any;
  timeseries_icu: any;
  timeseries_tests: any;
  timeseries_vents: any;
  util_chart: any;
}

const CovidDashboard: FunctionComponent<CovidDashboardProps> = ({
  last_updated,
  bar_chart,
  snapshot_bar,
  snapshot_graphic,
  snapshot_table,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { t } = useTranslation("common");

  const { data, setData } = useData({
    show_indicator: {
      label: t(`covid.${filterCaseDeath[0].value}`),
      value: filterCaseDeath[0].value,
    },
    filter_death: 0,
    filter_state: 0,
    filter_cases: 0,
    minmax: [0, timeseries_deaths.x.length - 1],
  });

  const filterTimeline = () => {
    return {
      x: timeseries_deaths.x.slice(data.minmax[0], data.minmax[1]),
      deaths_line: timeseries_deaths.line.slice(data.minmax[0], data.minmax[1]),
      deaths_inpatient: timeseries_deaths.deaths_inpatient.slice(data.minmax[0], data.minmax[1]),
      deaths_broughtin: timeseries_deaths.deaths_brought_in.slice(data.minmax[0], data.minmax[1]),
      vents_line: timeseries_vents.line.slice(data.minmax[0], data.minmax[1]),
      vents_vent: timeseries_vents.vent.slice(data.minmax[0], data.minmax[1]),
      icu_line: timeseries_icu.line.slice(data.minmax[0], data.minmax[1]),
      icu_icu: timeseries_icu.icu.slice(data.minmax[0], data.minmax[1]),
      admitted_line: timeseries_admitted.line.slice(data.minmax[0], data.minmax[1]),
      admitted_admitted: timeseries_admitted.admitted.slice(data.minmax[0], data.minmax[1]),
      cases_line: timeseries_cases.line.slice(data.minmax[0], data.minmax[1]),
      cases_cases: timeseries_cases.cases.slice(data.minmax[0], data.minmax[1]),
      tests_posrate: timeseries_tests.tooltip.slice(data.minmax[0], data.minmax[1]),
      tests_rtk: timeseries_tests.tests_rtk.slice(data.minmax[0], data.minmax[1]),
      tests_pcr: timeseries_tests.tests_pcr.slice(data.minmax[0], data.minmax[1]),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [
    data.minmax,
    timeseries_admitted,
    timeseries_cases,
    timeseries_deaths,
    timeseries_icu,
    timeseries_tests,
    timeseries_vents,
  ]);
  const interval_scale = useMemo(
    () =>
      filtered_timeline().x.length > 180
        ? "month"
        : filtered_timeline().x.length > 60
        ? "week"
        : "day",
    [filtered_timeline().x]
  );

  const BarTabsMenu = [
    {
      name: t("covid.tab_table2"),
      title: t("covid.tab_table2") + " per 100K",
      data: snapshot_bar.deaths,
    },
    {
      name: "Vent.",
      title: "Ventilator per 100K",
      data: snapshot_bar.util_vent,
    },
    {
      name: "ICU",
      title: "ICU per 100K",
      data: snapshot_bar.util_icu,
    },
    {
      name: "Hosp.",
      title: "Hospital per 100K",
      data: snapshot_bar.util_hosp,
    },
    {
      name: t("covid.tab_table4"),
      title: t("covid.tab_table4") + " per 100K",
      data: snapshot_bar.cases,
    },
  ];

  return (
    <>
      <Hero background="covid-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("covid.title")}
          </span>
          <h3 className="text-black">
            {t("covid.title_header", { state: CountryAndStates[currentState] })}
          </h3>
          <p className="text-dim">{t("covid.title_description1")}</p>
          <p className="text-dim">
            {t("covid.title_description2")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              {t("covid.description_link")}
            </a>
          </p>

          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("covid.zoom")}</p>
            <StateDropdown url={routes.COVID} currentState={currentState} exclude={["kvy"]} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* Utilisations */}
        <Section
          title={t("covid.donut_header")}
          description={
            <p className="pt-4 text-sm text-dim">
              {t("common.data_for", { state: CountryAndStates[currentState] })}
            </p>
          }
          date={last_updated}
        >
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_vent} />
              <div>
                <p className="text-dim">{t("covid.donut1")}</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_vent.toFixed(1)}%
                    </span>
                  }
                >
                  {t("covid.donut1_tooltips")}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_icu} />
              <div>
                <p className="text-dim">{t("covid.donut2")}</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_icu.toFixed(1)}%
                    </span>
                  }
                >
                  {t("covid.donut2_tooltips")}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_hosp} />
              <div>
                <p className="text-dim">{t("covid.donut3")}</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_hosp.toFixed(1)}%
                    </span>
                  }
                >
                  {t("covid.donut3_tooltips")}
                </Tooltip>
              </div>
            </div>
            {util_chart.util_pkrc ? (
              <div className="flex items-center gap-3">
                <DonutMeter value={util_chart.util_pkrc} />
                <div>
                  <p className="text-dim">{t("covid.donut4")}</p>
                  <Tooltip
                    trigger={
                      <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                        {util_chart.util_pkrc && +util_chart.util_pkrc.toFixed(1)}%
                      </span>
                    }
                  >
                    {t("covid.donut4_tooltips")}
                  </Tooltip>
                </div>
              </div>
            ) : undefined}
          </div>
        </Section>

        {/* What does the latest data show? */}
        <Section title={t("covid.diagram_header")} date={last_updated}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-1 xl:col-span-2">
              <Stages
                title={t("covid.diagram_subheader")}
                className="h-full pt-4"
                state={currentState}
                // menu={<MenuDropdown />}
                data={{
                  header: {
                    name: `${t("covid.diagram_title")}`,
                    value: snapshot_graphic.cases_active,
                    delta: snapshot_graphic.cases_active_annot,
                    inverse: true,
                  },
                  col_1: [
                    {
                      name: `${t("covid.col1_title1")}`,
                      value: snapshot_graphic.cases_local,
                      delta: snapshot_graphic.cases_local_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/virus.svg"
                          height={32}
                          width={32}
                          alt="Local Cases"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col1_title2")}`,
                      value: snapshot_graphic.cases_import,
                      delta: snapshot_graphic.cases_import_annot,
                      inverse: true,
                    },
                  ],
                  col_2: [
                    {
                      name: `${t("covid.col2_title1")}`,
                      value: snapshot_graphic.home,
                      delta: snapshot_graphic.home_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/home-quarantine.svg"
                          height={32}
                          width={32}
                          alt="Home Quarantine"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title2")}`,
                      value: snapshot_graphic.pkrc,
                      delta: snapshot_graphic.pkrc_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/pkrc.svg"
                          height={32}
                          width={32}
                          alt="PKRC"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title3")}`,
                      value: snapshot_graphic.hosp,
                      delta: snapshot_graphic.hosp_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/hospitalised.svg"
                          height={32}
                          width={32}
                          alt="Hospitalised"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title4")}`,
                      value: snapshot_graphic.icu,
                      delta: snapshot_graphic.icu_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-unventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Unventilated)"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title5")}`,
                      value: snapshot_graphic.vent,
                      delta: snapshot_graphic.vent_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-ventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Ventilated)"
                        />
                      ),
                    },
                  ],
                  col_3: [
                    {
                      name: `${t("covid.col3_title1")}`,
                      value: snapshot_graphic.cases_recovered,
                      delta: snapshot_graphic.cases_recovered_annot,
                      icon: (
                        <Image
                          src="/static/images/stages/recovered.svg"
                          height={32}
                          width={32}
                          alt="Recovered"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col3_title2")}`,
                      value: snapshot_graphic.deaths,
                      delta: snapshot_graphic.deaths_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/death.svg"
                          height={32}
                          width={32}
                          alt="Deaths (Including BID)"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col3_title3")}`,
                      value: snapshot_graphic.deaths_bid,
                      delta: snapshot_graphic.deaths_bid_annot,
                      inverse: true,
                    },
                  ],
                }}
              />
            </div>
            <div className="col-span-1">
              {/* <ChartHeader title={} // menu={<MenuDropdown />} /> */}

              <Tabs
                title={BarTabsMenu[data.filter_state].title}
                className="w-full"
                onChange={value => setData("filter_state", value)}
              >
                {BarTabsMenu.map(({ name, data }, index) => {
                  return (
                    <Panel key={index} name={name}>
                      <BarMeter
                        className="block w-full space-y-2 pt-4"
                        data={data}
                        yKey="y"
                        xKey="x"
                        layout="state-horizontal"
                        relative
                        sort="desc"
                      />
                    </Panel>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section title={t("covid.area_chart_header")} date={last_updated}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title1")}
              state={currentState}
              // menu={<MenuDropdown />}
              interval={interval_scale}
              //    stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().deaths_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart_tooltip2")}`,
                    data: filtered_timeline().deaths_inpatient,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart_tooltip3")}`,
                    data: filtered_timeline().deaths_broughtin,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title2")}
              state={currentState}
              interval={interval_scale}
              // menu={<MenuDropdown />}
              //   stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart2_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().vents_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart2_tooltip2")}`,
                    data: filtered_timeline().vents_vent,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title3")}
              state={currentState}
              // menu={<MenuDropdown />}
              interval={interval_scale}
              //   stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart3_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().icu_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart3_tooltip2")}`,
                    data: filtered_timeline().icu_icu,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title4")}
              state={currentState}
              // menu={<MenuDropdown />}
              interval={interval_scale}
              //   stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart4_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().admitted_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart4_tooltip2")}`,
                    data: filtered_timeline().admitted_admitted,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title5")}
              state={currentState}
              // menu={<MenuDropdown />}
              interval={interval_scale}
              // enableLegend
              //   stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart5_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().cases_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart5_tooltip2")}`,
                    data: filtered_timeline().cases_cases,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title6")}
              state={currentState}
              // menu={<MenuDropdown />}
              interval={interval_scale}
              //   stats={[
              //     {
              //       title: t("vaccination.daily"),
              //       value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
              //     },
              //     {
              //       title: `${t("vaccination.total")}`,
              //       value: `${stats_data.daily_primary.total.toLocaleString()}`,
              //     },
              //   ]}
              enableRightScale
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart6_tooltip1")}`,
                    pointRadius: 0,
                    borderColor: COVID_COLOR[300],
                    data: filtered_timeline().tests_posrate,
                    borderWidth: 1.5,
                    yAxisID: "y1",
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart6_tooltip2")}`,
                    data: filtered_timeline().tests_rtk,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart6_tooltip3")}`,
                    data: filtered_timeline().tests_pcr,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
          </div>
          <div>
            <Slider
              className="pt-7"
              type="range"
              data={timeseries_deaths.x}
              defaultValue={data.minmax}
              onChange={(item: { min: number; max: number }) =>
                setData("minmax", [item.min, item.max])
              }
            />
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>

        {/* How vaccinated against COVID-19 are we? */}
        <Section title={t("covid.table_header")} date={last_updated}>
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title={t("covid.table_subheader")}
            >
              {COVID_TABLE_SCHEMA().map((menu, index) => {
                return (
                  <Panel key={index} name={menu.name}>
                    <Table data={snapshot_table} config={menu.config} />
                  </Panel>
                );
              })}
            </Tabs>
          </div>
        </Section>

        <Section
          title={t("covid.bar_chart_header")}
          description={t("covid.bar_chart_subheader")}
          date={last_updated}
        >
          <Tabs
            title={
              {
                cases:
                  data.filter_cases === 0
                    ? `${t("covid.bar_chart_cases1")}`
                    : `${t("covid.bar_chart_cases2")}`,
                deaths:
                  data.filter_deaths === 0
                    ? `${t("covid.bar_chart_Deaths1")}`
                    : `${t("covid.bar_chart_Deaths2")}`,
              }[data.show_indicator.value as string]
            }
            state={currentState}
            controls={
              <Dropdown
                options={filterCaseDeath.map(option => {
                  return {
                    label: t(`covid.${option.value}`),
                    value: option.value,
                  };
                })}
                selected={data.show_indicator}
                onChange={e => setData("show_indicator", e)}
              />
            }
            onChange={value => setData("filter_death", value)}
          >
            <Panel name={t("covid.bar_chart1_type")}>
              <>
                {
                  {
                    cases: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.cases.capita.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.cases.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.cases.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.cases.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.cases.capita.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                    deaths: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.deaths.capita.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.deaths.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.deaths.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.deaths.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.deaths.capita.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                  }[data.show_indicator.value as string]
                }
              </>
            </Panel>
            <Panel name={t("covid.bar_chart2_type")}>
              <>
                {
                  {
                    cases: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.cases.abs.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.cases.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.cases.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.cases.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.cases.abs.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                    deaths: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.deaths.abs.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.deaths.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.deaths.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.deaths.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.deaths.abs.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                  }[data.show_indicator.value as string]
                }
              </>
            </Panel>
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default CovidDashboard;
