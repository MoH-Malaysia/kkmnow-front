/**
 * Covid Vaccination Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { get } from "@lib/api";

const CovidVaccinationIndex = ({
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await get("/kkmnow", { dashboard: "covidvax", state: "mys" }); // fetch static data here

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

export default CovidVaccinationIndex;
