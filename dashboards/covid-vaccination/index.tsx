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
import { useTranslation } from "next-i18next";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

interface CovidVaccinationProps {
  last_updated: number;
  waffle_data: Array<any>;
  barmeter_data: Array<any>;
  table_data: Array<any>;
  timeseries_data: any;
  stats_data: Record<string, any>;
}

const CovidVaccinationDashboard: FunctionComponent<CovidVaccinationProps> = ({
  last_updated,
  waffle_data,
  table_data,
  barmeter_data,
  timeseries_data,
  stats_data,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    vax_tab: 0,
    filter_dose: {
      label: t(`vaccination.${filterDoseOptions[0].value}`),
      value: filterDoseOptions[0].value,
    },
    filter_age: {
      label: t(`vaccination.${filterAgeOptions[0].value}`),
      value: filterAgeOptions[0].value,
    },
    minmax: [timeseries_data.x.length - 182, timeseries_data.x.length - 1], // [6months ago, today]
  });

  const filterTimeline = () => {
    return {
      x: timeseries_data.x.slice(data.minmax[0], data.minmax[1] + 1),
      line_stacked: timeseries_data.line_stacked.slice(data.minmax[0], data.minmax[1] + 1),
      primary: timeseries_data.primary.slice(data.minmax[0], data.minmax[1] + 1),
      booster: timeseries_data.booster.slice(data.minmax[0], data.minmax[1] + 1),
      booster2: timeseries_data.booster2.slice(data.minmax[0], data.minmax[1] + 1),
      adult: timeseries_data.adult.slice(data.minmax[0], data.minmax[1] + 1),
      adol: timeseries_data.adol.slice(data.minmax[0], data.minmax[1] + 1),
      child: timeseries_data.child.slice(data.minmax[0], data.minmax[1] + 1),
      line_primary: timeseries_data.line_primary.slice(data.minmax[0], data.minmax[1] + 1),
      line_booster: timeseries_data.line_booster.slice(data.minmax[0], data.minmax[1] + 1),
      line_booster2: timeseries_data.line_booster2.slice(data.minmax[0], data.minmax[1] + 1),
      line_adult: timeseries_data.line_adult.slice(data.minmax[0], data.minmax[1] + 1),
      line_adol: timeseries_data.line_adol.slice(data.minmax[0], data.minmax[1] + 1),
      line_child: timeseries_data.line_child.slice(data.minmax[0], data.minmax[1] + 1),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries_data]);

  const renderFilterOptions = () => {
    switch (data.vax_tab) {
      case 0:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_age", item)}
            selected={data.filter_age}
            options={filterAgeOptions.map(option => {
              return {
                label: t(`vaccination.${option.value}`),
                value: option.value,
              };
            })}
          />
        );
      case 1:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_dose", item)}
            selected={data.filter_dose}
            options={filterDoseOptions.map(option => {
              return {
                label: t(`vaccination.${option.value}`),
                value: option.value,
              };
            })}
          />
        );
    }
  };

  return (
    <>
      <Hero background="covidvax-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("vaccination.title")}
          </span>
          <h3 className="text-black">
            {t("vaccination.title_header", { state: CountryAndStates[currentState] })}
          </h3>
          <p className="text-dim">{t("vaccination.title_description1")}</p>
          <p className="text-dim">
            {t("vaccination.title_description2")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              {t("vaccination.description_link")}
            </a>
          </p>

          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("vaccination.zoom")}</p>
            <StateDropdown url={routes.COVID_VAX} currentState={currentState} exclude={["kvy"]} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section title={t("vaccination.waffle_header")} date={last_updated}>
          <Tabs
            state={
              <p className="text-dim">
                {t("common.data_for", { state: CountryAndStates[currentState] })} |{" "}
                {data.vax_tab === 0 ? data.filter_age.label : data.filter_dose.label}
              </p>
            }
            className="pb-4"
            current={data.vax_tab}
            onChange={index => setData("vax_tab", index)}
            controls={<>{renderFilterOptions()}</>}
          >
            <Panel name={t("vaccination.filter_age")}>
              <div className="grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-4 lg:gap-6">
                <Waffle
                  className="aspect-square w-full lg:h-[250px] lg:w-auto"
                  title={
                    <div className="flex self-center text-base font-bold">
                      {t("vaccination.dose1")} -
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].dose1.perc as number).toFixed(1)}%
                          </span>
                        }
                      >
                        {t("vaccination.tooltips_dose1")}
                      </Tooltip>
                    </div>
                  }
                  color="#9FE8B1"
                  data={waffle_data[data.filter_age.value].dose1.data}
                >
                  <div className="text-dim">
                    <p>
                      {t("vaccination.total")} -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      {t("vaccination.daily")} -{" "}
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
                      {t("vaccination.dose2")} -
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].dose2.perc as number).toFixed(1)}%
                          </span>
                        }
                      >
                        {t("vaccination.tooltips_dose2")}
                      </Tooltip>
                    </div>
                  }
                  color="#31C752"
                  data={waffle_data[data.filter_age.value].dose2.data}
                >
                  <div className="text-dim">
                    <p>
                      {t("vaccination.total")} -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      {t("vaccination.daily")} -{" "}
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
                      {t("vaccination.booster1")} -
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
                        {t("vaccination.tooltips_booster1")}
                      </Tooltip>
                    </div>
                  }
                  color="#228F3A"
                  data={waffle_data[data.filter_age.value].booster1.data}
                >
                  <div className="text-dim">
                    <p>
                      {t("vaccination.total")} -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      {t("vaccination.daily")} -{" "}
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
                      {t("vaccination.booster2")} -{" "}
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
                        {t("vaccination.tooltips_booster2")}
                      </Tooltip>
                    </div>
                  }
                  color="#135523"
                  data={waffle_data[data.filter_age.value].booster2.data}
                >
                  <div className="text-dim">
                    <p>
                      {t("vaccination.total")} -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      {t("vaccination.daily")}-{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].booster2.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
              </div>
            </Panel>
            <Panel name={t("vaccination.filter_dose")}>
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
        <Section title={t("vaccination.combine_header")} date={last_updated}>
          <div className="space-y-4">
            <Timeseries
              className="h-[350px] w-full pt-6"
              title={t("vaccination.combine_title")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={null}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.combine_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_stacked,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.combine_tooltip2")}`,
                    data: filtered_timeline().primary,
                    backgroundColor: GRAYBAR_COLOR[100],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.combine_tooltip3")}`,
                    data: filtered_timeline().booster,
                    backgroundColor: GRAYBAR_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.combine_tooltip4")}`,
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
            <span className="text-sm text-dim">{t("vaccination.combine_slider")}</span>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section title={t("vaccination.area_chart_header")} date={last_updated}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              title={t("vaccination.area_chart_title1")}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              state={currentState}
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_primary,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart_tooltip2")}`,
                    data: filtered_timeline().primary,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_primary.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_primary.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("vaccination.area_chart_title2")}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              state={currentState}
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart2_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_booster,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart2_tooltip2")}`,
                    data: filtered_timeline().booster,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_booster.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_booster.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("vaccination.area_chart_title3")}
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart3_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_booster2,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart3_tooltip2")}`,
                    data: filtered_timeline().booster2,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_booster2.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_booster2.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("vaccination.area_chart_title4")}
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart4_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_adult,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart4_tooltip2")}`,
                    data: filtered_timeline().adult,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_adult.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_adult.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("vaccination.area_chart_title5")}
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart5_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_adol,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart5_tooltip2")}`,
                    data: filtered_timeline().adol,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_adol.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_adol.total.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("vaccination.area_chart_title6")}
              state={currentState}
              // menu={<MenuDropdown />}
              className="h-full max-h-[250px] w-full"
              enableGridX={false}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("vaccination.area_chart6_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_child,
                    borderColor: COVIDVAX_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("vaccination.area_chart6_tooltip2")}`,
                    data: filtered_timeline().child,
                    backgroundColor: COVIDVAX_COLOR[100],
                  },
                ],
              }}
              stats={[
                {
                  title: t("vaccination.daily"),
                  value: `+${stats_data.daily_child.latest.toLocaleString()}`,
                },
                {
                  title: `${t("vaccination.total")}`,
                  value: `${stats_data.daily_child.total.toLocaleString()}`,
                },
              ]}
            />
          </div>
        </Section>

        {/* Which states are best vaccinated against COVID-19? */}
        <Section title={t("vaccination.table_header")} date={last_updated}>
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title={t("vaccination.table_subheader")}
            >
              {VACCINE_TABLE_SCHEMA().map((menu, index) => {
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
