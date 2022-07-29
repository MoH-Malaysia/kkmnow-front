import { FunctionComponent, ReactElement, ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";

/**
 * Stages
 */
interface StagesProps {
  className?: string;
  title?: string;
  menu?: ReactElement;
}

const Stages: FunctionComponent<StagesProps> = ({ title, className = "", menu }) => {
  return (
    <div>
      <div className="grid grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex justify-end">{menu}</div>}
      </div>
      <div className={className}>
        {/* Active Cases */}
        <div className="m-auto w-fit rounded bg-washed py-1.5 px-3 text-center">
          <span className="text-xs text-dim">Active Cases</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">4,497,078</span>
            <small className="inline-block rounded bg-green-400 bg-opacity-20 px-1.5 text-green-500">
              -405
            </small>
          </div>
        </div>
        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3">
          {/* Col-1 */}
          <ul className="m-auto space-y-4">
            <li>
              <Stats
                name="Local Cases"
                value="4,522,829"
                delta="+2,005"
                icon={<ArrowRightIcon className="h-5 w-5" />}
              />
            </li>
            <li>
              <Stats name="Imported Cases" value="4,522,829" delta="+2,005" />
            </li>
          </ul>
          {/* Col-2 */}
          <div className="flex flex-col justify-center lg:flex-row">
            <Bracket
              arrowLeft={
                <div className="flex h-full w-full items-center justify-center lg:w-auto">
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
                </div>
              }
            />
            <div className="w-full lg:flex-grow">
              <ul className="flex flex-row flex-wrap justify-evenly gap-12 py-7 lg:mx-auto lg:block lg:w-fit lg:gap-0 lg:space-y-4 lg:py-0">
                <li>
                  <Stats
                    name="Home Quarantine"
                    value="26,541"
                    delta="+2,005"
                    iconPlacement="left"
                    icon={<ArrowRightIcon className="h-5 w-5" />}
                  />
                </li>
                <li>
                  <Stats
                    name="PKRC"
                    value="14"
                    delta="+2,005"
                    iconPlacement="left"
                    icon={<ArrowRightIcon className="h-5 w-5" />}
                  />
                </li>
                <li>
                  <Stats
                    name="Hospitalised"
                    value="1,155"
                    delta="+2,005"
                    iconPlacement="left"
                    icon={<ArrowRightIcon className="h-5 w-5" />}
                  />
                </li>
                <li>
                  <Stats
                    name="ICU (Unventilated)"
                    value="18"
                    delta="+2,005"
                    iconPlacement="left"
                    icon={<ArrowRightIcon className="h-5 w-5" />}
                  />
                </li>
                <li>
                  <Stats
                    name="ICU (Ventilated)"
                    value="19"
                    delta="+2,005"
                    iconPlacement="left"
                    icon={<ArrowRightIcon className="h-5 w-5" />}
                  />
                </li>
              </ul>
            </div>
            <Bracket
              className="rotate-180"
              arrowRight={
                <div className="flex h-full flex-row justify-evenly pl-3 lg:flex-col">
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
                  <ArrowRightIcon className="my-3 h-5 w-5 rotate-90 text-dim lg:mr-3 lg:rotate-0" />
                </div>
              }
            />
          </div>
          {/* Col-3 */}
          <ul className="m-auto space-y-4">
            <li>
              <Stats
                name="Recovered"
                value="4,522,829"
                delta="+2,005"
                icon={<ArrowRightIcon className="h-5 w-5" />}
              />
            </li>
            <li>
              <Stats
                name="Death (Including BID)"
                value="4,522,829"
                delta="+2,005"
                icon={<ArrowRightIcon className="h-5 w-5" />}
              />
            </li>
            <li>
              <Stats name="BID" value="4,522,829" delta="+2,005" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Stats
 */

interface StatsProps {
  className?: string;
  name: string;
  icon?: ReactNode;
  iconPlacement?: "top" | "left";
  value: string;
  delta: string;
}

const Stats: FunctionComponent<StatsProps> = ({
  className = "",
  name,
  icon,
  iconPlacement = "top",
  value,
  delta = "",
}) => {
  return (
    <div
      className={`flex ${className} ${
        iconPlacement === "top"
          ? "flex-col items-center space-y-4"
          : "flex-col items-center lg:flex-row lg:items-start lg:space-x-4"
      }`}
    >
      {icon && icon}
      <div
        className={`flex flex-col ${
          iconPlacement === "top" ? "items-center" : "items-center lg:items-start"
        }`}
      >
        <span className="text-xs text-dim">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xl">{value}</span>
          <small className="inline-block rounded bg-green-400 bg-opacity-20 px-1.5 text-green-500">
            {delta}
          </small>
        </div>
      </div>
    </div>
  );
};

/**
 * Bracket
 */
interface BracketProps {
  className?: string;
  arrowLeft?: ReactNode;
  arrowRight?: ReactNode;
}

const Bracket: FunctionComponent<BracketProps> = ({ className = "", arrowLeft, arrowRight }) => {
  return (
    <>
      {arrowLeft && arrowLeft}
      <div className={`relative ${className}`}>
        <div className="h-1 bg-outline lg:h-full lg:w-1" />
        <div className="absolute top-0 left-0 h-2 w-1 rounded-xl bg-outline lg:h-1 lg:w-2" />
        <div className="absolute bottom-0 top-0 right-0 h-2 w-1 bg-outline lg:top-full lg:left-0 lg:h-1 lg:w-2" />
      </div>
      {arrowRight && arrowRight}
    </>
  );
};

export default Stages;
