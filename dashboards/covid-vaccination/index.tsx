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
  Tooltip,
} from "@components/index";
import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { VACCINE_TABLE_SCHEMA } from "@lib/schema/covid-vaccination";
import { filterAgeOptions, filterDoseOptions, statesOptions } from "@lib/options";
import { CountryAndStates } from "@lib/constants";
import { useRouter } from "next/router";
import StateDropdown from "@components/Dropdown/StateDropdown";

const BarLine = dynamic(() => import("@components/Chart/BarLine"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

interface CovidVaccinationProps {
  waffle_data: Array<any>;
  barmeter_data: Array<any>;
  timeseries_data: Array<any>;
  table_data: Array<any>;
}

const CovidVaccinationDashboard: FunctionComponent<CovidVaccinationProps> = ({
  waffle_data,
  timeseries_data,
  table_data,
  barmeter_data,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    vax_tab: 0,
    filter_dose: filterDoseOptions[0],
    filter_age: filterAgeOptions[0],
  });

  const renderFilterOptions = () => {
    switch (data.vax_tab) {
      case 0:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_age", item)}
            selected={data.filter_age}
            options={filterAgeOptions}
          />
        );
      case 1:
        return (
          <Dropdown
            placeholder="Select"
            onChange={item => setData("filter_dose", item)}
            selected={data.filter_dose}
            options={filterDoseOptions}
          />
        );
    }
  };

  return (
    <>
      <Hero background="hero-light-4">
        <div className="space-y-4 xl:w-2/3">
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

          <StateDropdown url="/dashboard/covid-vaccination" currentState={currentState} />
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section title="How vaccinated against COVID-19 are we?">
          <Tabs
            title={
              <p className="text-dim">
                Data for {CountryAndStates[currentState]} | Total Population
              </p>
            }
            menu={<MenuDropdown />}
            current={data.vax_tab}
            onChange={index => setData("vax_tab", index)}
            controls={<>{renderFilterOptions()}</>}
          >
            <Panel name="Filter by Age group">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <Waffle
                  className="aspect-square w-full lg:h-[300px] lg:w-auto"
                  title={
                    <>
                      1st Dose -{" "}
                      <Tooltip
                        trigger={
                          <span className="underline decoration-dashed underline-offset-4">
                            {(waffle_data[data.filter_age.value].dose1.perc as number).toFixed(2)}%
                          </span>
                        }
                      >
                        Tooltip for Dose 1
                      </Tooltip>
                    </>
                  }
                  color="#9FE8B1"
                  data={waffle_data[data.filter_age.value].dose1.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].dose1.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[300px] lg:w-auto"
                  title={
                    <>
                      <>
                        2nd Dose -{" "}
                        <Tooltip
                          trigger={
                            <span className="underline decoration-dashed underline-offset-4">
                              {(waffle_data[data.filter_age.value].dose2.perc as number).toFixed(2)}
                              %
                            </span>
                          }
                        >
                          Tooltip for Dose 2
                        </Tooltip>
                      </>
                    </>
                  }
                  color="#31C752"
                  data={waffle_data[data.filter_age.value].dose2.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].dose2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].dose2.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[300px] lg:w-auto"
                  title={
                    <>
                      <>
                        1st Booster -{" "}
                        <Tooltip
                          trigger={
                            <span className="underline decoration-dashed underline-offset-4">
                              {(waffle_data[data.filter_age.value].booster1.perc as number).toFixed(
                                2
                              )}
                              %
                            </span>
                          }
                        >
                          Tooltip for Booster 1
                        </Tooltip>
                      </>
                    </>
                  }
                  color="#228F3A"
                  data={waffle_data[data.filter_age.value].booster1.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster1.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].booster1.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
                <Waffle
                  className="aspect-square w-full lg:h-[300px] lg:w-auto"
                  title={
                    <>
                      <>
                        2nd Booster -{" "}
                        <Tooltip
                          trigger={
                            <span className="underline decoration-dashed underline-offset-4">
                              {(waffle_data[data.filter_age.value].booster2.perc as number).toFixed(
                                2
                              )}
                              %
                            </span>
                          }
                        >
                          Tooltip for Booster 2
                        </Tooltip>
                      </>
                    </>
                  }
                  color="#135523"
                  data={waffle_data[data.filter_age.value].booster2.data}
                >
                  <div className="text-dim">
                    <p>
                      Total -{" "}
                      <span className="font-medium text-black">
                        {(
                          waffle_data[data.filter_age.value].booster2.total as number
                        ).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Daily -{" "}
                      <span className="font-medium text-black">
                        {waffle_data[data.filter_age.value].booster2.daily}
                      </span>
                    </p>
                  </div>
                </Waffle>
              </div>
            </Panel>
            <Panel name="Filter by Dose">
              <BarMeter
                data={barmeter_data[data.filter_dose.value]}
                className="relative flex h-[500px] w-full justify-between"
                indexBy="id"
              />
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
              {VACCINE_TABLE_SCHEMA.map((menu, index) => {
                return (
                  <Panel key={index} name={menu.name}>
                    <Table data={table_data} config={menu.config} />
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

export default CovidVaccinationDashboard;
