import { Hero, Container, Tabs, Panel, Slider, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";

import { GRAYBAR_COLOR, ORGAN_COLOR } from "@lib/constants";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useMemo } from "react";
import { routes } from "@lib/routes";
import { ORGAN_DONATION_SCHEMA } from "@lib/schema/organ-donation";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface OrganDonationDashboardProps {
  timeseries_pledge: any;
  bar_age: any;
  bar_time: any;
  bar_reasons: any;
  heatmap_donorrate: any;
}

const OrganDonationDashboard: FunctionComponent<OrganDonationDashboardProps> = ({
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  heatmap_donorrate,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [0, timeseries_pledge.x.length - 1],
  });

  const filtered_timeline = useCallback(() => {
    return {
      x: timeseries_pledge.x.slice(data.minmax[0], data.minmax[1]),
      line: timeseries_pledge.line.slice(data.minmax[0], data.minmax[1]),
      daily: timeseries_pledge.daily.slice(data.minmax[0], data.minmax[1]),
    };
  }, [data.minmax, timeseries_pledge]);

  const interval_scale = useMemo(
    () => (filtered_timeline().x.length > 365 ? "month" : "day"),
    [filtered_timeline().x]
  );
  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">health</span>
          <h3 className="text-black">Organ Donation</h3>
          <p className="text-dim">
            Since 1997, there have only been 785 actual donors post-mortem despite thousands
            requiring a transplant. Malaysia uses an opt-in rather than opt-out system, making it
            vital to achieve a pledger rate as close to 100% as possible. This dashboard, which
            tracks organ donation pledges, is brought to you by the
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              National Resource Transplant Centre
            </a>
          </p>
          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">Zoom into</p>
            <StateDropdown
              url={routes.ORGAN_DONATION}
              currentState={currentState}
              exclude={["kvy"]}
            />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title="What are the latest organ pledger trends in Klang Valley?"
          description={
            <p className="pt-2 text-dim">
              Blood compromises 3 components - red blood cells, platelets, and plasma. Although
              plasma can be stored for up to 1 year, red blood cells can be only stored for up to 35
              days, and plasma only for up to 5 days. Therefore, it is{" "}
              <strong>vital to maintain a high and stable level of blood donations</strong>; when
              blood donation activity is low or volatile, healthcare services that depend upon blood
              transfusions may start to come under stress.
            </p>
          }
        >
          <div className="space-y-4">
            <Timeseries
              title="Daily Pledges"
              className="h-[350px]"
              state={currentState}
              interval={interval_scale}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: "Moving Average (MA)",
                    data: filtered_timeline().line,
                    borderColor: ORGAN_COLOR[600],
                    borderWidth: 1,
                  },
                  {
                    type: "bar",
                    label: "Daily Pledges",
                    data: filtered_timeline().daily,
                    backgroundColor: GRAYBAR_COLOR[100],
                  },
                ],
              }}
              stats={null}
            />
            <Slider
              className="pt-7"
              type="range"
              data={timeseries_pledge.x}
              onChange={(item: any) => setData("minmax", [item.min, item.max])}
            />
            <span className="text-sm text-dim">
              Use this time slider to zoom in specific time range
            </span>
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
              <Tabs
                title="Number of new donors"
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name="Annual">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_time.annual.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_time.annual.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Monthly">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_time.monthly.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_time.monthly.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs
                title="New donors by age group"
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name="Past 1 year">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_age.past_year.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_age.past_year.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_age.past_month.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_age.past_month.y,
                          backgroundColor: GRAYBAR_COLOR[100],
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
          title="What proportion of the population in Klang Valley donates blood?"
          description="To ensure a stable and high supply of blood, we need 10% of the eligible population to
              donate at least 1 time per year."
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full">
              <Tabs
                title="Donor rates across key demographics"
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name="Per Capita">
                  <>
                    <Heatmap
                      className="flex h-[140px] overflow-visible"
                      data={[heatmap_donorrate.capita.male, heatmap_donorrate.capita.female]}
                      subdata
                      axisLeft="default"
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
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
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
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
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />
                  </>
                </Panel>
                <Panel name="% of Donations">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_donorrate.perc.male, heatmap_donorrate.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_donorrate.perc.male_chinese,
                        heatmap_donorrate.perc.male_indian,
                        heatmap_donorrate.perc.male_bumi,
                        heatmap_donorrate.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.perc.female_chinese,
                        heatmap_donorrate.perc.female_indian,
                        heatmap_donorrate.perc.female_bumi,
                        heatmap_donorrate.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />
                  </>
                </Panel>
                <Panel name="Absolute">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_donorrate.abs.male, heatmap_donorrate.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_donorrate.abs.male_chinese,
                        heatmap_donorrate.abs.male_indian,
                        heatmap_donorrate.abs.male_bumi,
                        heatmap_donorrate.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.abs.female_chinese,
                        heatmap_donorrate.abs.female_indian,
                        heatmap_donorrate.abs.female_bumi,
                        heatmap_donorrate.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={Object.values(ORGAN_COLOR)}
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <Tabs title="Reasons for pledging to donate organs" state={currentState}>
                <Panel name="All-time">
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.all_time.x,
                      datasets: [
                        {
                          label: "No. of Donors",
                          data: bar_reasons.all_time.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.last_month.x,
                      datasets: [
                        {
                          label: "No. of Screenings",
                          data: bar_reasons.last_month.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How is this data collected? */}
        <Section
          title="How is this data collected?"
          description="Map showing locations of BBIS centres:"
        />
      </Container>
    </>
  );
};

export default OrganDonationDashboard;
