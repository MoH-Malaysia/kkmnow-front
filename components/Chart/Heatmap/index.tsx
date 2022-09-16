import { FunctionComponent, ReactElement } from "react";
import { ComputedCell, ResponsiveHeatMap } from "@nivo/heatmap";
import { ColorInterpolatorId, ContinuousColorScaleConfig } from "@nivo/colors";
import { AxisProps } from "@nivo/axes";
import { ChartHeader, StateTick, DefaultTick } from "@components/index";
import { CountryAndStates, HeatmapSchema } from "@lib/constants";
import { CHOROPLETH_RED_SCALE } from "@lib/constants";
interface HeatmapProps {
  className?: string;
  data?: any;
  subdata?: any;
  title?: string | ReactElement;
  menu?: ReactElement;
  key?: string;
  controls?: ReactElement;
  schema?: Array<HeatmapSchema>;
  color?: ColorInterpolatorId | Array<string>;
  minY?: number;
  maxY?: number;
  forceSquare?: boolean;
  interactive?: boolean;
  hoverTarget?: "cell" | "row" | "column" | "rowColumn";
  axisLeft?: AxisProps<any> | "state" | "default";
  axisTop?: AxisProps<any> | null;
  legend?: LegendTitle;
}

type LegendTitle = {
  left?: string;
  top?: string;
};

const Heatmap: FunctionComponent<HeatmapProps> = ({
  className,
  title,
  data = dummy,
  subdata,
  schema,
  color,
  menu,
  key = "y",
  controls,
  minY = 0,
  maxY = 100,
  forceSquare = false,
  interactive = true,
  hoverTarget,
  axisLeft,
  axisTop,
  legend,
}) => {
  const get = (
    props: { id: any; serieId: any; data: any; formattedValue: any; color?: any },
    _key: keyof HeatmapSchema
  ) => {
    if (!schema) return;
    let { id, serieId, data, formattedValue, color } = props;

    for (const scheme of schema) {
      if (data[key] < scheme.max) {
        if (!scheme[_key]) return formattedValue;
        return scheme[_key];
      }
    }

    return formattedValue ?? "";
  };

  const getAxisLeft = (): AxisProps<any> | null => {
    switch (axisLeft) {
      case "state":
        return {
          ticksPosition: "before",
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          renderTick: StateTick,
        };

      case "default":
        return {
          ticksPosition: "before",
          tickSize: 0,
          tickPadding: 10,
          renderTick: DefaultTick,
        };
      default:
        return axisLeft ?? null;
    }
  };

  const getColorScheme = (): ContinuousColorScaleConfig | undefined => {
    if (Array.isArray(color)) {
      return {
        type: "quantize",
        colors: color,
        steps: color.length,
      };
    } else if (typeof color === "string") {
      return {
        type: "sequential",
        scheme: color,
      };
    }

    return undefined;
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />

      <div className={className}>
        {legend?.left && (
          <span className="rotate-180 text-center font-medium [writing-mode:vertical-lr]">
            {legend.left}
          </span>
        )}
        <div className="h-full flex-grow">
          {legend?.top && <span className="block text-center font-medium">{legend.top}</span>}

          <ResponsiveHeatMap
            data={data}
            margin={{
              top: axisTop !== null ? 30 : 0,
              right: 0,
              bottom: 10,
              left: axisLeft === "state" ? 180 : axisLeft === "default" ? 140 : 80,
            }}
            hoverTarget={hoverTarget}
            valueFormat=">-.2s"
            axisTop={
              axisTop !== undefined
                ? axisTop
                : {
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legendOffset: 46,
                  }
            }
            label={schema ? props => get(props, "label") : undefined}
            labelTextColor={schema ? props => get(props, "labelColor") : undefined}
            axisLeft={getAxisLeft()}
            isInteractive={interactive}
            forceSquare={forceSquare}
            theme={{
              fontSize: 14,
              axis: {
                ticks: {
                  text: {
                    fontSize: 14,
                    fontFamily: "inherit",
                  },
                },
              },
            }}
            colors={getColorScheme()}
            emptyColor="#555555"
            animate={false}
          />
        </div>

        {subdata && (
          <div className="aspect-auto h-full w-[12.5%]">
            <ResponsiveHeatMap
              data={subdata}
              margin={{
                top: axisTop !== null ? 30 : 0,
                right: 20,
                bottom: 10,
                left: 0,
              }}
              hoverTarget={hoverTarget}
              valueFormat=">-.2s"
              axisTop={
                axisTop !== undefined
                  ? axisTop
                  : {
                      tickSize: 0,
                      tickPadding: 10,
                      tickRotation: 0,
                      legend: "",
                      legendOffset: 46,
                    }
              }
              axisLeft={null}
              forceSquare={forceSquare}
              isInteractive={interactive}
              label={schema ? props => get(props, "label") : undefined}
              labelTextColor={schema ? props => get(props, "labelColor") : undefined}
              theme={{
                fontSize: 14,
                axis: {
                  ticks: {
                    text: {
                      fontSize: 14,
                      fontFamily: "inherit",
                    },
                  },
                },
              }}
              colors={getColorScheme()}
              emptyColor="#555555"
              animate={false}
            />
          </div>
        )}
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

    return {
      id: Object.keys(CountryAndStates)[index],
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

export default Heatmap;
