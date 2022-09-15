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

export const STATES: Array<Record<string, string>> = [
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
