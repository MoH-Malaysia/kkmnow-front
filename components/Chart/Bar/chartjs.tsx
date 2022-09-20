import { FunctionComponent, ReactElement } from "react";
import { ChartHeader, StateTick } from "@components/index";
import { CountryAndStates } from "@lib/constants";

interface BarProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  indexBy?: string;
  keys?: string[];
  layout?: "vertical" | "horizontal";
  data?: any;
  mode?: "grouped" | "stacked";
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableLabel?: boolean;
  hideLabelKeys?: string[];
  enableLine?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableAxisX?: boolean;
  enableAxisY?: boolean;
  reverse?: boolean;
  customTickX?: "state" | undefined;
  interactive?: boolean;
  animate?: boolean;
  lineKey?: string;
  colors?: Array<string>;
}

const Bar: FunctionComponent<BarProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  unitX,
  unitY,
  indexBy = "x",
  keys = ["y1"],
  mode = "stacked",
  layout = "vertical",
  data = dummy,
  interactive = true,
  animate = false,
  customTickX = undefined,
  enableGridX = true,
  enableGridY = true,
  enableAxisX = true,
  enableAxisY = true,
  enableLine = false,
  gridXValues = undefined,
  gridYValues = undefined,
  enableLabel = false,
  hideLabelKeys,
  reverse = false,
  minY = "auto",
  maxY = "auto",
  lineKey = "line",
  colors = ["rgba(15, 23, 42, 1)"],
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}></div>
    </div>
  );
};

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);

    const y1 = () => Math.floor(Math.random() * 98 + 2);
    const y2 = 100 - y1();

    return {
      x: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      y1: y1(),
      y2: y2,
      line: y1(),
      state: Object.keys(CountryAndStates)[index],
    };
  })
  .reverse();

export default Bar;
