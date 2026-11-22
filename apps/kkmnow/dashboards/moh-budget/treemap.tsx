import { Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import { Chart } from "react-chartjs-2";

// Register the plugins Timeseries registers too, before any chart exists. Tooltip must come
// before TreemapController: the controller's afterRegister hook installs the "treemap" tooltip
// positioner only if the tooltip plugin already exists. datalabels is registered once with labels
// off, so this chart never draws them and a later Timeseries finds it initialised.
ChartJS.register(Tooltip, LinearScale, AnnotationPlugin, CrosshairPlugin, ChartDataLabels);
ChartJS.defaults.set("plugins.datalabels", { display: false });
ChartJS.register(TreemapController, TreemapElement);

// The crosshair plugin is registered globally (Timeseries) but declares no option types
const NO_CROSSHAIR = { crosshair: false } as Record<string, unknown>;

export type TreemapRow = {
  /** Group the box sits in (captioned) */
  group: string;
  /** Unique key of the box */
  key: string;
  value: number;
};

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

/** Line height of box labels (Chart.js default 1.2) and room for borders and spacing */
const LABEL_LINE = LABEL_FONT.size * 1.2;
const SLACK = 2;
const MAX_LINES = 3;

/** Words wrapped greedily into lines no wider than `width`; null if a word alone is too wide */
const wrap = (text: string, width: number, font: string): string[] | null => {
  const lines: string[] = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && textWidth(`${last} ${word}`, font) <= width) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else if (textWidth(word, font) <= width) {
      lines.push(word);
    } else {
      return null;
    }
  }
  return lines;
};

/**
 * Text for a box: the name wrapped over up to three lines with its share, else the code with
 * its share, else the name or code alone; [] when nothing fits. Checks height as well as width,
 * because the plugin hides a label that overflows either.
 */
const boxLabel = (w: number, h: number, name: string, code: string, share: string) => {
  const font = "11px Inter";
  const width = w - 2 * PAD - SLACK;
  const fitsHeight = (n: number) => n * LABEL_LINE + 2 * PAD + SLACK <= h;
  const named = wrap(name, width, font);
  const codeFits = textWidth(code, font) <= width;
  const candidates: Array<string[] | null> = [
    named && named.length <= MAX_LINES ? [...named, share] : null,
    codeFits ? [code, share] : null,
    named && named.length === 1 ? named : null,
    codeFits ? [code] : null,
  ];
  return candidates.find(c => c && fitsHeight(c.length)) ?? [];
};

/** Black or white, whichever reads better on the fill (WCAG relative luminance) */
export const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.06 ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK;
};

interface TreemapProps {
  className?: string;
  rows: TreemapRow[];
  /** Fill of a box, by its key */
  color: (key: string) => string;
  /** Caption fill of a group */
  groupColor: (group: string) => string;
  groupLabel: (group: string) => string;
  label: (key: string) => string;
  /** Tooltip lines for a box */
  tooltip: (key: string, share: string) => string[];
}

/**
 * Two-level treemap: boxes grouped and captioned by group, sized by value. Names wrap to fit their
 * box, then give way to the code, then disappear; the tooltip carries every figure.
 */
const Treemap: FunctionComponent<TreemapProps> = ({
  className = "h-[560px] w-full",
  rows,
  color,
  groupColor,
  groupLabel,
  label,
  tooltip,
}) => {
  const { theme } = useTheme();
  const surface = theme === "dark" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE;
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const share = (v: number) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "");
  // The plugin's box: g is the group value at its level (l = 0 for groups, 1 for leaf keys)
  type Raw = { g?: string; v: number; w: number; h: number; l?: number };
  const keyOf = (raw: Raw) => (raw.l === 1 ? raw.g : undefined);
  const fill = (raw: Raw | undefined) => {
    if (!raw?.g) return AKSARA_COLOR.GREY;
    const key = keyOf(raw);
    return key ? color(key) : groupColor(raw.g);
  };

  return (
    <div className={className}>
      <Chart
        type="treemap"
        data={{
          datasets: [
            {
              tree: rows,
              key: "value",
              groups: ["group", "key"],
              spacing: 1,
              borderWidth: 1,
              borderColor: surface,
              backgroundColor: ctx =>
                ctx.type === "data" ? fill(ctx.raw as Raw) : AKSARA_COLOR.GREY,
              captions: {
                display: true,
                color: ctx => inkOn(fill(ctx.raw as Raw)),
                font: CAPTION_FONT,
                formatter: ctx => {
                  const raw = ctx.raw as Raw | undefined;
                  if (!raw?.g) return " ";
                  // Empty text makes the plugin draw its own label (the raw key): use a space
                  return (
                    fit(
                      raw.w,
                      "600 12px Inter",
                      `${groupLabel(raw.g)} · ${share(raw.v)}`,
                      groupLabel(raw.g)
                    ) || " "
                  );
                },
              },
              labels: {
                display: true,
                color: ctx => inkOn(fill(ctx.raw as Raw)),
                font: LABEL_FONT,
                overflow: "hidden",
                formatter: ctx => {
                  const raw = ctx.raw as Raw | undefined;
                  const key = raw && keyOf(raw);
                  if (!raw || !key) return " ";
                  const lines = boxLabel(raw.w, raw.h, label(key), key, share(raw.v));
                  return lines.length ? lines : " ";
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
            ...NO_CROSSHAIR,
            tooltip: {
              bodyFont: { family: "Inter" },
              titleFont: { family: "Inter" },
              displayColors: false,
              // The pointer is over a leaf and the group box beneath it: describe the leaf only
              filter: item => keyOf(item.raw as Raw) !== undefined,
              callbacks: {
                title: items => {
                  const key = items[0] && keyOf(items[0].raw as Raw);
                  return key ? label(key) : "";
                },
                label: item => {
                  const raw = item.raw as Raw;
                  return tooltip(keyOf(raw)!, share(raw.v));
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
