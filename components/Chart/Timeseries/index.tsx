import { FunctionComponent, ReactElement } from "react";
import { ChartHeader, Tooltip } from "@components/index";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  TimeScale,
  TimeSeriesScale,
  ChartData,
  ChartTypeRegistry,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { DateTime } from "luxon";
import "chartjs-adapter-luxon";

interface TimeseriesProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  type?: keyof ChartTypeRegistry;
  controls?: ReactElement;
  layout?: "vertical" | "horizontal";
  data?: ChartData<keyof ChartTypeRegistry, any[], string | number>;
  mode?: "grouped" | "stacked";
  subheader?: ReactElement;
  interval?:
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";
  round?:
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number;
  maxY?: number;
  enableLabel?: boolean;
  hideLabelKeys?: string[];
  enableLine?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  stats?: Array<StatProps> | null;
  animate?: false;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  ChartTooltip
);

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  className = "w-full h-[750px]", // manage CSS here
  menu,
  title,
  controls,
  interval = "month",
  unitX,
  unitY,
  round,
  mode = "stacked",
  layout = "vertical",
  data = dummy,
  stats,
  subheader,
  animate,
  type = "bar",
  enableGridX = false,
  enableGridY = true,
  maxY,
}) => {
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    normalized: true,
    elements: {
      point: {
        borderWidth: 0,
        radius: 0,
        hoverRadius: 2,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: interval,
          round: round,
          displayFormats: {
            quarter: "MMM",
            month: "MMM yyyy",
          },
        },
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          major: {
            enabled: true,
          },
          minRotation: 0,
          maxRotation: 50,
        },
        stacked: mode === "stacked",
      },
      y: {
        grid: {
          display: enableGridY,
          borderWidth: 1,
          borderDash: [5, 5],
          drawTicks: false,
          drawBorder: false,
          offset: false,
        },
        ticks: {
          padding: 6,
          callback: (value: string | number) => {
            return numFormat(value as number).concat(unitY ?? "");
          },
        },
        max: maxY,
        stacked: mode === "stacked",
      },
    },
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      {stats && <Stats data={stats} className="py-4"></Stats>}
      {subheader && <div className="py-4">{subheader}</div>}

      <div className={className}>{data && <Chart data={data} options={options} type={type} />}</div>
    </div>
  );
};

const dummy: ChartData = {
  labels: [], // x-values - must be epoch millis eg. [168231311000, 16856172321, ...] etc
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      borderColor: "red",
    },
    {
      type: "bar",
      label: "Primary",
      data: [4, 5, 6], // y-values
      backgroundColor: "blue",
    },
    {
      type: "bar",
      label: "Booster 1",
      data: [1, 2, 3], // y-values
      backgroundColor: "teal",
    },
    {
      type: "bar",
      label: "Booster 2",
      data: [10, 11, 12], // y-values
      backgroundColor: "green",
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

export default Timeseries;
