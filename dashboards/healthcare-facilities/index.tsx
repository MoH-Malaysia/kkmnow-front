import { Hero, Container, Bar, Search, Section, StateDropdown, Dropdown } from "@components/index";
import { GlobeAltIcon } from "@heroicons/react/solid";
import { MapIcon } from "@heroicons/react/outline";
import { useData } from "@hooks/useData";
import { CountryAndStates } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useEffect } from "react";
import { OptionType } from "@components/types";
import { useTranslation } from "next-i18next";

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
    table_filter: "",
  });
  const { t } = useTranslation("common");

  const isZoomEmpty = () => {
    return data.zoom_district != "" && data.zoom_state != "";
  };

  //   useEffect(() => {
  //     setData("zoom_facility", undefined);
  //   }, [data.zoom_state]);

  return (
    <>
      <Hero background="hero-light-1">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("healthcare.title")}
          </span>
          <h3 className="text-black">{t("healthcare.title_header")}</h3>
          <p className="text-dim">{t("healthcare.title_description")}</p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        <Section title={t("healthcare.table_header")}>
          <div className="mt-2">
            <TableFacilities
              data={facility_table}
              config={FACILTIES_TABLE_SCHEMA.config}
              filter={true}
              pagination={true}
              currentState={currentState}
              facility_types={facility_types}
              state_district_mapping={state_district_mapping}
            />
          </div>
        </Section>
        <Section title="">
          {/* <div className="grid grid-cols-1 gap-12 xl:grid-cols-2"> */}
          <div className="flex w-full flex-col gap-12 lg:flex-row">
            <div className="w-full space-y-4 lg:w-1/3">
              <h3>{t("healthcare.map_header")}</h3>
              <p>{t("healthcare.map_description1")}</p>
              <p>{t("healthcare.map_description2")}</p>
              <h4 className="flew-row flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-dim" />
                {t("healthcare.zoom")}
              </h4>

              <StateDropdown
                url={routes.HEALTHCARE}
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_state", selected.value);
                  setData("zoom_district", "");
                  setData("zoom_type", "");
                  //   router.push(`${routes.HEALTHCARE}/${selected.value}`);
                }}
                exclude={["kvy"]}
                disableText
                width="w-full"
              />
              <Dropdown
                placeholder={t("healthcare.dropdown_placeholder1")}
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
                placeholder={t("healthcare.dropdown_placeholder2")}
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
                  {t("healthcare.map_title")}{" "}
                  {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                  {CountryAndStates[data.zoom_state]}
                </h4>
                <div
                  className="ml-auto flex cursor-pointer flex-row items-center gap-2 text-right text-blue-500"
                  onClick={() => {}}
                >
                  <MapIcon className="h-5 w-5" />
                  {t("healthcare.map_nav")}
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
                      {t("healthcare.map_distance")} {data.zoom_type ? data.zoom_type.label : ""}{" "}
                      {t("healthcare.map_distance1")}{" "}
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
                      {CountryAndStates[data.zoom_state]} {t("healthcare.map_relative")}{" "}
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
