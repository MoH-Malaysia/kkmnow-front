import { FunctionComponent } from "react";
import { ResponsiveLine } from "@nivo/line";
interface LineProps {
  className?: string;
  title?: string;
  data?: any;
  unitX?: string;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableGridX?: boolean;
  enableGridY?: boolean;
  enablePointLabel?: boolean;
}

const Line: FunctionComponent<LineProps> = ({
  className = "w-full h-full", // manage CSS here
  title,
  unitX,
  unitY,
  data = dummy,
  enableGridX = true,
  enableGridY = true,
  enablePointLabel = false,
  gridXValues = undefined,
  gridYValues = undefined,
  minY = "auto",
  maxY = "auto",
}) => {
  return (
    <div className={className}>
      {title && <span className="text-base font-bold">{title}</span>}
      <div className="h-full w-full">
        <ResponsiveLine
          data={data}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: gridYValues,
            format: value => (unitY ? value.toString().concat(unitY) : value),
          }}
          theme={{
            grid: {
              line: {
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              },
            },
          }}
          enableGridX={enableGridX}
          enableGridY={enableGridY}
          axisBottom={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: "x-axis title",
            legendPosition: "middle",
            legendOffset: 36,
            format: value => (unitX ? value.toString().concat(unitX) : value),
          }}
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
            stacked: false,
            min: minY,
            max: maxY,
            clamp: true,
          }}
          useMesh={true}
          enablePointLabel={enablePointLabel}
          pointLabelYOffset={-14}
          pointLabel={function (t) {
            return t.y + unitY!.toString();
          }}
        />
      </div>
    </div>
  );
};

export default Line;

const dummy = [
  {
    id: "fake corp. A",
    data: [
      { x: 0, y: 7 },
      { x: 1, y: 5 },
      { x: 2, y: 11 },
      { x: 3, y: 12 },
      { x: 4, y: 13 },
      { x: 5, y: null },
      { x: 6, y: 18 },
      { x: 7, y: 16 },
      { x: 8, y: 8 },
      { x: 9, y: 10 },
      { x: 10, y: 9 },
    ],
  },
  {
    id: "fake corp. B",
    data: [
      { x: 3, y: 14 },
      { x: 4, y: 16 },
      { x: 5, y: 19 },
      { x: 6, y: 20 },
      { x: 7, y: 18 },
    ],
  },
];
