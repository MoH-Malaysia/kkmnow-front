import { FunctionComponent } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

interface HeatmapProps {
  className?: string;
  data?: any;
}

const Heatmap: FunctionComponent<HeatmapProps> = ({ className, data = dummy }) => {
  return (
    <div className={className}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 30, right: 0, bottom: 60, left: 60 }}
        valueFormat=">-.2s"
        axisTop={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          legend: "",
          legendOffset: 46,
        }}
        axisLeft={{
          ticksPosition: "before",
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          legend: "country",
          legendPosition: "middle",
          legendOffset: -72,
        }}
        colors={{
          type: "diverging",
          scheme: "blues",
          minValue: -100000,
          maxValue: 100000,
          divergeAt: 0.5,
        }}
        emptyColor="#555555"
        legends={[
          {
            anchor: "bottom",
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: "row",
            tickPosition: "after",
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: ">-.2s",
            title: "Value →",
            titleAlign: "start",
            titleOffset: 4,
          },
        ]}
      />
    </div>
  );
};

const dummy = [
  {
    id: "Japan",
    data: [
      {
        x: "Train",
        y: -13623,
      },
      {
        x: "Subway",
        y: 49382,
      },
      {
        x: "Bus",
        y: -49785,
      },
      {
        x: "Car",
        y: 38066,
      },
      {
        x: "Boat",
        y: -70988,
      },
      {
        x: "Moto",
        y: 60325,
      },
      {
        x: "Moped",
        y: -25685,
      },
      {
        x: "Bicycle",
        y: 18402,
      },
    ],
  },
  {
    id: "France",
    data: [
      {
        x: "Train",
        y: 11476,
      },
      {
        x: "Subway",
        y: -7392,
      },
      {
        x: "Bus",
        y: 19185,
      },
      {
        x: "Car",
        y: -20491,
      },
      {
        x: "Boat",
        y: -66405,
      },
      {
        x: "Moto",
        y: 62149,
      },
      {
        x: "Moped",
        y: -62377,
      },
    ],
  },
  {
    id: "US",
    data: [
      {
        x: "Train",
        y: 55769,
      },
      {
        x: "Subway",
        y: -6430,
      },
      {
        x: "Bus",
        y: 95228,
      },
      {
        x: "Car",
        y: 38713,
      },
      {
        x: "Boat",
        y: -20260,
      },
      {
        x: "Moto",
        y: 15754,
      },
    ],
  },
  {
    id: "Germany",
    data: [
      {
        x: "Train",
        y: 99572,
      },
      {
        x: "Subway",
        y: -42981,
      },
      {
        x: "Bus",
        y: -17820,
      },
      {
        x: "Car",
        y: 80488,
      },
      {
        x: "Boat",
        y: -68851,
      },
    ],
  },
  {
    id: "Norway",
    data: [
      {
        x: "Train",
        y: 58659,
      },
      {
        x: "Subway",
        y: -54633,
      },
      {
        x: "Bus",
        y: -91166,
      },
      {
        x: "Car",
        y: 86125,
      },
    ],
  },
  {
    id: "Iceland",
    data: [
      {
        x: "Train",
        y: -72165,
      },
      {
        x: "Subway",
        y: 5633,
      },
      {
        x: "Bus",
        y: 81015,
      },
    ],
  },
  {
    id: "UK",
    data: [
      {
        x: "Train",
        y: -51205,
      },
      {
        x: "Subway",
        y: 18326,
      },
    ],
  },
  {
    id: "Vietnam",
    data: [
      {
        x: "Train",
        y: -20267,
      },
    ],
  },
];

export default Heatmap;
