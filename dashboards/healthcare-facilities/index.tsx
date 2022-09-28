import {
  Hero,
  Container,
  Bar,
  Search,
  Section,
  StateDropdown,
  Dropdown,
  Table,
  Button,
  Empty,
} from "@components/index";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { CountryAndStates, GRAYBAR_COLOR } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import dynamic from "next/dynamic";
import { FunctionComponent, useEffect } from "react";
import { OptionType } from "@components/types";
import { get } from "@lib/api";

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
  const { data, setData } = useData({
    zoom_facility_type: undefined,
    zoom_state: undefined,
    zoom_district: undefined,
    table_state: undefined,
    table_district: undefined,
    table_facility_type: undefined,
    map_markers: [],
    bar_distances_within: undefined,
    bar_distances_between: undefined,
  });

  const handleClearSelection = () => {
    setData("zoom_state", undefined);
    setData("zoom_facility_type", undefined);
    setData("zoom_district", undefined);
    setData("map_markers", []);
    setData("bar_distances_within", undefined);
    setData("bar_distances_between", undefined);
  };

  const fetchProximities = async () => {
    if (!data.zoom_state || !data.zoom_facility_type || !data.zoom_district) {
      setData("map_markers", []);
      setData("bar_distances_within", []);
      setData("map_distances_district", []);
      return;
    }
    const { data: result } = await get("/kkmnow", {
      dashboard: "facilities",
      table: "false",
      state: data.zoom_state,
      fac_type: data.zoom_facility_type.label.toLowerCase(),
      district: data.zoom_district.label.toLowerCase().replace(" ", "-"),
    });

    setData("map_markers", result.locations_mapping);
    setData("bar_distances_within", result.distances_within);
    setData("bar_distances_between", result.distances_between);
  };

  useEffect(() => {
    fetchProximities().catch(e => console.error(e));
  }, [data.zoom_district, data.zoom_facility_type, data.zoom_state]);

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
                    exclude={["kvy", "mys"]}
                    width="w-full lg:w-64"
                  />
                  <Dropdown
                    selected={data.table_district}
                    placeholder={!data.table_state ? "Select state first" : "All"}
                    label="District"
                    options={
                      data.table_state
                        ? state_district_mapping[data.table_state].map((district: string) => {
                            return { label: district, value: district };
                          })
                        : []
                    }
                    onChange={selected => {
                      setData("table_district", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "district", value: selected.value })
                      );
                    }}
                    width="w-full lg:w-64"
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
                  {(data.table_state || data.table_district || data.table_facility_type) && (
                    <Button
                      className="justify-end text-right text-sm text-dim"
                      onClick={() => {
                        setData("table_state", undefined);
                        setData("table_district", undefined);
                        setData("table_facility_type", undefined);
                        setColumnFilters([]);
                      }}
                      icon={<ArrowPathIcon className="h-4 w-4" />}
                    >
                      Clear Selection
                    </Button>
                  )}
                </>
              )}
              search={setGlobalFilter => (
                <Search
                  className="w-full lg:w-auto"
                  onChange={query => setGlobalFilter(query ?? "")}
                />
              )}
              enablePagination
              cellClass="text-left"
            />
          </div>
        </Section>
        <div className="grid grid-cols-1 gap-8 pt-12 lg:grid-cols-3">
          <Section
            className="col-span-1"
            title="How does proximity to healthcare vary nationally?"
            description="Distance to the nearest healthcare facility is not the only measure of access to
                healthcare. There is a modern and growing body of research demonstrating the tough
                tradeoffs involved in localisation of healthcare - for instance, diversifying
                resources across multiple facilities in an area to decrease travel time, or
                concentrating them in a single hospital to up the quality of care.  The data presented here only captures one aspect of healthcare access (proximity),
                and is intended as a starting point for policymakers and the community to have a
                conversation about access."
            date={null}
          >
            <div className="w-full space-y-2 lg:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-dim" />
                  Zoom into my area
                </h4>

                {data.zoom_facility_type && (
                  <Button
                    onClick={handleClearSelection}
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    Clear Selection
                  </Button>
                )}
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
                  setData("zoom_district", undefined);
                }}
                disabled={!data.zoom_facility_type}
                exclude={["kvy", "mys"]}
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
          </Section>
          <div className="col-span-1 lg:col-span-2">
            <OSMapWrapper
              title={`${
                data.zoom_facility_type
                  ? data.zoom_facility_type.label.concat(" in ")
                  : "Healthcare Facilities in "
              } ${data.zoom_district ? data.zoom_district.label + ", " : ""} ${
                CountryAndStates[data.zoom_state ?? "mys"]
              }`}
              position={
                data.map_markers.length
                  ? [data.map_markers[0].lat, data.map_markers[0].lon]
                  : undefined
              }
              zoom={data.map_markers.length ? 9 : undefined}
              markers={data.map_markers.map((marker: any) => ({
                name: marker.name,
                position: [marker.lat, marker.lon],
              }))}
              className="h-[520px] w-full rounded-xl"
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-12 py-12 xl:grid-cols-2">
          {data.bar_distances_within && data.bar_distances_between ? (
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
                data={{
                  labels: data.bar_distances_within.x,
                  datasets: [
                    {
                      label: `No. of ${data.zoom_facility_type.label}`,
                      data: data.bar_distances_within.y,
                      backgroundColor: GRAYBAR_COLOR[200],
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Bar
                title={
                  <div className="flex self-center text-base font-bold">
                    Distance of {data.zoom_facility_type.label} in{" "}
                    {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                    {CountryAndStates[data.zoom_state]} relative to other{" "}
                    {data.zoom_district === "" ? "States" : "Districts"}
                  </div>
                }
                data={{
                  labels: data.bar_distances_between.x,
                  datasets: [
                    {
                      label: `Distance to ${data.zoom_facility_type.label} (km)`,
                      data: data.bar_distances_between.y,
                      backgroundColor: GRAYBAR_COLOR[200],
                    },
                  ],
                }}
                className="h-[380px]"
                unitY="km"
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
        </div>
      </Container>
    </>
  );
};

export default HealthcareFacilitiesDashboard;
