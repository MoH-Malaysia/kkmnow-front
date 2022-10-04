/**
 * Covid Vaccination Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { get } from "@lib/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { useTranslation } from "next-i18next";
import { JSXElementConstructor, ReactElement } from "react";
import { routes } from "@lib/routes";
import { sortMsiaFirst } from "@lib/helpers";

const CovidVaccinationIndex = ({
  last_updated,
  waffle_data,
  table_data,
  barmeter_data,
  timeseries_data,
  stats_data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.covid_19_vax")}
        description={t("vaccination.title_description1")}
        keywords={""}
      />

      <CovidVaccinationDashboard
        last_updated={last_updated}
        waffle_data={waffle_data}
        table_data={table_data}
        barmeter_data={barmeter_data}
        timeseries_data={timeseries_data}
        stats_data={stats_data}
      />
    </>
  );
};

CovidVaccinationIndex.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout stateSelector={<StateDropdown url={routes.COVID} currentState={"mys"} hideOnScroll />}>
    <StateModal url={routes.COVID_VAX} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "covid_vax", state: "mys" }); // fetch static data here
  data.snapshot = sortMsiaFirst(data.snapshot, "state");

  return {
    props: {
      last_updated: new Date().valueOf(),
      waffle_data: data.waffle,
      barmeter_data: data.bar_chart,
      table_data: data.snapshot,
      timeseries_data: data.timeseries,
      stats_data: data.statistics,
      ...i18n,
    },
    revalidate: 300,
  };
};

export default CovidVaccinationIndex;
