import { FunctionComponent, ReactElement } from "react";
import { Tab } from "@headlessui/react";
import { ChartHeader } from "..";
import { CountryAndStates } from "@lib/constants";

interface TabsProps {
  children: Array<ReactElement>;
  className?: string;
  current?: number;
  state?: string | ReactElement;
  title?: string | ReactElement;
  menu?: ReactElement;
  controls?: ReactElement;
  onChange?: ((index: number) => void) | undefined;
}

const Tabs: FunctionComponent<TabsProps> = ({
  className = "flex justify-start gap-2",
  children,
  title,
  controls,
  current,
  state,
  menu,
  onChange = () => {},
}) => {
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div className={`flex flex-wrap justify-between gap-4 pb-4 ${className}`}>
          <div>
            {title && typeof title === "string" ? (
              <span className="text-base font-bold">{title}</span>
            ) : (
              title
            )}
            {state && typeof state === "string" ? (
              <p className="pt-4 text-sm text-dim">Data for {CountryAndStates[state]}</p>
            ) : (
              <>{state}</>
            )}
          </div>

          <Tab.List className="flex flex-wrap items-start justify-between gap-[10px] lg:justify-end">
            {controls}
            <div className="flex flex-grow gap-3">
              {children.map(({ props: { name } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    selected
                      ? "text-base font-medium text-black underline underline-offset-4"
                      : "text-base text-dim underline underline-offset-4"
                  }
                >
                  {name}
                </Tab>
              ))}
            </div>

            {menu && <div>{menu}</div>}
          </Tab.List>
        </div>

        <Tab.Panels className="w-full">
          {children.map(({ props: { children } }, index) => (
            <Tab.Panel key={index}>{children}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

interface PanelProps {
  name: string | ReactElement;
  children?: ReactElement | string | any;
}

const Panel: FunctionComponent<PanelProps> = ({ children, name }) => {
  return <>{children}</>;
};

export { Panel };
export default Tabs;
