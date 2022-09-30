import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Slider,
  Section,
  ChartHeader,
  StateDropdown,
} from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";

import { ORGAN_DONATION_COLOR } from "@lib/constants";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { routes } from "@lib/routes";
import { ORGAN_DONATION_SCHEMA } from "@lib/schema/organ-donation";
import { useTranslation } from "next-i18next";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface OrganDonationDashboardProps {}

const OrganDonationDashboard: FunctionComponent<OrganDonationDashboardProps> = () => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    filter_by: 0,
  });
  const { t } = useTranslation("common");

  const TableTabsMenu = [
    {
      name: "Show All",
    },
    {
      name: "Total",
    },
    {
      name: "Adults",
    },
    {
      name: "Adolescents",
    },
    {
      name: "Children",
    },
  ];

  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">health</span>
          <h3 className="text-black">{t("organ.title_header")}</h3>
          <p className="text-dim">
            {t("organ.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              {t("organ.title_link")}
            </a>
          </p>
          <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("organ.zoom")}</p>
            <StateDropdown url={routes.ORGAN_DONATION} currentState={currentState} />
          </div>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title={t("organ.bar_header")}
          description={
            <p className="pt-2 text-dim">
              {t("organ.bar_description1")} <strong> {t("organ.bar_description2")}</strong>; when
              {t("organ.bar_description3")}
            </p>
          }
        >
          <div className="space-y-4">
            <Timeseries title={t("organ.bar_tittle")} menu={<MenuDropdown />} stats={null} />
            <Slider className="pt-7" type="range" onChange={(item: any) => console.log(item)} />
            <span className="text-sm text-dim">{t("organ.sub_tittle")}</span>
          </div>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section title={t("organ.bar1_header")} description={t("organ.bar1_description")}>
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("organ.bar_title")} menu={<MenuDropdown />}>
                <Panel name={t("organ.annual")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name={t("organ.monthly")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("organ.bar2_title")} menu={<MenuDropdown />}>
                <Panel name={t("organ.year")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name={t("organ.month")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section title={t("organ.heatmap_header")} description={t("organ.heatmap_description")}>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-4">
              <Tabs title="Donor rates across key demographics" menu={<MenuDropdown />}>
                <Panel name={t("organ.capita")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title={t("organ.heatmap2_title")}
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Female"
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel2")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title={t("organ.heatmap2_title")}
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title={t("organ.heatmap3_title")}
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel3")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title={t("organ.heatmap2_title")}
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title={t("organ.heatmap3_title")}
                      data={dummyFourRowHeatmap}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <ChartHeader title={t("organ.chart_header")} menu={<MenuDropdown />} />
              <Tabs className="pt-9" title={t("organ.bar1_title")} menu={<MenuDropdown />}>
                <Panel name={t("organ.annual")}>
                  <Bar
                    className="h-[650px] w-full"
                    enableGridX={false}
                    enableGridY={false}
                    layout="horizontal"
                  />
                </Panel>
                <Panel name={t("organ.monthly")}>
                  <Bar
                    className="h-[650px] w-full"
                    enableGridX={false}
                    enableGridY={false}
                    layout="horizontal"
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How is this data collected? */}
        <Section title={t("organ.map_btm")} description={t("organ.map_desc")}>
          <Choropleth className="h-[500px] w-full" enableScale={false} />
        </Section>
      </Container>
    </>
  );
};

export default OrganDonationDashboard;

const dummyOneColTwoRowHeatmap = [
  {
    id: "Male",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
  {
    id: "Female",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
];
const dummyOneColFourRowHeatmap = [
  {
    id: "Chinese",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
  {
    id: "Indian",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
  {
    id: "Bumiputera",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
  {
    id: "Other",
    data: [
      {
        x: "Overall",
        y: -13623,
      },
    ],
  },
];

const dummyTwoRowHeatmap = [
  {
    id: "Male",
    data: [
      {
        x: "Train",
        y: -13623,
      },
      {
        x: "Subway",
        y: 49382,
      },
      {
        x: "Bus",
        y: -49785,
      },
      {
        x: "Car",
        y: 38066,
      },
      {
        x: "Boat",
        y: -70988,
      },
      {
        x: "Moto",
        y: 60325,
      },
      {
        x: "Moped",
        y: -25685,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "Female",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
];
const dummyFourRowHeatmap = [
  {
    id: "Chinese",
    data: [
      {
        x: "Train",
        y: -13623,
      },
      {
        x: "Subway",
        y: 49382,
      },
      {
        x: "Bus",
        y: -49785,
      },
      {
        x: "Car",
        y: 38066,
      },
      {
        x: "Boat",
        y: -70988,
      },
      {
        x: "Moto",
        y: 60325,
      },
      {
        x: "Moped",
        y: -25685,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "Indian",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "Bumiputera",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "Other",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
];

const dummyDiagonal = [
  {
    id: "Japan",
    data: [
      {
        x: "Train",
        y: -13623,
      },
      {
        x: "Subway",
        y: 49382,
      },
      {
        x: "Bus",
        y: -49785,
      },
      {
        x: "Car",
        y: 38066,
      },
      {
        x: "Boat",
        y: -70988,
      },
      {
        x: "Moto",
        y: 60325,
      },
      {
        x: "Moped",
        y: -25685,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "France",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
    ],
  },
  {
    id: "US",
    data: [
      {
        x: "Train",
        y: 55769,
      },
      {
        x: "Subway",
        y: -6430,
      },
      {
        x: "Bus",
        y: 95228,
      },
      {
        x: "Car",
        y: 38713,
      },
      {
        x: "Boat",
        y: -20260,
      },
      {
        x: "Moto",
        y: 15754,
      },
    ],
  },
  {
    id: "Germany",
    data: [
      {
        x: "Train",
        y: 99572,
      },
      {
        x: "Subway",
        y: -42981,
      },
      {
        x: "Bus",
        y: -17820,
      },
      {
        x: "Car",
        y: 80488,
      },
      {
        x: "Boat",
        y: -68851,
      },
    ],
  },
  {
    id: "Norway",
    data: [
      {
        x: "Train",
        y: 58659,
      },
      {
        x: "Subway",
        y: -54633,
      },
      {
        x: "Bus",
        y: -91166,
      },
      {
        x: "Car",
        y: 86125,
      },
    ],
  },
  {
    id: "Iceland",
    data: [
      {
        x: "Train",
        y: -72165,
      },
      {
        x: "Subway",
        y: 5633,
      },
      {
        x: "Bus",
        y: 81015,
      },
    ],
  },
  {
    id: "UK",
    data: [
      {
        x: "Train",
        y: -51205,
      },
      {
        x: "Subway",
        y: 18326,
      },
    ],
  },
  {
    id: "Vietnam",
    data: [
      {
        x: "Train",
        y: -20267,
      },
    ],
  },
];
