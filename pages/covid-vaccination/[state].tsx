/**
 * Covid Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { CountryAndStates, STATES } from "@lib/constants";
import { get } from "@lib/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { useTranslation } from "next-i18next";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { JSXElementConstructor, ReactElement } from "react";

const CovidVaccinationState = ({
  last_updated,
  waffle_data,
  table_data,
  barmeter_data,
  timeseries_data,
  stats_data,
  state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("nav.megamenu.dashboards.covid_19_vax"))}
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

CovidVaccinationState.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.COVID_VAX}
        currentState={(useRouter().query.state as string) ?? "mys"}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.COVID_VAX} />
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  let paths: Array<any> = [];
  STATES.forEach(state => {
    paths = paths.concat([
      {
        params: {
          state: state.key,
        },
      },
      {
        params: {
          state: state.key,
        },
        locale: "ms-MY",
      },
    ]);
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "covid_vax", state: params?.state }); // fetch static data here

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      waffle_data: data.waffle,
      barmeter_data: data.bar_chart,
      table_data: data.snapshot,
      timeseries_data: data.timeseries,
      stats_data: data.statistics,
      state: params?.state,
    },
    revalidate: 300,
  };
};

export default CovidVaccinationState;
