import { FunctionComponent, ReactElement } from "react";
import { Tab } from "@headlessui/react";

interface TabsProps {
  children: Array<ReactElement>;
  className?: string;
  current?: number;
  title?: string;
  onChange?: ((index: number) => void) | undefined;
}

const Tabs: FunctionComponent<TabsProps> = ({
  className = "flex justify-start gap-2",
  children,
  title,
  current,
  onChange = () => {},
}) => {
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <div className="flex flex-wrap justify-between gap-4 py-4">
          {title && <span className="text-base font-bold">{title}</span>}
          <Tab.List className={className}>
            {children.map(({ props }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  selected
                    ? "text-base font-medium text-black underline underline-offset-4"
                    : "text-base text-dim underline underline-offset-4"
                }
              >
                {props.title}
              </Tab>
            ))}
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
  title: string | ReactElement;
  children?: ReactElement | string;
}

const Panel: FunctionComponent<PanelProps> = ({ children, title }) => {
  return <>{children}</>;
};

export { Panel };
export default Tabs;
