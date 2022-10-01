import { FunctionComponent, useCallback, useMemo } from "react";
import { Hero, Container, Tabs, Panel, Slider, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";

import { GRAYBAR_COLOR, PEKA_COLOR, CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { useTranslation } from "next-i18next";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface PekaB40DashboardProps {
  timeseries_screenrate: any;
  heatmap_screenrate: any;
  bar_age: any;
  choropleth_malaysia_peka_b40: any;
}

const PekaB40Dashboard: FunctionComponent<PekaB40DashboardProps> = ({
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [0, timeseries_screenrate.x.length - 1],
  });

  const { t } = useTranslation("common");

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
          <h3 className="text-black">{t("peka.title")}</h3>
          <p className="text-dim">
            {t("peka.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("peka.title_link")}
            </a>
            {t("peka.title_description2")}
          </p>
          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("covid.zoom")}</p>
            <StateDropdown url={routes.PEKA_B40} currentState={currentState} exclude={["kvy"]} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title={t("peka.screening_header")}
          description={
            <p className="pt-2 text-dim">
              {t("peka.screening_description1")} <strong>{t("peka.screening_description2")}</strong>
              {t("peka.screening_description3")}
            </p>
          }
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
            <span className="text-sm text-dim">{t("peka.slider")}</span>
          </div>
        </Section>
        {/* Choropleth view of pekaB40 in Malaysia */}
        <Section title={t("covidnow.mmap_header")} description={t("covidnow.mmap_description")}>
          <div>
            <Choropleth
              className="h-[500px] w-full"
              enableScale={false}
              colorScale="RdPu"
              borderColor="#000"
              borderWidth={0.5}
              projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
              projectionScaleSetting={isMobile ? 2200 : 3500}
              data={choropleth_malaysia_peka_b40.map((item: any) => ({
                id: CountryAndStates[item.state],
                state: CountryAndStates[item.state],
                value: item.data.perc,
              }))}
              unitY="%"
              graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
            />
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section title={t("peka.heatmap_header")} description={t("peka.heatmap_description")}>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full">
              <Tabs
                title={t("peka.heatmap_title")}
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name={t("peka.heatmap_panel1")}>
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
                <Panel name={t("peka.heatmap_panel2")}>
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
                <Panel name={t("peka.heatmap_panel3")}>
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
              <Tabs title={t("peka.bar2_x")} state={currentState}>
                <Panel name={t("peka.annual")}>
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
                <Panel name={t("peka.monthly")}>
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
        <Section title={t("peka.map_header")} description={t("peka.map_description")} />
      </Container>
    </>
  );
};

export default PekaB40Dashboard;
