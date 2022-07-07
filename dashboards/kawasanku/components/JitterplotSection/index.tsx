import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { FunctionComponent, useState } from "react";

import { OptionType } from "@components/types";
import { IJitterplots } from "@dashboards/kawasanku/lib/types";
import { AREA_TYPES } from "@dashboards/kawasanku/lib/constants";

import Spotlight from "./Spotlight";
import SectionHeading from "../SectionHeading";

const Jitterplots = dynamic(() => import("./Jitterplots"), { ssr: false });

type JitterplotSectionProps = {
  areaType: AREA_TYPES;
  data: IJitterplots;
  currentLocation?: OptionType;
};

const JitterplotSection: FunctionComponent<JitterplotSectionProps> = ({
  areaType,
  data,
  currentLocation,
}) => {
  const { t } = useTranslation("kawasanku");

  const [comparisons, setComparisons] = useState<OptionType[]>([]);

  return (
    <div className="py-12 md:py-6">
      <SectionHeading>{t("section2_title1")}</SectionHeading>
      <Spotlight comparisons={comparisons} setComparisons={setComparisons} />
      <Jitterplots areaType={areaType} data={data} comparisons={comparisons} />
    </div>
  );
};

export default JitterplotSection;
