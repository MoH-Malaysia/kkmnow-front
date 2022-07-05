import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import { OptionType } from "@components/types";
import { IJitterplots } from "@dashboards/kawasanku/lib/types";
import { AREA_TYPES } from "@dashboards/kawasanku/lib/constants";

import SectionHeading from "../SectionHeading";

const Jitterplots = dynamic(() => import("./Jitterplots"), { ssr: false });

type JitterplotSectionProps = {
  areaType: AREA_TYPES;
  data: IJitterplots;
  comparisons: OptionType[];
  currentLocation?: OptionType;
};

const JitterplotSection: FunctionComponent<JitterplotSectionProps> = ({
  areaType,
  data,
  comparisons,
  currentLocation,
}) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div className="py-6">
      <SectionHeading>{t("section2_title1")}</SectionHeading>
      <Jitterplots areaType={areaType} data={data} comparisons={comparisons} />
    </div>
  );
};

export default JitterplotSection;
