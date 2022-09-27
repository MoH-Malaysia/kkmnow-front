import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  StateDropdown,
  Tooltip,
  Section,
  ChartHeader,
  Stages,
  DonutMeter,
  Dropdown,
  Slider,
} from "@components/index";
import { FunctionComponent, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useRouter } from "next/router";
import { CountryAndStates, COVID_COLOR } from "@lib/constants";
import { routes } from "@lib/routes";
import { COVID_TABLE_SCHEMA } from "@lib/schema/covid";
import { filterCaseDeath } from "@lib/options";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Donut = dynamic(() => import("@components/Chart/Donut"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface CovidDashboardProps {
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

  const { data, setData } = useData({
    show_indicator: filterCaseDeath[0],
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

  const filtered_timeline = useCallback(filterTimeline, data.minmax);
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
      name: "Deaths",
      title: "Deaths per 100K",
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
      name: "Cases",
      title: "Cases per 100K",
      data: snapshot_bar.cases,
    },
  ];

  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">covid-19</span>
          <h3 className="text-black">The latest data on the pandemic in Malaysia.</h3>
          <p className="text-dim">
            Drawing from the Ministry of Health's excellent CovidDashboard dashboard, this page
            allows you to track the evolution of the epidemic in Malaysia on a daily basis.
          </p>
          <p className="text-dim">
            For a more general look at infectious diseases such as measles, chicken pox, and HFMD,
            head on over to our{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              Infectious Diseases Dashboard.
            </a>
          </p>

          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">Zoom into</p>
            <StateDropdown url={routes.COVID} currentState={currentState} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* Utilisations */}
        <Section
          title="Healthcare facility utilisation"
          description={
            <p className="text-sm text-dim">Data for {CountryAndStates[currentState]}</p>
          }
        >
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_vent} />
              <div>
                <p className="text-dim">Ventilators</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_vent.toFixed(1)}%
                    </span>
                  }
                >
                  Tooltip for Ventilators
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_icu} />
              <div>
                <p className="text-dim">ICUs</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_icu.toFixed(1)}%
                    </span>
                  }
                >
                  Tooltip for ICUs
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.util_hosp} />
              <div>
                <p className="text-dim">Hospital Beds</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      {+util_chart.util_hosp.toFixed(1)}%
                    </span>
                  }
                >
                  Tooltip for Hospital Beds
                </Tooltip>
              </div>
            </div>
            {util_chart.util_pkrc && (
              <div className="flex items-center gap-3">
                <DonutMeter value={util_chart.util_pkrc} />
                <div>
                  <p className="text-dim">PKRC</p>
                  <Tooltip
                    trigger={
                      <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                        {util_chart.util_pkrc && +util_chart.util_pkrc.toFixed(1)}%
                      </span>
                    }
                  >
                    Tooltip for PKRC
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* What does the latest data show? */}
        <Section title="What does the latest data show?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2">
              <Stages
                title="Active COVID-19 Cases"
                className="h-full pt-10"
                state={currentState}
                menu={<MenuDropdown />}
                data={{
                  header: {
                    name: "Active Cases",
                    value: snapshot_graphic.cases_active,
                    delta: snapshot_graphic.cases_active_annot,
                    inverse: true,
                  },
                  col_1: [
                    {
                      name: "Local Cases",
                      value: snapshot_graphic.cases_local,
                      delta: snapshot_graphic.cases_local_annot,
                      inverse: true,
                      icon: <img src="/static/images/stages/virus.svg" className="h-8 w-8" />,
                    },
                    {
                      name: "Imported Cases",
                      value: snapshot_graphic.cases_import,
                      delta: snapshot_graphic.cases_import_annot,
                      inverse: true,
                    },
                  ],
                  col_2: [
                    {
                      name: "Home Quarantine",
                      value: snapshot_graphic.home,
                      delta: snapshot_graphic.home_annot,
                      unit: "%",
                      icon: (
                        <img src="/static/images/stages/home-quarantine.svg" className="h-8 w-8" />
                      ),
                    },
                    {
                      name: "PKRC",
                      value: snapshot_graphic.pkrc,
                      delta: snapshot_graphic.pkrc_annot,
                      unit: "%",
                      icon: <img src="/static/images/stages/pkrc.svg" className="h-8 w-8" />,
                    },
                    {
                      name: "Hospitalised",
                      value: snapshot_graphic.hosp,
                      delta: snapshot_graphic.hosp_annot,
                      unit: "%",
                      icon: (
                        <img src="/static/images/stages/hospitalised.svg" className="h-8 w-8" />
                      ),
                    },
                    {
                      name: "ICU (Unventilated)",
                      value: snapshot_graphic.icu,
                      delta: snapshot_graphic.icu_annot,
                      unit: "%",
                      icon: (
                        <img src="/static/images/stages/icu-unventilated.svg" className="h-8 w-8" />
                      ),
                    },
                    {
                      name: "ICU (Ventilated)",
                      value: snapshot_graphic.vent,
                      delta: snapshot_graphic.vent_annot,
                      unit: "%",
                      icon: (
                        <img src="/static/images/stages/icu-ventilated.svg" className="h-8 w-8" />
                      ),
                    },
                  ],
                  col_3: [
                    {
                      name: "Recovered",
                      value: snapshot_graphic.cases_recovered,
                      delta: snapshot_graphic.cases_recovered_annot,
                      icon: <img src="/static/images/stages/recovered.svg" className="h-8 w-8" />,
                    },
                    {
                      name: "Death (Including BID)",
                      value: snapshot_graphic.deaths,
                      delta: snapshot_graphic.deaths_annot,
                      inverse: true,
                      icon: <img src="/static/images/stages/death.svg" className="h-8 w-8" />,
                    },
                    {
                      name: "Brought in Dead",
                      value: snapshot_graphic.deaths_bid,
                      delta: snapshot_graphic.deaths_bid_annot,
                      inverse: true,
                    },
                  ],
                }}
              />
            </div>
            <div className="col-span-1">
              <ChartHeader title={BarTabsMenu[data.filter_state].title} menu={<MenuDropdown />} />

              <Tabs onChange={value => setData("filter_state", value)}>
                {BarTabsMenu.map(({ name, data }, index) => {
                  return (
                    <Panel key={index} name={name}>
                      <BarMeter
                        className="block space-y-2"
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
        <Section title="How are COVID-19 key indicators trending?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              className="h-[300px] w-full"
              title="Deaths by Date of Death"
              state={currentState}
              menu={<MenuDropdown />}
              interval={interval_scale}
              stats={null}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().deaths_line,
                    borderColor: COVID_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "In-patient",
                    data: filtered_timeline().deaths_inpatient,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: "Brought in dead",
                    data: filtered_timeline().deaths_broughtin,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[300px] w-full"
              title="Patients Ventilated"
              state={currentState}
              interval={interval_scale}
              menu={<MenuDropdown />}
              stats={null}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().vents_line,
                    borderColor: COVID_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Patients ventilated",
                    data: filtered_timeline().vents_vent,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[300px] w-full"
              title="Patients in ICU"
              state={currentState}
              menu={<MenuDropdown />}
              interval={interval_scale}
              stats={null}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().icu_line,
                    borderColor: COVID_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "ICU admitted",
                    data: filtered_timeline().icu_icu,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[300px] w-full"
              title="Hospital Admissions"
              state={currentState}
              menu={<MenuDropdown />}
              interval={interval_scale}
              stats={null}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().admitted_line,
                    borderColor: COVID_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Patients admitted",
                    data: filtered_timeline().admitted_admitted,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[300px] w-full"
              title="Confirmed Cases"
              state={currentState}
              menu={<MenuDropdown />}
              interval={interval_scale}
              // enableLegend
              stats={null}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().cases_line,
                    borderColor: COVID_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Cases",
                    data: filtered_timeline().cases_cases,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[300px] w-full"
              title="Tests Conducted"
              state={currentState}
              menu={<MenuDropdown />}
              interval={interval_scale}
              stats={null}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Positivity Rate (%)",
                    pointRadius: 0,
                    data: filtered_timeline().tests_posrate,
                    showLine: false,
                  },
                  {
                    type: "bar",
                    label: "RTK",
                    data: filtered_timeline().tests_rtk,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: "PCR",
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
            <span className="text-sm text-dim">
              Use this time slider to zoom in specific time range
            </span>
          </div>
        </Section>

        {/* How vaccinated against COVID-19 are we? */}
        <Section title="How vaccinated against COVID-19 are we?">
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title="Vaccination Progress by State"
            >
              {COVID_TABLE_SCHEMA.map((menu, index) => {
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
          title="How is vaccination influencing key epidemic indicators?"
          description="Some description here"
        >
          <Tabs
            title={
              {
                cases:
                  data.filter_cases === 0
                    ? "Cases per 100k by Vaccination Status"
                    : "Cases by Vaccination Status",
                deaths:
                  data.filter_deaths === 0
                    ? "Deaths per 100k by Vaccination Status"
                    : "Deaths by Vaccination Status",
              }[data.show_indicator.value as string]
            }
            state={currentState}
            controls={
              <Dropdown
                options={filterCaseDeath}
                selected={data.show_indicator}
                onChange={e => setData("show_indicator", e)}
              />
            }
            onChange={value => setData("filter_death", value)}
          >
            <Panel name="Per Capita">
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
                              label: "Unvaccinated",
                              data: bar_chart.cases.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: "Partially Vaccinated",
                              data: bar_chart.cases.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: "Fully Vaccinated",
                              data: bar_chart.cases.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: "Boosted",
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
                              label: "Unvaccinated",
                              data: bar_chart.deaths.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: "Partially Vaccinated",
                              data: bar_chart.deaths.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: "Fully Vaccinated",
                              data: bar_chart.deaths.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: "Boosted",
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
            <Panel name="Absolute">
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
                              label: "Unvaccinated",
                              data: bar_chart.cases.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: "Partially Vaccinated",
                              data: bar_chart.cases.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: "Fully Vaccinated",
                              data: bar_chart.cases.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: "Boosted",
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
                              label: "Unvaccinated",
                              data: bar_chart.deaths.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: "Partially Vaccinated",
                              data: bar_chart.deaths.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: "Fully Vaccinated",
                              data: bar_chart.deaths.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: "Boosted",
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
