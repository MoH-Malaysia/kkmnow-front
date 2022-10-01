import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { BREAKPOINTS, CountryAndStates } from "@lib/constants";

import {
  Container,
  Button,
  Hero,
  StateDropdown,
  Empty,
  Search,
  Section,
  Tabs,
  Panel,
} from "@components/index";
import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { HOSPITAL_TABLE_SCHEMA } from "@lib/schema/hospital-bed-utilisation";
import { useWindowWidth } from "@hooks/useWindowWidth";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface HospitalBedUtilisationDashboardProps {
  choropleth_bed: any;
  table_facility: any;
  timeseries_facility: any;
  timeseries_state: any;
}

const HospitalBedUtilisationDashboard: FunctionComponent<HospitalBedUtilisationDashboardProps> = ({
  choropleth_bed,
  table_facility,
  timeseries_facility,
}) => {
  const { data, setData } = useData({
    state: undefined,
    facility: undefined,
  });
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;

  return (
    <>
      <Hero background="hospbed-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            healthcare resources
          </span>
          <h3 className="text-black">Hospital Bed Utilisation</h3>
          <p className="text-dim">
            The Health Informatics Centre (PIK) maintains a constantly-updated database on all
            healthcare facilities - both public and private - in Malaysia. This dashboard documents
            the data in a manner that eases the process of finding a healthcare facility for your
            needs, and builds on the dataset to analyse healthcare access. The analysis on access
            will be constantly enriched over time as we deepen the scope of the facilities dataset -
            for instance with data on services offered, waiting times, and healthare outcomes.
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        <Section
          title="What is the current geographic distribution of hospital bed utilisation?"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        >
          <Tabs className="flex flex-wrap justify-end gap-2">
            <Panel key={0} name="Non-Critical Care">
              <Choropleth
                className={"h-[500px] w-auto"}
                colorScale="oranges"
                enableScale={false}
                projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
                projectionScaleSetting={isMobile ? 2200 : 3500}
                data={choropleth_bed.map((item: any) => ({
                  id: CountryAndStates[item.state],
                  value: item.data.util_nonicu,
                }))}
                graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
                unitY="%"
              />
            </Panel>
            <Panel key={1} name={"Critical Care (ICU)"}>
              <Choropleth
                className={"h-[500px] w-auto"}
                colorScale="reds"
                enableScale={false}
                projectionTranslation={isMobile ? [0.5, 1.0] : [0.65, 1.0]}
                projectionScaleSetting={isMobile ? 2200 : 3500}
                data={choropleth_bed.map((item: any) => ({
                  id: CountryAndStates[item.state],
                  value: item.data.util_icu,
                }))}
                graphChoice={isMobile ? "StateMobile" : "StateDesktop"}
                unitY="%"
              />
            </Panel>
          </Tabs>
        </Section>
        <Section title="Hospital Bed Utilisation by Facility">
          <Table
            controls={setColumnFilters => (
              <>
                <StateDropdown
                  label="State"
                  currentState={data.table_state}
                  onChange={selected => {
                    setData("table_state", selected.value);
                    setColumnFilters([{ id: "state", value: selected.value }]);
                  }}
                  exclude={["kvy", "mys"]}
                  width="w-full lg:w-64"
                />
                <Button
                  onClick={() => {
                    setData("table_state", undefined);
                    setData("table_district", undefined);
                    setData("table_facility_type", undefined);
                    setColumnFilters([]);
                  }}
                  className="justify-end text-right text-sm text-dim"
                  disabled={!data.table_state && !data.table_district && !data.table_facility_type}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Clear Selection
                </Button>
              </>
            )}
            search={setGlobalFilter => (
              <Search
                className="w-full lg:w-auto"
                onChange={query => setGlobalFilter(query ?? "")}
              />
            )}
            data={table_facility}
            config={HOSPITAL_TABLE_SCHEMA(({ state, facility }) => {
              setData("state", state);
              setData("facility", facility);
            })}
            enablePagination
          />
        </Section>
        <Section title={`Bed Utilisation for ${data.facility ?? "Malaysia"}`}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {data.state && data.facility ? (
              <>
                <Timeseries
                  className="h-[250px] w-full"
                  title="Hospital Bed Utilisation (non-critical)"
                  enableGridX={false}
                  data={{
                    labels: timeseries_facility[data.state][data.facility].x,
                    datasets: [
                      {
                        type: "line",
                        label: "Utilisation rate (%)",
                        data: timeseries_facility[data.state][data.facility].line_util_non_icu,
                        borderColor: "#DC2626",
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                />
                <Timeseries
                  className="h-[250px] w-full"
                  title="ICU Bed Utilisation (critical care)"
                  data={{
                    labels: timeseries_facility[data.state][data.facility].x,
                    datasets: [
                      {
                        type: "line",
                        label: "Utilisation rate (%)",
                        data: timeseries_facility[data.state][data.facility].line_util_icu,
                        borderColor: "#DC2626",
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                  enableGridX={false}
                />
              </>
            ) : (
              <>
                <Empty
                  title="Hospital Bed Utilisation (non-critical)"
                  type="timeseries"
                  className="h-[250px] w-full"
                  placeholder="Please select a facility from table"
                />
                <Empty
                  title="ICU Bed Utilisation (critical care)"
                  type="timeseries"
                  className="h-[250px] w-full"
                  placeholder="Please select a facility from table"
                />
              </>
            )}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default HospitalBedUtilisationDashboard;
