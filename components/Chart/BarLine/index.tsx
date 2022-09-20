import { FunctionComponent, ReactElement } from "react";
import { Tooltip } from "@components/index";
import { maxBy } from "@lib/helpers";
import { BarCanvasLayer, BarDatum, canvasDefaultProps, ResponsiveBarCanvas } from "@nivo/bar";
import { line, curveMonotoneX } from "d3-shape";

/**
 * BarLine Component
 */
interface BarLineProps {
  title?: string;
  indexBy?: string;
  keys?: Array<string>;
  data?: Array<any>;
  menu?: ReactElement;
  stats?: Array<StatProps> | null;
  colors?: Array<string>;
  enableLine?: boolean;
  lineKey?: string;
}

const BarLine: FunctionComponent<BarLineProps> = ({
  title,
  indexBy = "x",
  keys = ["y"],
  data = dummyBar,
  stats = dummyStats,
  menu,
  colors,
  enableLine = true,
  lineKey = "line",
}) => {
  //   const LineLayer =
  //     (key: string) =>
  //     ( (ctx, props) JSX.Element => {
  //     //   const lineGenerator = line()
  //     //     .curve(curveMonotoneX)
  //     //     .x((d: any) => xScale(d.data.indexValue) + d.width / 2)
  //     //     .y((d: any) => yScale(d.data.data[key]));

  //     //   return (
  //     //     <path
  //     //       d={lineGenerator(bars as Iterable<[number, number]>)!}
  //     //       fill="none"
  //     //       stroke="#2563EB"
  //     //       strokeWidth="2px"
  //     //     />
  //     //   );
  //     };

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

  return (
    <div>
      <div className="grid grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>
      {stats && <Stats data={stats} className="py-4"></Stats>}
      <div className="h-[500px] w-full">
        <ResponsiveBarCanvas
          data={data}
          indexBy={indexBy}
          margin={{
            left: 60,
            right: 60,
            top: 20,
            bottom: 40,
          }}
          keys={keys}
          gridXValues={generateXTicks(data, indexBy, 5)}
          gridYValues={generateYTicks(data, keys[0], 5)}
          enableGridX={false}
          enableGridY={true}
          enableLabel={false}
          colors={colors}
          layers={[
            "grid",
            "axes",
            "bars",
            (ctx, props) => {
              console.log(ctx);
              console.log(props);
              const total = props.bars
                .reduce((acc, bar) => acc + bar.data.value, 0)
                .toLocaleString();

              ctx.save();

              ctx.textAlign = "right";
              ctx.font = "bold 20px san-serif";
              ctx.fillStyle = "#2a2a2a";

              ctx.fillText(`Grand Total: ${total}`, props.width - 100, -10);

              ctx.restore();
            },
            "legends",
          ]}
        />
      </div>
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
 * Dummy data BarLine (Timeseries)
 */
const dummyBar = Array(180)
  .fill(0)
  .map((_, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);
    return {
      x: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      y: Math.floor(Math.random() * 100 + 2),
      line: Math.floor(Math.random() * 100 + 2),
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
