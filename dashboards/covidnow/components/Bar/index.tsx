import { FunctionComponent, ReactElement } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { AxisTickProps } from "@nivo/axes";
import { line, curveMonotoneX } from "d3-shape";

interface BarProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  indexBy?: string;
  keys?: string[];
  layout?: "vertical" | "horizontal";
  data?: any;
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
}

const LineLayer = ({ bars, xScale, yScale }) => {
  const lineGenerator = line()
    .curve(curveMonotoneX)
    .x(d => xScale(d.data.indexValue) + d.width / 2)
    .y(d => yScale(d.data.data.y));

  return <path d={lineGenerator(bars)!} fill="none" stroke="#2563EB" strokeWidth="2px" />;
};

const Bar: FunctionComponent<BarProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  unitX,
  unitY,
  indexBy = "x",
  keys = ["y"],
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
}) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex justify-end">{menu}</div>}
      </div>
      <div className="h-full w-full">
        <ResponsiveBar
          data={data}
          indexBy={indexBy}
          keys={keys}
          layout={layout}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          theme={{
            grid: {
              line: {
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              },
            },
          }}
          colors={["rgba(15, 23, 42, 1)", "rgba(241, 245, 249, 1)"]}
          groupMode="stacked"
          minValue={minY}
          maxValue={maxY}
          enableLabel={enableLabel}
          label={({ id, formattedValue }) => {
            if (hideLabelKeys?.includes(id.toString())) return "";
            return formattedValue;
          }}
          valueFormat={d => {
            return (
              <tspan x={-20} style={{ fontSize: "14px", fill: "rgba(100, 116, 139, 1)" }}>
                {d}
              </tspan>
            );
          }}
          animate={animate}
          isInteractive={interactive}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          reverse={reverse}
          axisBottom={
            enableAxisX
              ? {
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "x-axis title",
                  legendPosition: "middle",
                  legendOffset: 36,
                  tickValues: gridXValues,
                  format: value => (unitX ? value.toString().concat(unitX) : value),
                }
              : null
          }
          axisLeft={
            enableAxisY
              ? {
                  tickSize: 0,
                  tickPadding: 10,
                  tickValues: gridYValues,
                  format: value => (unitY ? value.toString().concat(unitY) : value),
                  renderTick: customTickX === "state" ? StateTick : undefined,
                }
              : null
          }
          padding={0.4}
          margin={{
            top: layout === "vertical" ? 40 : 10,
            right: 5,
            bottom: 40,
            left: layout === "vertical" ? 30 : 180,
          }}
          gridXValues={gridXValues}
          gridYValues={gridYValues}
          layers={
            enableLine ? ["grid", "axes", "bars", LineLayer, "markers", "legends"] : undefined
          }
        />
      </div>
    </div>
  );
};

export default Bar;

const statesMap = {
  jhr: "Johor",
  kdh: "Kedah",
  ktn: "Kelantan",
  kul: "Kuala Lumpur",
  kvy: "Klang Valley",
  lbn: "Labuan",
  mlk: "Melaka",
  mys: "Malaysia",
  nsn: "N.Sembilan",
  phg: "Pahang",
  pjy: "Putrajaya",
  pls: "Perlis",
  png: "P.Pinang",
  prk: "Perak",
  sbh: "Sabah",
  sgr: "Selangor",
  swk: "Sarawak",
  trg: "Terengganu",
  wp: "W.Persekutuan",
};

const dummy = Array(19)
  .fill(0)
  .map((_, index) => {
    let date = new Date();
    date.setDate(date.getDate() - index);

    const y1 = Math.floor(Math.random() * 98 + 2);
    const y2 = 100 - y1;

    return {
      x: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      y: y1,
      y2: y2,
      state: Object.keys(statesMap)[index],
    };
  })
  .reverse();

const StateTick = (tick: AxisTickProps<string>) => {
  return (
    <g transform={`translate(${tick.x - 150},${tick.y})`}>
      <image
        x={-28}
        y={-6}
        href={`/static/images/states/${tick.value}.jpeg`}
        style={{ width: "18px" }}
      ></image>
      <text
        textAnchor="start"
        dominantBaseline="middle"
        style={{
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        {statesMap[tick.value]}
      </text>
    </g>
  );
};
