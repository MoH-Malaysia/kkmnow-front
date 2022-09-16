import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Dropdown,
  Tooltip,
  Section,
  ChartHeader,
  Stages,
} from "@components/index";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useState } from "react";
import dynamic from "next/dynamic";
import { post } from "@lib/api";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Donut = dynamic(() => import("@components/Chart/Donut"), { ssr: false });
const BarLine = dynamic(() => import("@components/Chart/BarLine"), { ssr: false });
const Line = dynamic(() => import("@components/Chart/Line"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), {
  ssr: false,
});

const CovidNow = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [currentTab, selectTab] = useState(0);
  const BarTabsMenu = [
    {
      name: "Deaths",
      title: "Deaths per 100K",
    },
    {
      name: "Vent.",
      title: "Ventilator per 100K",
    },
    {
      name: "ICU",
      title: "ICU per 100K",
    },
    {
      name: "Hosp.",
      title: "Hospital per 100K",
    },
    {
      name: "Cases",
      title: "Cases per 100K",
    },
  ];
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
        <div className="space-y-2 xl:w-1/2">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">covid-19</span>
          <h3 className="text-black">The latest data on the pandemic in Malaysia.</h3>
          <p className="text-dim">
            Drawing from the Ministry of Health's excellent COVIDNOW dashboard, this page allows you
            to track the evolution of the epidemic in Malaysia on a daily basis.
          </p>
          <p className="text-dim">
            For a more general look at infectious diseases such as measles, chicken pox, and HFMD,
            head on over to our{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              Infectious Diseases Dashboard.
            </a>
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* Utilisations */}
        <Section title="Utilisations">
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Donut className="h-[56px] w-[56px]" type="progress" />
              <div>
                <p className="text-dim">Ventilators</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      74.3%
                    </span>
                  }
                >
                  Tooltip for Ventilators
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Donut className="h-[56px] w-[56px]" type="progress" />
              <div>
                <p className="text-dim">ICUs</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      74.3%
                    </span>
                  }
                >
                  Tooltip for ICUs
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Donut className="h-[56px] w-[56px]" type="progress" />
              <div>
                <p className="text-dim">Hospital Beds</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      74.3%
                    </span>
                  }
                >
                  Tooltip for Hospital Beds
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Donut className="h-[56px] w-[56px]" type="progress" />
              <div>
                <p className="text-dim">PKRC</p>
                <Tooltip
                  trigger={
                    <span className="text-2xl font-medium underline decoration-dashed underline-offset-4">
                      74.3%
                    </span>
                  }
                >
                  Tooltip for PKRC
                </Tooltip>
              </div>
            </div>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section title="How are COVID-19 key indicators trending?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <BarLine title="Deaths by Date of Death" menu={<MenuDropdown />} />
            <BarLine title="Patients Ventilated" menu={<MenuDropdown />} />
            <BarLine title="Patients in ICU" menu={<MenuDropdown />} />
            <BarLine title="Hospital Admissions" menu={<MenuDropdown />} />
            <BarLine title="Confirmed Cases" menu={<MenuDropdown />} />
            <BarLine title="Tests Conducted" menu={<MenuDropdown />} />
          </div>
        </Section>

        {/* What does the latest data show? */}
        <Section title="What does the latest data show?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2">
              <Stages title="Active COVID-19 Cases" className="pt-10" menu={<MenuDropdown />} />
            </div>
            <div className="col-span-1">
              <ChartHeader title={BarTabsMenu[currentTab].title} menu={<MenuDropdown />} />

              <Tabs onChange={selectTab}>
                {BarTabsMenu.map((menu, index) => {
                  return (
                    <Panel key={index} name={menu.name}>
                      <Bar
                        className="h-[550px] w-full"
                        keys={["y1", "y2"]}
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
                  );
                })}
              </Tabs>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <Line
              className="h-[450px] w-full"
              menu={<MenuDropdown />}
              controls={
                <>
                  <Dropdown
                    placeholder="Spotlight"
                    onChange={() => {}}
                    options={[
                      { label: "hello", value: 1 },
                      { label: "world", value: 2 },
                    ]}
                  />
                  <Dropdown
                    placeholder="Variable Title"
                    onChange={() => {}}
                    options={[
                      { label: "hello", value: 1 },
                      { label: "world", value: 2 },
                    ]}
                  />
                </>
              }
              title="Snapshot of Key Variables"
              gridYValues={[0, 25, 50, 75, 100]}
              unitY="%"
              enablePointLabel={true}
              enableGridX={false}
              minY={0}
              maxY={100}
            />
            <Choropleth
              title="Geographic Distribution of Key Variables"
              controls={
                <Dropdown
                  placeholder="Variable Title"
                  onChange={() => {}}
                  options={[
                    { label: "hello", value: 1 },
                    { label: "world", value: 2 },
                  ]}
                />
              }
              menu={<MenuDropdown />}
            />
          </div>
        </Section>

        {/* How vaccinated against COVID-19 are we? */}
        <Section title="How vaccinated against COVID-19 are we?">
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title="Vaccination Progress by State"
            >
              {TableTabsMenu.map((menu, index) => {
                return (
                  <Panel key={index} name={menu.name}>
                    <Table />
                  </Panel>
                );
              })}
            </Tabs>
          </div>
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // fetch static data here

  return {
    props: {},
  };
};

export default CovidNow;
