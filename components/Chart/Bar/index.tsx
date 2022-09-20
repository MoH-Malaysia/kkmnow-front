import { FunctionComponent, ReactElement } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { line, curveMonotoneX } from "d3-shape";
import { ChartHeader, StateTick } from "@components/index";
import { CountryAndStates } from "@lib/constants";
import type { BarCustomLayerProps, BarDatum } from "@nivo/bar";

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

const LineLayer =
  (key: string) =>
  ({ bars, xScale, yScale }: BarCustomLayerProps<BarDatum>): JSX.Element => {
    const lineGenerator = line()
      .curve(curveMonotoneX)
      .x((d: any) => xScale(d.data.indexValue) + d.width / 2)
      .y((d: any) => yScale(d.data.data[key]));

    return (
      <path
        d={lineGenerator(bars as Iterable<[number, number]>)!}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2px"
      />
    );
  };

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
      <div className={className}>
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
          colors={colors}
          groupMode={mode}
          minValue={minY}
          maxValue={maxY}
          enableLabel={enableLabel}
          label={({ id, formattedValue }) => {
            if (hideLabelKeys?.includes(id.toString())) return "";
            return `${formattedValue}`;
          }}
          valueFormat={(d: number) => {
            return (
              <tspan x={-20} style={{ fontSize: "14px", fill: "rgba(100, 116, 139, 1)" }}>
                {d}
              </tspan>
            ) as unknown as string;
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
          padding={0.3}
          margin={{
            top: layout === "vertical" ? 40 : 0,
            right: 5,
            bottom: layout === "vertical" ? 40 : 10,
            left: layout === "vertical" ? 60 : 180,
          }}
          gridXValues={gridXValues}
          gridYValues={gridYValues}
          layers={
            enableLine
              ? ["grid", "axes", "bars", LineLayer(lineKey), "markers", "legends"]
              : undefined
          }
        />
      </div>
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
