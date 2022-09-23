import { FunctionComponent } from "react";

interface DonutMeterProps {
  value?: number;
}

const DonutMeter: FunctionComponent<DonutMeterProps> = ({ value = 60 }) => {
  const color = () => {
    if (value > 90) return "#DC2626";
    if (value > 75) return "#FB8229";
    if (value > 50) return "#FBBF24";
    else return "#22C55E";
  };
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-[50%] bg-outline">
      <div
        className="h-14 w-14 rounded-[50%]"
        style={{
          backgroundColor: `conic-gradient(${color()} 5deg, rgb(241, 245, 249) 0deg)`,
        }}
      ></div>
    </div>
  );
};

export default DonutMeter;
