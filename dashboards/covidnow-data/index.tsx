import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Checkbox,
  Tooltip,
  Section,
  Slider,
  StateDropdown,
  Dropdown,
  MapEmbed,
} from "@components/index";
import { BLOOD_DONATION_COLOR, CountryAndStates, STATES, BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useState, useEffect } from "react";
import { COVIDNOW_COLOR_SCHEME } from "@lib/schema/covid-now";
import { numFormat } from "@lib/helpers";
import { useTranslation } from "next-i18next";
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const ChoroplethWorld = dynamic(() => import("@components/Chart/ChoroplethWorld"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

interface CovidNOWDashboardProps {
  barmeter_chart: any;
  timeseries_chart: any;
  heatmap_chart: any;
  choropleth_world: any;
  choropleth_malaysia: any;
}

const CovidNowDashboard: FunctionComponent<CovidNOWDashboardProps> = ({
  timeseries_chart,
  heatmap_chart,
  barmeter_chart,
  choropleth_world,
  choropleth_malaysia,
}) => {
  const [limit, setLimit] = useState([0, timeseries_chart.x.length - 1]);

  const dateEnd = new Date("2022-09-24").toDateString();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const { t } = useTranslation("common");

  const filterTimeline = () => {
    return {
      x: timeseries_chart.x.slice(limit[0], limit[1]),
      y: timeseries_chart.y.slice(limit[0], limit[1]),
      line: timeseries_chart.line.slice(limit[0], limit[1]),
    };
  };

  const worldMapConfig = [
    {
      header: "",
      id: "iso3",
      accessorKey: "data",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as any;
        return (
          <div className="flex items-center gap-3">
            <span>{state.country}</span>
          </div>
        );
      },
    },
    {
      id: "data",
      header: "Statistics",
      columns: [
        {
          id: "data.users",
          header: "Users",
          accessorFn: (item: any) => numFormat(item.data.users, "standard"),
        },
        {
          id: "data.views",
          header: "Views",
          accessorFn: (item: any) => numFormat(item.data.views, "standard"),
        },
        {
          id: "data.views_perc",
          header: "% of Views",
          accessorFn: (item: any) => Math.round(item.data.perc_views * 100) / 100 + "%",
        },
      ],
    },
  ];

  const malaysiaMapConfig = [
    {
      header: "",
      id: "state",
      accessorKey: "state",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as string;
        return (
          <div className="flex items-center gap-3">
            <img className="h-4 w-7" src={`/static/images/states/${state}.jpeg`}></img>
            <span>{CountryAndStates[state]}</span>
          </div>
        );
      },
    },
    {
      id: "data",
      header: "Statistics",
      columns: [
        {
          id: "data.total_user",
          header: "Users",
          accessorFn: (item: any) => numFormat(item.data.users, "standard"),
        },
        {
          id: "data.views",
          header: "Views",
          accessorFn: (item: any) => numFormat(item.data.views, "standard"),
        },
        {
          id: "data.views_perc",
          header: "% of Views",
          accessorFn: (item: any) => Math.round(item.data.views_perc * 100) / 100 + "%",
        },
        {
          id: "data.pop_perc",
          header: "% of Population",
          accessorFn: (item: any) => Math.round(item.data.pop_perc * 100) / 100 + "%",
        },
      ],
    },
  ];

  return (
    <>
      <Hero background="bg-slate-200">
        <div className="space-y-4">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("covidnow.title")}
          </span>
          <h3 className="text-black">{t("covidnow.title_header")}</h3>
          <p className="text-dim">{t("covidnow.title_description")}</p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        {/* Daily views on COVIDNOW */}
        <Section
          title={t("covidnow.combine_header")}
          description={t("covidnow.combine_description")}
          date={dateEnd}
        >
          <div className="flex w-full flex-col gap-12">
            <div className="space-y-4">
              <Timeseries
                className="h-[400px] w-full pt-6 lg:h-[750px]"
                title={t("covidnow.combine_title")}
                interval="month"
                menu={<MenuDropdown />}
                round="day"
                stats={null}
                data={{
                  labels: filterTimeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: `${t("covidnow.combine_tooltip1")}`,
                      pointRadius: 0,
                      data: filterTimeline().line,
                      borderColor: "#2563EB",
                    },
                    {
                      type: "bar",
                      label: `${t("covidnow.combine_tooltip2")}`,
                      data: filterTimeline().y,
                      backgroundColor: "#D1D5DB",
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Slider
                className="pt-7"
                type="range"
                data={timeseries_chart.x}
                onChange={(item: any) => setLimit([item.min, item.max])}
              />
              <span className="text-sm text-dim">{t("covidnow.slider")}</span>
            </div>
          </div>
        </Section>
        {/* World Map */}
        <Section
          title={t("covidnow.wmap_header")}
          description={t("covidnow.wmap_description")}
          date={dateEnd}
        >
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title={t("covidnow.wmap_title")}>
              <Panel key={0} name={`${t("covidnow.heatmap")}`}>
                <div className="grid grid-cols-1 ">
                  <ChoroplethWorld
                    className={isMobile ? "h-[300px] w-full" : "h-[500px] w-full"}
                    enableScale={false}
                    projectionScaleSetting={isMobile ? 75 : 125}
                    data={choropleth_world.map((item: any) => ({
                      id: item.iso3,
                      value_real: item.data.views,
                      value: item.data.views_log ? item.data.views_log : 0,
                    }))}
                  />
                </div>
              </Panel>
              <Panel key={1} name={`${t("covidnow.table")}`}>
                <Table
                  data={choropleth_world.map((items: any) => ({
                    ...items,
                    highlight: items.iso3 == "MYS" ? true : false,
                  }))}
                  config={worldMapConfig}
                  isPagination={true}
                />
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Malaysia Map */}
        <Section title={t("covidnow.mmap_header")} description={t("covidnow.mmap_description")}>
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title={t("covidnow.mmap_title")}>
              <Panel key={0} name={`${t("covidnow.heatmap")}`}>
                <div className="grid grid-cols-1 ">
                  <Choropleth
                    className="h-[500px] w-full"
                    enableScale={false}
                    colorScale="CHOROPLETH_BLUE_SCALE"
                    borderColor="#000"
                    borderWidth={0.5}
                    projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
                    projectionScaleSetting={isMobile ? 2500 : 3500}
                    data={choropleth_malaysia.map((item: any) => ({
                      id: CountryAndStates[item.state],
                      state: CountryAndStates[item.state],
                      value: item.data.views_log,
                      value_real: item.data.views,
                    }))}
                    graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
                  />
                </div>
              </Panel>
              <Panel key={1} name={`${t("covidnow.table")}`}>
                <Table data={choropleth_malaysia} config={malaysiaMapConfig} />
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Heatmap */}
        <Section
          title={t("covidnow.heatmap_header")}
          description={t("covidnow.heatmap_description")}
          date={dateEnd}
        >
          <div className="grid grid-cols-1 gap-12">
            <Heatmap
              className="flex h-[700px] overflow-auto pt-7 lg:overflow-hidden"
              title={t("covidnow.heatmap_title")}
              menu={<MenuDropdown />}
              data={heatmap_chart}
              axisLeft={{
                ticksPosition: "before",
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
              }}
              valueFormat=" >-.2s"
              interactive={true}
              schema={COVIDNOW_COLOR_SCHEME}
              color={BLOOD_DONATION_COLOR}
            />
          </div>
        </Section>

        {/* covidnow user demographic */}
        <Section
          title={t("covidnow.bar_header")}
          description={t("covidnow.bar_description")}
          date={dateEnd}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.device_type}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title1")}
                layout="horizontal"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.device_language}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title2")}
                layout="horizontal"
              />
            </div>

            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.browser}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title3")}
                layout="horizontal"
              />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-12 xl:grid-cols-3">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.os}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title4")}
                layout="horizontal"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.os_mobile}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title5")}
                layout="horizontal"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.mobile_screensize}
                yKey="y"
                title={t("covidnow.bar_title6")}
                xKey="x"
                layout="horizontal"
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CovidNowDashboard;
