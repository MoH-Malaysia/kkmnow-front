// GENERAL
export enum BREAKPOINTS {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1440,
}

export enum DASHBOARDS {
  KAWASANKU = "kawasanku",
}

// COUNTRY & STATES
export const MALAYSIA: Record<string, string> = {
  key: "mys",
  name: "Malaysia",
};

export const STATES: Array<Record<string, any>> = [
  {
    key: "jhr",
    name: "Johor",
  },
  {
    key: "kdh",
    name: "Kedah",
  },
  {
    key: "ktn",
    name: "Kelantan",
  },
  {
    key: "kvy",
    name: "Klang Valley",
  },
  {
    key: "kul",
    name: "Kuala Lumpur",
  },
  {
    key: "lbn",
    name: "Labuan",
  },
  {
    key: "mlk",
    name: "Melaka",
  },
  {
    key: "nsn",
    name: "N.Sembilan",
  },
  {
    key: "phg",
    name: "Pahang",
  },
  {
    key: "prk",
    name: "Perak",
  },
  {
    key: "pls",
    name: "Perlis",
  },
  {
    key: "png",
    name: "P.Pinang",
  },
  {
    key: "pjy",
    name: "Putrajaya",
  },
  {
    key: "sbh",
    name: "Sabah",
  },
  {
    key: "swk",
    name: "Sarawak",
  },
  {
    key: "sgr",
    name: "Selangor",
  },
  {
    key: "trg",
    name: "Terengganu",
  },
];

export const CountryAndStates = (() => {
  return [MALAYSIA, ...STATES].reduce((prev, current) => {
    return { ...prev, ...{ [current.key]: current.name } };
  }, {});
})();

// CHOROPLETH COLOR SCALE
export const CHOROPLETH_RED_SCALE = [
  "#FFF5F0",
  "#FEE0D2",
  "#FBBCA1",
  "#FC9272",
  "#FB694A",
  "#EF3B2C",
  "#CA191D",
  "#A40F15",
  "#67000D",
];

export const CHOROPLETH_GREEN_SCALE = [
  "#F7FCF5",
  "#E5F5E0",
  "#C8E8BF",
  "#A2D89B",
  "#74C476",
  "#42AB5D",
  "#238B44",
  "#026C2C",
  "#00451B",
];

export const CHOROPLETH_BLUE_SCALE = [
  "#F7FBFF",
  "#DEEBF7",
  "#C7DAEF",
  "#9DCAE0",
  "#6AAED6",
  "#4292C6",
  "#2270B5",
  "#08529C",
  "#092F6B",
];

export const CHOROPLETH_YELLOW_GREEN_BLUE_SCALE = [
  "#061E58",
  "#215FA8",
  "#215FA8",
  "#1D91C0",
  "#41B6C4",
  "#7FCDBB",
  "#C7E9B4",
  "#EDF8B1",
  "#FFFFD9",
];

export const CHOROPLETH_RED_PURPLE_SCALE = [
  "#FDE0DD",
  "#FBC5C0",
  "#FBC5C0",
  "#FA9FB5",
  "#F768A1",
  "#DD3597",
  "#AD017E",
  "#7A0177",
  "#49006A",
];

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
    max: 25,
  },
  {
    label: "Mid",
    labelColor: "#000",
    max: 50,
  },
  {
    label: "Safe",
    labelColor: "#000",
    max: 80,
  },
  {
    label: "High",
    labelColor: "#000",
    max: Infinity,
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

// HEATMAP COLORS
export const BLOOD_SUPPLY_COLOR: Array<string> = [
  "rgba(255, 78, 78, 1)",
  "rgba(255, 192, 192, 1)",
  "rgba(248, 250, 252, 1)",
  "rgba(255, 255, 255, 1)",
];

export const BLOOD_DONATION_COLOR: Array<string> = [
  "rgba(237, 246, 252, 1)",
  "rgba(181, 221, 242, 1)",
  "rgba(96, 185, 225, 1)",
  "rgba(22, 168, 220, 1)",
  "rgba(0, 114, 197, 1)",
];

export const ORGAN_DONATION_COLOR: Array<string> = [
  "#228F3A",
  "#29AB47",
  "#31C752",
  "#84E19A",
  "#9FE8B1",
  "#CFF6D9",
];
