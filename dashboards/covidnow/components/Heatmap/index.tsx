import { FunctionComponent, ReactElement } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ChartHeader } from "@dashboards/covidnow/components";
import { AxisTickProps } from "@nivo/axes";
import { CHOROPLETH_RED_SCALE } from "@dashboards/kawasanku/lib/constants";
interface HeatmapProps {
  className?: string;
  data?: any;
  title?: string | ReactElement;
  menu?: ReactElement;
  controls?: ReactElement;
  schema?: Array<Record<string, string | number>>;
  minY?: number;
  maxY?: number;
  hoverTarget?: "cell" | "row" | "column" | "rowColumn";
}

const sortedSchema = [
  {
    label: "Low",
    labelColor: "#FFF",
    max: 25,
  },
  {
    label: "Mid",
    labelColor: "#000",
    max: 50,
  },
  {
    label: "Safe",
    labelColor: "#000",
    max: 80,
  },
  {
    label: "High",
    labelColor: "#000",
    max: Infinity,
  },
];

const Heatmap: FunctionComponent<HeatmapProps> = ({
  className,
  title,
  data = dummy,
  schema = sortedSchema,
  menu,
  controls,
  minY = 0,
  maxY = 100,
  hoverTarget,
}) => {
  const get = (
    props: { id: any; serieId: any; data: any; formattedValue: any; color?: any },
    key: string
  ) => {
    let { id, serieId, data, formattedValue, color } = props;
    if (!schema && key === "label") return formattedValue ?? "";
    if (!schema && key === "labelColor") return color ?? "#000";

    for (const scheme of schema) {
      if (data.y < scheme.max) return scheme[key];
    }

    return formattedValue ?? "";
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 30, right: 0, bottom: 10, left: 180 }}
          hoverTarget={hoverTarget}
          valueFormat=">-.2s"
          axisTop={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legend: "",
            legendOffset: 46,
          }}
          label={props => get(props, "label")}
          labelTextColor={props => get(props, "labelColor")}
          axisLeft={{
            ticksPosition: "before",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            renderTick: StateTick,
          }}
          colors={{
            type: "quantize",
            // scheme: "reds",
            minValue: minY,
            maxValue: maxY,
            steps: 4,
            colors: [
              "rgba(255, 255, 255, 1)",
              "rgba(248, 250, 252, 1)",
              "rgba(255, 192, 192, 1)",
              "rgba(255, 78, 78, 1)",
            ].reverse(),
          }}
          emptyColor="#555555"
          animate={false}
          //   legends={[
          //     {
          //       anchor: "bottom",
          //       translateX: 0,
          //       translateY: 30,
          //       length: 400,
          //       thickness: 8,
          //       direction: "row",
          //       tickPosition: "after",
          //       tickSize: 3,
          //       tickSpacing: 4,
          //       tickOverlap: false,
          //       tickFormat: ">-.2s",
          //       title: "Value →",
          //       titleAlign: "start",
          //       titleOffset: 4,
          //     },
          //   ]}
        />
      </div>
    </div>
  );
};

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

    const y1 = () => Math.floor(Math.random() * 98 + 2);
    const y2 = 100 - y1();

    return {
      id: Object.keys(statesMap)[index],
      data: [
        {
          x: "A",
          y: y1(),
        },
        {
          x: "B",
          y: y1(),
        },
        {
          x: "AB",
          y: y1(),
        },
        {
          x: "O",
          y: y1(),
        },
      ],
    };
  });

const dummyDiagonal = [
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
