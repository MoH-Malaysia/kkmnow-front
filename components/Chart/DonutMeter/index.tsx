import { FunctionComponent } from "react";

interface DonutMeterProps {
  value?: number;
}

const DonutMeter: FunctionComponent<DonutMeterProps> = ({ value = 30 }) => {
  const color = () => {
    if (value >= 90) return "#DC2626";
    if (value >= 75) return "#FB8229";
    if (value >= 50) return "#FBBF24";
    else return "#22C55E";
  };
  return (
    <div
      className="min-h-[56px] min-w-[56px]"
      role={"progressbar"}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        background: `radial-gradient(closest-side, white 75%, transparent 0 100%, white 0),
            conic-gradient(${color()} ${value}%, rgb(226 232 240)  0)`,
      }}
    />
  );
};

export default DonutMeter;
