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
import { useData } from "@hooks/useData";
import {
  BLOOD_SUPPLY_COLOR,
  BLOOD_DONATION_COLOR,
  BLOOD_COLOR,
  GRAYBAR_COLOR,
  CountryAndStates,
} from "@lib/constants";
import { BLOOD_SUPPLY_SCHEMA, BLOOD_DONATION_SCHEMA } from "@lib/schema/blood-donation";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useEffect } from "react";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

interface BloodDonationDashboardProps {
  heatmap_bloodstock: any;
  heatmap_donorrate: any;
  heatmap_retention: any;
  barchart_age: any;
  barchart_time: any;
  timeseries_chart: any;
  heatmap_chart: any;
}

const CovidNowDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  timeseries_chart,
  heatmap_retention,
  heatmap_chart,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const [limit, setLimit] = useState([0, timeseries_chart.x.length - 1]);
  const { data, setData } = useData({
    relative_donation_type: false,
    relative_blood_group: false,
    relative_donor_type: false,
    relative_location: false,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_facility: undefined,
  });
  console.log(heatmap_chart);
  console.log(heatmap_retention);
  const filterTimeline = () => {
    return {
      x: timeseries_chart.x.slice(limit[0], limit[1]),
      y: timeseries_chart.y.slice(limit[0], limit[1]),
      line: timeseries_chart.line.slice(limit[0], limit[1]),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, limit);

  useEffect(() => {
    setData("zoom_facility", undefined);
  }, [data.zoom_state]);

  return (
    <>
      <Hero background="bg-slate-200">
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
        >
          <div className="flex w-full flex-col gap-12">
            <div className="space-y-4">
              <Timeseries
                className="h-[400px] w-full pt-6 lg:h-[750px]"
                title="Daily views on COVIDNOW"
                interval="month"
                menu={<MenuDropdown />}
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
                    },
                    {
                      type: "bar",
                      label: "Primary",
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
        >
          <div className="grid grid-cols-1 gap-12"></div>
        </Section>

        {/* Malaysia Map */}
        <Section
          title="Within Malaysia, views disproportionately came from the Klang Valley and urban centres"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        >
          <div className="grid grid-cols-1 gap-12"></div>
        </Section>

        {/* Malaysia Map */}
        <Section
          title="In general, users checked COVIDNOW when they woke up - likely due to updates being pushed overnight"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        >
          <div className="grid grid-cols-1 gap-12">
            <Heatmap
              className="flex h-[700px] overflow-auto pt-7 lg:overflow-hidden"
              title="Donor retention: How well do we retain donors?"
              menu={<MenuDropdown />}
              data={heatmap_retention}
              axisLeft={{
                ticksPosition: "before",
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
              }}
              legend={{
                top: "Donated after N years",
                left: "Donated in",
              }}
              interactive={false}
              schema={BLOOD_DONATION_SCHEMA}
              color={BLOOD_DONATION_COLOR}
            />
          </div>
        </Section>

        {/* covidnow user demographic */}
        <Section
          title="For developers: A breakdown of views by key user demographics"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={dummy}
                yKey="y1"
                xKey="state"
                layout="state-horizontal"
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);

    const y1 = () => Math.floor(Math.random() * 98 + 2);
    const y2 = 100 - y1();

    return {
      x: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      y1: y1(),
      y2: y2,
      line: y1(),
      state: Object.keys(CountryAndStates)[index],
    };
  })
  .reverse();

export default CovidNowDashboard;
