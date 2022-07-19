import { BarDatum } from "@nivo/bar";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

export type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactElement) => ReactElement;
};

// CHART INTERFACE
export interface IChart {
  id: string;
  keys: string[];
  data: any;
  [key: string]: any;
}

// BAR CHART
export interface IBarChartData extends IChart {
  data: BarDatum[];
}
