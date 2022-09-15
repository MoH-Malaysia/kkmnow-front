import { FunctionComponent, ReactElement } from "react";
interface ChartHeaderProps {
  title?: string | ReactElement;
  controls?: ReactElement;
  menu?: ReactElement;
}

const ChartHeader: FunctionComponent<ChartHeaderProps> = ({ title, menu, controls }) => {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        {title && <span className="max-w-[60%] self-center text-base font-bold">{title}</span>}
        {menu && <div className="block md:hidden">{menu}</div>}
        {controls && (
          <div className="flex items-center justify-end gap-2 md:hidden">{controls}</div>
        )}
        <div className="hidden items-center justify-end gap-2 md:flex">
          {controls}
          {menu && <div className="hidden md:block">{menu}</div>}
        </div>
      </div>
    </>
  );
};

export default ChartHeader;
