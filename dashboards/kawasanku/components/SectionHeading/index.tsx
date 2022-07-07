import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

type SectionHeadingProps = {
  children?: React.ReactNode;
};

const SectionHeading: FunctionComponent<SectionHeadingProps> = ({ children }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div className="mb-6 flex w-full flex-col items-start justify-between gap-3 md:mb-7 md:flex-row md:items-center md:gap-0">
      <h4>{children}</h4>
      <p className="text-sm text-outlineHover">{t("census_2020")}</p>
    </div>
  );
};

export default SectionHeading;
