import { Hero, Container, Bar, Search, Section, StateDropdown, Dropdown } from "@components/index";
import { GlobeAltIcon } from "@heroicons/react/solid";
import { useData } from "@hooks/useData";
import { CountryAndStates } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useEffect } from "react";

const TableFacilities = dynamic(() => import("@components/Chart/TableFacilities"), { ssr: false });

interface HealthcareFacilitiesDashboardProps {
  facility_table: any;
}

const HealthcareFacilitiesDashboard: FunctionComponent<HealthcareFacilitiesDashboardProps> = ({
  facility_table,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    zoom_type: undefined,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_district: undefined,
    table_filter: "",
  });

  useEffect(() => {
    setData("zoom_facility", undefined);
  }, [data.zoom_state]);

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
            <TableFacilities
              data={facility_table}
              config={FACILTIES_TABLE_SCHEMA.config}
              filter={true}
              pagination={true}
              pageSize={20}
              currentState={currentState}
            />
          </div>
        </Section>
        <Section title="How does proximity to healthcare vary nationally?">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="w-full space-y-3">
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
                url={routes.HEALTHCARE}
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_state", selected.value);
                  //   router.push(`${routes.HEALTHCARE}/${selected.value}`);
                }}
                exclude={["kvy"]}
                disableText
                width="w-full"
              />
              <Dropdown
                placeholder="Select District"
                onChange={item => setData("zoom_district", item)}
                selected={data.zoom_district}
                disabled={!data.zoom_state}
                options={[]}
                width="w-full"
              />
              <Dropdown
                placeholder="Select Facilty Type"
                onChange={item => setData("zoom_type", item)}
                selected={data.zoom_type}
                disabled={!data.zoom_district}
                options={[
                  { label: "Hospital", value: 0 },
                  { label: "Clinic", value: 1 },
                ]}
                width="w-full"
              />
            </div>
            <div className="w-full">
              <h4>Hospitals in {CountryAndStates[data.zoom_state]}</h4>
            </div>
          </div>
          <div className="mt-10 grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Bar
                title={
                  <div className="flex self-center text-base font-bold">
                    Distance to Nearest {data.zoom_type ? data.zoom_type.label : ""} within{" "}
                    {CountryAndStates[data.zoom_state]}
                  </div>
                }
                className="h-[300px]"
                enableGridX={false}
              />
            </div>
            <div>
              <Bar
                title="Area relative to other area type"
                className="h-[300px]"
                enableGridX={false}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default HealthcareFacilitiesDashboard;
