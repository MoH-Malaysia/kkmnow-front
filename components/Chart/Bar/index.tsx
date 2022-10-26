import { FunctionComponent, ReactElement, useMemo } from "react";
import { ChartHeader } from "@components/index";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip as ChartTooltip,
  ChartData,
} from "chart.js";
import { Bar as BarCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { BarCrosshairOption } from "@lib/types";
import { GRAYBAR_COLOR } from "@lib/constants";

interface BarProps {
  className?: string;
  menu?: ReactElement;
  title?: string | ReactElement;
  state?: string | ReactElement;
  controls?: ReactElement;
  layout?: "vertical" | "horizontal";
  data?: ChartData<"bar", any[], string | number>;
  type?: "category" | "linear" | "logarithmic";
  unitX?: string;
  unitY?: string;
  decimal?: number;
  minY?: number;
  maxY?: number;
  enableLegend?: boolean;
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
  state,
  type = "category",
  unitX,
  unitY,
  layout = "vertical",
  data = dummy,
  enableLegend = false,
  enableStack = false,
  enableGridX = true,
  enableGridY = true,
  decimal = 1,
  minY,
  maxY,
}) => {
  const isVertical = useMemo(() => layout === "vertical", [layout]);

  const plugin = {
    id: "increase-legend-spacing",
    beforeInit(chart: any) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 24;
      };
    },
  };
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip);

  const options: BarCrosshairOption = {
    indexAxis: !isVertical ? "y" : "x",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: enableLegend,
        align: "start",
        labels: {
          font: {
            family: "Inter",
            weight: "500",
          },
          boxWidth: 24,
          color: GRAYBAR_COLOR[300],
        },
      },
      tooltip: {
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            return `${item.dataset.label}: ${
              item.parsed.y ? numFormat(item.parsed.y, "standard", decimal) : "-"
            }`;
          },
        },
      },
      crosshair: false,
    },
    layout: {
      padding: {
        top: 20,
      },
    },
    scales: {
      x: {
        type: isVertical ? type : "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          font: {
            family: "Inter",
          },
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
        reverse: !isVertical,
        grid: {
          display: enableGridY,
          borderWidth: 1,
          borderDash: [5, 5],
          drawTicks: false,
          drawBorder: false,
          offset: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
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
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <BarCanvas data={data} options={options} plugins={[plugin]} />
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
