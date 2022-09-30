import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Slider,
  Section,
  ChartHeader,
  Metadata,
} from "@components/index";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { post } from "@lib/api";
import { useData } from "@hooks/useData";

import { ORGAN_DONATION_COLOR } from "@lib/constants";
import { ORGAN_DONATION_SCHEMA } from "@lib/schema/organ-donation";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const PekaB40: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
      <Metadata title={"PeKa B40"} keywords={""} />
      <Hero background="hero-light-4">
        <div className="space-y-2 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("peka.title")}
          </span>
          <h3 className="text-black">{t("peka.title_header")}</h3>
          <p className="text-dim">
            {t("peka.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("peka.title_link")}
            </a>
            {t("peka.title_description2")}
          </p>
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
            <Timeseries title="Daily Pledges" menu={<MenuDropdown />} stats={null} />
            <Slider className="pt-7" type="range" onChange={(item: any) => console.log(item)} />
            <span className="text-sm text-dim">{t("peka.slider")}</span>
          </div>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section title={t("peka.bar1_header")} description={t("peka.bar1_description")}>
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("peka.bar1_title1")} menu={<MenuDropdown />}>
                <Panel name={t("peka.annual")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name={t("peka.monthly")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("peka.bar_title2")} menu={<MenuDropdown />}>
                <Panel name={t("peka.1year")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name={t("peka.1month")}>
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section title={t("peka.heatmap_header")} description={t("peka.heatmap_description")}>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-4">
              <Tabs title={t("peka.heatmap_title")} menu={<MenuDropdown />}>
                <Panel name={t("peka.heatmap_panel1")}>
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
                      title={t("peka.heatmap2_title")}
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
                      title={t("peka.heatmap3_title")}
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
                <Panel name={t("peka.heatmap_panel2")}>
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
                      title={t("peka.heatmap3_title")}
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
                      title={t("peka.heatmap3_title")}
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
                <Panel name={t("peka.heatmap_panel3")}>
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
                      title={t("peka.heatmap3_title")}
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
                      title={t("peka.heatmap3_title")}
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
              <ChartHeader title={t("peka.bar2_title1")} menu={<MenuDropdown />} />
              <Tabs className="pt-9" title={t("peka.bar2_x")} menu={<MenuDropdown />}>
                <Panel name={t("peka.annual")}>
                  <Bar
                    className="h-[650px] w-full"
                    enableGridX={false}
                    enableGridY={false}
                    layout="horizontal"
                  />
                </Panel>
                <Panel name={t("peka.monthly")}>
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
        <Section title={t("peka.map_header")} description={t("peka.map_description")}>
          <Choropleth className="h-[500px] w-full" enableScale={false} />
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await post("") // fetch static data here

  return {
    props: {
      ...i18n,
    },
  };
};

export default PekaB40;

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
