// HEATMAP SCHEMAS
export type HeatmapSchema = {
  label?: string;
  labelColor?: string;
  max: number;
};

export const BLOOD_SUPPLY_SCHEMA: HeatmapSchema[] = [
  {
    label: "Low",
    labelColor: "#FFF",
    max: 0,
  },
  {
    label: "Mid",
    labelColor: "#000",
    max: 1,
  },
  {
    label: "Safe",
    labelColor: "#000",
    max: 2,
  },
  {
    label: "High",
    labelColor: "#000",
    max: 3,
  },
];
export const COVIDNOW_COLOR_SCHEME: HeatmapSchema[] = [
  {
    labelColor: "#000",
    max: 150000,
  },
  {
    labelColor: "#fff",
    max: 800000,
  },
];
