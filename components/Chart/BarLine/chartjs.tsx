import { FunctionComponent, ReactElement } from "react";
import { ChartHeader, StateTick, Tooltip } from "@components/index";
import { CountryAndStates } from "@lib/constants";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  TimeScale,
} from "chart.js";
import { Bar as BarCanvas } from "react-chartjs-2";

interface BarProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  layout?: "vertical" | "horizontal";
  data?: any;
  mode?: "grouped" | "stacked";
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableLabel?: boolean;
  hideLabelKeys?: string[];
  enableLine?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableAxisX?: boolean;
  stats?: Array<StatProps> | null;
  enableAxisY?: boolean;
  reverse?: boolean;
  customTickX?: "state" | undefined;
  interactive?: boolean;
  animate?: boolean;
  lineKey?: string;
  colors?: Array<string>;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  ChartTooltip
);

const Bar: FunctionComponent<BarProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  unitX,
  unitY,
  mode = "stacked",
  layout = "vertical",
  data = dummy,
  interactive = true,
  animate = false,
  customTickX = undefined,
  enableGridX = true,
  enableGridY = true,
  enableAxisX = true,
  enableAxisY = true,
  enableLine = false,
  gridXValues = undefined,
  gridYValues = undefined,
  enableLabel = false,
  hideLabelKeys,
  reverse = false,
  minY = "auto",
  maxY = "auto",
  lineKey = "line",
  colors = ["rgba(15, 23, 42, 1)"],
}) => {
  const options = {
    responsive: true,
    scales: {
      x: {
        // type: "time",
        // time: {
        //   unit: "quarter",
        // },
        grid: {
          display: enableGridX,
        },
        stacked: mode === "stacked",
      },
      y: {
        grid: {
          display: enableGridY,
        },
        stacked: mode === "stacked",
      },
    },
  };

  const formattedData = () => {
    let _data = data;
    _data.datasets = data.datasets.map((item: any, index: number) => {
      return { ...item, backgroundColor: colors[index], borderColor: colors[index] };
    });
    console.log(_data);
    return _data;
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <BarCanvas data={formattedData()} options={options} />
      </div>
    </div>
  );
};

const dummy = {
  labels: [], // x-values
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [], // y-values
    },
    {
      type: "bar",
      label: "Primary",
      data: [], // y-values
    },
    {
      type: "bar",
      label: "Booster 1",
      data: [], // y-values
    },
    {
      type: "bar",
      label: "Booster 2",
      data: [], // y-values
    },
  ],
};

/**
 * Stats Component
 */
interface StatsProps {
  data: Array<StatProps>;
  className?: string;
}

type StatProps = {
  title: string;
  value: string;
  tooltip?: string;
};

const Stats: FunctionComponent<StatsProps> = ({ data, className }) => {
  const cols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return (
    <div className={`grid w-full ${cols[data.length] ?? "grid-cols-3"} ${className}`}>
      {data.map(({ title, value, tooltip }: StatProps, index) => (
        <div key={index}>
          <p className="text-sm text-dim">{title}</p>
          {tooltip ? (
            <Tooltip
              trigger={
                <h4 className="font-medium underline decoration-dashed underline-offset-4">
                  {value}
                </h4>
              }
            >
              <span className="text-sm">{tooltip}</span>
            </Tooltip>
          ) : (
            <h4 className="font-medium">{value}</h4>
          )}
        </div>
      ))}
    </div>
  );
};

export default Bar;
