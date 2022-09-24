import { FunctionComponent, ReactElement, useMemo } from "react";
import { ChartHeader } from "@components/index";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip as ChartTooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar as BarCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip);

interface BarProps {
  className?: string;
  menu?: ReactElement;
  title?: string | ReactElement;
  controls?: ReactElement;
  layout?: "vertical" | "horizontal";
  data?: ChartData<"bar", any[], string | number>;
  type?: "category" | "linear" | "logarithmic";
  unitX?: string;
  unitY?: string;
  minY?: number;
  maxY?: number;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableStack?: boolean;
  interactive?: boolean;
}

const Bar: FunctionComponent<BarProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  type = "category",
  unitX,
  unitY,
  layout = "vertical",
  data = dummy,
  enableStack = false,
  enableGridX = true,
  enableGridY = true,
  minY,
  maxY,
}) => {
  const isVertical = useMemo(() => layout === "vertical", [layout]);
  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: isVertical ? type : "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          padding: 6,
          callback: function (value: string | number) {
            return isVertical
              ? this.getLabelForValue(value as number).concat(unitX ?? "")
              : numFormat(value as number).concat(unitY ?? "");
          },
        },
        stacked: enableStack,
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
          callback: function (value: string | number) {
            return isVertical
              ? numFormat(value as number).concat(unitY ?? "")
              : this.getLabelForValue(value as number).concat(unitX ?? "");
          },
        },
        min: minY,
        max: maxY,
        stacked: enableStack,
      },
    },
  };
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <BarCanvas data={data} options={options} />
      </div>
    </div>
  );
};

const dummy = {
  labels: ["0-4", "5-10", "11-14"], // x-values
  datasets: [
    // grouped y-values
    {
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      fill: true,
      backgroundColor: "#000",
    },
    {
      label: "Primary",
      data: [4, 1, 7], // y-values
      fill: true,
      backgroundColor: "#a4a4a4",
      stack: "primary",
    },
  ],
};

export default Bar;
