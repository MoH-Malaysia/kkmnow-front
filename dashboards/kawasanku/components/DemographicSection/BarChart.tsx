import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import { BarDatum, ResponsiveBarCanvas } from "@nivo/bar";

import ChartTitle from "./ChartTitle";

type BarChartProps = {
  title: string;
  data: BarDatum[];
  height: number;
};

const BarChart: FunctionComponent<BarChartProps> = ({ title, data, height }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div>
      <ChartTitle>{title}</ChartTitle>
      <div style={{ height }} className="relative w-full">
        <div className="absolute top-0 left-0 w-full text-xs">
          {data.map((item, index) => (
            <div key={index} className={`${index < data.length - 1 ? "mb-[10px]" : ""}`}>
              <div className="mb-1 flex w-full justify-between">
                <p>{item.id}</p>
                <p className="text-dim">{item.value}%</p>
              </div>
              <div className="h-[10px] w-full bg-washed"></div>
            </div>
          ))}
        </div>
        <ResponsiveBarCanvas
          data={data}
          layout="horizontal"
          minValue={0}
          maxValue={100}
          margin={{ top: -4, right: 0, bottom: -10, left: 0 }}
          colors={["#0F172A"]}
          enableLabel={false}
          enableGridY={false}
          renderBar={(ctx, { bar: { x, y, width, color } }) => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.rect(x, y + 20, width, 10);
            ctx.fill();
          }}
          tooltip={({ id, formattedValue, color }) => {
            return (
              <div className="flex items-center justify-center rounded-[2px] bg-white py-[5px] px-[9px] shadow">
                <div className="mr-2 h-3 w-3" style={{ backgroundColor: color }} />
                <p>
                  {t(`snapshot.${id}`)}:{" "}
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

export default BarChart;
