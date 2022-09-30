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
export const BLOOD_DONATION_SCHEMA: HeatmapSchema[] = [
  {
    labelColor: "#000",
    max: 0,
  },
  {
    labelColor: "#000",
    max: 5000,
  },
  {
    labelColor: "#000",
    max: 20000,
  },
  {
    labelColor: "#000",
    max: 50000,
  },
  {
    labelColor: "#000",
    max: Infinity,
  },
];
export const BLOOD_PERCENT_SCHEMA: HeatmapSchema[] = [
  {
    labelColor: "#000",
    max: 20,
  },
  {
    labelColor: "#000",
    max: 40,
  },
  {
    labelColor: "#FFF",
    max: 60,
  },
  {
    labelColor: "#FFF",
    max: 80,
  },
  {
    labelColor: "#FFF",
    max: 100,
  },
];
