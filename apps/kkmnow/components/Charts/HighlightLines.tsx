import {
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  ChartDataset,
} from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { ChartCrosshairOption } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import { Line } from "react-chartjs-2";

// Register what Timeseries registers too, before this chart exists (see LogScatter)
ChartJS.register(
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  AnnotationPlugin,
  CrosshairPlugin
);

export type HighlightSeries = {
  label: string;
  /** Values aligned with `years`; null where missing */
  data: Array<number | null>;
  /** Drawn in the highlight colour and on top; the rest are grey context lines */
  highlight?: boolean;
};

interface HighlightLinesProps {
  className?: string;
  years: number[];
  series: HighlightSeries[];
  highlightColor: string;
  /** y tick label */
  formatY: (value: number) => string;
  /** Value in the tooltip */
  formatValue: (value: number) => string;
}

const MIN_LABEL_GAP = 48;
const YEAR_STEPS = [1, 2, 5, 10, 20];

/**
 * One series in colour against grey context series. Hovering picks the nearest line: it darkens,
 * thickens and is named in the tooltip, so a grey line can be identified without a legend.
 */
const HighlightLines: FunctionComponent<HighlightLinesProps> = ({
  className = "h-[450px] w-full",
  years,
  series,
  highlightColor,
  formatY,
  formatValue,
}) => {
  const { theme } = useTheme();
  const isLight = theme !== "dark";
  const ink = isLight ? AKSARA_COLOR.DIM : AKSARA_COLOR.WHITE;
  const grid = isLight ? AKSARA_COLOR.OUTLINE : AKSARA_COLOR.WASHED_DARK;
  const hoverInk = isLight ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE;

  // Grey lines first, highlighted ones last so they sit on top
  const ordered = [...series.filter(s => !s.highlight), ...series.filter(s => s.highlight)];
  const datasets: ChartDataset<"line", Array<{ x: number; y: number | null }>>[] = ordered.map(
    s => ({
      label: s.label,
      data: years.map((x, i) => ({ x, y: s.data[i] })),
      borderColor: s.highlight ? highlightColor : AKSARA_COLOR.GREY + "B3",
      hoverBorderColor: s.highlight ? highlightColor : hoverInk,
      borderWidth: s.highlight ? 3 : 1.5,
      hoverBorderWidth: s.highlight ? 4 : 3,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBackgroundColor: s.highlight ? highlightColor : hoverInk,
      spanGaps: true,
    })
  );

  return (
    <div className={className}>
      <Line
        data={{ datasets }}
        options={
          {
            responsive: true,
            maintainAspectRatio: false,
            parsing: false,
            // "dataset" hover lights up the whole nearest line, not just one point
            hover: { mode: "dataset", intersect: false },
            interaction: { mode: "nearest", intersect: false, axis: "xy" },
            scales: {
              x: {
                type: "linear",
                min: years[0],
                max: years[years.length - 1],
                grid: { display: false, drawBorder: false },
                ticks: {
                  color: ink,
                  font: { family: "Inter" },
                  stepSize: 1,
                  autoSkip: false,
                  maxRotation: 0,
                  // Same rule as the Timeseries charts: every N years, on multiples of N
                  callback(this: { width: number }, value: number | string) {
                    const span = Math.max(years[years.length - 1] - years[0], 1);
                    const step =
                      YEAR_STEPS.find(s => (s * this.width) / span >= MIN_LABEL_GAP) ?? 20;
                    return Number(value) % step === 0 ? String(value) : null;
                  },
                },
              },
              y: {
                type: "linear",
                beginAtZero: true,
                grid: { color: grid, borderDash: [5, 5], drawBorder: false },
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
              legend: { display: false },
              tooltip: {
                mode: "nearest",
                intersect: false,
                bodyFont: { family: "Inter" },
                titleFont: { family: "Inter" },
                callbacks: {
                  title: items => items[0]?.dataset.label ?? "",
                  label: item => `${(item.raw as { x: number }).x}: ${formatValue(item.parsed.y)}`,
                },
              },
            },
          } as ChartCrosshairOption<"line">
        }
      />
    </div>
  );
};

export default HighlightLines;
