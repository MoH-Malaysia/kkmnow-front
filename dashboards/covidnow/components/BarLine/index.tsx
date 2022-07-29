import { FunctionComponent, ReactElement } from "react";
import { Tooltip } from "@components/index";
import { maxBy } from "@lib/helpers";
import { Bar } from "..";

/**
 * BarLine Component
 */
interface BarLineProps {
  title?: string;
  indexBy?: string;
  keys?: Array<string>;
  data?: Array<any>;
  menu?: ReactElement;
}

const BarLine: FunctionComponent<BarLineProps> = ({
  title,
  indexBy = "x",
  keys = ["y"],
  data = dummyBar,
  menu,
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
      <div className="grid grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex justify-end">{menu}</div>}
      </div>
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
        enableLine={true}
        maxY={Math.floor(1.25 * maxBy(data, "y").y)}
      />
    </div>
  );
};

/**
 * Stats Component
 */
interface StatsProps {
  data: Array<StatProps>;
  className?: string;
}

type StatProps = {
  title: string;
  value: string;
  tooltip?: string;
};

const Stats: FunctionComponent<StatsProps> = ({ data, className }) => {
  const cols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return (
    <div className={`grid w-full ${cols[data.length] ?? "grid-cols-3"} ${className}`}>
      {data.map(({ title, value, tooltip }: StatProps, index) => (
        <div key={index}>
          <p className="text-sm text-dim">{title}</p>
          {tooltip ? (
            <Tooltip
              trigger={
                <h4 className="font-medium underline decoration-dashed underline-offset-4">
                  {value}
                </h4>
              }
            >
              <span className="text-sm">{tooltip}</span>
            </Tooltip>
          ) : (
            <h4 className="font-medium">{value}</h4>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Dummy data
 */
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

export default BarLine;
