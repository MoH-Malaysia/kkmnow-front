import { FunctionComponent, ReactElement } from "react";
import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import { ChartHeader } from "@dashboards/covidnow/components";
interface LineProps {
  className?: string;
  menu?: ReactElement;
  controls?: ReactElement;
  title?: string;
  data?: any;
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number | "auto";
  maxY?: number | "auto";
  lineWidth?: number;
  curve?:
    | "basis"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "natural"
    | "step"
    | "stepAfter"
    | "stepBefore"
    | undefined;
  interactive?: boolean;
  enableArea?: boolean;
  enablePoint?: boolean;
  enablePointLabel?: boolean;
  enableLabel?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableAxisY?: boolean;
  enableAxisX?: boolean;
}

const Line: FunctionComponent<LineProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  controls,
  title,
  unitX,
  unitY,
  data = dummy,
  lineWidth = 2,
  curve = "linear",
  enableArea = false,
  enablePoint = true,
  enablePointLabel = false,
  enableGridX = true,
  enableGridY = true,
  enableAxisX = true,
  enableAxisY = true,
  gridXValues = undefined,
  gridYValues = undefined,
  interactive = true,
  minY = "auto",
  maxY = "auto",
}) => {
  const generateGradient = (data: any, key: string) => {
    // Blood red color scheme
    const colors = ["#67000D", "#B01217", "#E23028", "#F9694C", "#FBA082", "#FEF5F0", "#FFFFFF"];
    const interval = 100 / (data.length - 1);
    const max = Math.max(...data.map((o: any) => o[key]));
    const gradients = data.map((item: any, index: number) => {
      return { offset: index * interval, color: getColor(item[key], max, colors) };
    });
    return gradients;
  };
  const getColor = (value: number, max: number, colors: Array<string>) => {
    const delta = max / colors.length;
    let index = Math.floor(value / delta);
    if (index === colors.length) index = colors.length - 1;
    return colors[index];
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveLine
          data={data}
          axisLeft={
            enableAxisY
              ? {
                  tickSize: 0,
                  tickPadding: 10,
                  tickValues: gridYValues,
                  format: value => (unitY ? value.toString().concat(unitY) : value),
                }
              : null
          }
          theme={{
            grid: {
              line: {
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              },
            },
          }}
          lineWidth={lineWidth}
          curve={curve}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          axisBottom={
            enableAxisX
              ? {
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: value => (unitX ? value.toString().concat(unitX) : value),
                }
              : null
          }
          margin={{ top: 40, right: 10, bottom: 40, left: 40 }}
          xScale={{
            type: "linear",
            min: 0,
            max: "auto",
          }}
          gridXValues={gridXValues}
          gridYValues={gridYValues}
          yScale={{
            type: "linear",
            stacked: true,
            min: minY,
            max: maxY,
            clamp: true,
          }}
          isInteractive={interactive}
          useMesh={interactive}
          enablePoints={enablePoint}
          enablePointLabel={enablePointLabel}
          pointLabelYOffset={-14}
          pointLabel={function (t) {
            return t.y + unitY!.toString();
          }}
          enableArea={enableArea}
          areaOpacity={1}
          defs={[
            linearGradientDef("a", generateGradient(data[0].data, "y"), {
              gradientTransform: "rotate(270 0.5 0.5)",
              spreadMethod: "repeat",
            }),
          ]}
          fill={[{ match: "*", id: "a" }]}
        />
      </div>
    </div>
  );
};

export default Line;

const dummy = [
  {
    id: "a",
    data: Array(25)
      .fill(0)
      .map((_, index) => {
        let date = new Date();
        date.setDate(date.getDate() - index);

        const y1 = Math.floor(Math.random() * 50 + 1);

        return {
          x: index,
          y: y1,
        };
      }),
  },
];

// const dummy = [
//   {
//     id: "a",
//     data: [
//       { x: 0, y: 70 },
//       { x: 1, y: 50 },
//       { x: 2, y: 11 },
//       { x: 3, y: 12 },
//       { x: 4, y: 13 },
//       { x: 5, y: 8 },
//       { x: 6, y: 18 },
//       { x: 7, y: 16 },
//       { x: 8, y: 8 },
//       { x: 9, y: 10 },
//       { x: 10, y: 9 },
//     ],
//   },
//   {
//     id: "fake corp. B",
//     data: [
//       { x: 3, y: 14 },
//       { x: 4, y: 16 },
//       { x: 5, y: 19 },
//       { x: 6, y: 20 },
//       { x: 7, y: 18 },
//     ],
//   },
// ];
