import { Hero, Container, Tabs, Panel, MenuDropdown, Dropdown, Tooltip } from "@components/index";
import { post } from "@lib/api";
import dynamic from "next/dynamic";
import { Stages, Table } from "@dashboards/covidnow/components";
import { useState } from "react";

import { InferGetStaticPropsType, GetStaticProps } from "next";

const Bar = dynamic(() => import("@dashboards/covidnow/components/Bar"), { ssr: false });
const Donut = dynamic(() => import("@dashboards/covidnow/components/Donut"), { ssr: false });
const BarLine = dynamic(() => import("@dashboards/covidnow/components/BarLine"), { ssr: false });
const Line = dynamic(() => import("@dashboards/covidnow/components/Line"), { ssr: false });
const Choropleth = dynamic(() => import("@dashboards/covidnow/components/Choropleth"), {
  ssr: false,
});

const CovidNow = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [currentTab, selectTab] = useState(0);
  const TabsMenu = [
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
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>Utilizations</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Donut className="h-[56px] w-[56px]" />
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
              <Donut className="h-[56px] w-[56px]" />
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
              <Donut className="h-[56px] w-[56px]" />
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
              <Donut className="h-[56px] w-[56px]" />
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
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How are COVID-19 key indicators trending?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-2 xl:grid-cols-3">
            <BarLine title="Deaths by Date of Death" menu={<MenuDropdown />} />
            <BarLine title="Patients Ventilated" menu={<MenuDropdown />} />
            <BarLine title="Patients in ICU" menu={<MenuDropdown />} />
            <BarLine title="Hospital Admissions" menu={<MenuDropdown />} />
            <BarLine title="Confirmed Cases" menu={<MenuDropdown />} />
            <BarLine title="Tests Conducted" menu={<MenuDropdown />} />
          </div>
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>What does the latest data show?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2">
              <Stages title="Active COVID-19 Cases" className="pt-10" menu={<MenuDropdown />} />
            </div>
            <div className="col-span-1">
              <div className="grid grid-cols-2">
                <span className="block pb-4 text-base font-bold">{TabsMenu[currentTab].title}</span>
                <div className="flex justify-end">
                  <MenuDropdown />
                </div>
              </div>

              <Tabs onChange={selectTab}>
                {TabsMenu.map((menu, index) => {
                  return (
                    <Panel key={index} title={menu.name}>
                      <Bar
                        className="h-[550px] w-full"
                        keys={["y", "y2"]}
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
                {/* <Panel title="Deaths">
                        <Bar
                            className="w-full h-[550px]"
                            keys={["y", "y2"]}
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
                    <Panel title="Vent.">
                        <Bar
                            className="w-full h-[550px]"
                            keys={["y", "y2"]}
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
                    <Panel title="ICU">
                        <Bar
                            className="w-full h-[550px]"
                            keys={["y", "y2"]}
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
                    <Panel title="Hosp.">
                        <Bar
                            className="w-full h-[550px]"
                            keys={["y", "y2"]}
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
                    <Panel title="Cases">
                        <Bar
                            className="w-full h-[550px]"
                            keys={["y", "y2"]}
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
                    </Panel> */}
              </Tabs>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <Line
              className="h-[450px] w-full"
              menu={
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
                  <MenuDropdown />
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
              menu={
                <>
                  <Dropdown
                    placeholder="Variable Title"
                    onChange={() => {}}
                    options={[
                      { label: "hello", value: 1 },
                      { label: "world", value: 2 },
                    ]}
                  />
                  <MenuDropdown />
                </>
              }
            />
          </div>
        </section>
        <section className="border-b py-12">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h4>How vaccinated against COVID-19 are we?</h4>
            <span className="text-dim">Data as of {new Date().toDateString()}</span>
          </div>
          <div>
            <Table />
          </div>
        </section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // your fetch function here

  return {
    props: {},
  };
};

export default CovidNow;
