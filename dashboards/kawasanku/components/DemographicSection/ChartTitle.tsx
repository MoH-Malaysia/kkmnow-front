import { FunctionComponent } from "react";

type ChartTitleProps = {
  children: string;
};

const ChartTitle: FunctionComponent<ChartTitleProps> = ({ children }) => {
  return <p className="mb-3 text-sm font-bold capitalize">{children}</p>;
};

export default ChartTitle;
