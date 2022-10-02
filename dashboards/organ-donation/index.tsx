import { Hero, Container, Tabs, Panel, Slider, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { GRAYBAR_COLOR, ORGAN_COLOR, CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useMemo } from "react";
import { routes } from "@lib/routes";
import { useTranslation } from "next-i18next";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface OrganDonationDashboardProps {
  last_updated: number;
  timeseries_pledge: any;
  bar_age: any;
  bar_time: any;
  bar_reasons: any;
  heatmap_donorrate: any;
  choropleth_malaysia_organ_donation: any;
}

const OrganDonationDashboard: FunctionComponent<OrganDonationDashboardProps> = ({
  last_updated,
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  heatmap_donorrate,
  choropleth_malaysia_organ_donation,
}) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [0, timeseries_pledge.x.length - 1],
  });
  const { t } = useTranslation("common");
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
      <Hero background="organ-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("organ.title")}
          </span>
          <h3 className="text-black">{t("organ.title_header")}</h3>
          <p className="text-dim">
            {t("organ.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("organ.title_link")}
            </a>
          </p>
          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("organ.zoom")}</p>
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
          title={t("organ.bar_header", { state: CountryAndStates[currentState] })}
          description={
            <p className="pt-2 text-dim">
              {t("organ.bar_description1")} <strong> {t("organ.bar_description2")}</strong>; when
              {t("organ.bar_description3")}
            </p>
          }
          date={last_updated}
        >
          <div className="space-y-4">
            <Timeseries
              title={t("organ.bar_tittle")}
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
                    borderWidth: 1.5,
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
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>
        {/* Choropleth view of organ donar in Malaysia */}
        <Section
          title={t("covidnow.mmap_header", { state: t("state.kvy") })}
          description={t("covidnow.mmap_description")}
          date={last_updated}
        >
          <div>
            <Choropleth
              className={isMobile ? "h-[450px] w-auto" : "h-[500px] w-full"}
              enableScale={false}
              colorScale="greens"
              borderColor="#000"
              borderWidth={0.5}
              projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
              projectionScaleSetting={isMobile ? windowWidth * 4.5 : 3500}
              data={choropleth_malaysia_organ_donation.map((item: any) => ({
                id: CountryAndStates[item.state],
                state: CountryAndStates[item.state],
                value: item.data.perc,
              }))}
              unitY="%"
              graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
            />
          </div>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section
          title={t("organ.bar1_header", { state: CountryAndStates[currentState] })}
          description={t("organ.bar1_description")}
          date={last_updated}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs
                title={t("organ.bar_title")}
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name={t("organ.annual")}>
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
                <Panel name={t("organ.monthly")}>
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
                title={t("organ.bar2_title")}
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name={t("organ.year")}>
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
                <Panel name={t("organ.month")}>
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
          title={t("organ.heatmap_header", { state: CountryAndStates[currentState] })}
          description={t("organ.heatmap_description")}
          date={last_updated}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full">
              <Tabs
                title="Donor rates across key demographics"
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name={t("organ.capita")}>
                  <>
                    <Heatmap
                      className="mx-auto flex h-[500px] overflow-visible lg:w-[500px]"
                      data={heatmap_donorrate.capita}
                      subdata
                      axisLeft="default"
                      color="greens"
                    />
                    {/* <Heatmap
                      className="flex h-[140px] overflow-visible"
                      data={[heatmap_donorrate.capita.male, heatmap_donorrate.capita.female]}
                      subdata
                      axisLeft="default"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
                      data={[
                        heatmap_donorrate.capita.male_chinese,
                        heatmap_donorrate.capita.male_indian,
                        heatmap_donorrate.capita.male_bumi,
                        heatmap_donorrate.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
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
                      color="greens"
                    /> */}
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel2")}>
                  <>
                    <Heatmap
                      className="mx-auto flex h-[500px] overflow-visible lg:w-[500px]"
                      data={heatmap_donorrate.perc}
                      subdata
                      axisLeft="default"
                      color="greens"
                      unitY="%"
                    />
                    {/* <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_donorrate.perc.male, heatmap_donorrate.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
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
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap3_title")}
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
                      color="greens"
                    /> */}
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel3")}>
                  <>
                    <Heatmap
                      className="mx-auto flex h-[500px] overflow-visible lg:w-[500px]"
                      data={heatmap_donorrate.abs}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="greens"
                    />
                    {/* <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_donorrate.abs.male, heatmap_donorrate.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
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
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap3_title")}
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
                      color="greens"
                    /> */}
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <Tabs title={t("organ.bar1_title")} state={currentState}>
                <Panel name={t("organ.annual")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.all_time.x,
                      datasets: [
                        {
                          label: t("organ.donor"),
                          data: bar_reasons.all_time.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
                <Panel name={t("organ.monthly")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.last_month.x,
                      datasets: [
                        {
                          label: t("organ.donor"),
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
        <Section title={t("organ.map_btm")} description={t("organ.map_desc")} date={last_updated} />
      </Container>
    </>
  );
};

export default OrganDonationDashboard;
