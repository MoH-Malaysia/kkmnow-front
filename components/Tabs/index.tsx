import { FunctionComponent, ReactElement } from "react";
import { Tab } from "@headlessui/react";

interface TabsProps {
  children: Array<ReactElement>;
  className?: string;
  current?: number;
  onChange?: ((index: number) => void) | undefined;
}

const Tabs: FunctionComponent<TabsProps> = ({
  className = "h-full w-full",
  children,
  current,
  onChange = () => {},
}) => {
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <Tab.List className="flex justify-start gap-2">
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
        <Tab.Panels className={className}>
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
