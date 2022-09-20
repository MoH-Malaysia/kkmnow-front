import { ChartHeader } from "@components/index";
import { minMax } from "@lib/helpers";
import { FunctionComponent, ReactElement } from "react";

interface BarMeterProps {
  className?: string;
  title?: string | ReactElement;
  menu?: ReactElement;
  controls?: ReactElement;
  total?: number;
  data: Array<any>;
  indexBy?: string;
  key?: string;
  color?: string;
  unit?: string;
  reverse?: boolean;
  layout?: "horizontal" | "vertical";
}

const BarMeter: FunctionComponent<BarMeterProps> = ({
  className = "relative flex w-full flex-col justify-between gap-8 lg:h-[500px] lg:flex-row",
  title,
  menu,
  controls,
  total = 100,
  color = "#0F172A",
  indexBy = "x",
  key = "y",
  data,
  layout = "vertical",
  unit = "%",

  reverse = false,
}) => {
  const percentFill = (value: number): string => {
    return `${minMax((value / total) * 100)}%`;
  };

  const renderBars = (item: any) => {
    switch (layout) {
      case "horizontal":
        return (
          <div className="space-y-2" key={item[indexBy]}>
            <div className="flex justify-between">
              <p>{item[indexBy]}</p>
              <p className="text-dim">{(item[key] as number).toFixed(1) + unit}</p>
            </div>

            <div className="flex h-2.5 w-full overflow-x-hidden bg-outline">
              <div
                className="h-full items-center overflow-hidden"
                style={{
                  backgroundColor: color,
                  width: percentFill(item[key]),
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="hidden flex-col items-center space-y-2 lg:flex" key={item[indexBy]}>
              <p>{(item[key] as number).toFixed(1) + unit}</p>
              <div className="relative flex h-[80%] w-8 overflow-x-hidden bg-outline">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    height: percentFill(item[key]),
                  }}
                />
              </div>
              <p>{item[indexBy]}</p>
            </div>
            <div className="block space-y-2 lg:hidden" key={item[indexBy]}>
              <div className="flex justify-between">
                <p>{item[indexBy]}</p>
                <p className="text-dim">{(item[key] as number).toFixed(1) + unit}</p>
              </div>

              <div className="flex h-2.5 w-full overflow-x-hidden bg-outline">
                <div
                  className="h-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    width: percentFill(item[key]),
                  }}
                />
              </div>
            </div>
          </>
        );
    }
  };

  const _data = reverse ? data.reverse() : data;
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        {_data.length &&
          _data.map(item => {
            return <>{renderBars(item)}</>;
          })}
      </div>
    </div>
  );
};

const dummy = [
  {
    x: "80+",
    y: 80.6,
  },
  {
    x: "70-79",
    y: 90.8,
  },
  {
    x: "60-69",
    y: 98.4,
  },
  {
    x: "50-59",
    y: 97.6,
  },
  {
    x: "40-49",
    y: 102.3,
  },
  {
    x: "30-39",
    y: 96.4,
  },
  {
    x: "20-29",
    y: 91.2,
  },
  {
    x: "10-19",
    y: 94.7,
  },
  {
    x: "5-9",
    y: 49.9,
  },
  {
    x: "0-4",
    y: 0,
  },
];

export default BarMeter;
