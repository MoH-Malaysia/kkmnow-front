import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Dropdown,
  Slider,
  Section,
  BarMeter,
  Tooltip,
  StateDropdown,
} from "@components/index";
import { FunctionComponent, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { VACCINE_TABLE_SCHEMA } from "@lib/schema/covid-vaccination";
import { filterAgeOptions, filterDoseOptions } from "@lib/options";
import { CountryAndStates, COVIDVAX_COLOR, GRAYBAR_COLOR } from "@lib/constants";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

interface CovidVaccinationProps {
  waffle_data: Array<any>;
  barmeter_data: Array<any>;
  table_data: Array<any>;
  timeseries_data: any;
  stats_data: Record<string, any>;
}

const CovidVaccinationDashboard: FunctionComponent<CovidVaccinationProps> = ({
  waffle_data,
  table_data,
  barmeter_data,
  timeseries_data,
  stats_data,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    vax_tab: 0,
    filter_dose: filterDoseOptions[0],
    filter_age: filterAgeOptions[0],
    minmax: [timeseries_data.x.length - 182, timeseries_data.x.length - 1], // [6months ago, today]
  });

  const filterTimeline = () => {
    return {
      x: timeseries_data.x.slice(data.minmax[0], data.minmax[1]),
      line_stacked: timeseries_data.line_stacked.slice(data.minmax[0], data.minmax[1]),
      primary: timeseries_data.primary.slice(data.minmax[0], data.minmax[1]),
      booster: timeseries_data.booster.slice(data.minmax[0], data.minmax[1]),
      booster2: timeseries_data.booster2.slice(data.minmax[0], data.minmax[1]),
      adult: timeseries_data.adult.slice(data.minmax[0], data.minmax[1]),
      adol: timeseries_data.adol.slice(data.minmax[0], data.minmax[1]),
      child: timeseries_data.child.slice(data.minmax[0], data.minmax[1]),
      line_primary: timeseries_data.line_primary.slice(data.minmax[0], data.minmax[1]),
      line_booster: timeseries_data.line_booster.slice(data.minmax[0], data.minmax[1]),
      line_booster2: timeseries_data.line_booster2.slice(data.minmax[0], data.minmax[1]),
      line_adult: timeseries_data.line_adult.slice(data.minmax[0], data.minmax[1]),
      line_adol: timeseries_data.line_adol.slice(data.minmax[0], data.minmax[1]),
      line_child: timeseries_data.line_child.slice(data.minmax[0], data.minmax[1]),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries_data]);
  const interval_scale = useMemo(
    () =>
      filtered_timeline().x.length > 180
        ? "month"
        : filtered_timeline().x.length > 60
        ? "week"
        : "day",
    [filtered_timeline().x]
  );

  const renderFilterOptions = () => {
    switch (data.vax_tab) {
      case 0:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_age", item)}
            selected={data.filter_age}
            options={filterAgeOptions}
          />
        );
      case 1:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_dose", item)}
            selected={data.filter_dose}
            options={filterDoseOptions}
          />
        );
    }
  };

  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            covid-19 vaccination
          </span>
          <h3 className="text-black">The latest data on the pandemic in Malaysia.</h3>
          <p className="text-dim">
            Drawing from the Ministry of Health's excellent COVIDNOW dashboard, this page allows you
            to track the evolution of the epidemic in Malaysia on a daily basis.
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
            <StateDropdown url={routes.COVID_VAX} currentState={currentState} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section title="How vaccinated against COVID-19 are we?">
          <Tabs
            state={
              <p className="text-dim">
                Data for {CountryAndStates[currentState]} |{" "}
                {data.vax_tab === 0 ? data.filter_age.label : data.filter_dose.label}
              </p>
            }
            className="pb-4"
            current={data.vax_tab}
            onChange={index => setData("vax_tab", index)}
            controls={<>{renderFilterOptions()}</>}
          >
            <Panel name="Filter by Age group">
              <div className="grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-4 lg:gap-6">
                <Waffle
                  className="aspect-square w-full lg:h-[250px] lg:w-auto"
                  title={
                    <div className="flex self-center text-base font-bold">
                      1st Dose -
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].dose1.perc as number).toFixed(1)}%
                          </span>
                        }
                      >
                        Tooltip for Dose 1
                      </Tooltip>
                    </div>
                  }
                  color="#9FE8B1"
                  data={waffle_data[data.filter_age.value].dose1.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].dose1.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[250px] lg:w-auto"
                  title={
                    <div className="flex self-center text-base font-bold">
                      2nd Dose -
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].dose2.perc as number).toFixed(1)}%
                          </span>
                        }
                      >
                        Tooltip for Dose 2
                      </Tooltip>
                    </div>
                  }
                  color="#31C752"
                  data={waffle_data[data.filter_age.value].dose2.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].dose2.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[250px] lg:w-auto"
                  title={
                    <div className="flex self-center text-base font-bold">
                      1st Booster -
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].booster1.perc as number).toFixed(
                              1
                            )}
                            %
                          </span>
                        }
                      >
                        Tooltip for Booster 1
                      </Tooltip>
                    </div>
                  }
                  color="#228F3A"
                  data={waffle_data[data.filter_age.value].booster1.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].booster1.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[250px] lg:w-auto"
                  title={
                    <div className="flex self-center text-base font-bold">
                      2nd Booster -{" "}
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].booster2.perc as number).toFixed(
                              1
                            )}
                            %
                          </span>
                        }
                      >
                        Tooltip for Booster 2
                      </Tooltip>
                    </div>
                  }
                  color="#135523"
                  data={waffle_data[data.filter_age.value].booster2.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].booster2.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
              </div>
            </Panel>
            <Panel name="Filter by Dose">
              <BarMeter
                className="flex h-[320px] w-full justify-between"
                data={barmeter_data[data.filter_dose.value]}
                xKey="id"
                unit="%"
              />
            </Panel>
          </Tabs>
        </Section>

        {/* What is the current state of the COVID-19 vaccination program? */}
        <Section title="What is the current state of the COVID-19 vaccination program?">
          <div className="space-y-4">
            <Timeseries
              className="h-[350px] w-full pt-6"
              title="Daily Vaccination"
              state={currentState}
              // menu={<MenuDropdown />}
              stats={null}
              interval={interval_scale}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_stacked,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Primary",
                    data: filtered_timeline().primary,
                    backgroundColor: GRAYBAR_COLOR[100],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: "Booster 1",
                    data: filtered_timeline().booster,
                    backgroundColor: GRAYBAR_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: "Booster 2",
                    data: filtered_timeline().booster2,
                    backgroundColor: GRAYBAR_COLOR[200],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Slider
              className="pt-7"
              type="range"
              data={timeseries_data.x}
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

        {/* How are COVID-19 key indicators trending */}
        <Section title="How are COVID-19 key indicators trending?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              title="Primary Doses (All Ages)"
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              state={currentState}
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_primary,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Primary",
                    data: filtered_timeline().primary,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_primary.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_primary.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title="1st Boosters (All Ages)"
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              state={currentState}
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_booster,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Booster",
                    data: filtered_timeline().booster,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_booster.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_booster.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title="2nd Boosters (All Ages)"
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_booster2,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Booster 2",
                    data: filtered_timeline().booster2,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_booster2.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_booster2.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title="Adults (All Doses)"
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_adult,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Adult",
                    data: filtered_timeline().adult,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_adult.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_adult.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title="Adolescents (All Doses)"
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_adol,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Adolescent",
                    data: filtered_timeline().adol,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_adol.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_adol.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title="Children (All Doses)"
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    pointRadius: 0,
                    data: filtered_timeline().line_child,
                    borderColor: COVIDVAX_COLOR[300],
                  },
                  {
                    type: "bar",
                    label: "Primary",
                    data: filtered_timeline().child,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: "Daily",
                  value: `+${stats_data.daily_child.daily.toLocaleString()}`,
                },
                {
                  title: "Total",
                  value: `${stats_data.daily_child.total.toLocaleString()}`,
                },
              ]}
            />
          </div>
        </Section>

        {/* Which states are best vaccinated against COVID-19? */}
        <Section title="Which states are best vaccinated against COVID-19?">
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title="Vaccination Progress by State"
            >
              {VACCINE_TABLE_SCHEMA.map((menu, index) => {
                return (
                  <Panel key={index} name={menu.name}>
                    <Table data={table_data} config={menu.config} />
                  </Panel>
                );
              })}
            </Tabs>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CovidVaccinationDashboard;
