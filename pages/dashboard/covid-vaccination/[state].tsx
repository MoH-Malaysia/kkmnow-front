/**
 * Covid Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { STATES } from "@lib/constants";
import { get } from "@lib/api";

const CovidVaccinationState = ({
  waffle_data,
  table_data,
  barmeter_data,
  timeseries_data,
  stats_data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidVaccinationDashboard
        waffle_data={waffle_data}
        table_data={table_data}
        barmeter_data={barmeter_data}
        timeseries_data={timeseries_data}
        stats_data={stats_data}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const paths = STATES.map(state => {
    return {
      params: {
        state: state.key,
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await get("/kkmnow", { dashboard: "covidvax", state: params?.state }); // fetch static data here

  return {
    props: {
      waffle_data: data.waffle_chart,
      barmeter_data: data.bar_chart,
      table_data: data.snapshot_chart,
      timeseries_data: data.timeseries_chart,
      stats_data: data.stats_chart,
    },
  };
};

export default CovidVaccinationState;
