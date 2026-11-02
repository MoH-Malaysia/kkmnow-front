import { Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import { Chart } from "react-chartjs-2";

// Register the plugins Timeseries registers too, before any chart exists (see LogScatter).
// Tooltip must be registered before TreemapController: the controller's afterRegister hook
// installs the "treemap" tooltip positioner only if the tooltip plugin already exists.
ChartJS.register(Tooltip, LinearScale, AnnotationPlugin, CrosshairPlugin);
ChartJS.register(TreemapController, TreemapElement);

export type TreemapRow = { family: string; code: string; value: number };

const CAPTION_FONT = { family: "Inter", size: 12, weight: "600" } as const;
const LABEL_FONT = { family: "Inter", size: 11 } as const;
/** Box padding the plugin leaves around text, per side */
const PAD = 3;

let measureCtx: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, font: string) => {
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return text.length * 7;
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
};

/** The first candidate that fits the width, else "" */
const fit = (width: number, font: string, ...candidates: string[]) =>
  candidates.find(c => textWidth(c, font) <= width - 2 * PAD) ?? "";

/** Black or white, whichever reads better on the fill (WCAG relative luminance) */
const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  // Contrast with white is 1.05 / (L + 0.05); with near-black ink it is (L + 0.05) / 0.06
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.06 ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK;
};

interface TreemapProps {
  className?: string;
  rows: TreemapRow[];
  color: (code: string) => string;
  label: (code: string) => string;
  format: (value: number) => string;
}

/**
 * Composition treemap: one box per leaf code, grouped and captioned by level-1 family.
 */
const Treemap: FunctionComponent<TreemapProps> = ({
  className = "h-[500px] w-full",
  rows,
  color,
  label,
  format,
}) => {
  const { theme } = useTheme();
  const surface = theme === "dark" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE;
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const share = (v: number) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "");

  return (
    <div className={className}>
      <Chart
        type="treemap"
        data={{
          datasets: [
            {
              tree: rows,
              key: "value",
              groups: ["family", "code"],
              spacing: 1,
              borderWidth: 1,
              borderColor: surface,
              backgroundColor: ctx =>
                ctx.type === "data" && ctx.raw?.g ? color(ctx.raw.g) : AKSARA_COLOR.GREY,
              // Text shortens to what fits its box: full label, then code only, then nothing
              captions: {
                display: true,
                color: ctx => (ctx.raw?.g ? inkOn(color(ctx.raw.g)) : AKSARA_COLOR.WHITE),
                font: CAPTION_FONT,
                formatter: ctx => {
                  const { g, v, w } = ctx.raw ?? {};
                  if (!g) return "";
                  const font = `600 12px Inter`;
                  const code = label(g).split(": ")[0];
                  return fit(w, font, `${label(g)} · ${share(v)}`, `${code} · ${share(v)}`, code);
                },
              },
              labels: {
                display: true,
                color: ctx => (ctx.raw?.g ? inkOn(color(ctx.raw.g)) : AKSARA_COLOR.WHITE),
                font: LABEL_FONT,
                overflow: "hidden",
                formatter: ctx => {
                  const { g, v, w } = ctx.raw ?? {};
                  if (!g) return "";
                  const name = fit(w, "11px Inter", label(g), label(g).split(": ")[0]);
                  return name ? [name, share(v)] : "";
                },
              },
              data: [],
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: { display: false },
            tooltip: {
              bodyFont: { family: "Inter" },
              callbacks: {
                title: () => "",
                label: item => {
                  const raw = item.raw as { g?: string; v: number };
                  return raw.g ? `${label(raw.g)}: ${format(raw.v)} (${share(raw.v)})` : "";
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Treemap;
