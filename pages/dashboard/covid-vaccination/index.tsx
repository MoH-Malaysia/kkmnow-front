import {
  Hero,
  Container,
  Tabs,
  Panel,
  MenuDropdown,
  Dropdown,
  Slider,
  Section,
  BarMeter,
} from "@components/index";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { post } from "@lib/api";
import { useData } from "@hooks/useData";
import { filterAgeOptions, filterDoseOptions } from "@lib/options";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Donut = dynamic(() => import("@components/Chart/Donut"), { ssr: false });
const BarLine = dynamic(() => import("@components/Chart/BarLine"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

const CovidVaccination = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
        <div className="space-y-2 xl:w-1/2">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            covid-19 vaccination
          </span>
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
        <Section title="How vaccinated against COVID-19 are we?">
          <Tabs
            title={<p className="text-dim">Data for Malaysia | Total Population</p>}
            menu={<MenuDropdown />}
            current={data.filter_by}
            onChange={index => setData("filter_by", index)}
            controls={
              <>
                <Dropdown
                  placeholder="Select"
                  onChange={() => {}}
                  selected={data.filter_by === 0 ? filterDoseOptions[0] : filterAgeOptions[0]}
                  options={data.filter_by === 0 ? filterDoseOptions : filterAgeOptions}
                />
              </>
            }
          >
            <Panel name="Filter by Dose">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <Waffle
                  className=" aspect-square w-full lg:h-[300px] lg:w-auto"
                  title="1st Dose"
                  color="#9FE8B1"
                >
                  <div>
                    <p>Total - 16,228,368</p>
                    <p>Daily - 1,026</p>
                  </div>
                </Waffle>
                <Waffle
                  className=" aspect-square w-full lg:h-[300px] lg:w-auto"
                  title="2nd Dose"
                  color="#31C752"
                >
                  <div>
                    <p>Total - 16,228,368</p>
                    <p>Daily - 1,026</p>
                  </div>
                </Waffle>
                <Waffle
                  className=" aspect-square w-full lg:h-[300px] lg:w-auto"
                  title="1st Booster"
                  color="#228F3A"
                >
                  <div>
                    <p>Total - 16,228,368</p>
                    <p>Daily - 1,026</p>
                  </div>
                </Waffle>
                <Waffle
                  className=" aspect-square w-full lg:h-[300px] lg:w-auto"
                  title="2nd Booster"
                  color="#135523"
                >
                  <div>
                    <p>Total - 16,228,368</p>
                    <p>Daily - 1,026</p>
                  </div>
                </Waffle>
              </div>
            </Panel>
            <Panel name="Filter by Age group">
              <BarMeter className="relative flex h-[500px] w-full justify-between" />
            </Panel>
          </Tabs>
        </Section>

        {/* What is the current state of the COVID-19 vaccination program? */}
        <Section title="What is the current state of the COVID-19 vaccination program?">
          <div className="space-y-4">
            <BarLine title="Daily Vaccination" menu={<MenuDropdown />} stats={null} />
            <Slider className="pt-7" type="range" onChange={(item: any) => console.log(item)} />
            <span className="text-sm text-dim">
              Use this time slider to zoom in specific time range
            </span>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section title="How are COVID-19 key indicators trending?">
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <BarLine
              title="Primary Doses (All Ages)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
            <BarLine
              title="1st Boosters (All Ages)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
            <BarLine
              title="2nd Boosters (All Ages)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
            <BarLine
              title="Adults (All Doses)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
            <BarLine
              title="Adolescents (All Doses)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
            <BarLine
              title="Children (All Doses)"
              menu={<MenuDropdown />}
              stats={[
                {
                  title: "Daily",
                  value: "+5,230",
                },
                {
                  title: "Total",
                  value: "4,613,998",
                },
              ]}
            />
          </div>
        </Section>

        {/* Which states are best vaccinated against COVID-19? */}
        <Section title="Which states are best vaccinated against COVID-19?">
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

export default CovidVaccination;
