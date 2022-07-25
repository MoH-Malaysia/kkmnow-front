import { FunctionComponent } from "react";
import { Line, Bar } from "..";
import { maxBy } from "@lib/helpers";
import Stats from "../Stats";

interface BarLineProps {
  title?: string;
  indexBy?: string;
  keys?: Array<string>;
  data?: Array<any>;
}

const BarLine: FunctionComponent<BarLineProps> = ({
  title,
  indexBy = "x",
  keys = ["y"],
  data = dummyBar,
}) => {
  const generateXTicks = (data: any, key: string, count: number) => {
    let ticks: Array<any> = [];
    const interval = Math.floor(data.length / count);
    data.forEach((item: any, index: number) => {
      if (index % interval === 0) ticks.push(item[key]);
    });
    return ticks;
  };

  const generateYTicks = (data: any, key: string, count: number) => {
    let ticks: Array<any> = [];

    const max = maxBy(data, key)[key];
    const newMax = Math.floor(1.25 * max);
    const interval = Math.floor(newMax / count);

    for (let i = 0; i < newMax; i++) {
      if (i % interval === 0) ticks.push(i);
    }

    return ticks;
  };

  // TODO: Add dropdown menu option
  return (
    <div>
      {title && <span className="text-base font-bold">{title}</span>}
      <Stats data={dummyStats} className="py-4"></Stats>
      <Bar
        className="h-[370px] w-full"
        data={data}
        indexBy={indexBy}
        keys={keys}
        gridXValues={generateXTicks(data, indexBy, 5)}
        gridYValues={generateYTicks(data, "y", 5)}
        enableGridX={false}
        enableGridY={true}
        maxY={Math.floor(1.25 * maxBy(data, "y").y)}
      />
    </div>
  );
};

export default BarLine;

const dummyBar = Array(180)
  .fill(0)
  .map((_, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);
    return {
      x: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      y: Math.floor(Math.random() * 100 + 2),
    };
  })
  .reverse();

const dummyStats = [
  {
    title: "Total - Deaths",
    value: "35,844",
  },
  {
    title: "Active - Ventilated",
    value: "43.4%",
    tooltip: "yabedabedooo",
  },
  {
    title: "Utilisation (Overall)",
    value: "35,844",
  },
];
