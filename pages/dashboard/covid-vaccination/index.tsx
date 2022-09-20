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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await get("/kkmnow", { dashboard: "covidvax", state: "mys" }); // fetch static data here

  // data transformation
  const ts_stacked_data = {
    labels: data.timeseries_stacked.map((item: { x: string }) => item.x), // x-values
    datasets: [
      // stacked y-values
      {
        type: "line",
        label: "Moving Average (MA)",
        pointRadius: 0,
        data: data.timeseries_stacked.map((item: { line: string }) => item.line), // y-values
      },
      {
        type: "bar",
        label: "Primary",
        data: data.timeseries_stacked.map((item: { y_primary: string }) => item.y_primary), // y-values
      },
      {
        type: "bar",
        label: "Booster 1",
        data: data.timeseries_stacked.map((item: { y_booster: string }) => item.y_booster), // y-values
      },
      {
        type: "bar",
        label: "Booster 2",
        data: data.timeseries_stacked.map((item: { y_booster2: string }) => item.y_booster2), // y-values
      },
    ],
  };

  return {
    props: {
      waffle_data: data.waffle_chart,
      barmeter_data: data.bar_chart,
      table_data: data.snapshot_chart,
      ts_stacked_data,
      ts_adol_data: data.timeseries_adol ?? [],
      ts_adult_data: data.timeseries_adult ?? [],
      ts_booster_data: data.timeseries_booster ?? [],
      ts_booster2_data: data.timeseries_booster2 ?? [],
      ts_primary_data: data.timeseries_primary ?? [],
      ts_child_data: data.timeseries_child ?? [],
    },
  };
};

export default CovidVaccinationIndex;
