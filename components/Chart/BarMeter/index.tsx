import { minMax } from "@lib/helpers";
import { FunctionComponent } from "react";

interface BarMeterProps {
  className?: string;
  total?: number;
  data: Array<any>;
  indexBy?: string;
  key?: string;
  color?: string;
  unit?: string;
  reverse?: boolean;
}

const BarMeter: FunctionComponent<BarMeterProps> = ({
  className = "h-[500px] w-full",
  total = 100,
  color = "#0F172A",
  indexBy = "x",
  key = "y",
  data,
  unit = "%",
  reverse = false,
}) => {
  const getHeight = (value: number): string => {
    return `${minMax((value / total) * 100)}%`;
  };

  const _data = reverse ? data.reverse() : data;
  console.log(_data);

  return (
    <div className={className}>
      {_data.length &&
        _data.map(item => {
          return (
            <div className="flex flex-col items-center space-y-2" key={item[indexBy]}>
              <p>{(item[key] as number).toFixed(1) + unit}</p>
              <div className="relative flex h-[80%] w-8 overflow-x-hidden bg-outline">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    height: getHeight(item[key]),
                  }}
                />
              </div>
              <p>{item[indexBy]}</p>
            </div>
          );
        })}
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
