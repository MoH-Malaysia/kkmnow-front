import { FunctionComponent, useCallback, useMemo } from "react";
import { Hero, Container, Tabs, Panel, Slider, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";

import { GRAYBAR_COLOR, PEKA_COLOR } from "@lib/constants";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface PekaB40DashboardProps {
  timeseries_screenrate: any;
  heatmap_screenrate: any;
  bar_age: any;
}

const PekaB40Dashboard: FunctionComponent<PekaB40DashboardProps> = ({
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [0, timeseries_screenrate.x.length - 1],
  });

  const filtered_timeline = useCallback(() => {
    return {
      x: timeseries_screenrate.x.slice(data.minmax[0], data.minmax[1]),
      line: timeseries_screenrate.line.slice(data.minmax[0], data.minmax[1]),
      daily: timeseries_screenrate.daily.slice(data.minmax[0], data.minmax[1]),
    };
  }, [data.minmax, timeseries_screenrate]);

  const interval_scale = useMemo(
    () => (filtered_timeline().x.length > 365 ? "month" : "day"),
    [filtered_timeline().x]
  );

  return (
    <>
      <Hero background="peka-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">health</span>
          <h3 className="text-black">Peka B40</h3>
          <p className="text-dim">
            PeKa B40 is a MoH initiative which aims to sustain the healthcare needs of low income
            groups by focusing on non-communicable diseases (NCDs). Recipients of the Bantuan
            Prihatin Rakyat (previously known as Bantuan Sara Hidup) and their spouses aged 40 and
            above are automatically eligible for free health screenings. This dashboard, which gives
            you near-real-time updates on PeKa B40 screenings, is brought to you by ProtectHealth
            Corporation (PHCorp), a fully-owned subsidiary of the Ministry of Health.
          </p>
          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">Zoom into</p>
            <StateDropdown url={routes.PEKA_B40} currentState={currentState} exclude={["kvy"]} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title="What are the latest screening trends in Klang Valley?"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        >
          <div className="space-y-4">
            <Timeseries
              title="Daily Screens"
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
                    borderColor: PEKA_COLOR[600],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: "Daily Screens",
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
              data={timeseries_screenrate.x}
              onChange={(item: any) => setData("minmax", [item.min, item.max])}
            />
            <span className="text-sm text-dim">
              Use this time slider to zoom in specific time range
            </span>
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
                      data={[heatmap_screenrate.capita.male, heatmap_screenrate.capita.female]}
                      subdata
                      axisLeft="default"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.capita.male_chinese,
                        heatmap_screenrate.capita.male_indian,
                        heatmap_screenrate.capita.male_bumi,
                        heatmap_screenrate.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.capita.female_chinese,
                        heatmap_screenrate.capita.female_indian,
                        heatmap_screenrate.capita.female_bumi,
                        heatmap_screenrate.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
                <Panel name="% of Donations">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_screenrate.perc.male, heatmap_screenrate.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.perc.male_chinese,
                        heatmap_screenrate.perc.male_indian,
                        heatmap_screenrate.perc.male_bumi,
                        heatmap_screenrate.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.perc.female_chinese,
                        heatmap_screenrate.perc.female_indian,
                        heatmap_screenrate.perc.female_bumi,
                        heatmap_screenrate.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
                <Panel name="Absolute">
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_screenrate.abs.male, heatmap_screenrate.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.abs.male_chinese,
                        heatmap_screenrate.abs.male_indian,
                        heatmap_screenrate.abs.male_bumi,
                        heatmap_screenrate.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.abs.female_chinese,
                        heatmap_screenrate.abs.female_indian,
                        heatmap_screenrate.abs.female_bumi,
                        heatmap_screenrate.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <Tabs title="Newly screened individuals by age" state={currentState}>
                <Panel name="Past 1 year">
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_age.last_year.x,
                      datasets: [
                        {
                          label: "No. of Screenings",
                          data: bar_age.last_year.y,
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
                      labels: bar_age.last_year.x,
                      datasets: [
                        {
                          label: "No. of Screenings",
                          data: bar_age.last_year.y,
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

export default PekaB40Dashboard;
