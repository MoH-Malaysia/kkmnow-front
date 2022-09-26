import {
  Hero,
  Container,
  Bar,
  Search,
  Section,
  StateDropdown,
  Dropdown,
  Table,
} from "@components/index";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import { useData } from "@hooks/useData";
import { CountryAndStates } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useEffect } from "react";
import { OptionType } from "@components/types";

const TableFacilities = dynamic(() => import("@components/Chart/TableFacilities"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

interface HealthcareFacilitiesDashboardProps {
  facility_table: any;
  state_district_mapping: any;
  facility_types: any;
}

const HealthcareFacilitiesDashboard: FunctionComponent<HealthcareFacilitiesDashboardProps> = ({
  facility_table,
  state_district_mapping,
  facility_types,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    zoom_type: "",
    zoom_state: currentState,
    zoom_district: "",
    table_state: undefined,
    table_district: undefined,
    table_facility_type: undefined,
  });

  const isZoomEmpty = () => {
    return data.zoom_district != "" && data.zoom_state != "";
  };

  console.log(facility_types);

  return (
    <>
      <Hero background="hero-light-1">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            healthcare resources
          </span>
          <h3 className="text-black">Healthcare Facilities</h3>
          <p className="text-dim">
            The Health Informatics Centre (PIK) maintains a constantly-updated database on all
            healthcare faciltiies - both public and private - in Malaysia. This dashboard documents
            the data in a manner that eases the process of finding a healthcare facility for your
            needs, and builds on the dataset to analyse healthcare access. The analysis on the
            access will be constantly enriched over time as we deepen the scope of the facilities
            dataset - for instance with data on services offered, waiting times, and healthcare
            outcomes.
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        <Section title="Find A Healthcare Facility">
          <div className="mt-2">
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
                    options={[]}
                    disabled
                    onChange={selected => {
                      setData("table_district", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "district", value: selected.value })
                      );
                    }}
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
                        state.concat({ id: "type", value: selected.label })
                      );
                    }}
                    width="w-full"
                  />
                </>
              )}
              search={setGlobalFilter => (
                <Search onChange={query => setGlobalFilter(query ?? "")} />
              )}
              enablePagination
            />
          </div>
        </Section>
        <Section title="">
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
              <h4 className="flew-row flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-dim" />
                Zoom into my area
              </h4>

              <StateDropdown
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_state", selected.value);
                  setData("zoom_district", "");
                  setData("zoom_type", "");
                }}
                exclude={["kvy"]}
                width="w-full"
              />
              <Dropdown
                placeholder="Select District"
                onChange={item => setData("zoom_district", item)}
                selected={data.zoom_district}
                disabled={!data.zoom_state}
                options={
                  data.zoom_state != "mys"
                    ? state_district_mapping[data.zoom_state].map((district: any) => {
                        return { label: district, value: district } as OptionType<string, string>;
                      })
                    : []
                }
                width="w-full"
              />
              <Dropdown
                placeholder="Select Facilty Type"
                onChange={item => setData("zoom_type", item)}
                selected={data.zoom_type}
                disabled={!data.zoom_district}
                options={facility_types.map((fac: any) => {
                  return { label: fac, value: fac } as OptionType<string, string>;
                })}
                width="w-full"
              />
            </div>
            <div className="w-full lg:w-2/3">
              <div className="flex flex-row items-center">
                <h4 className="mb-5">
                  Hospitals in {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                  {CountryAndStates[data.zoom_state]}
                </h4>
                <div
                  className="ml-auto flex cursor-pointer flex-row items-center gap-2 text-right text-blue-500"
                  onClick={() => {}}
                >
                  <MapIcon className="h-5 w-5" />
                  Navigate to location
                </div>
              </div>

              <OSMapWrapper mapHeight={510} LatLng={[3, 102]} borderRadius={10} />
            </div>
          </div>
          {isZoomEmpty() && (
            <div className="mt-16 grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
              <div>
                <Bar
                  title={
                    <div className="flex self-center text-base font-bold">
                      Distance to Nearest {data.zoom_type ? data.zoom_type.label : ""} within{" "}
                      {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                      {CountryAndStates[data.zoom_state]}
                    </div>
                  }
                  className="h-[300px]"
                  enableGridX={false}
                />
              </div>
              <div>
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
              </div>
            </div>
          )}
        </Section>
      </Container>
    </>
  );
};

export default HealthcareFacilitiesDashboard;
