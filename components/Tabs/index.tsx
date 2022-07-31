import { FunctionComponent, ReactElement } from "react";
import { Tab } from "@headlessui/react";
import { ChartHeader } from "@dashboards/covidnow/components";

interface TabsProps {
  children: Array<ReactElement>;
  className?: string;
  current?: number;
  title?: string;
  menu?: ReactElement;
  onChange?: ((index: number) => void) | undefined;
}

const Tabs: FunctionComponent<TabsProps> = ({
  className = "flex justify-start gap-2",
  children,
  title,
  current,
  menu,
  onChange = () => {},
}) => {
  return (
    <>
      <Tab.Group selectedIndex={current} onChange={onChange}>
        <ChartHeader
          title={title}
          menu={menu}
          controls={
            <Tab.List className={className}>
              {children.map(({ props: { title } }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    selected
                      ? "text-base font-medium text-black underline underline-offset-4"
                      : "text-base text-dim underline underline-offset-4"
                  }
                >
                  {title}
                </Tab>
              ))}
            </Tab.List>
          }
        />

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
