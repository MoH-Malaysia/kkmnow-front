import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  StateDropdown,
  Tooltip,
  Section,
  ChartHeader,
  Stages,
  BarMeter,
} from "@components/index";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useState } from "react";
import dynamic from "next/dynamic";
import { post } from "@lib/api";
import { useData } from "@hooks/useData";
import { useRouter } from "next/router";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Donut = dynamic(() => import("@components/Chart/Donut"), { ssr: false });
const BarLine = dynamic(() => import("@components/Chart/BarLine"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

const CovidDashboard = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";

  const { data, setData } = useData({
    filter_death: 0,
    filter_state: 0,
  });

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
      name: "Deaths",
    },
    {
      name: "Hosp.",
    },
    {
      name: "Cases",
    },
    {
      name: "Show All",
    },
  ];

  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">covid-19</span>
          <h3 className="text-black">The latest data on the pandemic in Malaysia.</h3>
          <p className="text-dim">
            Drawing from the Ministry of Health's excellent CovidDashboard dashboard, this page
            allows you to track the evolution of the epidemic in Malaysia on a daily basis.
          </p>
          <p className="text-dim">
            For a more general look at infectious diseases such as measles, chicken pox, and HFMD,
            head on over to our{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              Infectious Diseases Dashboard.
            </a>
          </p>

          <StateDropdown url="/dashboard/covid" currentState={currentState} />
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* Utilisations */}
        <Section title="Healthcare facility utilisation">
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

        {/* What does the latest data show? */}
        <Section title="What does the latest data show?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2">
              <Stages
                title="Active COVID-19 Cases"
                className="h-full pt-10"
                menu={<MenuDropdown />}
              />
            </div>
            <div className="col-span-1">
              <ChartHeader title={BarTabsMenu[data.filter_state].title} menu={<MenuDropdown />} />

              <Tabs onChange={value => setData("filter_state", value)}>
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

        <Section
          title="What is the mortality rate across vaccination groups?"
          description="Some description here"
        >
          <Tabs
            title={
              data.filter_death === 0
                ? "Deaths per 100k by Vaccination Status"
                : "Deaths by Vaccination Status"
            }
            menu={<MenuDropdown />}
            onChange={value => setData("filter_death", value)}
          >
            <Panel name="Per Capita">
              <Bar className="h-[450px]" mode="grouped" keys={["y1", "y2"]} enableGridX={false} />
            </Panel>
            <Panel name="Absolute">
              <Bar className="h-[450px]" mode="grouped" keys={["y1", "y2"]} enableGridX={false} />
            </Panel>
          </Tabs>
        </Section>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-2"></div>
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

export default CovidDashboard;
