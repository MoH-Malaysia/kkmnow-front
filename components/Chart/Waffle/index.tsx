import { FunctionComponent, ReactElement } from "react";
import { ResponsiveWaffle } from "@nivo/waffle";
import { Colors } from "@nivo/core";
import { ChartHeader } from "@components/index";

interface WaffleProps {
  title?: string;
  menu?: ReactElement;
  controls?: ReactElement;
  className?: string;
  data?: any;
  total?: number;
  padding?: number;
  color?: Colors;
  rows?: number;
  cols?: number;
  children?: ReactElement | ReactElement[];
}

const Waffle: FunctionComponent<WaffleProps> = ({
  title,
  menu,
  controls,
  className,
  data = dummy,
  color = "#157857",
  total = 100,
  padding = 4,
  rows = 10,
  cols = 10,
  children,
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveWaffle
          data={data}
          total={total}
          rows={rows}
          columns={cols}
          padding={padding}
          emptyColor="#F3F4F6"
          margin={{ top: 10, right: 0, bottom: 10, left: -20 }}
          colors={color}
          animate={false}
        />
      </div>
      {children}
    </div>
  );
};

const dummy = [
  {
    id: "men",
    label: "men",
    value: 9.699015247221036,
  },
];

export default Waffle;
