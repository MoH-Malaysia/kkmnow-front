import { OptionType } from "@components/types";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { CountryAndStates } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import {
  Container,
  Button,
  Dropdown,
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

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface HospitalBedUtilisationDashboardProps {}

const HospitalBedUtilisationDashboard: FunctionComponent<
  HospitalBedUtilisationDashboardProps
> = () => {
  const { data, setData } = useData({
    table_state: undefined,
    table_district: undefined,
  });

  return (
    <>
      <Hero background="hero-light-1">
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
                //   className={isMobile ? "h-[300px] w-full" : "h-[500px] w-full"}
                className={"h-[500px] w-full"}
                enableScale={false}
                projectionScaleSetting={3500}
                //   xKey="properties.name_short"
                //   data={choropleth_world.map((item: any) => {
                //     return {
                //       id: item.iso3,
                //       value_real: item.data.views,
                //       value: item.data.views_log ? item.data.views_log : 0,
                //     };
                //   })}
              />
            </Panel>
            <Panel key={1} name={"Critical Care (ICU)"}>
              <Choropleth
                //   className={isMobile ? "h-[300px] w-full" : "h-[500px] w-full"}
                className={"h-[500px] w-full"}
                enableScale={false}
                projectionScaleSetting={3500}
                //   xKey="properties.name_short"
                //   data={choropleth_world.map((item: any) => {
                //     return {
                //       id: item.iso3,
                //       value_real: item.data.views,
                //       value: item.data.views_log ? item.data.views_log : 0,
                //     };
                //   })}
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
                />
                <Dropdown
                  selected={data.table_district}
                  placeholder="All"
                  label="District"
                  options={[]}
                  disabled={!data.table_state}
                  onChange={selected => {
                    setData("table_district", selected);
                    setColumnFilters(state =>
                      state.concat({ id: "district", value: selected.value })
                    );
                  }}
                  width="w-52"
                />
                <Button
                  onClick={() => {
                    setData("table_state", undefined);
                    setData("table_district", undefined);
                    setData("table_facility_type", undefined);
                    setColumnFilters([]);
                  }}
                  disabled={!data.table_state && !data.table_district && !data.table_facility_type}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Clear Selection
                </Button>
              </>
            )}
            search={setGlobalFilter => <Search onChange={query => setGlobalFilter(query ?? "")} />}
            enablePagination
            cellClass="text-left"
          />
        </Section>
        <Section title="Bed Utilisation for {hospital_facility}">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <Timeseries
              className="h-[250px] w-full"
              title="Daily Hospital Admissions"
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title="Hospital Bed Admissions (non-critical)"
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title="ICU Bed Utilisation (critical care)"
              enableGridX={false}
            />
          </div>
        </Section>

        {/* <div className="mt-2">
            <Table
              data={facility_table}
              config={FACILTIES_TABLE_SCHEMA.config}
              controls={setColumnFilters => (
                <>
                  <StateDropdown
                    label="State"
                    currentState={data.table_state}
                    onChange={selected => {
                      setData("table_state", selected.value);
                      setColumnFilters([{ id: "state", value: selected.value }]);
                    }}
                    exclude={["kvy"]}
                  />
                  <Dropdown
                    selected={data.table_district}
                    placeholder="All"
                    label="District"
                    options={
                      data.table_state
                        ? state_district_mapping[data.table_state].map((district: string) => {
                            return { label: district, value: district };
                          })
                        : []
                    }
                    disabled={!data.table_state}
                    onChange={selected => {
                      setData("table_district", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "district", value: selected.value })
                      );
                    }}
                    width="w-52"
                  />
                  <Dropdown
                    selected={data.table_facility_type}
                    placeholder="All"
                    label="Type"
                    options={facility_types.map((item: string): OptionType => {
                      return {
                        label: item,
                        value: item.toLowerCase(),
                      };
                    })}
                    onChange={selected => {
                      setData("table_facility_type", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "type", value: selected.value })
                      );
                    }}
                    width="w-full"
                  />
                  <Button
                    onClick={() => {
                      setData("table_state", undefined);
                      setData("table_district", undefined);
                      setData("table_facility_type", undefined);
                      setColumnFilters([]);
                    }}
                    disabled={
                      !data.table_state && !data.table_district && !data.table_facility_type
                    }
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    Clear Selection
                  </Button>
                </>
              )}
              search={setGlobalFilter => (
                <Search onChange={query => setGlobalFilter(query ?? "")} />
              )}
              enablePagination
              cellClass="text-left"
            />
          </div>
        </Section>
        <Section date={null}>
          <div className="flex w-full flex-col gap-12 lg:flex-row">
            <div className="w-full space-y-4 lg:w-1/3">
              <h3>How does proximity to healthcare vary nationally?</h3>
              <p>
                Distance to the nearest healthcare facility is not the only measure of access to
                healthcare. There is a modern and growing body of research demonstrating the tough
                tradeoffs involved in localisation of healthcare - for instance, diversifying
                resources across multiple facilities in an area to decrease travel time, or
                concentrating them in a single hospital to up the quality of care.
              </p>
              <p>
                The data presented here only captures one aspect of healthcare access (proximity),
                and is intended as a starting point for policymakers and the community to have a
                conversation about access.
              </p>
              <div className="flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-dim" />
                  Zoom into my area
                </h4>
                <Button
                  onClick={handleClearSelection}
                  disabled={!data.zoom_state}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Clear Selection
                </Button>
              </div>

              <Dropdown
                placeholder="Select facilty type"
                onChange={item => setData("zoom_facility_type", item)}
                selected={data.zoom_facility_type}
                options={facility_types.map((fac: any) => {
                  return { label: fac, value: fac } as OptionType<string, string>;
                })}
                width="w-full"
              />

              <StateDropdown
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_state", selected.value);
                  setData("zoom_district", "");
                }}
                disabled={!data.zoom_facility_type}
                exclude={["kvy"]}
                width="w-full"
              />
              <Dropdown
                placeholder="Select district"
                onChange={item => setData("zoom_district", item)}
                selected={data.zoom_district}
                disabled={!data.zoom_state}
                options={
                  data.zoom_state
                    ? state_district_mapping[data.zoom_state].map((district: any) => {
                        return { label: district, value: district } as OptionType<string, string>;
                      })
                    : []
                }
                width="w-full"
              />
            </div>
            <div className="w-full lg:w-2/3">
              <OSMapWrapper
                title={`${
                  data.zoom_facility_type
                    ? data.zoom_facility_type.label.concat(" in ")
                    : "Healthcare Facilities in "
                } ${data.zoom_district ? data.zoom_district.label + ", " : ""} ${
                  CountryAndStates[data.zoom_state ?? "mys"]
                }`}
                className="h-[520px] w-full rounded-xl"
              />
            </div>
          </div>
          <div className="mt-16 grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            {data.zoom_state && data.zoom_district ? (
              <>
                <Bar
                  title={
                    <div className="flex self-center text-base font-bold">
                      Distance to Nearest{" "}
                      {data.zoom_facility_type ? data.zoom_facility_type.label : ""} within{" "}
                      {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                      {CountryAndStates[data.zoom_state]}
                    </div>
                  }
                  className="h-[300px]"
                  enableGridX={false}
                />
                <Bar
                  title={
                    <div className="flex self-center text-base font-bold">
                      {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                      {CountryAndStates[data.zoom_state]} relative to other{" "}
                      {data.zoom_district === "" ? "States" : "Districts"}
                    </div>
                  }
                  className="h-[300px]"
                  enableGridX={false}
                />
              </>
            ) : (
              <>
                <Empty
                  title="Distance to Nearest Facility"
                  type="timeseries"
                  className="h-[300px] w-full"
                  placeholder="Please select a district"
                />
                <Empty
                  title="Relative to Nearest Facility"
                  type="timeseries"
                  className="h-[300px] w-full"
                  placeholder="Please select a district"
                />
              </>
            )}
          </div> */}
      </Container>
    </>
  );
};

export default HospitalBedUtilisationDashboard;
