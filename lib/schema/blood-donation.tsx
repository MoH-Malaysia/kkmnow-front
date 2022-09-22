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
    labelColor: "#FFF",
    max: 20000,
  },
  {
    labelColor: "#FFF",
    max: 50000,
  },
  {
    labelColor: "#FFF",
    max: Infinity,
  },
];
export const ORGAN_DONATION_SCHEMA: HeatmapSchema[] = [
  {
    labelColor: "#FFF",
    max: 0,
  },
  {
    labelColor: "#FFF",
    max: 5000,
  },
  {
    labelColor: "#000",
    max: 20000,
  },
  {
    labelColor: "#000",
    max: 40000,
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
