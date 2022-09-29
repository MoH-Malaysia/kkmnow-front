import { Hero, Container, Tabs, Panel, Section, Slider } from "@components/index";
import { CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import dynamic from "next/dynamic";
import { FunctionComponent, useState } from "react";
import { numFormat } from "@lib/helpers";

const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const ChoroplethWorld = dynamic(() => import("@components/Chart/ChoroplethWorld"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

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
          <div className="flex items-center gap-3 text-left">
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
          sortingFn: "localeNumber",
        },
        {
          id: "data.views",
          header: "Views",
          accessorFn: (item: any) => numFormat(item.data.views, "standard"),
          sortingFn: "localeNumber",
        },
        {
          id: "data.views_perc",
          header: "% of Views",
          accessorFn: (item: any) => Math.round(item.data.perc_views * 100) / 100 + "%",
          sortingFn: "localeNumber",
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
      <Hero background="bg-[#ECFAFF]">
        <div className="space-y-4">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            MISCELLANEOUS
          </span>
          <h3 className="text-black">COVIDNOW: Data from its year in the sun</h3>
          <p className="text-dim">
            Over 6 million users, 44 million views, and 100 million clicks later, data on COVIDNOW -
            powered by Google Analytics - provides a large-sample insight into how users interact
            with a Malaysian-based data site. Beyond providing transparency on the usage of
            COVIDNOW, this dashboard also yields valuable insight into how Malaysians use the web -
            ranging from where usage is concentrated, to what times of day saw peak traffic, to the
            devices people use. We hope this helps everyone looking to do something similar.
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        {/* Daily views on COVIDNOW */}
        <Section
          title="COVIDNOW always received a steady stream of traffic, but saw huge spikes driven by shock value"
          description="The largest two spikes in traffic were due to the launch announcement (2 mil views over its first 2 days), and Malaysia hitting the “90% of adults fully vaccinated milestone” (2 mil views in a single day). The former was likely due to massive traction on social media, while the latter was due to 90% being used as the trigger to allow interstate travel."
          date={dateEnd}
        >
          <div className="flex w-full flex-col gap-12">
            <div className="space-y-4">
              <Timeseries
                className="h-[350px] w-full pt-6"
                title="Daily views on COVIDNOW"
                interval="month"
                // menu={<MenuDropdown />}
                round="day"
                stats={null}
                data={{
                  labels: filterTimeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Moving Average (MA)",
                      pointRadius: 0,
                      data: filterTimeline().line,
                      borderColor: "#2563EB",
                      borderWidth: 1,
                    },
                    {
                      type: "bar",
                      label: "Daily Views",
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
              <span className="text-sm text-dim">
                Use this time slider to zoom in specific time range
              </span>
            </div>
          </div>
        </Section>
        {/* World Map */}
        <Section
          title="Globally, COVIDNOW was accessed from every country in the world...except Niger and North Korea"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
          date={dateEnd}
        >
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title="World Views Statistics">
              <Panel key={0} name={"Heatmap"}>
                <div className="grid grid-cols-1 ">
                  <ChoroplethWorld
                    className={isMobile ? "h-[300px] w-full" : "h-[500px] w-full"}
                    enableScale={false}
                    projectionScaleSetting={isMobile ? 65 : 125}
                    unitY=" views"
                    xKey="properties.name_short"
                    data={choropleth_world.map((item: any) => {
                      return {
                        id: item.iso3,
                        value_real: item.data.views,
                        value: item.data.views_log ? item.data.views_log : 0,
                      };
                    })}
                  />
                </div>
              </Panel>
              <Panel key={1} name={"Table"}>
                <Table
                  data={choropleth_world.map((items: any) => ({
                    ...items,
                    state: items.iso3.toLowerCase(),
                  }))}
                  config={worldMapConfig}
                  enablePagination
                />
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Malaysia Map */}
        <Section
          title="Within Malaysia, views disproportionately came from the Klang Valley and urban centres"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        >
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title="Malaysia Views Statistics">
              <Panel key={0} name={"Heatmap"}>
                <div className="grid grid-cols-1 ">
                  <Choropleth
                    className="h-[500px] w-full"
                    enableScale={false}
                    // colorScale="CHOROPLETH_BLUE_SCALE"
                    colorScale="blues"
                    borderColor="#000"
                    borderWidth={0.5}
                    projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
                    projectionScaleSetting={isMobile ? 2200 : 3500}
                    data={choropleth_malaysia.map((item: any) => ({
                      id: CountryAndStates[item.state],
                      state: CountryAndStates[item.state],
                      value: item.data.views_log,
                      value_real: item.data.views,
                    }))}
                    unitY=" views"
                    graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
                  />
                </div>
              </Panel>
              <Panel key={1} name={"Table"}>
                <Table data={choropleth_malaysia} config={malaysiaMapConfig} />
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Heatmap */}
        <Section
          title="In general, users checked COVIDNOW when they woke up - likely due to updates being pushed overnight"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
          date={dateEnd}
        >
          <div className="grid grid-cols-1 gap-12">
            <Heatmap
              className="flex h-[500px] w-[1500px] overflow-auto pt-7 lg:w-auto lg:overflow-visible"
              title="Median Views by Time of Day"
              //   menu={<MenuDropdown />}
              data={heatmap_chart}
              axisLeft="default"
              unitY=" views"
              valueFormat=" >-.2s"
              color="blues"
            />
          </div>
        </Section>

        {/* covidnow user demographic */}
        <Section
          title="For developers: A breakdown of views by key user demographics"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          date={dateEnd}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.device_type}
                yKey="y"
                xKey="x"
                title="Device Type"
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.device_language}
                yKey="y"
                xKey="x"
                title="Language on Device"
                layout="horizontal"
                unit="%"
              />
            </div>

            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.browser}
                yKey="y"
                xKey="x"
                title="Browser"
                layout="horizontal"
                unit="%"
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
                title="Operating System (all)"
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.os_mobile}
                yKey="y"
                xKey="x"
                title="Operating System (mobile only)"
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter_chart.mobile_screensize}
                yKey="y"
                title="Screen Resolution (mobile only)"
                xKey="x"
                layout="horizontal"
                unit="%"
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CovidNowDashboard;
