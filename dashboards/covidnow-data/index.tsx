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
  timeseries_all: any;
  timeseries_bloodstock: any;
  timeseries_facility: any;
  heatmap_bloodstock: any;
  heatmap_donorrate: any;
  heatmap_retention: any;
  barchart_age: any;
  barchart_time: any;
  map_facility: any;
}

const CovidNowDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  map_facility,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const [limit, setLimit] = useState([0, timeseries_all.x.length - 1]);
  const { data, setData } = useData({
    relative_donation_type: false,
    relative_blood_group: false,
    relative_donor_type: false,
    relative_location: false,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_facility: undefined,
  });

  const filterTimeline = () => {
    return {
      x: timeseries_all.x.slice(limit[0], limit[1]),
      daily: timeseries_all.daily.slice(limit[0], limit[1]),
      line_daily: timeseries_all.line_daily.slice(limit[0], limit[1]),
      apheresis: timeseries_all.apheresis_abs.slice(limit[0], limit[1]),
      apheresis_rel: timeseries_all.apheresis_pct.slice(limit[0], limit[1]),
      wholeblood: timeseries_all.wholeblood_abs.slice(limit[0], limit[1]),
      wholeblood_rel: timeseries_all.wholeblood_pct.slice(limit[0], limit[1]),
      o: timeseries_all.blood_o_abs.slice(limit[0], limit[1]),
      o_rel: timeseries_all.blood_o_pct.slice(limit[0], limit[1]),
      a: timeseries_all.blood_a_abs.slice(limit[0], limit[1]),
      a_rel: timeseries_all.blood_a_pct.slice(limit[0], limit[1]),
      b: timeseries_all.blood_b_abs.slice(limit[0], limit[1]),
      b_rel: timeseries_all.blood_b_pct.slice(limit[0], limit[1]),
      ab: timeseries_all.blood_ab_abs.slice(limit[0], limit[1]),
      ab_rel: timeseries_all.blood_ab_pct.slice(limit[0], limit[1]),
      newdon: timeseries_all.donor_new_abs.slice(limit[0], limit[1]),
      newdon_rel: timeseries_all.donor_new_pct.slice(limit[0], limit[1]),
      recurdon: timeseries_all.donor_recurring_abs.slice(limit[0], limit[1]),
      recurdon_rel: timeseries_all.donor_recurring_pct.slice(limit[0], limit[1]),
      center: timeseries_all.location_centre_abs.slice(limit[0], limit[1]),
      center_rel: timeseries_all.location_centre_pct.slice(limit[0], limit[1]),
      outreach: timeseries_all.location_mobile_abs.slice(limit[0], limit[1]),
      outreach_rel: timeseries_all.location_mobile_pct.slice(limit[0], limit[1]),
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
                title="Daily Donations"
                interval="year"
                menu={<MenuDropdown />}
                round="week"
                stats={null}
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: "Moving Average (MA)",
                      pointRadius: 0,
                      data: filtered_timeline().line_daily,
                      borderColor: "red",
                    },
                    {
                      type: "bar",
                      label: "Primary",
                      data: filtered_timeline().daily,
                      backgroundColor: "#FF4E4E",
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Slider
                className="pt-7"
                type="range"
                data={timeseries_all.x}
                onChange={(item: any) => setLimit([item.min, item.max])}
              />
              <span className="text-sm text-dim">
                Use this time slider to zoom in specific time range
              </span>
            </div>
          </div>
        </Section>

        {/* Is {{ area }}'s current blood supply sufficient? */}
        <Section title="Is Klang Valley's current blood supply sufficient?">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 ">
            <Heatmap
              className="h-[500px]"
              title="Blood Supply by States"
              hoverTarget="row"
              data={heatmap_bloodstock}
              axisLeft="state"
              schema={BLOOD_SUPPLY_SCHEMA}
              color={BLOOD_SUPPLY_COLOR}
              menu={<MenuDropdown />}
            />
            <div>
              <Tabs
                title={
                  <Tooltip
                    trigger={
                      <span className="text-lg font-bold underline decoration-dashed underline-offset-4">
                        Blood supply over time
                      </span>
                    }
                  >
                    Tooltip for Blood supply over time
                  </Tooltip>
                }
                menu={<MenuDropdown />}
              >
                <Panel name="Type A">
                  <Timeseries
                    className="h-[500px] w-full"
                    interval="month"
                    animate={false}
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type A",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_a,
                          backgroundColor: BLOOD_COLOR[100],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type B">
                  <Timeseries
                    className="h-[500px] w-full"
                    interval="month"
                    animate={false}
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type B",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_b,
                          backgroundColor: BLOOD_COLOR[200],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type AB">
                  <Timeseries
                    className="h-[500px] w-full"
                    interval="month"
                    animate={false}
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type AB",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_ab,
                          backgroundColor: BLOOD_COLOR[300],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Type O">
                  <Timeseries
                    className="h-[500px] w-full"
                    interval="month"
                    animate={false}
                    data={{
                      labels: timeseries_bloodstock.x,
                      datasets: [
                        {
                          type: "line",
                          label: "Type O",
                          pointRadius: 0,
                          data: timeseries_bloodstock.type_o,
                          backgroundColor: BLOOD_COLOR[400],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section
          title="How strong is the new donor recruitment in Klang Valley?"
          description="Recruitment of new donors is vital to replace donors who reach their golden years and
                stop donating, as well as to support a growing population."
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title="Number of new donors" menu={<MenuDropdown />}>
                <Panel name="Annual">
                  <Bar
                    className="h-[300px]"
                    data={{
                      labels: barchart_time.annual.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_time.annual.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Monthly">
                  <Bar
                    className="h-[300px]"
                    data={{
                      labels: barchart_time.monthly.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_time.monthly.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title="New donors by age group" menu={<MenuDropdown />}>
                <Panel name="Past 1 year">
                  <Bar
                    className="h-[300px]"
                    data={{
                      labels: barchart_age.past_year.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_age.past_year.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar
                    className="h-[300px]"
                    data={{
                      labels: barchart_age.past_month.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: barchart_age.past_month.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section
          title="In general, users checked COVIDNOW when they woke up - likely due to updates being pushed overnight"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-4">
              <Tabs title="Donor rates across key demographics" menu={<MenuDropdown />}>
                <Panel name="Per Capita">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-4 overflow-auto lg:overflow-hidden"
                      data={[heatmap_donorrate.capita.male, heatmap_donorrate.capita.female]}
                      subdata
                      axisLeft="default"
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={[
                        heatmap_donorrate.capita.male_chinese,
                        heatmap_donorrate.capita.male_indian,
                        heatmap_donorrate.capita.male_bumi,
                        heatmap_donorrate.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Female"
                      data={[
                        heatmap_donorrate.capita.female_chinese,
                        heatmap_donorrate.capita.female_indian,
                        heatmap_donorrate.capita.female_bumi,
                        heatmap_donorrate.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="% of Donations">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={[heatmap_donorrate.perc.male, heatmap_donorrate.perc.female]}
                      subdata
                      axisLeft="default"
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={[
                        heatmap_donorrate.perc.male_chinese,
                        heatmap_donorrate.perc.male_indian,
                        heatmap_donorrate.perc.male_bumi,
                        heatmap_donorrate.perc.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Female"
                      data={[
                        heatmap_donorrate.perc.female_chinese,
                        heatmap_donorrate.perc.female_indian,
                        heatmap_donorrate.perc.female_bumi,
                        heatmap_donorrate.perc.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="Absolute">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={[heatmap_donorrate.abs.male, heatmap_donorrate.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="< ,.2~s"
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={[
                        heatmap_donorrate.abs.male_chinese,
                        heatmap_donorrate.abs.male_indian,
                        heatmap_donorrate.abs.male_bumi,
                        heatmap_donorrate.abs.male_other,
                      ]}
                      subdata
                      valueFormat="< ,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Female"
                      data={[
                        heatmap_donorrate.abs.female_chinese,
                        heatmap_donorrate.abs.female_indian,
                        heatmap_donorrate.abs.female_bumi,
                        heatmap_donorrate.abs.female_other,
                      ]}
                      subdata
                      valueFormat="< ,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={BLOOD_DONATION_SCHEMA}
                      color={BLOOD_DONATION_COLOR}
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

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
