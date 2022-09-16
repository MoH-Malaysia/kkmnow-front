import { minMax } from "@lib/helpers";
import { FunctionComponent } from "react";

interface BarMeterProps {
  className?: string;
  total?: number;
  data?: MeterProp[];
  color?: string;
  unit?: string;
}

type MeterProp = {
  id: string;
  value: number;
};

const BarMeter: FunctionComponent<BarMeterProps> = ({
  className = "h-[500px] w-full",
  total = 100,
  color = "#0F172A",
  data = dummy,
  unit = "%",
}) => {
  const getHeight = (value: number): string => {
    return `${minMax((value / total) * 100)}%`;
  };
  return (
    <div className={className}>
      {data?.length &&
        data.map(item => {
          return (
            <div className="flex flex-col items-center space-y-2">
              <p>{item.value + unit}</p>
              <div className="relative flex h-[80%] w-8 overflow-x-hidden bg-outline">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    height: getHeight(item.value),
                  }}
                />
              </div>
              <p>{item.id}</p>
            </div>
          );
        })}
    </div>
  );
};

const dummy = [
  {
    id: "80+",
    value: 80.6,
  },
  {
    id: "70-79",
    value: 90.8,
  },
  {
    id: "60-69",
    value: 98.4,
  },
  {
    id: "50-59",
    value: 97.6,
  },
  {
    id: "40-49",
    value: 102.3,
  },
  {
    id: "30-39",
    value: 96.4,
  },
  {
    id: "20-29",
    value: 91.2,
  },
  {
    id: "10-19",
    value: 94.7,
  },
  {
    id: "5-9",
    value: 49.9,
  },
  {
    id: "0-4",
    value: 0,
  },
];

export default BarMeter;
