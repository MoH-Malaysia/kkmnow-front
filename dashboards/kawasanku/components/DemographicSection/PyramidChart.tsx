import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import { BarDatum, ResponsiveBarCanvas } from "@nivo/bar";

import { formatNumberPrefix } from "@lib/helpers";
import { IPyramidChartData } from "@dashboards/kawasanku/lib/types";

export type PyramidChartProps = {
  data: BarDatum extends IPyramidChartData[] ? IPyramidChartData[] : BarDatum[];
};

const PyramidChart: FunctionComponent<PyramidChartProps> = ({ data }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div>
      <div className="flex items-center justify-between pl-10 text-xs font-medium">
        <p>{t("pyramid.male")}</p>
        <p className="text-rose-600">{t("pyramid.female")}</p>
      </div>
      <div className="h-96 min-h-full w-full">
        <ResponsiveBarCanvas
          data={data}
          indexBy="id"
          keys={["male", "female"]}
          margin={{ top: 0, right: 20, bottom: 20, left: 45 }}
          padding={0.3}
          layout="horizontal"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          valueFormat=">-,"
          colors={["#0F172A", "#E11D48"]}
          enableLabel={false}
          axisBottom={{
            format: value => formatNumberPrefix(Math.abs(value)),
          }}
          tooltip={({ id, formattedValue, color }) => {
            return (
              <div className="flex items-center justify-center rounded-[2px] bg-white py-[5px] px-[9px] shadow">
                <div className="mr-2 h-3 w-3" style={{ backgroundColor: color }} />
                <p>
                  {t(`pyramid.${id}`)}:{" "}
                  <span className="font-bold">
                    {formattedValue[0] === "-" ? formattedValue.substring(1) : formattedValue}
                  </span>
                </p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PyramidChart;
