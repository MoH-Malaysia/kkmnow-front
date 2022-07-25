import { FunctionComponent, ReactElement } from "react";
import { ResponsiveBar, BarCustomLayer, BarDatum } from "@nivo/bar";
import { line, curveMonotoneX } from "d3-shape";

interface BarProps {
  className?: string;
  title?: string;
  indexBy: string;
  keys: string[];
  layout?: "vertical" | "horizontal";
  data?: any;
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableLabel?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
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
  title,
  unitX,
  unitY,
  indexBy,
  keys,
  layout = "vertical",
  data = dummy,
  enableGridX = true,
  enableGridY = true,
  gridXValues = undefined,
  gridYValues = undefined,
  enableLabel = false,
  minY = "auto",
  maxY = "auto",
}) => {
  return (
    <div className={className}>
      {title && <span className="text-base font-bold">{title}</span>}
      <div className="h-full w-full">
        <ResponsiveBar
          data={data}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: gridYValues,
            format: value => (unitY ? value.toString().concat(unitY) : value),
          }}
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
          colors={["#5384EF"]}
          groupMode="stacked"
          minValue={minY}
          maxValue={maxY}
          enableLabel={enableLabel}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          axisBottom={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: "x-axis title",
            legendPosition: "middle",
            legendOffset: 36,
            tickValues: gridXValues,
            format: value => (unitX ? value.toString().concat(unitX) : value),
          }}
          padding={0.4}
          margin={{ top: 40, right: 10, bottom: 40, left: 30 }}
          gridXValues={gridXValues}
          gridYValues={gridYValues}
          layers={["grid", "axes", "bars", LineLayer, "markers", "legends"]}
        />
      </div>
    </div>
  );
};

export default Bar;

const dummy = [
  { country: "A", population: 100 },
  { country: "B", population: 50000 },
  { country: "C", population: 15000 },
];
