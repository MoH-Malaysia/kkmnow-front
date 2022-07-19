import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import { BarDatum, ResponsiveBarCanvas } from "@nivo/bar";

import { formatNumberPrefix } from "@lib/helpers";

type PyramidChartProps = {
  keys: string[];
  data: BarDatum[];
  translationPrefix: string;
};

const PyramidChart: FunctionComponent<PyramidChartProps> = ({ keys, data, translationPrefix }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div className="h-full">
      <div className="flex items-center justify-between pl-10 text-xs font-medium">
        <p>{t(`${translationPrefix}.${keys[0]}`)}</p>
        <p className="text-rose-600">{t(`${translationPrefix}.${keys[1]}`)}</p>
      </div>
      <div className="h-96 w-full md:h-[440px]">
        <ResponsiveBarCanvas
          data={data}
          indexBy="id"
          keys={keys}
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
                  {t(`${translationPrefix}.${id}`)}:{" "}
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
