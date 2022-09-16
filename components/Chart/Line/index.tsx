import { FunctionComponent, ReactElement } from "react";
import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";
import { LegendProps } from "@nivo/legends";
import { ChartHeader } from "@components/index";

interface LineProps {
  className?: string;
  menu?: ReactElement;
  controls?: ReactElement;
  subheader?: ReactElement | ReactElement[];
  title?: string;
  data?: any;
  unitX?: string;
  unitY?: string;
  colorScheme?: "inherit" | "blood-red";
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
  legends?: LegendProps | "right" | "bottom-right";
}

const Line: FunctionComponent<LineProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  controls,
  subheader,
  title,
  unitX,
  unitY,
  data = dummy,
  colorScheme = "inherit",
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
  legends,
  minY = "auto",
  maxY = "auto",
}) => {
  const getColorScheme = () => {
    switch (colorScheme) {
      case "inherit":
        return linearGradientDef("scheme", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit" },
        ]);
      case "blood-red":
        return linearGradientDef("scheme", generateGradient(data[0].data, "y"), {
          gradientTransform: "rotate(270 0.5 0.5)",
          spreadMethod: "repeat",
        });
    }
  };

  const getLegendsConfig = (): LegendProps[] | undefined => {
    switch (legends) {
      case "right":
        return [
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ];

      case "bottom-right":
        return [
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ];

      default:
        return legends ? [legends] : undefined;
    }
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      {subheader && <div className="pt-4">{subheader}</div>}
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
          margin={{ top: 40, right: legends ? 120 : 40, bottom: 40, left: 40 }}
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
          defs={[getColorScheme()]}
          fill={[{ match: "*", id: "scheme" }]}
          legends={getLegendsConfig()}
        />
      </div>
    </div>
  );
};

/**
 * Generate gradients
 * @param data Dataset
 * @param key X-key?
 * @returns gradient for the given point
 */
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

/**
 * Obtain the colors scheme for Y-dependent visuals
 * @param value Y-value
 * @param max Max value in dataset
 * @param colors color scheme
 * @returns
 */
const getColor = (value: number, max: number, colors: Array<string>) => {
  const delta = max / colors.length;
  let index = Math.floor(value / delta);
  if (index === colors.length) index = colors.length - 1;
  return colors[index];
};

export default Line;

// const dummy = [
//   {
//     id: "a",
//     data: Array(25)
//       .fill(0)
//       .map((_, index) => {
//         let date = new Date();
//         date.setDate(date.getDate() - index);

//         const y1 = Math.floor(Math.random() * 50 + 1);

//         return {
//           x: index,
//           y: y1,
//         };
//       }),
//   },
// ];

const dummy = [
  {
    id: "fake corp. A",
    color: "#B01217",
    data: [
      { x: 0, y: 70 },
      { x: 1, y: 50 },
      { x: 2, y: 11 },
      { x: 3, y: 12 },
      { x: 4, y: 13 },
      { x: 5, y: 8 },
      { x: 6, y: 18 },
      { x: 7, y: 16 },
      { x: 8, y: 8 },
      { x: 9, y: 10 },
      { x: 10, y: 9 },
    ],
  },
  {
    id: "fake corp. B",
    color: "#E23028",
    data: [
      { x: 0, y: 13 },
      { x: 1, y: 8 },
      { x: 2, y: 18 },
      { x: 3, y: 16 },
      { x: 4, y: 14 },
      { x: 5, y: 16 },
      { x: 6, y: 19 },
      { x: 7, y: 20 },
      { x: 8, y: 18 },
      { x: 9, y: 16 },
      { x: 10, y: 8 },
    ],
  },
];
