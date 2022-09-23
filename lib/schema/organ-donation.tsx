import { HeatmapSchema } from "./blood-donation";

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
