import { useTranslation } from "next-i18next";
import { FunctionComponent, useEffect, useState } from "react";

import ComboBox from "@components/Combobox";
import { OptionType } from "@components/types";

import { STATES } from "@lib/constants";

type SpotlightProps = {
  stateKey?: string;
  areaType?: string;
  currentLocation?: OptionType;
  comparisons: OptionType[];
  setComparisons: React.Dispatch<React.SetStateAction<OptionType[]>>;
};

const Spotlight: FunctionComponent<SpotlightProps> = ({
  stateKey,
  areaType,
  currentLocation,
  comparisons,
  setComparisons,
}) => {
  const { t } = useTranslation("kawasanku");

  const [options, setOptions] = useState<OptionType[]>(
    Object.values(STATES).map(state => {
      return { label: state.name, value: state.key };
    })
  );

  const handleComparisons = (newOption?: OptionType) => {
    if (!newOption || comparisons?.length === 3) return;

    setComparisons([...comparisons, newOption]);
  };

  const handleClearComparison = (removedOption: OptionType) => {
    setComparisons(comparisons.filter(option => option.value !== removedOption.value));
  };

  // TODO (@itschrislow): use fixed area options until API is ready
  // useEffect(() => {
  //   if (areaType)
  //     getAreaOptions({ filter: areaType, state: stateKey, withState: true })
  //       .then(res => setOptions(res))
  //       .catch(err => console.log(err));
  // }, [areaType]);

  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
      <div className="flex h-full w-full items-center justify-between gap-2 md:w-auto">
        <p className="text-sm">{t("spotlight")}:</p>
        <ComboBox
          options={options}
          onChange={handleComparisons}
          placeholder={t("spotlight_placeholder")}
          disabled={comparisons.length >= 3}
          width="w-60"
        />
      </div>
      {(currentLocation || comparisons.length > 0) && (
        <div className="flex w-full flex-wrap items-start gap-3 md:w-auto md:items-center">
          {/* CURRENT LOCATION */}
          {currentLocation && <Label color="bg-black" text={currentLocation?.label} />}
          {/* JITTER COMPARISONS */}
          {comparisons.length !== 0 &&
            comparisons.map((comparison, index) => {
              return (
                <Label
                  key={index}
                  color={
                    index === 0 ? "bg-[#D44647]" : index === 1 ? "bg-[#2873E8]" : "bg-[#EC9E29]"
                  }
                  text={comparison.label}
                  isClearable={true}
                  handleClear={() => handleClearComparison(comparison)}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

type LabelProps = {
  color: string;
  text: string;
  isClearable?: boolean;
  handleClear?: () => void;
};

const Label = ({ color, text, isClearable = false, handleClear }: LabelProps) => {
  return (
    <div className={`flex items-center ${isClearable ? "rounded-xl bg-washed px-2 py-0.5" : ""}`}>
      <div className="rounded-full bg-white p-0.5">
        <div className={`h-3 w-3 rounded-full ${color}`} />
      </div>
      <div className="mx-1 text-sm font-semibold">{text}</div>
      {isClearable && (
        <button className="focus:outline-none focus:ring-0" onClick={handleClear}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Spotlight;
