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
  ts_stacked_data,
  ts_adol_data,
  ts_adult_data,
  ts_booster_data,
  ts_booster2_data,
  ts_primary_data,
  ts_child_data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidVaccinationDashboard
        waffle_data={waffle_data}
        table_data={table_data}
        barmeter_data={barmeter_data}
        ts_stacked_data={ts_stacked_data}
        ts_adol_data={ts_adol_data}
        ts_adult_data={ts_adult_data}
        ts_booster_data={ts_booster_data}
        ts_booster2_data={ts_booster2_data}
        ts_primary_data={ts_primary_data}
        ts_child_data={ts_child_data}
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
      ts_stacked_data: data.timeseries_stacked ?? [],
      ts_adol_data: data.timeseries_adol ?? [],
      ts_adult_data: data.timeseries_adult ?? [],
      ts_booster_data: data.timeseries_booster ?? [],
      ts_booster2_data: data.timeseries_booster2 ?? [],
      ts_primary_data: data.timeseries_primary ?? [],
      ts_child_data: data.timeseries_child ?? [],
    },
  };
};

export default CovidVaccinationState;
