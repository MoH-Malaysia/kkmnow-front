import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { ChartCrosshairOption } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";
import { Doughnut as DoughnutCanvas } from "react-chartjs-2";

// Register the plugins Timeseries registers too, before any chart exists (see LogScatter)
ChartJS.register(ArcElement, Tooltip, Legend, AnnotationPlugin, CrosshairPlugin);

interface DoughnutProps {
  className?: string;
  title: string;
  slices: Array<{ code: string; value: number }>;
  color: (code: string) => string;
  label: (code: string) => string;
  format: (value: number) => string;
}

const Doughnut: FunctionComponent<DoughnutProps> = ({
  className = "h-[420px] w-full",
  title,
  slices,
  color,
  label,
  format,
}) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-3">
      <h5>{title}</h5>
      <div className={className}>
        <DoughnutCanvas
          data={{
            labels: slices.map(s => label(s.code)),
            datasets: [
              {
                data: slices.map(s => s.value),
                backgroundColor: slices.map(s => color(s.code)),
                borderColor: dark ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                borderWidth: 2,
              },
            ],
          }}
          options={
            {
              responsive: true,
              maintainAspectRatio: false,
              cutout: "60%",
              plugins: {
                crosshair: false,
                datalabels: { display: false },
                legend: {
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "rect",
                    boxWidth: 8,
                    color: dark ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK,
                    font: { family: "Inter", size: 11 },
                  },
                },
                tooltip: {
                  bodyFont: { family: "Inter" },
                  callbacks: {
                    label: item => {
                      const v = item.raw as number;
                      return `${item.label}: ${format(v)} (${((v / total) * 100).toFixed(1)}%)`;
                    },
                  },
                },
              },
            } as ChartCrosshairOption<"doughnut">
          }
        />
      </div>
    </div>
  );
};

export default Doughnut;
