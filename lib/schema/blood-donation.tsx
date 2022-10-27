import { useTranslation } from "next-i18next";

// HEATMAP SCHEMAS
export type HeatmapSchema = {
  label?: string;
  labelColor?: string;
  max: number;
};

export const BLOOD_SUPPLY_SCHEMA = (): HeatmapSchema[] => {
  const { t } = useTranslation();
  return [
    {
      label: t("blood.low"),
      labelColor: "#FFF",
      max: 33,
    },
    {
      label: t("blood.mid"),
      labelColor: "#000",
      max: 67,
    },
    {
      label: t("blood.safe"),
      labelColor: "#000",
      max: 100,
    },
  ];
};
