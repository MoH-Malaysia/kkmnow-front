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
  TimeSeriesScale,
  ChartTooltip
);

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  unitX,
  unitY,
  mode = "stacked",
  layout = "vertical",
  data,
  stats,
  interactive = true,
  animate = false,
  type = "bar",
  enableGridX = true,
  enableGridY = true,
  enableAxisX = true,
  enableAxisY = true,
  enableLine = false,
  gridXValues = undefined,
  gridYValues = undefined,
  enableLabel = false,
}) => {
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "timeseries",
        time: {
          parser: value => DateTime.fromFormat(value as string, "dd/MM/yyyy").toMillis(),
          unit: "month",
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
            return numFormat(value as number);
          },
        },
        stacked: mode === "stacked",
      },
    },
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      {stats && <Stats data={stats} className="py-4"></Stats>}

      <div className={className}>{data && <Chart data={data} options={options} type={type} />}</div>
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

export default Timeseries;
