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

import { ORGAN_DONATION_COLOR, ORGAN_DONATION_SCHEMA } from "@lib/constants";
import { useRouter } from "next/router";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const OrganDonationDashboard = () => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    filter_by: 0,
  });

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
          <h3 className="text-black">Organ Donation</h3>
          <p className="text-dim">
            A stable and high supply of blood is critical for a well-functioning public healthcare
            system. This dashboard, which gives you near-real-time updates on key indicators related
            to blood transfusion services, is brought to you by the{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              National Blood Centre (PDN).
            </a>
          </p>
          <StateDropdown url="/dashboard/covid-vaccination" currentState={currentState} />
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
            <Timeseries title="Daily Pledges" menu={<MenuDropdown />} stats={null} />
            <Slider className="pt-7" type="range" onChange={(item: any) => console.log(item)} />
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
              <Tabs title="Number of new donors" menu={<MenuDropdown />}>
                <Panel name="Annual">
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name="Monthly">
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title="New donors by age group" menu={<MenuDropdown />}>
                <Panel name="Past 1 year">
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
                <Panel name="Past 1 month">
                  <Bar className="h-[300px]" enableGridX={false} />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood? */}
        <Section
          title="What proportion of the population in Klang Valley donates blood?"
          description="To ensure a stable and high supply of blood, we need 10% of the eliglble population to
              donate at least 1 time per year."
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-4">
              <Tabs title="Donor rates across key demographics" menu={<MenuDropdown />}>
                <Panel name="Per Capita">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata={dummyOneColTwoRowHeatmap}
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={dummyFourRowHeatmap}
                      subdata={dummyOneColFourRowHeatmap}
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
                      subdata={dummyOneColFourRowHeatmap}
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="% of Donations">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata={dummyOneColTwoRowHeatmap}
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={dummyFourRowHeatmap}
                      subdata={dummyOneColFourRowHeatmap}
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
                      subdata={dummyOneColFourRowHeatmap}
                      axisLeft="default"
                      axisTop={null}
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />
                  </>
                </Panel>
                <Panel name="Absolute">
                  <>
                    <Heatmap
                      className="flex h-[150px] gap-[30px] overflow-auto lg:overflow-hidden"
                      data={dummyTwoRowHeatmap}
                      subdata={dummyOneColTwoRowHeatmap}
                      axisLeft="default"
                      interactive={false}
                      schema={ORGAN_DONATION_SCHEMA}
                      color={ORGAN_DONATION_COLOR}
                    />

                    <Heatmap
                      className="flex h-[240px] gap-[30px] overflow-auto lg:overflow-hidden"
                      title="Male"
                      data={dummyFourRowHeatmap}
                      subdata={dummyOneColFourRowHeatmap}
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
                      subdata={dummyOneColFourRowHeatmap}
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
              <ChartHeader
                title="Motivation: Why do people pledge to donate organs?"
                menu={<MenuDropdown />}
              />
              <Tabs className="pt-9" title="Number of new donors" menu={<MenuDropdown />}>
                <Panel name="Annual">
                  <Bar
                    className="h-[650px] w-full"
                    keys={["y1"]}
                    interactive={false}
                    indexBy="state"
                    hideLabelKeys={["y2"]}
                    customTickX="state"
                    enableLabel={true}
                    enableAxisX={false}
                    enableGridX={false}
                    enableGridY={false}
                    layout="horizontal"
                  />
                </Panel>
                <Panel name="Monthly">
                  <Bar
                    className="h-[650px] w-full"
                    keys={["y1"]}
                    interactive={false}
                    indexBy="state"
                    hideLabelKeys={["y2"]}
                    customTickX="state"
                    enableLabel={true}
                    enableAxisX={false}
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
        <Section
          title="How is this data collected?"
          description="Map showing locations of BBIS centres:"
        >
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