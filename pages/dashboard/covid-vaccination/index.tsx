/**
 * Vaccination Page <State>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import CovidVaccinationDashboard from "@dashboards/covid-vaccination";
import { get } from "@lib/api";

const CovidVaccinationIndex = ({
  waffle_data,
  timeseries_data,
  table_data,
  barmeter_data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidVaccinationDashboard
        waffle_data={waffle_data}
        timeseries_data={timeseries_data}
        table_data={table_data}
        barmeter_data={barmeter_data}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await get("/kkmnow", { dashboard: "covidvax", state: "mys" }); // fetch static data here

  // data transformation stuff. to reformat in backend
  const table_data = Object.entries(data.snapshot_chart).map(([_, value]) => value);
  const barmeter_data = {
    dose1: Object.entries(data.bar_chart.dose1)
      .map(([_, value]) => value)
      .reverse(),
    dose2: Object.entries(data.bar_chart.dose2)
      .map(([_, value]) => value)
      .reverse(),
    booster1: Object.entries(data.bar_chart.booster1)
      .map(([_, value]) => value)
      .reverse(),
    booster2: Object.entries(data.bar_chart.booster2)
      .map(([_, value]) => value)
      .reverse(),
  };

  return {
    props: {
      waffle_data: data.waffle_chart,
      barmeter_data,
      table_data,
      timeseries_data: data.timeseries_chart,
    },
  };
};

export default CovidVaccinationIndex;
