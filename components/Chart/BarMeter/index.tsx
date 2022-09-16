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
    id: "Pahang",
    value: 50,
  },
  {
    id: "N. Sembilan",
    value: 23,
  },
  {
    id: "Kuala Lumpur",
    value: 300,
  },
  {
    id: "Johor",
    value: 23,
  },
  {
    id: "Pulau Pinang",
    value: 23,
  },
  {
    id: "Melaka",
    value: 23,
  },
  {
    id: "Terengganu",
    value: 23,
  },
  {
    id: "Kelantan",
    value: 23,
  },
  {
    id: "Perak",
    value: 23,
  },
];

export default BarMeter;
