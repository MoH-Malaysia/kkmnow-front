import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LogarithmicScale,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataset,
  LegendItem,
} from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat } from "datagovmy-ui/helpers";
import { ChartCrosshairOption } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import { Scatter } from "react-chartjs-2";

// Chart.js plugins are global. Register the ones Timeseries registers too, so they exist before
// this chart is created; a plugin registered afterwards would hook into a chart it never initialised.
ChartJS.register(
  LinearScale,
  LogarithmicScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  AnnotationPlugin,
  CrosshairPlugin
);

export type LogScatterPoint = { x: number; y: number; name: string; year?: number };

interface LogScatterProps {
  className?: string;
  datasets: ChartDataset<"scatter", LogScatterPoint[]>[];
  titleX: string;
  titleY: string;
  /** "linear" keeps y on a plain axis (log-linear); the x axis is always logarithmic */
  scaleY?: "logarithmic" | "linear";
  /** Formats a linear y tick */
  formatY?: (value: number) => string;
  tooltipLabel: (point: LogScatterPoint) => string;
  /**
   * For datasets drawn as lines: hovering picks the nearest line as a whole, which then takes its
   * hoverBorderColor / hoverBorderWidth, and the tooltip names it.
   */
  highlightOnHover?: boolean;
  /** Replaces the generated legend, e.g. one entry standing for many grey context lines */
  legendLabels?: () => LegendItem[];
}

/**
 * Scatter with a logarithmic x axis (and optionally y). datagovmy-ui's Scatter only draws
 * linear axes. Datasets with showLine draw a path through their points.
 */
const LogScatter: FunctionComponent<LogScatterProps> = ({
  className = "h-[500px] w-full",
  datasets,
  titleX,
  titleY,
  scaleY = "logarithmic",
  formatY = v => `${v}`,
  tooltipLabel,
  highlightOnHover = false,
  legendLabels,
}) => {
  const { theme } = useTheme();
  const isLight = theme !== "dark";
  const ink = isLight ? AKSARA_COLOR.DIM : AKSARA_COLOR.WHITE;
  const grid = isLight ? AKSARA_COLOR.OUTLINE : AKSARA_COLOR.WASHED_DARK;

  const title = (text: string) => ({
    display: true,
    text,
    color: ink,
    font: { family: "Inter", size: 13 },
  });
  const gridLines = { color: grid, borderDash: [5, 5], drawBorder: false };
  const logAxis = (text: string) => ({
    type: "logarithmic" as const,
    title: title(text),
    grid: gridLines,
    ticks: {
      color: ink,
      font: { family: "Inter" },
      maxRotation: 0,
      // Only label powers of ten and their 2x/5x steps, as plain dollar values
      callback: (value: number | string) => {
        const v = Number(value);
        const lead = v / Math.pow(10, Math.floor(Math.log10(v)));
        return [1, 2, 5].includes(Math.round(lead)) ? `US$${numFormat(v, "compact", [1, 0])}` : "";
      },
    },
  });

  return (
    <div className={className}>
      <Scatter
        data={{ datasets }}
        options={
          {
            responsive: true,
            maintainAspectRatio: false,
            ...(highlightOnHover && {
              hover: { mode: "dataset", intersect: false },
              interaction: { mode: "nearest", intersect: false },
            }),
            scales: {
              x: logAxis(titleX),
              y:
                scaleY === "logarithmic"
                  ? logAxis(titleY)
                  : {
                      type: "linear" as const,
                      beginAtZero: true,
                      title: title(titleY),
                      grid: gridLines,
                      ticks: {
                        color: ink,
                        font: { family: "Inter" },
                        callback: (value: number | string) => formatY(Number(value)),
                      },
                    },
            },
            plugins: {
              crosshair: false,
              datalabels: { display: false },
              legend: {
                position: "top",
                align: "start",
                labels: {
                  usePointStyle: true,
                  color: ink,
                  font: { family: "Inter" },
                  ...(legendLabels && { generateLabels: legendLabels }),
                },
                // A custom legend stands for groups of datasets, so clicking it can't toggle one
                ...(legendLabels && { onClick: () => {} }),
              },
              tooltip: {
                bodyFont: { family: "Inter" },
                callbacks: {
                  label: item => tooltipLabel(item.raw as LogScatterPoint),
                },
              },
            },
          } as ChartCrosshairOption<"scatter">
        }
      />
    </div>
  );
};

export default LogScatter;
