import { Chart as ChartJS } from "chart.js";
import type { Chart, LegendItem, Scale, Tick } from "chart.js";

const YEAR_STEPS = [1, 2, 5, 10, 20, 25, 50];
/** Minimum horizontal room per year label, in px */
const MIN_LABEL_GAP = 48;

/**
 * Tick callback for yearly time axes: labels every N years (N from YEAR_STEPS, as small as the
 * width allows) on multiples of N, so charts side by side share the same years. Pair with
 * autoSkipX={false}, or Chart.js thins the ticks again by position.
 */
export function yearTicks(this: Scale, _label: number | string, index: number, ticks: Tick[]) {
  // A time scale passes the formatted label; the tick itself holds the timestamp
  const year = (ms: number) => new Date(ms).getUTCFullYear();
  const span = Math.max(year(ticks[ticks.length - 1].value) - year(ticks[0].value), 1);
  const step = YEAR_STEPS.find(s => (s * this.width) / span >= MIN_LABEL_GAP) ?? 50;
  const y = year(ticks[index].value);
  return y % step === 0 ? String(y) : null;
}

/** Props for a datagovmy-ui Timeseries on a yearly axis */
export const yearAxis = { tickXCallback: yearTicks, autoSkipX: false };

/**
 * Legend items that match the marks: unfilled lines get a line swatch in their own dash pattern,
 * so dashed and dotted series are told apart by more than colour; dot-only series get a dot,
 * areas and bars keep squares.
 */
export const lineLegend = (chart: Chart): LegendItem[] =>
  ChartJS.defaults.plugins.legend.labels.generateLabels(chart).map(item => {
    const dataset = chart.data.datasets[item.datasetIndex!] as {
      type?: string;
      fill?: unknown;
      borderColor?: unknown;
      borderDash?: number[];
      showLine?: boolean;
    };
    if (dataset.showLine === false) return { ...item, pointStyle: "circle" };
    const chartType = (chart.config as { type?: string }).type;
    // A fill object only shades between lines (e.g. a surplus/deficit band): still a line
    const area = dataset.fill && typeof dataset.fill !== "object";
    const isLine = (dataset.type ?? chartType) === "line" && !area;
    if (!isLine) return { ...item, pointStyle: "rect" };
    const color = String(dataset.borderColor);
    return {
      ...item,
      pointStyle: "line",
      lineWidth: 2,
      lineDash: dataset.borderDash ?? [],
      strokeStyle: color,
      fillStyle: color,
    };
  });
